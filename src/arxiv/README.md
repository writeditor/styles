# arxiv venue (PRIMEarxiv)

One folder, everything this venue needs:

| Part | Here | Used by |
|---|---|---|
| Look | `style.css`, `editor.css`, `index.ts` | the editor and the PDF export (same stylesheet) |
| PDF markup | `markup.ts` (`arxivMarkup(doc, { math })`, exported as `MARKUP.arxiv`) | the compiler's `pdf/` exporter; Writ's Preview in step 3 |
| Front matter | `../front.ts` (`front(doc)`: reads authors, affiliations, keywords, title note; shared) and `markup.ts` (`groupByAffiliation`: arxiv's own choice) | the PDF markup and Writ's arxiv adapter |
| LaTeX | `class/PRIMEarxiv.sty` (MIT; not in git, see `SOURCE.txt`), `class/media/figure1.png` (ours); the `arxiv` template of `compiler/src/latex.ts` | `exportLaTeX(rash, "arxiv")`; put `class/` on `TEXINPUTS` |
| Official sample | `sample/templatePRIME.tex`, `references.bib` (not in git, see `SOURCE.txt`) | what every metric is compared with |

`markup.ts` and `front.ts` take a DOM `Document` (browser or linkedom) and import nothing, so this package stays dependency-free. The math typesetter is passed in.

Measure it from the compiler repo: `make eval ARGS=arxiv` (ref / ts / paged PDFs in `eval/out/arxiv/{ref,ts,paged}/`, screenshots in `rulers/`), `python3 eval/compare.py arxiv 730 1`, `.venv/bin/python eval/ruler.py arxiv 1 60 230`, `make view`.

Known differences (paged PDF): 4 pages against the reference's 3 (page 2 breaks about 40 pt early); `\paragraph`, centred-URL and verbatim spacing; the title star's size; the figure is a PNG stand-in for the sample's `\fbox`. Writ's editor does not yet do the footnote, formula, link-box and small-caps-title steps that `arxivMarkup` does.
