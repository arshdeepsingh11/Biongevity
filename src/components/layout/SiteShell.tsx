import type { Metadata, Viewport } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Floating, Reveal } from "@/components/site/Floating";
import { Analytics } from "@/components/layout/Analytics";
import { AiDock } from "@/components/ai/AiDock";
import { navData } from "@/content/uae/nav";
import { SITE } from "@/data/site";
import { JsonLd, organization, website } from "@/lib/seo";

export const metadata: Metadata = {
  title: { default: "Biongevity — Longevity & Precision Health", template: "%s · Biongevity" },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, type: "website", siteName: SITE.name, locale: "en_US", url: SITE.url },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  category: "health",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FAF7F2",
};

const REGION_PAINT = `(function(){var p=location.pathname;document.documentElement.setAttribute("data-region",/^\\/(ar\\/)?uae(\\/|$)/.test(p)?"uae":"intl");})();`;

/**
 * Site shell (v6.1), used by the two root layouts: app/(site) in English and app/(arabic) in Arabic (lang="ar" dir="rtl"
 * in the HTML itself, so search engines and screen readers get it without JavaScript). Two faces share one shell:
 *  • /uae/…  → Biongevity Dubai clinic (UAE contact details, WhatsApp, Book now, AI assistant)
 *  • /ar/uae/… → the same Dubai pages in Arabic (right-to-left)
 *  • the rest → Biongevity International (no clinic details; US launch March 2027)
 * Header, footer and floating buttons switch on the URL.
 */
export function SiteShell({ children, lang }: { children: React.ReactNode; lang: "en" | "ar" }) {
  const nav = navData();
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} data-theme="clinic" suppressHydrationWarning>
      <head>
        {/* Before the first paint: every page gets its region palette (lang and dir are already in the HTML). */}
        <script dangerouslySetInnerHTML={{ __html: REGION_PAINT }} />
      </head>
      <body className="bg-pearl text-ink">
        <JsonLd data={[organization(), website()]} />
        <Header nav={nav} />
        <main className="relative">{children}</main>
        <Footer nav={nav} />
        <Floating />
        <AiDock />
        <Reveal />
        <Analytics />
      </body>
    </html>
  );
}
