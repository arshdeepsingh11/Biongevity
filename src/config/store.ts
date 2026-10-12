/**
 * Store settings — edit here, no code changes elsewhere.
 * Currency: all prices are CAD.
 * Program terms follow the original biongevity.com plans (3, 6 or 12 months).
 * The listed program price is the 12-month price; set 3- and 6-month prices when finance confirms them
 * (null = "priced by the care team").
 */
export const CURRENCY = "CAD";

export const TERMS = [3, 6, 12] as const;
export type Term = (typeof TERMS)[number];

/** Program price by term (CAD). 12-month = published price. */
export const TERM_PRICES: Record<string, Partial<Record<Term, number | null>>> = {
  core: { 3: null, 6: null },
  precision: { 3: null, 6: null },
  elite: { 3: null, 6: null },
};

/** Formulas are one-time purchases (no subscription on the original sites). */
export const FORMULA_SUBSCRIPTION = false;

/**
 * Policies — left empty until legal confirms them; the UI hides empty items.
 * None of biongevity.com, bioarolabs.com or bioarodrugs.com publish these in crawlable text today.
 */
export const POLICIES = { refunds: "", shipping: "", kitRegions: "" };
