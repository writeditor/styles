import type { Style } from "../types.ts";
import { CSS } from "../css.generated.ts";
import { scoped } from "../scope.ts";

// Real CSS lives next to this file (style.css; editor.css only for styles that need it); `pnpm build` inlines it into css.generated.ts.
export const arxiv: Style = { ...{ id: "arxiv", name: "arXiv preprint", paper: "US Letter", page: { size: [215.9, 279.4], margins: [25.4, 25.4, 25.4, 25.4] }, fields: [] }, css: scoped(CSS["arxiv/style"]), editor: "" };
