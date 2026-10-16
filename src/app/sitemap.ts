import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { DEPARTMENTS } from "@/data/departments";
import { CLINICS } from "@/data/clinic";

export const dynamic = "force-static";

/** sitemap.xml — every static route, so search engines and AI crawlers index the whole site. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-14");
  const page = (p: string, priority: number, freq: "weekly" | "monthly" = "monthly") => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: freq, priority });
  return [
    page("/", 1, "weekly"),
    page("/precision-health/", 0.9, "weekly"),
    ...DEPARTMENTS.map((d) => page(`/precision-health/${d.id}/`, 0.85)),
    page("/precision-health/bioaro-labs/", 0.85),
    page("/precision-health/bioaro-drugs/", 0.85),
    page("/clinic/", 0.8),
    ...CLINICS.map((c) => page(`/clinic/${c.id}/`, 0.8)),
    page("/shop/", 0.8, "weekly"),
    page("/twin/", 0.9),
    page("/plan/", 0.9),
    page("/evidence/", 0.8),
    page("/scan/", 0.9),
    page("/family/", 0.8),
    page("/platform/", 0.85),
    page("/tools/", 0.8),
    page("/bioelr/", 0.8),
    page("/ai/", 0.6),
    ...["/life/", "/app/", "/insights/", "/about/", "/contact/"].map((p) => page(p, 0.6)),
  ];
}
