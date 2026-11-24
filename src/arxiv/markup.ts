// The arxiv style's PDF markup: the `.paper-pdf` box that style.css expects, built from a RASH document, plus what the PRIMEarxiv class does to links, footnotes, formulas and tables.
// DOM-only (a browser Document or linkedom's); the caller supplies the math typesetter. It rewrites `doc` in place: pass a document you are done with.
// shortcut: Writ's editor builds this markup itself (apps/web/components/adapters); the two meet in step 3, when the Preview calls this function.
import { front } from "../front.ts";
import { bylineHtml } from "../byline.ts";
import { esc, footnotes, linkKinds, spaceAfterSentences, typeset, natbib } from "../markup-steps.ts";

export type MarkupOptions = {
  /** TeX source to HTML (KaTeX in the PDF export). Writ has no typesetter yet: without one the TeX source stays as text. */
  math?: (tex: string, display: boolean) => string;
};

/**
 * arXiv sets authors side by side: those linked to the same affiliations share one block, in order of first appearance. (Other styles number affiliations instead.)
 * A RASH document says which authors share by organisation id (the official sample puts identical placeholder text under different ids, and they stay apart);
 * Writ's own authors, read from the editor, have no ids and share by text (Writ writes one organisation per distinct text).
 */
export function groupByAffiliation<T extends { affiliations: string[]; affIds?: string }>(people: T[]): T[][] {
  const groups = new Map<string, T[]>();
  people.forEach((a, i) => { const k = (a.affIds ?? a.affiliations.join("\n")) || `#${i}`; groups.set(k, [...(groups.get(k) ?? []), a]); });
  return [...groups.values()];
}

export function arxivMarkup(doc: Document, { math }: MarkupOptions = {}): string {
  const f = front(doc);

  const bib = footnotes(doc);
  // "Section 2": only the number is the link in the class.
  doc.querySelectorAll("a[href^='#']").forEach((a) => { const m = /^([A-Za-z]+)\s+(\S+)$/.exec(a.textContent ?? ""); if (m && !bib.has(a.getAttribute("href")!.slice(1))) { a.textContent = m[2]; a.before(`${m[1]} `); } });
  // shortcut: a float goes to the top of its page in the class; Paged.js has no float:top, so a table moves ahead of the section it sits in.
  doc.querySelectorAll("figure:has(table)").forEach((fig) => { const s = fig.closest("section"); if (s) s.before(fig); });
  linkKinds(doc, bib);
  spaceAfterSentences(doc);
  // \sc also sets the abstract's heading: real small capitals (the style's .p-sc), not the 0.7 CSS small-caps would synthesize.
  const abs = doc.querySelector('section[role="doc-abstract"] > h1');
  if (abs?.children.length === 0) abs.innerHTML = esc(abs.textContent ?? "").replace(/[a-z]+/g, '<span class="p-sc">$&</span>');
  typeset(doc, math);
  let body = natbib(doc);

  // Title footnote, "Label: text" as in the class (label italic underlined, text bold).
  const m = /^([^:]+):\s*(.*)$/.exec(f.cite);
  const note = !f.cite ? "" : `<span class="p-foot">${m ? `<i><u>${esc(m[1])}</u></i>: <b>${esc(m[2])}</b>` : esc(f.cite)}</span>`;
  const kw = f.keywords.length ? `<p class="p-keywords">${f.keywords.map(esc).join(" · ")}</p>` : "";
  body = /role="doc-abstract"/.test(body) ? body.replace(/(<section[^>]*role="doc-abstract"[\s\S]*?<\/section>)/, `$1${kw}`) : kw + body; // keywords follow the abstract
  // \sc: the lowercase letters are set as small capitals (the style's .p-sc), since CSS small-caps would synthesize them too small.
  return `<div class="paper-pdf"><h1 class="p-title">${esc(f.title || "Untitled").replace(/[a-z]+/g, '<span class="p-sc">$&</span>')}${note}</h1>${f.authors.length ? `<div class="p-authors">${bylineHtml(f.authors, groupByAffiliation)}</div>` : ""}${body}</div>`;
}
