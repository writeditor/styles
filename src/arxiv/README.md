# arxiv venue (PRIMEarxiv)

One folder, everything this venue needs:

| Part | Here | Used by |
|---|---|---|
| Look | `style.css` (bare RASH selectors; `scope.ts` binds them to `.paper-pdf` in `index.ts`), `index.ts` | the editor and the PDF export (same stylesheet) |
| PDF markup | `markup.ts` (`arxivMarkup(doc, { math })`, exported as `MARKUP.arxiv`) | the compiler's `pdf/` exporter; Writ's Preview in step 3 |
| Front matter | `../front.ts` (`front(doc)`: reads authors, affiliations, keywords, title note; shared) and `markup.ts` (`groupByAffiliation`: arxiv's own choice) and `../byline.ts` (the shared RASH byline markup) | the PDF markup and Writ's arxiv adapter |
| LaTeX export | `export.xsl` when a venue needs its own front matter (arxiv uses the compiler's built-in `arxiv` template) | `exportLaTeX(rash, "arxiv")` |
| LaTeX class | `class/PRIMEarxiv.sty` (MIT; not in git, see `SOURCE.txt`), `class/media/figure1.png` (ours); the `arxiv` template of `compiler/src/latex.ts` | `exportLaTeX(rash, "arxiv")`; put `class/` on `TEXINPUTS` |
| Official sample | `sample/templatePRIME.tex`, `references.bib` (not in git, see `SOURCE.txt`) | what every metric is compared with |

`markup.ts` and `front.ts` take a DOM `Document` (browser or linkedom) and import nothing, so this package stays dependency-free. The math typesetter is passed in.

Measure it from the compiler repo: `make eval ARGS=arxiv` (ref / ts / paged PDFs in `eval/out/arxiv/{ref,ts,paged}/`, screenshots in `rulers/`), `python3 eval/compare.py arxiv 730 1`, `.venv/bin/python eval/ruler.py arxiv 1 60 230`, `make view`.

Known differences (paged PDF), after a pass over the first list: the footnote mark is now a raised numeral at the class's size and indent, the sample's figure frame is a high-resolution stand-in (the class draws it as a 0.4 pt vector `\fbox`), the full-stop space is added in `arxivMarkup`, the body line pitch is 10.91 pt like the class, and the abstract heading uses real small capitals. What remains: display blocks and the table rows sit up to about 2-3 pt off the reference (TeX's glue around `\verb`, `center` and `booktabs` is not one fixed margin, and Chromium snaps line positions to 0.75 pt); the formula spacing is set for the sample's one equation; TeX stretches the space after a full stop three times as much as a normal one, which CSS cannot. Writ's editor now does the small-caps title and abstract heading, the boxed links (citation, reference, address), typeset formulas (KaTeX, source while the cursor is in one) and footnotes at the foot of their page (`apps/web/lib/printed.ts`, `lib/paginate.ts`); it does not yet merge a run of citations into one `[1, 2]`, number display formulas, add the full-stop space or shrink the Notes list that stays at the end of the editing page.

<!-- metrics:start -->
## Compilation check

Sample: `sample/templatePRIME.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-24 (`make eval ARGS=arxiv`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page |
|---|---|---|---|---|---|---|
| reference (official class) | true | 3 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 |
| LaTeX (our compiler) | true | 3 | 0 | 1.00 | none | 0.0037 / 0.0616 / 0.0608 |
| PDF (paged) | true | 3 | 0 | 1.00 | none | 0.0805 / 0.0878 / 0.0553 |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Both are measured, never edited by hand.
<!-- metrics:end -->
