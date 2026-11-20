import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Floating, Reveal } from "@/components/site/Floating";
import { Analytics } from "@/components/layout/Analytics";
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

/**
 * Root layout (v6). Two faces share one shell:
 *  • /uae/…  → Biongevity Dubai clinic (UAE contact details, WhatsApp, Book now)
 *  • the rest → Biongevity International (no clinic details; US launch March 2027)
 * Header, footer and floating buttons switch on the URL.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="clinic" suppressHydrationWarning>
      <body className="bg-pearl text-ink">
        <JsonLd data={[organization(), website()]} />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
        <Floating />
        <Reveal />
        <Analytics />
      </body>
    </html>
  );
}
