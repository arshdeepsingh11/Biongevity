import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileDock } from "@/components/layout/MobileDock";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { AIHud } from "@/components/ai/AIHud";
import { AIInteractionLayer } from "@/components/ai/AIInteractionLayer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: { title: SITE.name, description: SITE.description, type: "website" },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F5F5F7",
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
          <MobileDock />
          <AIHud />
          <AIAssistant />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
