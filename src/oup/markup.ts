// The OUP style's PDF markup: the `.paper-pdf` box style.css expects, built from a RASH document. DOM-only; the caller supplies the math typesetter.
// What oup-authoring-template does that CSS cannot: the journal block and the front matter above the two columns, the numbered byline (shared byline.ts), footnotes at the column foot,
// the received/accepted line and the copyright line at the page foot, link kinds, formulas, the other abstracts and the key-messages box.
import { front } from "../front.ts";
import { bylineHtml } from "../byline.ts";
import { esc, footnotes, linkKinds, typeset } from "../markup-steps.ts";
import type { MarkupOptions } from "../arxiv/markup.ts";

const MONTHS = ["Month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function oupMarkup(doc: Document, { math }: MarkupOptions = {}): string {
  const f = front(doc);
  const bib = footnotes(doc);
  doc.querySelectorAll(".p-note").forEach((n, i) => n.setAttribute("data-num", String(i + 1))); // the page-foot notes have no number: the CSS prints data-n
  // Numbers of figures and tables here: Paged.js counts every counter-increment rule that matches, so a table would also be a figure.
  let figs = 0, tabs = 0;
  doc.querySelectorAll("figure:not(.algorithm)").forEach((e) => e.querySelector("figcaption")?.setAttribute("data-label", e.querySelector(":scope > table") ? `Table ${++tabs}` : `Figure ${++figs}`));
  doc.querySelectorAll("figure.algorithm figcaption").forEach((c, i) => c.setAttribute("data-label", `Algorithm ${i + 1}`));
  // The class rotates sidewaystable / sidewaysfigure on a portrait page and puts the floats it has on one page: collect them in one block where the first one is.
  const side = [...doc.querySelectorAll("figure.sideways")];
  if (side.length) {
    // shortcut: TeX keeps a rotated float for the next page break; here the page goes after the section that follows the last such float
    const page = doc.createElement("div"); page.className = "p-sideways";
    let top: Element = side.at(-1)!; while (top.parentElement && top.parentElement !== doc.body) top = top.parentElement;
    (top.nextElementSibling ?? top).after(page);
    const inner = doc.createElement("div"); inner.className = "p-sideways-in"; page.appendChild(inner);
    side.forEach((f) => inner.appendChild(f));
  }
  linkKinds(doc, bib);
  typeset(doc, math);
  const meta = (p: string) => doc.querySelector(`meta[property="writ:oup.${p}"]`)?.getAttribute("content") ?? "";
  const metas = (p: string) => [...doc.querySelectorAll(`meta[property="writ:oup.${p}"]`)].map((m) => m.getAttribute("content") ?? "");
  const abs = doc.querySelector('section[role="doc-abstract"]');
  const abstract = abs ? abs.outerHTML : "";
  abs?.remove();
  const creators = [...doc.querySelectorAll('meta[name="dc.creator"]')].filter((m) => (m.getAttribute("content") ?? "").trim());
  // The numbered byline merges affiliations that read the same, and the sample gives four different ones the same placeholder text: a zero-width space per id keeps them apart.
  const affKey = (a: (typeof f.authors)[number]) => a.affiliations.map((t, j) => t + "\u200b".repeat(Number(/\d+$/.exec(a.affIds.split(",")[j] ?? "")?.[0] ?? 0)));
  const people = f.authors.map((a, i) => ({ ...a, affiliations: affKey(a), marks: (doc.querySelector(`meta[about="${creators[i]?.getAttribute("about")}"][property="writ:oup.marks"]`)?.getAttribute("content") ?? "").split(",").filter(Boolean) }));
  const journal = meta("journal"), year = meta("year");
  const head = journal || meta("DOI") ? `<div class="p-journal"><p class="p-j1"><em>${esc(journal)}</em>${year ? `, ${esc(year)}` : ""}, pp. ${esc(meta("firstpage") || "1")}\u2013<span class="p-last">10</span></p>${meta("DOI") ? `<p>${esc(meta("DOI"))}</p>` : ""}${meta("access") ? `<p>${esc(meta("access"))}</p>` : ""}${meta("appnotes") ? `<p><strong>${esc(meta("appnotes"))}</strong></p>` : ""}</div><div class="p-logo"></div>` : "";
  const corresp = meta("corresp") ? `<p class="p-corresp"><sup>*</sup>${esc(meta("corresp").split("|").pop() ?? "").replace(/^Corresponding author\. \\href\{email:[^}]*\}\{([^}]*)\}/, "Corresponding author. $1")}</p>` : "";
  const kw = f.keywords.length ? `<p class="p-keywords"><strong>Keywords</strong> ${f.keywords.map(esc).join(", ")}</p>` : "";
  const abbr = meta("keywords-abbreviations") ? `<p class="p-keywords"><strong>Abbreviations</strong> ${esc(meta("keywords-abbreviations"))}</p>` : "";
  const other = metas("otherabstract").map((v) => { const [t, ...r] = v.split("|"), body = r.join("|"); return `<section class="p-other"><h1>${esc(t)}</h1>${/colorbox/.test(body) ? '<div class="ph"></div>' : `<p>${esc(body)}</p>`}</section>`; }).join("");
  const boxed = metas("boxedtext").map((v) => { const [t, ...r] = v.split("|"); return `<aside class="p-boxed"><p class="box-title">${esc(t)}</p><ul>${r.join("|").split("\\item").slice(1).map((i) => `<li>${esc(i.replace(/\\end\{itemize\}|\\begin\{itemize\}/g, "").trim())}</li>`).join("")}</ul></aside>`; }).join("");
  const date = (k: string) => { const [d, m, y] = meta(k).split("|"); return d ? `${esc(d)} ${MONTHS[+m] ?? esc(m)} ${esc(y ?? "")}` : ""; };
  const dates = [["Received", "received"], ["Revised received", "revised"], ["Accepted", "accepted"]].filter(([, k]) => meta(k)).map(([l, k]) => `<strong>${l}:</strong> ${date(k)}`).join(". ");
  // The class prints the received line and the copyright in the page footer of page 1, outside the text area: the CSS reads them back with string() into a margin box (one string: Paged.js takes one string() per content).
  const rh = journal ? `<span class="p-rh">${esc(journal)}, ${esc(year)}, Volume ${esc(meta("vol"))}, Issue ${esc(meta("issue"))}</span>` : "";
  const notes = dates || year || rh ? `<div class="p-footdata">${rh}<span class="p-dates">${dates.replace(/<[^>]+>/g, "")}.\n\u00a9 The Author(s) ${esc(year)}. Copyright and licence statements to be updated by the publisher during production.</span></div>` : "";
  return `<div class="paper-pdf">${head}<h1 class="p-title">${esc(f.title || "Untitled")}</h1>${f.authors.length ? `<div class="p-authors">${bylineHtml(people, undefined, "", true)}</div>` : ""}${corresp}<div class="p-front">${abstract}${kw}${abbr}${other}${boxed}</div>${notes}<div class="p-rest">${doc.body.innerHTML}</div></div>`;
}
