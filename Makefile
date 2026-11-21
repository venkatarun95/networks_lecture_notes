.PHONY: build view wasm

LINK_WASM := tools/chapter-link-wasm

build:
	node tools/build-book.mjs

view: build
	open build/01-what-should-a-network-do.html

wasm:
	cargo build --manifest-path $(LINK_WASM)/Cargo.toml --locked --offline --release --target wasm32-unknown-unknown --target-dir build/link-wasm
	install -m 644 build/link-wasm/wasm32-unknown-unknown/release/chapter_link_wasm.wasm $(LINK_WASM)/chapter_link_wasm.wasm
