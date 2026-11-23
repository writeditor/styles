# arxiv venue (PRIMEarxiv)

One folder, everything this venue needs:

| Part | Here | Used by |
|---|---|---|
| Look | `style.css`, `editor.css`, `index.ts` | the editor and the PDF export (same stylesheet) |
| PDF markup | `markup.ts` (`arxivMarkup(doc, { math })`, exported as `MARKUP.arxiv`) | the compiler's `pdf/` exporter; Writ's Preview in step 3 |
| Front matter | `../front.ts` (`front(doc)`: reads authors, affiliations, keywords, title note; shared) and `markup.ts` (`groupByAffiliation`: arxiv's own choice) | the PDF markup and Writ's arxiv adapter |
| LaTeX export | `export.xsl` when a venue needs its own front matter (arxiv uses the compiler's built-in `arxiv` template) | `exportLaTeX(rash, "arxiv")` |
| LaTeX class | `class/PRIMEarxiv.sty` (MIT; not in git, see `SOURCE.txt`), `class/media/figure1.png` (ours); the `arxiv` template of `compiler/src/latex.ts` | `exportLaTeX(rash, "arxiv")`; put `class/` on `TEXINPUTS` |
| Official sample | `sample/templatePRIME.tex`, `references.bib` (not in git, see `SOURCE.txt`) | what every metric is compared with |

`markup.ts` and `front.ts` take a DOM `Document` (browser or linkedom) and import nothing, so this package stays dependency-free. The math typesetter is passed in.

Measure it from the compiler repo: `make eval ARGS=arxiv` (ref / ts / paged PDFs in `eval/out/arxiv/{ref,ts,paged}/`, screenshots in `rulers/`), `python3 eval/compare.py arxiv 730 1`, `.venv/bin/python eval/ruler.py arxiv 1 60 230`, `make view`.

Known differences (paged PDF): the footnote mark prints "2." at body size where the class has a raised numeral; the figure border is heavier (the sample's `\fbox` is a PNG stand-in); no double space after a full stop; headings and display blocks are within about 1-3 pt of the reference. Writ's editor does not yet do the footnote, formula, link-box and small-caps-title steps that `arxivMarkup` does.

<!-- metrics:start -->
## Compilation check

Sample: `sample/templatePRIME.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-23 (`make eval ARGS=arxiv`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page |
|---|---|---|---|---|---|---|
| reference (official class) | true | 3 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 |
| LaTeX (our compiler) | true | 3 | 0 | 1.00 | none | 0.0037 / 0.0624 / 0.0612 |
| PDF (paged) | true | 3 | 0 | 1.00 | none | 0.1266 / 0.0918 / 0.0672 |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Both are measured, never edited by hand.
<!-- metrics:end -->
