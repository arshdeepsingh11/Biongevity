/**
 * Longevity supplements.
 *
 * UAE list — only formulas confirmed for the UAE (Dr. Kapoor, Nov 2026):
 *   • LONgevity+ (UAE-approved)        • CellOmega+ — FISH-oil version only in the UAE (the vegan version is NOT sold in the UAE)
 *   • Creagen — 5 kinds in the UAE (current packaging; new packaging from the new year)
 *   ✗ Glutara and SleepO are NOT approved in the UAE: never list them on UAE pages.
 * No prices on UAE pages: visitors enquire on WhatsApp.
 *
 * International list — links to the US store (bioarodrugs.com/us), where prices are in USD.
 */
export interface Supplement { id: string; name: string; line: string; detail: string; storeHandle?: string }

export const UAE_SUPPLEMENTS: Supplement[] = [
  { id: "longevity-plus", name: "LONgevity+", line: "Cellular energy and healthy ageing", detail: "NMN, resveratrol, CoQ10, curcumin, vitamin D3 and vitamin B12 in one daily formula." },
  { id: "cellomega-plus", name: "CellOmega+", line: "Omega-3 for heart, brain and cells", detail: "The UAE version uses omega-3 from fish oil." },
  { id: "creagen", name: "Creagen", line: "Creatine formulas for energy, focus and performance", detail: "Five Creagen formulas are available in the UAE. Ask us which one suits your goals." },
];

export const INTL_SUPPLEMENTS: Supplement[] = [
  { id: "longevity-plus", name: "LONgevity+", line: "Cellular energy and healthy ageing", detail: "NMN, resveratrol, CoQ10, curcumin, vitamin D3 and vitamin B12.", storeHandle: "longevity-plus" },
  { id: "cellomega-plus", name: "CellOmega+", line: "Omega-3 for heart, brain and cells", detail: "Omega-3 with antioxidants and essential nutrients.", storeHandle: "cellomega-plus" },
  { id: "creagen", name: "Creagen", line: "Creatine for energy, focus and performance", detail: "Brain Boost, Femme Energy, Raw Power and Pro Power.", storeHandle: "creagen-brain-boost" },
];

export const US_STORE = "https://bioarodrugs.com/us";
export const storeUrl = (handle: string) => `${US_STORE}/products/${handle}`;

/** Names that must never appear on UAE pages (checked by tests). */
export const NOT_IN_UAE = ["Glutara", "SleepO"];
