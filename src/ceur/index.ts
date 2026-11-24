import type { Style } from "../types.ts";
import { CSS } from "../css.generated.ts";
import { scoped } from "../scope.ts";

// The CSS lives next to this file (style.css); `pnpm build` inlines it into css.generated.ts, scoped() binds its bare selectors to the paper box.
export const ceur: Style = { ...{ id: "ceur", name: "CEUR-WS", paper: "A4", page: { size: [210, 297], margins: [21.9, 25.4, 25.4, 25.4] }, fields: [] }, css: scoped(CSS["ceur/style"]), editor: "" };
