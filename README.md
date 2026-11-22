# Networking book preview

Run `make` from the project directory with Node.js 20 or later. The build runs offline and saves the preview to [build/index.html](build/index.html). Open that file in a browser, or run `make view` on macOS to rebuild and open it in your default browser.

Edit the [Chapter 1 manuscript](chapters/01-what-should-a-network-do/chapter.md) and run `make` again. The builder renders each `chapters/<name>/chapter.md` as `build/<name>.html`. It adjusts relative links so figures and source materials still resolve from the preview. Keep the generated HTML within the project's `build/` directory to preserve those links.

The build uses the bundled [Marked 17.0.5 and its license](tools/vendor/marked/LICENSE.md) to render Markdown tables, lists, and figures.

## Chapter 1 simulations

The HTML embeds the shared-link simulator's WebAssembly and the playback model's JavaScript. Both run from an ordinary local file. The playback figure also has a static version for print and browsers without JavaScript.

Run `make wasm` after editing the [Rust wrapper](tools/chapter-link-wasm/src/lib.rs) or updating the `network_arena` submodule. It compiles the wrapper against the submodule's `competitive_net_sim` crate and refreshes the module bundled by `make`. A source rebuild needs an initialized submodule, a current Rust toolchain with the `wasm32-unknown-unknown` target, and the locked dependencies in Cargo's cache. On a fresh machine, `rustup target add wasm32-unknown-unknown` and `cargo fetch --locked --manifest-path tools/chapter-link-wasm/Cargo.toml` prepare those dependencies. Readers can rebuild the HTML with the bundled module using only Node.js and `make`.
