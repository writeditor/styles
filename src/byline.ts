// The byline as RASH sets it (rash.js: one <address class="authors"> per author with .author_name, .email and .affiliation), built once for every style.
// A style is CSS over this markup; a style that merges authors (arXiv: those sharing affiliations) registers a `group` in BYLINE (index.ts).
// Each name carries `data-author="<index in people>"`, the hook Writ's editor uses to select an author on click; other consumers ignore it.
export type BylinePerson = { name: string; orcid?: string; email?: string; corresponding?: boolean; affiliations: string[]; /** Ids of the affiliations, joined: people with the same value share them (read from a RASH document). */ affIds?: string };
export type Group = (people: (BylinePerson & { i: number })[]) => (BylinePerson & { i: number })[][];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function bylineHtml(people: BylinePerson[], group?: Group, date = ""): string {
  const indexed = people.map((a, i) => ({ ...a, i }));
  const addresses = (group ? group(indexed) : indexed.map((a) => [a])).map((g) => {
    const names = g.map((a) => `${a.orcid ? '<span class="orcid">iD</span>' : ""}<strong class="author_name" data-author="${a.i}">${esc(a.name)}</strong>${a.corresponding ? `<span class="p-foot">Corresponding author${a.email ? `: ${esc(a.email)}` : ""}.</span>` : ""}`).join(", ");
    const mails = g.filter((a) => a.email).map((a) => esc(a.email!));
    return `<address class="authors">${names}${g[0].affiliations.map((x) => `<span class="affiliation">${esc(x)}</span>`).join("")}${mails.length ? `<code class="email">${mails.join(", ")}</code>` : ""}</address>`;
  }).join("");
  const when = date && new Date(date + "T00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return addresses + (when ? `<div class="p-date">${when}</div>` : "");
}
