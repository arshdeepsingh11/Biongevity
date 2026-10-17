/**
 * BioAro Drugs label details — from each product page on bioarodrugs.com (October 2026): pack format, how to use,
 * servings per container and the main active ingredients with their amounts per serving. Shown in the formula book.
 * Keyed by product handle (see drugShop.ts). Supplements are not intended to diagnose, treat, cure or prevent disease.
 */
export interface DrugDetail { format: string; use: string; servings: string; actives: [string, string][] }
