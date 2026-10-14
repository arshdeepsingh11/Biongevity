import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SparkleNav } from "@/components/layout/SparkleNav";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { BagLayer } from "@/components/shop/BagLayer";
import { AIInteractionLayer } from "@/components/ai/AIInteractionLayer";
import { CommandBar } from "@/components/ai/CommandBar";
import { AskSelection } from "@/components/ai/AskSelection";
import { ParticleField } from "@/components/fx/ParticleField";
import { AINudge } from "@/components/ai/AINudge";
import { NextStep } from "@/components/ai/NextStep";
import { THEME_INIT } from "@/lib/theme";
import { SITE } from "@/data/site";
import { JsonLd, organization, website } from "@/lib/seo";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — AI Longevity & Healthspan Clinic | Precision Health, Genomics, Labs`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  keywords: ["healthspan", "longevity clinic", "AI health assistant", "digital twin health", "longevity for adults 40-65", "precision health", "biological age", "whole genome sequencing", "pharmacogenomics", "gut microbiome test", "stress echocardiogram Calgary", "cardiology Calgary", "endocrinology", "executive health", "virtual care", "hypertension clinic", "BioAro Labs", "BioAro Drugs", "NAD+ booster"],
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, type: "website", siteName: SITE.name, locale: "en_CA", url: SITE.url },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  category: "health",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFFDF9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="champagne" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint — no flash between themes. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <JsonLd data={[organization(), website()]} />
        <Providers>
          <ParticleField />
          <AIInteractionLayer />
          <Header />
          <main className="relative z-[1]">{children}</main>
          <NextStep />
          <Footer />
          <SparkleNav />
          <AIAssistant />
          <BagLayer />
          <CommandBar />
          <AskSelection />
          <AINudge />
        </Providers>
      </body>
    </html>
  );
}
