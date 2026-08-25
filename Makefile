.PHONY: init
init: install

# Единая команда для ии-агента
.PHONY: check
check: format lint

.PHONY: install
install:
	@bun install --ignore-scripts

.PHONY: update
update:
	@bun update

.PHONY: outdated
outdated:
	@bun outdated

.PHONY: audit
audit:
	@bunx cve-lite-cli ./
	@bun audit

.PHONY: format
format:
	@bun run format

.PHONY: lint
lint:
	@bun run lint
	@bun run check

.PHONY: run
run:
	@bun run dev

.PHONY: build
build:
	@bun run build
