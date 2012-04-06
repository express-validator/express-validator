test:
	for F in test/*.js; do echo "$$F: "; node $$F; done;

.PHONY: test
