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

Sample: `sample/templatePRIME.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-25 (`make eval ARGS=arxiv`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page | Word error rate | Character error rate | Line CER | Lines matched | Line ends kept | Same page | dy p95 (pt) | SSIM | Same font size | Text box IoU | Fonts missing / embedded |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| reference (official class) | true | 3 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | none / yes |
| LaTeX (our compiler) | true | 3 | 0 | 1.00 | none | 0.0037 / 0.0616 / 0.1061 | 0 | 0 | 0 | 1 | 1 | 1 | 123.1 | 0.803 | 1 | 0.938 | none / yes |
| PDF (paged) | true | 3 | 0 | 1.00 | none | 0.0805 / 0.0878 / 0.1069 | 0.0148 | 0.006 | 0.053 | 0.958 | 0.785 | 1 | 85.8 | 0.693 | 0.938 | 0.9520000000000001 | none / yes |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Word error rate: edit distance between the word sequences (letters only: digits, bullets and symbols are ignored) of the PDF and the reference, over the reference words. Character error rate: the same on the letter stream without word boundaries. Line CER: lines aligned first, then letters wrong inside matched lines (unmatched lines wholly wrong); Lines matched: reference lines that found a partner. Line ends kept: share of the reference's line breaks (on aligned words) that fall at the same word. Same page: aligned words on the same page. dy p95: 95th percentile vertical displacement of aligned words. SSIM: mean over pages at 50 dpi. Same font size: aligned words whose box height, relative to the body height, is within 5%. Text box IoU: overlap of the page's text area, mean over pages. All measured, never edited by hand.
<!-- metrics:end -->
