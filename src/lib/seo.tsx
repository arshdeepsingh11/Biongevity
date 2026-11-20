import { SITE } from "@/data/site";
import { UAE_CLINIC } from "@/content/contact";

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
  knowsAbout: ["Longevity medicine", "Precision health", "Dermatology", "Aesthetic medicine", "IV therapy", "Preventive health", "Genetic testing", "Telehealth"],
  department: [{
    "@type": "MedicalClinic", "@id": abs("/uae/#clinic"), name: UAE_CLINIC.name, url: abs("/uae/"), telephone: UAE_CLINIC.phone, email: UAE_CLINIC.email,
    address: { "@type": "PostalAddress", streetAddress: `${UAE_CLINIC.address[0]}, ${UAE_CLINIC.address[1]}`, addressLocality: "Dubai", addressCountry: "AE" },
    hasMap: UAE_CLINIC.mapUrl,
  }],
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
  publisher: { "@id": abs("/#org") }, lastReviewed: "2026-11-20", audience: { "@type": "Patient" },
  about: o.about.map((a) => ({ "@type": "MedicalCondition", name: a })),
  ...(o.procedures ? { mentions: o.procedures.map((p) => ({ "@type": "MedicalProcedure", name: p })) } : {}),
});

/** BreadcrumbList from explicit [name, path] pairs (no implied home). */
export const crumbsLd = (items: [string, string][]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});
