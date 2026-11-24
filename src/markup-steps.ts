// The PDF-markup steps that more than one style needs, as pure DOM functions (a browser Document or linkedom's). Each rewrites `doc` in place; a style's markup.ts picks the ones its class does.
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Footnotes: each note link becomes a real footnote (Paged.js moves it to the foot of the page); the endnotes list goes. Returns the ids of the bibliography entries. */
export function footnotes(doc: Document): Set<string | null> {
  const notes = new Map([...doc.querySelectorAll('li[role="doc-endnote"]')].map((li) => [li.getAttribute("id"), li.querySelector("p")?.innerHTML ?? li.innerHTML]));
  doc.querySelectorAll('a[href^="#"]').forEach((a) => { const n = notes.get(a.getAttribute("href")!.slice(1)); if (n != null) a.replaceWith(Object.assign(doc.createElement("span"), { className: "p-note", innerHTML: n })); });
  doc.querySelectorAll('section[role="doc-endnotes"]').forEach((s) => s.remove());
  return new Set([...doc.querySelectorAll('li[role="doc-biblioentry"]')].map((li) => li.getAttribute("id")));
}

/** Links by kind, so the style can colour them: citations (to the bibliography), other internal references, external addresses. */
export function linkKinds(doc: Document, bib: Set<string | null>) {
  doc.querySelectorAll("a[href]").forEach((a) => { const h = a.getAttribute("href")!; a.classList.add(h.startsWith("#") ? (bib.has(h.slice(1)) ? "p-cite" : "p-ref") : "p-url"); });
}

/** TeX sets extra space after a sentence-ending . ? ! : (space factor 3000 or 2000), but not when an uppercase letter comes before it ("A. Smith"). */
export function spaceAfterSentences(doc: Document) {
  const walk = (node: Node) => {
    for (const c of [...node.childNodes]) {
      if (c.nodeType === 1 && !(c as Element).matches('code, pre, [role="math"], a.p-url')) walk(c);
      else if (c.nodeType === 3 && /[a-z0-9)\]"'”’][.?!:](?: |$)/.test(c.textContent ?? "")) {
        const parts = (c.textContent ?? "").split(/(?<=[a-z0-9)\]"'”’][.?!:]) (?=\S|$)/);
        c.replaceWith(...parts.flatMap((t, i) => (i ? [Object.assign(doc.createElement("span"), { className: "p-ss", textContent: " " }), t] : [t])));
      }
    }
  };
  doc.querySelectorAll("p, li, figcaption").forEach((e) => { if (!e.parentElement?.closest("p, li, figcaption")) walk(e); });
}

/** Formulas typeset by the supplied function (KaTeX in the PDF export). */
export function typeset(doc: Document, math?: (tex: string, display: boolean) => string) {
  if (math) doc.querySelectorAll('[role="math"]').forEach((m) => { m.innerHTML = math(m.textContent ?? "", !!m.closest(".display_formula")); });
}

/** natbib look: [<1>, <2>], the numbers linked and the brackets not. Returns the body HTML with a run of citations joined into one bracket pair. */
export function natbib(doc: Document): string {
  doc.querySelectorAll("a.p-cite").forEach((a) => { const m = /^\[(.*)\]$/.exec(a.textContent ?? ""); if (m) { a.textContent = m[1]; a.before("["); a.after("]"); } });
  return doc.body.innerHTML.replace(/<\/a>\], \[(?=<a [^>]*p-cite)/g, "</a>, ");
}
