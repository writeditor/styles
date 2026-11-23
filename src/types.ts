/** A field the style adds to the paper's head. It is content, stored in the RASH head, and other styles ignore it. */
export type Field = { id: string; label: string; type: "text" | "enum"; options?: readonly { value: string; label: string }[]; default?: string };
/** page: size [w, h] and margins [top, right, bottom, left], in mm. */
export type Style = {
  id: string; name: string; paper: string;
  page: {
    size: [number, number]; margins: [number, number, number, number];
    /** Pages after the first are laid out in `columns` columns with `gap` mm between them (page 1 is the front matter beside a sidebar). */
    rest?: { columns: number; gap: number };
    /** Page 1: `strip` mm of its left margin is taken by the sidebar. */
    first?: { strip: number };
  };
  /** Paginated CSS (@page, running heads), for Paged.js and print. */
  css: string;
  /** The same look on the editing page, no pagination. */
  editor: string;
  fields: readonly Field[];
};
