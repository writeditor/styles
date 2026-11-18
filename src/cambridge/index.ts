import type { Style } from "../types.ts";
import { CSS } from "../css.generated.ts";

/** The journals the class `cup-journal` is set up for: its `journal=` option. */
export const JOURNALS = [
  { value: "chr", label: "Computational Humanities Research" },
  { value: "pri", label: "Cambridge Prisms" },
  { value: "rdi", label: "Research Directions" },
  { value: "large", label: "Cambridge Large One" },
] as const;

/** Offered in the article-type dropdown. shortcut: a plain list to start from; use the journal's own article types when known. */
export const ARTICLE_TYPES = ["Research article", "Review article", "Perspective", "Case study", "Short communication"] as const;

// Real CSS lives next to this file (style.css, editor.css); `pnpm build` inlines it into css.generated.ts.
export const cambridge: Style = {
  id: "cambridge", name: "Cambridge Large1", paper: "210×280 mm", page: { size: [210, 280], margins: [17, 16, 20, 15] },
  // Article type, DOI and date come from the paper's standard fields.
  fields: [
    { id: "journal", label: "Journal", type: "enum", options: JOURNALS, default: "chr" },
    { id: "volume", label: "Volume", type: "text" },
    { id: "manuscript", label: "Manuscript type (class option)", type: "text" },
    { id: "firstPageSections", label: "Sections on page 1", type: "text", default: "3" },
  ],
  css: CSS["cambridge/style"], editor: CSS["cambridge/editor"],
};
