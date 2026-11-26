import type { Style } from "../types.ts";
import { CSS } from "../css.generated.ts";
import { scoped } from "../scope.ts";

// The CSS lives next to this file (style.css); `pnpm build` inlines it into css.generated.ts, scoped() binds its bare selectors to the paper box.
export const oup: Style = { ...{ id: "oup", name: "Oxford University Press", paper: "OUP journal (210 x 276 mm)", page: { size: [210, 276], margins: [18.6, 12.5, 22.1, 12.5] }, fields: [] }, css: scoped(CSS["oup/style"]), editor: "" };
