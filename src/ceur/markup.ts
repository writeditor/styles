// The CEUR-WS style's PDF markup: the `.paper-pdf` box style.css expects, built from a RASH document. DOM-only; the caller supplies the math typesetter.
// What ceurart does that CSS cannot: the title note and the numbered-affiliation byline (shared byline.ts), footnotes at the page foot, link kinds, formulas, keywords after the abstract.
import { front } from "../front.ts";
import { bylineHtml } from "../byline.ts";
import { esc, footnotes, linkKinds, typeset, natbib, UNNUMBERED } from "../markup-steps.ts";
import type { MarkupOptions } from "../arxiv/markup.ts";

export function ceurMarkup(doc: Document, { math }: MarkupOptions = {}): string {
  const f = front(doc);
  const bib = footnotes(doc);
  // The title note has its own mark (a star) and takes no number: number the others here, the CSS prints data-n (Paged.js would count the title note too).
  doc.querySelectorAll(".p-note").forEach((n, i) => { n.setAttribute("data-n", String(i + 1)); if (!i) n.classList.add("p-first"); });
  // The block before a subsection that follows text carries the gap above it (the CSS cannot select that: Paged.js rewrites `+`); on a margin that hangs below, a page break cuts it, as TeX does.
  doc.querySelectorAll("section > section").forEach((s) => { const p = s.previousElementSibling; if (p && !/^(SECTION|H1)$/.test(p.tagName)) p.classList.add("p-gap"); });
  UNNUMBERED.forEach((u) => doc.getElementById(u)?.setAttribute("data-un", "")); // no number: the CSS counts only sections without it
  // Text right after a display formula goes on with the paragraph: not indented, and it carries part of the space below the formula (a margin at a page foot would push the formula off the page).
  doc.querySelectorAll(".display_formula").forEach((d) => { const n = d.nextElementSibling; if (n?.tagName === "P") n.classList.add("p-cont"); });
  // Number figures and tables here: Paged.js counts every counter-increment rule that matches, so a table would also be a figure.
  let figs = 0, tabs = 0;
  doc.querySelectorAll("figure").forEach((f) => f.querySelector("figcaption")?.setAttribute("data-label", f.querySelector(":scope > table") ? `Table ${++tabs}` : `Figure ${++figs}`));
  linkKinds(doc, bib);
  typeset(doc, math);
  let body = natbib(doc);
  const kw = f.keywords.length ? `<div class="p-keywords"><h1>Keywords</h1><p>${f.keywords.map(esc).join(", ")}</p></div>` : "";
  body = /role="doc-abstract"/.test(body) ? body.replace(/(<section[^>]*role="doc-abstract"[\s\S]*?<\/section>)/, `$1${kw}`) : kw + body; // keywords follow the abstract
  const note = f.cite ? `<span class="p-foot">${esc(f.cite)}</span>` : "";
  // The page-foot block of the first page, as ceurart sets it: the conference line before the title note, then e-mails, addresses and ORCIDs (with the names they belong to), then the licence.
  const meta = (p: string) => doc.querySelector(`meta[property="writ:ceur.${p}"]`)?.getAttribute("content") ?? "";
  const initials = (name: string) => { const w = name.split(/\s+/); return [...w.slice(0, -1).map((x) => `${x[0]}.`), w.at(-1)].join(" "); };
  const foot = (cls: string, html: string) => `<span class="p-foot p-${cls}">${html}</span>`;
  const lines = (pick: (a: (typeof f.authors)[number]) => string[], link: (v: string) => string) => f.authors.flatMap((a) => pick(a).map((v) => `${link(v)} (${esc(initials(a.name))})`)).join("; ");
  const mails = lines((a) => (a.email ? [a.email] : []), (v) => `<a href="mailto:${esc(v)}">${esc(v)}</a>`);
  const urls = lines((a) => a.urls, (v) => `<a href="${esc(v)}">${esc(v)}</a>`);
  const orcids = lines((a) => (a.orcid ? [a.orcid] : []), (v) => `<a href="https://orcid.org/${esc(v)}">${esc(v)}</a>`);
  const creators = [...doc.querySelectorAll('meta[name="dc.creator"]')].filter((m) => (m.getAttribute("content") ?? "").trim());
  const people = f.authors.map((a, i) => ({ ...a, marks: (doc.querySelector(`meta[about="${creators[i]?.getAttribute("about")}"][property="writ:ceur.marks"]`)?.getAttribute("content") ?? "").split(",").filter(Boolean) }));
  const mark = (cls: string, sym: string, text: string) => text ? `<span class="p-foot p-mark" data-mark="${sym}">${esc(text)}</span>` : "";
  const marked = mark("cor", "*", meta("cortext")) + mark("fn", "\u2020", meta("fntext"));
  const conf = meta("conference") ? foot("conf", esc(meta("conference"))) : "";
  const blocks = [mails && foot("contact", `<i class="fa fa-r">\uf2b6</i> ${mails}`), urls && foot("contact", `<i class="fa">\uf0ac</i> ${urls}`), orcids && foot("contact", `<span class="orcid">iD</span> ${orcids}`),
    meta("clause") && foot("copy", `<img class="cc" src="cc-by.png" alt="CC BY"/> \u00a9 ${esc(meta("year"))} ${esc(meta("clause"))}`)].filter(Boolean).join("");
  return `<div class="paper-pdf">${conf}<h1 class="p-title">${esc(f.title || "Untitled")}${note}</h1>${marked}${f.authors.length ? `<div class="p-authors">${bylineHtml(people, undefined, "", true)}</div>` : ""}${blocks}${body}</div>`;
}
