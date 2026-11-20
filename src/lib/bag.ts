import type { ShopItem } from "@/lib/catalog";
import { TERMS, TERM_PRICES, type Term } from "@/config/store";

/** One line in the "My plan" bag. Programs carry a term (3, 6 or 12 months). */
export interface Line { id: string; term?: Term }

/** Price for a line: programs depend on term (12 months = published price; null = care-team quote). */
export const linePrice = (item: ShopItem, term?: Term): number | null => {
  if (item.kind !== "program" || !term || term === 12) return item.price;
  const v = TERM_PRICES[item.handle]?.[term];
  return v === undefined ? null : v;
};

/** Saved bag from storage → valid lines only. Bad or tampered data yields an empty bag instead of a crash. */
export function parseLines(saved: string | null): Line[] {
  if (!saved) return [];
  try {
    const v: unknown = JSON.parse(saved);
    if (!Array.isArray(v)) return [];
    return v.filter((l): l is Line => !!l && typeof l === "object" && typeof (l as Line).id === "string" && ((l as Line).term === undefined || TERMS.includes((l as Line).term as Term)));
  } catch {
    return [];
  }
}
