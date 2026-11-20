import "./globals.css";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { NotFoundBody } from "@/components/site/NotFoundBody";

export const metadata: Metadata = { title: "Page not found · Biongevity", robots: { index: false } };

/** 404 for every URL (the site has two root layouts, English and Arabic, so the 404 brings its own shell). */
export default function GlobalNotFound() {
  return <SiteShell lang="en"><NotFoundBody /></SiteShell>;
}
