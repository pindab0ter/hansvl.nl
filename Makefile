develop:
	npm install
	hugo server --buildDrafts --watch --navigateToChanged

build:
	npm install
	hugo --gc --minify
