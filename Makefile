all: lint build

build:
	tsc

lint:
	tslint --project .

clean:
	rm -f public/js/irreligious.js

run:
	firefox public/index.html
