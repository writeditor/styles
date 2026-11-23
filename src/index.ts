import { CSS } from "./css.generated.ts";
import { rash } from "./rash/index.ts";
import { arxiv } from "./arxiv/index.ts";
import { cambridge } from "./cambridge/index.ts";
import { arxivMarkup, groupByAffiliation, type MarkupOptions } from "./arxiv/markup.ts";
import { bylineHtml, type BylinePerson, type Group } from "./byline.ts";

export type { Style, Field } from "./types.ts";
export { front, type Front, type Person } from "./front.ts";
export type { MarkupOptions, BylinePerson };
export { groupByAffiliation, bylineHtml };
export { JOURNALS, ARTICLE_TYPES } from "./cambridge/index.ts";
export const BASE = CSS.base;
/** Section ids that carry no number, whatever the style (the editor marks them `data-un`; base.css keeps them out of the heading counters). */
export const UNNUMBERED = ["plain-language-summary"] as const;
/** Statement sections set as run-in paragraphs ("Funding. Text…"), as the Cambridge class does (the editor marks them `data-run`). Same list the compiler sends to \\Backmatter. */
export const RUN_IN = ["supplementary-material", "acknowledgments", "acknowledgements", "ethical-standard", "author-contribution", "funding", "competing-interests", "data-availability"] as const;
/** Every style, by id. A new venue is one folder plus one line here. */
export const STYLES = { rash, arxiv, cambridge } as const;
/** The PDF markup a style needs beyond title and sections, as a pure DOM function (styles without one print from the plain paper). */
export const MARKUP: Partial<Record<keyof typeof STYLES, (doc: Document, o?: MarkupOptions) => string>> = { arxiv: arxivMarkup };
/** The styles that set their own byline (RASH markup, see byline.ts) and how they merge authors; Writ's editor draws these from the style instead of its chips. */
export const BYLINE: Partial<Record<keyof typeof STYLES, { group?: Group }>> = { arxiv: { group: groupByAffiliation } };
/** The byline HTML of a style, for the PDF and for Writ's editor. */
export const byline = (style: keyof typeof STYLES, people: BylinePerson[], date?: string) => bylineHtml(people, BYLINE[style]?.group, date);

/** The rules without @page blocks: for drawing the paper on a screen sheet instead of paginating it. */
// Comments go first: one that mentions @page would otherwise swallow the rules after it.
export const withoutPage = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@page[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, "");
/** What the editing page loads for a style: the same CSS as the pages, minus @page, plus the style's small editor glue. */
export const screenCss = (s: { css: string; editor: string }) => withoutPage(CSS.base + "\n" + s.css) + "\n" + s.editor;
