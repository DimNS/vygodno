.PHONY: init
init:
	@npm install

.PHONY: update
update:
	@npm update

.PHONY: outdated
outdated:
	@npm outdated

.PHONY: audit
audit:
	@npm audit

.PHONY: lint
lint:
	@npx eslint .

.PHONY: run
run:
	@npm run-script dev

.PHONY: build
build:
	@npm run-script build
