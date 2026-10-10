"use client";
import { useEffect, useState } from "react";
import { getProducts, isShopifyConfigured } from "@/lib/shopify";
import type { CatalogProduct } from "@/data/types";

/**
 * Starts from the local catalog (instant, works offline / in the app), then —
 * if Shopify is configured — swaps in live products (prices, images, variant IDs, stock).
 */
export function useShopifyCatalog(local: CatalogProduct[], vendor?: string) {
  const [items, setItems] = useState(local);
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!isShopifyConfigured) return;
    let on = true;
    getProducts(vendor ? `vendor:'${vendor}'` : undefined)
      .then((ps) => { if (on && ps.length) { setItems(ps); setLive(true); } })
      .catch((e) => console.warn("[shopify] using local catalog:", e.message));
    return () => { on = false; };
  }, [vendor]);
  return { items, live };
}
