/**
 * Binds a style written in bare RASH selectors (`section > h1`, `.p-title`, like rash.css) to a paper box: every rule gets `root` in front,
 * and `:scope` means the box itself. @-rules (@page) and the rules `keep` matches (Paged.js moves footnotes out of the box) are left as written.
 * shortcut: top-level rules and @page only, no rules nested in @media; scope those by hand if a style needs them.
 */
export function scoped(css: string, root = ".paper-pdf", keep = /pagedjs_|footnote-marker/): string {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, ""), bind = (list: string) => {
    const sels: string[] = []; let depth = 0, cur = "";
    for (const c of list) {
      if (c === "(" || c === "[") depth++; else if (c === ")" || c === "]") depth--;
      if (c === "," && !depth) { sels.push(cur); cur = ""; } else cur += c;
    }
    return [...sels, cur].map((s) => s.trim()).map((s) => (s.includes(":scope") ? s.replaceAll(":scope", root) : `${root} ${s}`)).join(", ");
  };
  let out = "", i = 0;
  for (let open = src.indexOf("{"); open >= 0; open = src.indexOf("{", i)) {
    let depth = 1, j = open + 1;
    while (depth && j < src.length) depth += src[j] === "{" ? 1 : src[j] === "}" ? -1 : 0, j++;
    const head = src.slice(i, open).trim();
    out += (head.startsWith("@") || keep.test(head) ? head : bind(head)) + " " + src.slice(open, j) + "\n";
    i = j;
  }
  return out;
}
