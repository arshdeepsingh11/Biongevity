import { OFFICES } from "@/data/clinic";

/**
 * Regions — the site has two faces: International (Calgary head office, CAD) and UAE (Dubai clinic, AED).
 * The visitor's choice is remembered in localStorage; the first visit is guessed from the device's timezone/language.
 */
export type Region = "intl" | "uae";

export const REGION_KEY = "biongevity.region";

/**
 * Indicative CAD→AED rate used until the clinic supplies an AED price list. Prices converted with it are
 * marked "indicative" on the page. Replace with official AED figures in src/data when they arrive.
 */
export const RATE_CAD_AED = 2.72;

export interface RegionInfo { id: Region; label: string; short: string; flag: string; currency: "CAD" | "AED"; locale: string; office: (typeof OFFICES)[number]; country: string }

export const REGIONS: Record<Region, RegionInfo> = {
  intl: { id: "intl", label: "International", short: "Intl", flag: "🌍", currency: "CAD", locale: "en-CA", office: OFFICES[0], country: "Canada" },
  uae: { id: "uae", label: "United Arab Emirates", short: "UAE", flag: "🇦🇪", currency: "AED", locale: "en-AE", office: OFFICES[1], country: "UAE" },
};

export const isRegion = (v: unknown): v is Region => v === "intl" || v === "uae";

/** A CAD list price in the region's currency. AED is converted and rounded to the nearest 10 until official prices exist. */
export function convertPrice(cad: number, region: Region): { amount: number; currency: "CAD" | "AED"; approx: boolean } {
  if (region === "uae") return { amount: Math.round((cad * RATE_CAD_AED) / 10) * 10, currency: "AED", approx: true };
  return { amount: cad, currency: "CAD", approx: false };
}

export function formatPrice(cad: number, region: Region): string {
  const { amount, currency } = convertPrice(cad, region);
  if (currency === "AED") return `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(amount)}`;
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
}

/** First-visit guess: Gulf timezone or an Arabic/UAE locale → UAE; everything else → International. Never used over a saved choice. */
export function detectRegion(): Region {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (/^Asia\/(Dubai|Muscat|Qatar|Bahrain|Riyadh|Kuwait)$/.test(tz)) return "uae";
    const langs = typeof navigator !== "undefined" ? [navigator.language, ...(navigator.languages ?? [])] : [];
    if (langs.some((l) => /-(AE|SA|QA|BH|KW|OM)$/i.test(l ?? ""))) return "uae";
  } catch { /* ignore */ }
  return "intl";
}

export function readRegion(): Region | null {
  try { const v = localStorage.getItem(REGION_KEY); return isRegion(v) ? v : null; } catch { return null; }
}

export function saveRegion(r: Region) {
  try { localStorage.setItem(REGION_KEY, r); } catch { /* ignore */ }
}
