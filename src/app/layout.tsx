import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCta } from "@/components/layout/MobileCta";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Analytics } from "@/components/layout/Analytics";
import { LazyBackground, LazyOverlays } from "@/components/layout/LazyOverlays";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AIInteractionLayer } from "@/components/ai/AIInteractionLayer";
import { NextStep } from "@/components/ai/NextStep";
import { SITE } from "@/data/site";
import { JsonLd, organization, website } from "@/lib/seo";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — AI Longevity & Healthspan Clinic | Precision Health, Genomics, Labs`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  keywords: ["healthspan", "longevity clinic", "AI health assistant", "digital twin health", "healthspan care", "precision health", "biological age", "whole genome sequencing", "pharmacogenomics", "gut microbiome test", "stress echocardiogram Calgary", "cardiology Calgary", "endocrinology", "executive health", "virtual care", "hypertension clinic", "BioAro Labs", "BioAro Drugs", "NAD+ booster"],
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, type: "website", siteName: SITE.name, locale: "en_CA", url: SITE.url },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  category: "health",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#101510",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <JsonLd data={[organization(), website()]} />
        <Providers>
          <Preloader />
          <SmoothScroll />
          <LazyBackground />
          <AIInteractionLayer />
          <Header />
          <main className="relative z-[1]">{children}</main>
          <NextStep />
          <Footer />
          <MobileCta />
          <WhatsAppButton />
          <Analytics />
          <LazyOverlays />
        </Providers>
      </body>
    </html>
  );
}
