# oup

Oxford University Press journals: the `oup-authoring-template` class, contemporary / large layout, two columns.

| Part | Where | State |
|---|---|---|
| PDF look | `style.css` | page 1 front matter within ~1 pt of the sample; pages 2+ drawn but not tuned |
| PDF markup | `markup.ts` | journal block, numbered byline, key-messages box, other abstracts, page-foot dates and copyright, footnotes, link kinds, formulas |
| Front matter | RASH head `writ:oup.*` metas (journal, year, DOI, dates, key messages...) written by `eval/tex2rash.ts` (`metaCommands` in `venue.json`) | |
| LaTeX export | `export.xsl` | compiles on the class; body walker does not know theorems, boxes, sideways floats yet |
| Class | `class/` | third-party, not in git (see `SOURCE.txt`) |
| Sample | `sample/oup-authoring-template.tex`, `reference.bib` | third-party, not in git |

Measure: `make eval ARGS=oup` in `compiler/`, then `python3 eval/compare.py oup <y-limit> <page>`, `eval/offsets.py`, `.venv/bin/python eval/ruler.py oup <page>`.

## Known differences
- Names in the byline are separated by ", " and "and" (shared byline); the class prints `Name,¹ Name²` with no commas between authors.
- `page_size`: Chromium rounds the 595.276 x 782.362 pt page; the check compares exactly. A person's decision.
- Running head reads "n | Journal title" (the class adds year, volume and issue).
- Full-width floats (`table*`, `figure*`) are not placed as TeX places them (Paged.js has no `float: top`, no `column-span`): they sit in the column flow.
- Sideways floats (`sidewaystable`, `sidewaysfigure`) share one portrait page with the content turned 90 degrees counter-clockwise (`markup.ts` collects them, `.p-sideways` in `style.css`); the page goes after the section that follows the last one (TeX defers it to the next page break). Measured against reference page 5: floats at x 115 and 366-468, text y 52.5-729.5.
- Footnotes and the page-foot block go to the page foot across both columns; the class puts column footnotes under their column.
- Pages 2-10 are not tuned; the page count now matches (10), the breaks do not yet.

<!-- metrics:start -->
## Compilation check

Sample: `sample/oup-authoring-template.tex`, converted to RASH, compiled by each output and compared with the reference PDF. Last run 2026-11-25 (`make eval ARGS=oup`).

| Output | Compiles | Pages | Undefined refs | Style score | Failed checks | Pixel diff by page | Word error rate | Character error rate | Line CER | Lines matched | Line ends kept | Same page | dy p95 (pt) | SSIM | Same font size | Text box IoU | Fonts missing / embedded |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| reference (official class) | true | 10 | 0 | 1.00 | none | 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | none / yes |
| LaTeX (our compiler) | true | 7 | 0 | 0.67 | fonts, header_footer | 0.0445 / 0.1374 / 0.1095 / 0.0993 / 0.0772 / 0.1336 / 0.1189 /  /  /  | 0.47 | 0.38 | 0.392 | 0.749 | 0.8809999999999999 | 0.428 | 455.5 | 0.294 | 0.96 | 0.6559999999999999 | MSAM10 / yes |
| PDF (paged) | true | 10 | 0 | 0.67 | fonts, header_footer | 0.0673 / 0.1695 / 0.1220 / 0.0834 / 0.0390 / 0.1471 / 0.1791 / 0.1688 / 0.1231 / 0.1214 | 0.6970000000000001 | 0.53 | 0.59 | 0.871 | 0.583 | 0.696 | 457.5 | 0.431 | 0.858 | 0.872 | MSAM10, MSBM10, rsfs10 / yes |

Style score: share of the checks (page size, fonts, margins, leading, header/footer, title) that match the reference. Pixel diff: share of pixels that differ on each page (0 = identical). Word error rate: edit distance between the word sequences (letters only: digits, bullets and symbols are ignored) of the PDF and the reference, over the reference words. Character error rate: the same on the letter stream without word boundaries. Line CER: lines aligned first, then letters wrong inside matched lines (unmatched lines wholly wrong); Lines matched: reference lines that found a partner. Line ends kept: share of the reference's line breaks (on aligned words) that fall at the same word. Same page: aligned words on the same page. dy p95: 95th percentile vertical displacement of aligned words. SSIM: mean over pages at 50 dpi. Same font size: aligned words whose box height, relative to the body height, is within 5%. Text box IoU: overlap of the page's text area, mean over pages. All measured, never edited by hand.
<!-- metrics:end -->
