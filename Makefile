.PHONY: build view

build:
	node tools/build-book.mjs

view: build
	open build/01-what-should-a-network-do.html
