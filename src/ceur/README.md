# ceur

<!-- metrics:start -->
## Compilation check

Sample: `sample/sample-1col.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-25 (`make eval ARGS=ceur`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page |
|---|---|---|---|---|---|---|
| reference (official class) | true | 9 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 |
| LaTeX (our compiler) | true | 9 | 0 | 0.50 | fonts, margins, title | 0.0284 / 0.0692 / 0.0446 / 0.0617 / 0.1146 / 0.0826 / 0.0438 / 0.1434 / 0.0750 |
| PDF (paged) | true | 9 | 0 | 0.33 | page_size, fonts, margins, title | 0.0745 / 0.0554 / 0.0499 / 0.0913 / 0.0953 / 0.0788 / 0.0843 / 0.0980 / 0.0709 |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Both are measured, never edited by hand.
<!-- metrics:end -->
