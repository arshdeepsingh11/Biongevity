import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { ALL_SERVICES, DEPARTMENTS } from "@/content/uae";

export const dynamic = "force-static";

/** sitemap.xml — International pages, the Dubai clinic, its 8 departments and every service page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-20");
  const page = (p: string, priority: number, freq: "weekly" | "monthly" = "monthly") => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: freq, priority });
  return [
    page("/", 1, "weekly"),
    page("/contact/", 0.5),
    page("/uae/", 1, "weekly"),
    page("/uae/about/", 0.7),
    page("/uae/contact/", 0.8),
    page("/uae/supplements/", 0.6),
    ...DEPARTMENTS.map((d) => page(`/uae/${d.id}/`, 0.9, "weekly")),
    ...ALL_SERVICES.map((r) => page(`/uae/${r.dept.id}/${r.service.slug}/`, 0.8)),
  ];
}
