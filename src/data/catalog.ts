import { LAB_TESTS, LAB_COLLECTIONS } from "./labs";
import { DRUG_PRODUCTS, DRUG_COLLECTIONS } from "./drugs";
import type { CatalogProduct } from "./types";

/** Local catalog = fallback + source of static routes. Shopify data is merged over it at runtime. */
export const CATALOG: CatalogProduct[] = [...LAB_TESTS, ...DRUG_PRODUCTS];
export const COLLECTIONS = [...LAB_COLLECTIONS, ...DRUG_COLLECTIONS];
export const productByHandle = (h: string) => CATALOG.find((p) => p.handle === h);
