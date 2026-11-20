import { departments, deptHref, serviceHref } from "@/content/uae";
import { UAE_CLINIC, addressOf } from "@/content/contact";
import { uaeSupplements } from "@/content/supplements";
import { uaeBase, type Locale } from "@/i18n";

/**
 * The site's own knowledge, built from src/content (the same text as the pages). Used to:
 *  1. ground the AI (numbered passages sent with each question),
 *  2. show "Related on our site" links when the AI is off or fails (plain search, labelled as such),
 *  3. publish /ai/knowledge-en.json and /ai/knowledge-ar.json for the AI team.
 * The browser fetches the JSON when the assistant first opens, so page bundles stay small.
 */
export interface KnowledgeDoc { id: string; kind: "department" | "service" | "supplement" | "clinic"; title: string; url: string; dept?: string; text: string }

const CACHE: Partial<Record<Locale, KnowledgeDoc[]>> = {};

export function knowledge(l: Locale): KnowledgeDoc[] {
  if (CACHE[l]) return CACHE[l]!;
  const docs: KnowledgeDoc[] = [];
  for (const d of departments(l)) {
    docs.push({ id: d.id, kind: "department", title: d.name, url: deptHref(d, l), dept: d.id, text: [d.tagline, d.intro, d.longevity, ...d.faqs.map((f) => `${f.q} ${f.a}`)].join(" ") });
    for (const g of d.groups) for (const s of g.services) {
      const facts = s.facts ? Object.values(s.facts).filter(Boolean).join(". ") : "";
      docs.push({ id: `${d.id}/${s.slug}`, kind: "service", title: s.name, url: serviceHref(d, s, l), dept: d.id, text: [`${g.name}.`, s.short, s.about, s.forWho.join(". "), s.includes.join(". "), facts, ...(s.faqs ?? []).map((f) => `${f.q} ${f.a}`)].join(" ") });
    }
  }
  for (const s of uaeSupplements(l)) docs.push({ id: `supplement/${s.id}`, kind: "supplement", title: s.name, url: `${uaeBase(l)}/supplements/`, text: `${s.line}. ${s.detail}` });
  const addr = addressOf(l).join(", ");
  docs.push({ id: "clinic", kind: "clinic", title: l === "ar" ? UAE_CLINIC.nameAr : UAE_CLINIC.name, url: `${uaeBase(l)}/contact/`, text: `${addr}. WhatsApp ${UAE_CLINIC.whatsappDisplay}. Phone ${UAE_CLINIC.phone}. Email ${UAE_CLINIC.email}. ${l === "ar" ? "تُطبَّق ضريبة القيمة المضافة 5%." : UAE_CLINIC.vatNote}` });
  return (CACHE[l] = docs);
}
