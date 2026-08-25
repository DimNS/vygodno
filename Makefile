.PHONY: init
init:
	@bun install

.PHONY: update
update:
	@bun update

.PHONY: outdated
outdated:
	@bun outdated

.PHONY: audit
audit:
	@bun audit

.PHONY: lint
lint:
	@bunx eslint .

.PHONY: run
run:
	@bun run dev

.PHONY: build
build:
	@bun run build
