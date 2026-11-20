import { CSS } from "./css.generated.ts";
import { rash } from "./rash/index.ts";
import { arxiv } from "./arxiv/index.ts";
import { cambridge } from "./cambridge/index.ts";
import { arxivMarkup, groupByAffiliation, type MarkupOptions } from "./arxiv/markup.ts";

export type { Style, Field } from "./types.ts";
export { front, type Front, type Person } from "./front.ts";
export type { MarkupOptions };
export { groupByAffiliation };
export { JOURNALS, ARTICLE_TYPES } from "./cambridge/index.ts";
export const BASE = CSS.base;
/** Every style, by id. A new venue is one folder plus one line here. */
export const STYLES = { rash, arxiv, cambridge } as const;
/** The PDF markup a style needs beyond title and sections, as a pure DOM function (styles without one print from the plain paper). */
export const MARKUP: Partial<Record<keyof typeof STYLES, (doc: Document, o?: MarkupOptions) => string>> = { arxiv: arxivMarkup };

/** The rules without @page blocks: for drawing the paper on a screen sheet instead of paginating it. */
// Comments go first: one that mentions @page would otherwise swallow the rules after it.
export const withoutPage = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@page[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, "");
/** What the editing page loads for a style: the same CSS as the pages, minus @page, plus the style's small editor glue. */
export const screenCss = (s: { css: string; editor: string }) => withoutPage(CSS.base + "\n" + s.css) + "\n" + s.editor;
