import type { Style } from "../types.ts";
import { CSS } from "../css.generated.ts";

// Real CSS lives next to this file (style.css, editor.css); `pnpm build` inlines it into css.generated.ts.
export const arxiv: Style = { ...{ id: "arxiv", name: "arXiv preprint", paper: "US Letter", page: { size: [215.9, 279.4], margins: [25.4, 25.4, 25.4, 25.4] }, fields: [] }, css: CSS["arxiv/style"], editor: CSS["arxiv/editor"] };
