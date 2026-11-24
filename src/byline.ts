// The byline as RASH sets it (rash.js: one <address class="authors"> per author with .author_name, .email and .affiliation), built once for every style.
// A style is CSS over this markup; a style that merges authors (arXiv: those sharing affiliations) registers a `group` in BYLINE (index.ts).
// Each name carries `data-author="<index in people>"`, the hook Writ's editor uses to select an author on click; other consumers ignore it.
export type BylinePerson = { name: string; orcid?: string; email?: string; corresponding?: boolean; affiliations: string[]; /** Marks printed with the affiliation numbers (corresponding author, equal contribution). */ marks?: string[]; /** Ids of the affiliations, joined: people with the same value share them (read from a RASH document). */ affIds?: string };
export type Group = (people: (BylinePerson & { i: number })[]) => (BylinePerson & { i: number })[][];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A name with its given names in their own span (a style may colour them): "Dmitry S. Kulyabov" -> given "Dmitry S.", family "Kulyabov". */
const given = (name: string) => { const i = name.lastIndexOf(" "); return i < 0 ? esc(name) : `<span class="given">${esc(name.slice(0, i))}</span> ${esc(name.slice(i + 1))}`; };

export function bylineHtml(people: BylinePerson[], group?: Group, date = "", numbered = false): string {
  const indexed = people.map((a, i) => ({ ...a, i }));
  const when = date && new Date(date + "T00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (numbered) { // one line of names with the numbers of their affiliations, then the numbered list (LNCS, CEUR)
    const orgs = [...new Set(people.flatMap((a) => a.affiliations))];
    const names = indexed.map((a) => `<strong class="author_name" data-author="${a.i}">${given(a.name)}${a.affiliations.length || a.marks?.length ? `<sup>${[...a.affiliations.map((x) => orgs.indexOf(x) + 1), ...(a.marks ?? [])].join(",")}</sup>` : ""}</strong>`);
    return `<address class="authors">${names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0] ?? ""}</address><address class="affiliations">${orgs.map((o, i) => `<span class="affiliation"><sup>${i + 1}</sup>${esc(o)}</span>`).join("")}</address>${when ? `<div class="p-date">${when}</div>` : ""}`;
  }
  const addresses = (group ? group(indexed) : indexed.map((a) => [a])).map((g) => {
    const names = g.map((a) => `${a.orcid ? '<span class="orcid">iD</span>' : ""}<strong class="author_name" data-author="${a.i}">${esc(a.name)}</strong>${a.corresponding ? `<span class="p-foot">Corresponding author${a.email ? `: ${esc(a.email)}` : ""}.</span>` : ""}`).join(", ");
    const mails = g.filter((a) => a.email).map((a) => esc(a.email!));
    return `<address class="authors">${names}${g[0].affiliations.map((x) => `<span class="affiliation">${esc(x)}</span>`).join("")}${mails.length ? `<code class="email">${mails.join(", ")}</code>` : ""}</address>`;
  }).join("");
  return addresses + (when ? `<div class="p-date">${when}</div>` : "");
}
