/**
 * Languages for the Dubai clinic site. English lives at /uae/…, Arabic at /ar/uae/… (same slugs).
 * The International site (/) is English only.
 */
export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];

export const localeFromPath = (path: string | null | undefined): Locale => (path?.startsWith("/ar/") || path === "/ar" ? "ar" : "en");
export const isUaePath = (path: string | null | undefined) => Boolean(path && (path.startsWith("/uae") || path.startsWith("/ar/uae")));
export const uaeBase = (l: Locale) => (l === "ar" ? "/ar/uae" : "/uae");
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** The same page in the other language (/uae/x/ ↔ /ar/uae/x/). */
export function switchLocalePath(path: string, to: Locale): string {
  const clean = path.startsWith("/ar/uae") ? path.slice(3) : path;
  if (!clean.startsWith("/uae")) return to === "ar" ? "/ar/uae/" : "/uae/";
  return to === "ar" ? `/ar${clean}` : clean;
}

export { t, type Dict } from "./dict";
