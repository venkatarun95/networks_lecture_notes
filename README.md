# Networking book preview

Run `make` from the project directory with Node.js 20 or later. The build runs offline and saves the preview to [build/01-what-should-a-network-do.html](build/01-what-should-a-network-do.html). Open that file in a browser, or run `make view` on macOS to rebuild and open it in your default browser.

Edit the [Chapter 1 manuscript](chapters/01-what-should-a-network-do/chapter.md) and run `make` again. The builder renders each `chapters/<name>/chapter.md` as `build/<name>.html`. It adjusts relative links so figures and source materials still resolve from the preview. Keep the generated HTML within the project's `build/` directory to preserve those links.

The build uses the bundled [Marked 17.0.5 and its license](tools/vendor/marked/LICENSE.md) to render Markdown tables, lists, and figures.
