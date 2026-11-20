import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { ALL_SERVICES, DEPARTMENTS } from "@/content/uae";

export const dynamic = "force-static";

/** sitemap.xml — International pages, the Dubai clinic, its 8 departments and every service page, in English and Arabic. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-20");
  const page = (p: string, priority: number, freq: "weekly" | "monthly" = "monthly") => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: freq, priority });
  // Every Dubai page exists in English (/uae/…) and Arabic (/ar/uae/…); both are listed with hreflang alternates.
  const dubai = (p: string, priority: number, freq: "weekly" | "monthly" = "monthly") => {
    const languages = { "en-AE": `${SITE.url}${p}`, "ar-AE": `${SITE.url}/ar${p}` };
    return [{ ...page(p, priority, freq), alternates: { languages } }, { ...page(`/ar${p}`, priority * 0.9, freq), alternates: { languages } }];
  };
  return [
    page("/", 1, "weekly"),
    page("/contact/", 0.5),
    ...dubai("/uae/", 1, "weekly"),
    ...dubai("/uae/about/", 0.7),
    ...dubai("/uae/contact/", 0.8),
    ...dubai("/uae/supplements/", 0.6),
    ...DEPARTMENTS.flatMap((d) => dubai(`/uae/${d.id}/`, 0.9, "weekly")),
    ...ALL_SERVICES.flatMap((r) => dubai(`/uae/${r.dept.id}/${r.service.slug}/`, 0.8)),
  ];
}
