# ceur

<!-- metrics:start -->
## Compilation check

Sample: `sample/sample-1col.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-24 (`make eval ARGS=ceur`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page |
|---|---|---|---|---|---|---|
| reference (official class) | true | 9 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 |
| LaTeX (our compiler) | true | 8 | 34 | 0.50 | fonts, margins, title | 0.0284 / 0.0692 / 0.0451 / 0.0709 / 0.1137 / 0.0855 / 0.0930 / 0.0950 /  |
| PDF (paged) | true | 8 | 0 | 0.33 | page_size, fonts, margins, title | 0.0645 / 0.0614 / 0.0550 / 0.1034 / 0.1249 / 0.0915 / 0.1304 / 0.1103 /  |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Both are measured, never edited by hand.
<!-- metrics:end -->
