import { access, copyFile, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked } from './vendor/marked/marked.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const chapters = join(project, 'chapters');
const output = join(project, 'build');
const stylesheet = await readFile(new URL('./book.css', import.meta.url), 'utf8');

function escapeHTML(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function page(title, content, scripts = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHTML(title)}</title>
  <style>${stylesheet}</style>
</head>
<body>
  <main>${content}</main>
${scripts}</body>
</html>
`;
}

function chapterLink(chapter, direction = '') {
  const label = direction ? `${direction} · ${chapter.title}` : chapter.title;
  return `<a href="${encodeURIComponent(chapter.name)}.html">${escapeHTML(label)}</a>`;
}

await mkdir(output, { recursive: true });
const assets = join(project, 'assets');
const publishedFiles = new Map();
await mkdir(join(output, 'assets'), { recursive: true });
for (const entry of await readdir(assets, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
    const source = join(assets, entry.name);
    const target = join(output, 'assets', entry.name);
    await copyFile(source, target);
    publishedFiles.set(source, target);
  }
}
const plan = await readFile(join(project, 'plan.md'), 'utf8');
const parts = new Map();
let currentPart;
for (const line of plan.split('\n')) {
  const part = /^# \*\*(Part [IVX]+ — .+?)\*\*/.exec(line);
  if (part) currentPart = part[1];
  const chapter = /^## \*\*Chapter (\d+)\./.exec(line);
  if (chapter && currentPart) parts.set(Number(chapter[1]), currentPart);
}

const entries = await readdir(chapters, { withFileTypes: true });
const manuscripts = [];
for (const entry of entries.filter(entry => entry.isDirectory()).sort((a, b) =>
  a.name.localeCompare(b.name, 'en', { numeric: true }))) {
  const source = join(chapters, entry.name, 'chapter.md');
  let markdown;
  try {
    markdown = await readFile(source, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  const heading = marked.lexer(markdown).find(token => token.type === 'heading' && token.depth === 1);
  const title = heading?.text ?? entry.name;
  manuscripts.push({ name: entry.name, source, markdown, title, part: parts.get(parseInt(entry.name, 10)) });
}

const figureDirectories = new Map();
for (const { name, source } of manuscripts) {
  const directory = dirname(source);
  const entries = await readdir(directory, { withFileTypes: true });
  if (entries.some(entry => entry.name === 'figures' && entry.isDirectory())) {
    const figures = join(directory, 'figures');
    const target = join(output, 'figures', name);
    await cp(figures, target, { recursive: true });
    figureDirectories.set(figures + sep, target);
  }
}

for (const [index, chapter] of manuscripts.entries()) {
  const { name, source, markdown, title, part } = chapter;
  const destination = join(output, `${name}.html`);
  const sourceUrl = pathToFileURL(source);
  const body = await marked.parse(markdown, {
    async: true,
    async walkTokens(token) {
      if (token.type !== 'image' && token.type !== 'link') return;
      if (token.href.startsWith('#')) return;

      const target = new URL(token.href, sourceUrl);
      if (target.protocol !== 'file:') return;

      const filename = fileURLToPath(target);
      try {
        await access(filename);
      } catch (error) {
        throw new Error(`${relative(project, source)} references unavailable file ${token.href}`, {
          cause: error,
        });
      }
      let published = publishedFiles.get(filename) ?? filename;
      for (const [prefix, directory] of figureDirectories) {
        if (filename.startsWith(prefix)) {
          published = join(directory, filename.slice(prefix.length));
          break;
        }
      }
      const path = relative(dirname(destination), published).split(sep).map(encodeURIComponent).join('/');
      token.href = `${path}${target.search}${target.hash}`;
    },
  });

  let scripts = '';
  if (name === '01-what-should-a-network-do') {
    const [chapterScript, wasm] = await Promise.all([
      readFile(join(chapters, name, 'chapter.js'), 'utf8'),
      readFile(join(project, 'tools/chapter-link-wasm/chapter_link_wasm.wasm')),
    ]);
    scripts = `  <script type="application/octet-stream" id="chapter-link-wasm">${wasm.toString('base64')}</script>
  <script>${chapterScript.replace(/<\/script/gi, '<\\/script')}</script>\n`;
  }

  const contents = '<a href="index.html">Contents</a>';
  const previous = manuscripts[index - 1];
  const next = manuscripts[index + 1];
  const navigation = [
    previous && chapterLink(previous, 'Previous'),
    contents,
    next && chapterLink(next, 'Next'),
  ].filter(Boolean).join('\n');

  await writeFile(destination, page(title, `
    <nav class="book-nav" aria-label="Book location">${contents}${part ? `<span>${escapeHTML(part)}</span>` : ''}</nav>
    <article>${body}</article>
    <nav class="book-nav chapter-turn" aria-label="Chapter navigation">${navigation}</nav>
  `, scripts));
  console.log(`Built ${relative(project, destination)}`);
}

const groups = new Map();
for (const chapter of manuscripts) {
  const part = chapter.part ?? 'Chapters';
  if (!groups.has(part)) groups.set(part, []);
  groups.get(part).push(chapter);
}
const contents = Array.from(groups, ([part, items]) => `
  <section><h2>${escapeHTML(part)}</h2>
    <ul>${items.map(chapter => `<li>${chapterLink(chapter)}</li>`).join('\n')}</ul>
  </section>`).join('\n');
await writeFile(join(output, 'index.html'), page('Computer Networks Through Design and Reasoning', `
  <h1>Computer Networks Through Design and Reasoning</h1>
  <h2 style="text-align: right;">&mdash; Venkat Arun</h2>
  <p><b>How the notes were generated:</b> This book was written by an LLM based on lecture transcripts, quizzes and assignments in my CS 356 class. It therefore contains many discussions and contributions from students in the fall 2026 offering of the course. While I think the notes are usable, do remember that the writing was largely autonomous with only high-level planning and prompting by me.</p>
  <nav class="book-contents" aria-label="Table of contents">${contents}</nav>
`));
console.log('Built build/index.html');
