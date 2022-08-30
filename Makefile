SHELL = /bin/sh

# Command variables # {{{

INSTALL := install
INSTALL_DIR := $(INSTALL) -d

MD2HTML := npx marked

TSUP := npx tsup

# }}}

# Data variables # {{{

repository := https://github.com/aryelgois/git-graph-handler

public_dir := public
api_dir := api
out_dirs := $(public_dir) $(api_dir)

assets_dir := src/assets
assets_out := $(public_dir)/styles.css

index_tmpl := $(assets_dir)/index.html
body_marker := <!-- BODY -->

index_src := README.md
index_out := $(public_dir)/index.html

api_src_files := tsconfig.json $(shell find src -name '*.ts' -not -name '*.spec.*')
api_entry_src := src/serverless.ts
api_entry_out := dist/serverless.mjs
api_out := $(api_dir)/index.js

# }}}

.PHONY: default
default: vercel

# Files to deploy at Vercel # {{{

.PHONY: vercel
vercel: $(out_dirs) $(assets_out) $(index_out) $(api_out)

$(out_dirs):
	$(INSTALL_DIR) $@

$(public_dir)/%: $(assets_dir)/%
	cp $< $@

$(index_out): $(index_src) $(index_tmpl)
	$(MD2HTML) -i $< \
		| sed -e 's#href="\([^:"]\+\)"#href="$(repository)/blob/main/\1"#' \
		| sed -e '/$(body_marker)/r /dev/stdin' $(index_tmpl) \
		> $@

$(api_out): $(api_entry_out)
	cp $< $@
	patch $(api_out) < vercel-fix-serverless.diff

$(api_entry_out): $(api_src_files)
	$(TSUP) --format esm $(api_entry_src)

# }}}

# Misc # {{{

.PHONY: clean
clean:
	-rm -r dist $(api_dir) $(public_dir)

# }}}

# vim: fdm=marker
