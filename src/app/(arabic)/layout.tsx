import "../globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
export { viewport } from "@/components/layout/SiteShell";
import { metadata as base } from "@/components/layout/SiteShell";
import type { Metadata } from "next";

export const metadata: Metadata = { ...base, openGraph: { ...base.openGraph, locale: "ar_AE" } };

/** Root layout for Arabic Dubai pages (/ar/uae/…): lang="ar", right-to-left. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="ar">{children}</SiteShell>;
}
