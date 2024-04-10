develop:
	bun install
	hugo server --buildDrafts --watch --navigateToChanged

build:
	bun install --frozen-lockfile
	hugo --gc --minify
