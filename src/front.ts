// The front matter of a RASH document, read from its head. RASH ties a person's email, ORCID and affiliations to their dc.creator <meta> through a shared `about` (RDFa).
// DOM-only: it takes a Document from the browser or from linkedom and imports nothing, so the editor, the PDF export and a style's markup all read authors the same way.
// It only reads. What to do with the people (group them, number their affiliations) is each style's own choice.
const ORCID = /^https?:\/\/orcid\.org\//i;

export type Person = { name: string; email: string; orcid: string; /** Profile pages that are not an ORCID (schema:sameAs). */ urls: string[]; corresponding: boolean; /** The affiliation ids, joined: two people with the same value share their affiliations. */ affIds: string; /** One entry per printed line. */ affiliations: string[] };
export type Front = { title: string; keywords: string[]; /** The title's footnote ("Citation: ..."), from writ:cite. */ cite: string; authors: Person[] };

export function front(doc: Document): Front {
  const about = (who: string | null, property: string) => !who ? [] : [...doc.querySelectorAll(`[about="${who}"]`)].filter((e) => e.getAttribute("property") === property);
  const authors = [...doc.querySelectorAll('meta[name="dc.creator"]')].map((m): Person => {
    const who = m.getAttribute("about"), links = about(who, "schema:affiliation");
    return {
      name: (m.getAttribute("content") ?? "").trim(),
      email: (about(who, "schema:email")[0]?.getAttribute("content") ?? (who?.startsWith("mailto:") ? who.slice(7) : "")).trim(),
      // sameAs can be any profile; only an orcid.org one is the ORCID.
      orcid: about(who, "schema:sameAs").map((l) => l.getAttribute("href") ?? "").find((h) => ORCID.test(h))?.replace(ORCID, "") ?? "",
      urls: about(who, "schema:sameAs").map((l) => l.getAttribute("href") ?? "").filter((h) => h && !ORCID.test(h)),
      corresponding: about(who, "schema:contactPoint").length > 0,
      affIds: links.map((l) => l.getAttribute("href")).join(),
      affiliations: links.flatMap((l) => (about(l.getAttribute("href"), "schema:name")[0]?.getAttribute("content") ?? "").split("\n")).map((a) => a.trim()).filter(Boolean),
    };
  }).filter((a) => a.name);
  return {
    title: doc.querySelector("title")?.textContent?.trim() ?? "",
    keywords: [...doc.querySelectorAll('meta[property="prism:keyword"]')].map((m) => m.getAttribute("content") ?? ""),
    cite: doc.querySelector('meta[property="writ:cite"]')?.getAttribute("content") ?? "",
    authors,
  };
}
