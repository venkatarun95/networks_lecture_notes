import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
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

await mkdir(output, { recursive: true });
const entries = await readdir(chapters, { withFileTypes: true });
const chapterDirectories = entries.filter(entry => entry.isDirectory());

for (const entry of chapterDirectories.sort((a, b) => a.name.localeCompare(b.name))) {
  const source = join(chapters, entry.name, 'chapter.md');
  let markdown;
  try {
    markdown = await readFile(source, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }

  const destination = join(output, `${entry.name}.html`);
  const sourceUrl = pathToFileURL(source);
  const heading = marked.lexer(markdown).find(token => token.type === 'heading' && token.depth === 1);
  const title = heading?.text ?? entry.name;
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
      const path = relative(dirname(destination), filename).split(sep).map(encodeURIComponent).join('/');
      token.href = `${path}${target.search}${target.hash}`;
    },
  });

  let scripts = '';
  if (entry.name === '01-what-should-a-network-do') {
    const [chapterScript, wasm] = await Promise.all([
      readFile(join(chapters, entry.name, 'chapter.js'), 'utf8'),
      readFile(join(project, 'tools/chapter-link-wasm/chapter_link_wasm.wasm')),
    ]);
    scripts = `  <script type="application/octet-stream" id="chapter-link-wasm">${wasm.toString('base64')}</script>
  <script>${chapterScript.replace(/<\/script/gi, '<\\/script')}</script>\n`;
  }

  await writeFile(destination, `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHTML(title)}</title>
  <style>${stylesheet}</style>
</head>
<body>
  <main>
    <article>
${body}    </article>
  </main>
${scripts}</body>
</html>
`);
  console.log(`Built ${relative(project, destination)}`);
}
