/** A field the style adds to the paper's head. It is content, stored in the RASH head, and other styles ignore it. */
export type Field = { id: string; label: string; type: "text" | "enum"; options?: readonly { value: string; label: string }[]; default?: string };
/** page: size [w, h] and margins [top, right, bottom, left], in mm. */
export type Style = {
  id: string; name: string; paper: string; page: { size: [number, number]; margins: [number, number, number, number] };
  /** Paginated CSS (@page, running heads), for Paged.js and print. */
  css: string;
  /** The same look on the editing page, no pagination. */
  editor: string;
  fields: readonly Field[];
};
