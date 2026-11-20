# @writeditor/styles

Paper styles for RASH papers, one folder per venue, like class files. CSS, data and small DOM-only functions (front matter, PDF markup); nothing here imports Writ or a DOM library.

```
src/
  base.css           shared rules: numbering counters, lists, code, figures, tables, font variables
  <id>/
    style.css        paginated look: @page geometry, running heads, fonts, title block, headings
    editor.css       a few lines of glue for an editing page (sidebar position, margins). The look itself is style.css, applied to .paper-pdf
    index.ts         manifest: name, paper label, page size + margins (mm), extra head fields
  index.ts           STYLES: one import line per style
```

`pnpm --filter @writeditor/styles build` inlines the `.css` files into `src/css.generated.ts` (checked in; a test fails if it is stale) and writes `dist/<id>.css` (base + style) and `dist/<id>.json` (page + fields). Those two files per style are what you ship.

## Try it

`example.html` (Cambridge Large1) and `example-arxiv.html` open in any browser with the Paged.js polyfill (loaded from unpkg) and print to PDF. They link `dist/*.css`, so build first.

## The markup a style expects

Everything sits in an element with class `paper-pdf` (in Writ's editor that is the editable root itself, so sections are its direct children). Styles name only `.paper-pdf` and the `.p-*` classes, never an editor's own class names. Title block: `h1.p-title`, `p.p-subtitle`, `p.p-authors` (with `span.p-author[data-refs]`, `span.p-aff[data-refs][data-text]`, and `data-short` for a running head), `p.p-keywords`. Then the RASH body: `section`, `section[role=doc-abstract]`, `section[role=doc-bibliography]`, `figure`.

Cambridge Large1 also needs `aside.p-side` before the title, and the body split into `.p-first` (page 1: the front matter plus the first N sections) and `.p-rest` (two columns). In Writ that markup comes from the editor's adapter; a style that needs extra markup says so in its CSS.

## Adding a style

0. Fastest: `make new-style ID=<id> NAME="<Name>"` in the compiler repo creates the folder, registers it and gitignores its third-party files (step 1 by hand, below).
1. A folder `src/<id>/` with `style.css`, `editor.css` and `index.ts`; one line in `src/index.ts`; run `build`. To measure it against the venue's official LaTeX sample (compiler's `make eval ARGS=<id>`), add a `venue.json`: `{ "sample": "sample/x.tex", "dirs": ["class", "sample"], "media": "media" }`. The class and sample are third-party: gitignore them and say where to get them in `SOURCE.txt`.
2. Optional, Writ only: an adapter in the Writ repo (`apps/web/components/adapters/index.ts`, extra markup) and, for LaTeX export, `xslt/<id>.xsl` plus a `VENUES` entry in [writeditor/compiler](https://github.com/writeditor/compiler).
