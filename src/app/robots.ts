import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export const dynamic = "force-static";

/** robots.txt — open to search engines and AI answer engines; member dashboard excluded. */
export default function robots(): MetadataRoute.Robots {
  const bots = ["Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Applebot", "Applebot-Extended", "CCBot", "DuckDuckBot"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/"] }, ...bots.map((b) => ({ userAgent: b, allow: "/", disallow: ["/dashboard/"] }))],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
