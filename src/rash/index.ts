import type { Style } from "../types.ts";
import { CSS } from "../css.generated.ts";

// Real CSS lives next to this file (style.css, editor.css); `pnpm build` inlines it into css.generated.ts.
export const rash: Style = { ...{ id: "rash", name: "RASH", paper: "A4", page: { size: [210, 297], margins: [20, 22, 20, 22] }, fields: [] }, css: CSS["rash/style"], editor: CSS["rash/editor"] };
