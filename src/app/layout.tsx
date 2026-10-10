import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SparkleNav } from "@/components/layout/SparkleNav";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { AIInteractionLayer } from "@/components/ai/AIInteractionLayer";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — Precision Health. Shared Longevity.`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: { title: SITE.name, description: SITE.description, type: "website" },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AIInteractionLayer />
          <Header />
          <main className="relative">{children}</main>
          <Footer />
          <SparkleNav />
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}
