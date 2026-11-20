import type { Metadata } from "next";
import type { Locale } from "@/i18n";

/**
 * Page metadata for the Dubai site in either language. `path` is the English path (/uae/…);
 * the Arabic page lives at /ar + path. Both pages list each other as hreflang alternates.
 */
export function uaeMeta(l: Locale, path: string, title: string, description: string): Metadata {
  const url = l === "ar" ? `/ar${path}` : path;
  return {
    title: { absolute: title },
    description: description.slice(0, 300),
    alternates: { canonical: url, languages: { "en-AE": path, "ar-AE": `/ar${path}`, "x-default": path } },
    openGraph: { title, description: description.slice(0, 200), url, locale: l === "ar" ? "ar_AE" : "en_AE", alternateLocale: l === "ar" ? ["en_AE"] : ["ar_AE"] },
  };
}

export const brandDubai = (l: Locale) => (l === "ar" ? "بيونجيفيتي دبي" : "Biongevity Dubai");
