import { env, shopifyEnabled } from "./env";
import { SHOPIFY_VARIANTS } from "@/config/shopify";

/**
 * Buy links — no backend. When NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is set and the handle has a variant id,
 * the button opens a Shopify cart permalink (Shopify hosts checkout). Otherwise it opens the official store page.
 */
export function buyUrl(item: { handle: string; url: string }, qty = 1): string {
  const variant = SHOPIFY_VARIANTS[item.handle];
  if (shopifyEnabled && variant) return `https://${env.shopifyDomain}/cart/${variant}:${qty}`;
  return item.url;
}

/** Multi-item cart permalink (e.g. a Plan Studio bundle). Falls back to null when Shopify isn't configured. */
export function bundleUrl(handles: string[]): string | null {
  if (!shopifyEnabled) return null;
  const parts = handles.map((h) => SHOPIFY_VARIANTS[h]).filter(Boolean).map((v) => `${v}:1`);
  return parts.length ? `https://${env.shopifyDomain}/cart/${parts.join(",")}` : null;
}

export const storeHost = (url: string) => { try { return new URL(url).host.replace(/^www\./, ""); } catch { return ""; } };
