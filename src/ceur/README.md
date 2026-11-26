# ceur

<!-- metrics:start -->
## Compilation check

Sample: `sample/sample-1col.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-25 (`make eval ARGS=ceur`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page | Word error rate | Character error rate | Line CER | Lines matched | Line ends kept | Same page | dy p95 (pt) | SSIM | Same font size | Text box IoU | Fonts missing / embedded |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| reference (official class) | true | 9 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | none / yes |
| LaTeX (our compiler) | true | 9 | 0 | 0.83 | fonts | 0.0284 / 0.0692 / 0.0446 / 0.0617 / 0.1146 / 0.0826 / 0.0438 / 0.1434 / 0.0750 | 0.214 | 0.061 | 0.07 | 0.955 | 0.94 | 0.983 | 69.1 | 0.672 | 0.986 | 0.9309999999999999 | DejaVuSans, FontAwesome5Brands / yes |
| PDF (paged) | true | 9 | 0 | 0.83 | fonts | 0.0744 / 0.0550 / 0.0499 / 0.0980 / 0.1054 / 0.0788 / 0.0843 / 0.0984 / 0.0712 | 0.16899999999999998 | 0.021 | 0.123 | 0.888 | 0.8270000000000001 | 1 | 17.5 | 0.706 | 0.879 | 0.9540000000000001 | DejaVuSans / yes |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Word error rate: edit distance between the word sequences (letters only: digits, bullets and symbols are ignored) of the PDF and the reference, over the reference words. Character error rate: the same on the letter stream without word boundaries. Line CER: lines aligned first, then letters wrong inside matched lines (unmatched lines wholly wrong); Lines matched: reference lines that found a partner. Line ends kept: share of the reference's line breaks (on aligned words) that fall at the same word. Same page: aligned words on the same page. dy p95: 95th percentile vertical displacement of aligned words. SSIM: mean over pages at 50 dpi. Same font size: aligned words whose box height, relative to the body height, is within 5%. Text box IoU: overlap of the page's text area, mean over pages. All measured, never edited by hand.
<!-- metrics:end -->
