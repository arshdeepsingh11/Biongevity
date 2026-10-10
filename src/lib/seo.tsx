import { SITE } from "@/data/site";
import { OFFICES } from "@/data/clinic";

/**
 * Structured data (schema.org JSON-LD) for search engines and AI answer engines.
 * Rendered server-side into static HTML so every crawler sees it without JavaScript.
 */
const abs = (p: string) => new URL(p, SITE.url).toString();

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const organization = () => ({
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "Organization"],
  "@id": abs("/#org"),
  name: SITE.name,
  url: SITE.url,
  logo: abs("/icon.svg"),
  description: SITE.description,
  slogan: "Precision Health. Shared Longevity.",
  parentOrganization: { "@type": "Organization", name: "BioAro Inc." },
  medicalSpecialty: ["Cardiovascular", "Endocrine", "Genetic", "Gastroenterologic", "Dermatologic", "Pulmonary", "Geriatric", "PrimaryCare"],
  knowsAbout: ["Precision medicine", "Longevity medicine", "Whole genome sequencing", "Pharmacogenomics", "Gut microbiome", "Biological age", "Preventive cardiology"],
  department: OFFICES.map((o) => ({
    "@type": "MedicalClinic", name: `${SITE.name} ${o.city}`, telephone: o.phone, email: o.email ?? undefined,
    address: { "@type": "PostalAddress", streetAddress: o.address, addressLocality: o.city },
    geo: { "@type": "GeoCoordinates", latitude: o.loc[0], longitude: o.loc[1] },
  })),
});

export const website = () => ({
  "@context": "https://schema.org", "@type": "WebSite", "@id": abs("/#website"), url: SITE.url, name: SITE.name,
  publisher: { "@id": abs("/#org") }, inLanguage: "en",
});

export const breadcrumb = (items: [string, string][]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

export const faqPage = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const medicalPage = (o: { name: string; description: string; path: string; about: string[]; procedures?: string[] }) => ({
  "@context": "https://schema.org", "@type": "MedicalWebPage", name: o.name, description: o.description, url: abs(o.path),
  publisher: { "@id": abs("/#org") }, lastReviewed: "2026-10-10", audience: { "@type": "Patient" },
  about: o.about.map((a) => ({ "@type": "MedicalCondition", name: a })),
  ...(o.procedures ? { mentions: o.procedures.map((p) => ({ "@type": "MedicalProcedure", name: p })) } : {}),
});
