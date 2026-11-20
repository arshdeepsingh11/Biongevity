import { env } from "./env";

/**
 * Central Shopify store, read through this site's own Headless storefront.
 * The public Storefront token only returns products published to the Biongevity sales channel,
 * so which products appear here is controlled in Shopify admin, not in code.
 */
const API_VERSION = "2025-10";

export interface StoreProduct {
  id: string; handle: string; title: string; description: string; type: string;
  image: { url: string; alt: string } | null;
  price: number; currency: string; variantId: string; available: boolean;
}

interface ProductNode {
  id: string; handle: string; title: string; description: string; productType: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: { id: string; availableForSale: boolean }[] };
}

const PRODUCTS = `{
  products(first: 100, sortKey: TITLE) {
    nodes {
      id handle title productType
      description(truncateAt: 120)
      featuredImage { url(transform: { maxWidth: 640 }) altText }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 1) { nodes { id availableForSale } }
    }
  }
}`;

const CART_CREATE = `mutation ($lines: [CartLineInput!]!) {
  cartCreate(input: { lines: $lines }) {
    cart { checkoutUrl }
    userErrors { message }
  }
}`;

export const shopifyStoreEnabled = Boolean(env.shopifyDomain && env.shopifyToken);

async function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const r = await fetch(`https://${env.shopifyDomain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": env.shopifyToken },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) throw new Error(`Shopify responded ${r.status}`);
  const j = (await r.json()) as { data?: T; errors?: { message: string }[] };
  if (j.errors?.length || !j.data) throw new Error(j.errors?.[0]?.message ?? "Empty Shopify response");
  return j.data;
}

export const toStoreProduct = (n: ProductNode): StoreProduct => ({
  id: n.id, handle: n.handle, title: n.title, description: n.description, type: n.productType,
  image: n.featuredImage ? { url: n.featuredImage.url, alt: n.featuredImage.altText ?? n.title } : null,
  price: Number(n.priceRange.minVariantPrice.amount), currency: n.priceRange.minVariantPrice.currencyCode,
  variantId: n.variants.nodes[0]?.id ?? "", available: n.variants.nodes[0]?.availableForSale ?? false,
});

export async function fetchStoreProducts(): Promise<StoreProduct[]> {
  const d = await storefront<{ products: { nodes: ProductNode[] } }>(PRODUCTS);
  return d.products.nodes.map(toStoreProduct);
}

/** Creates a Shopify cart and returns its hosted checkout URL. */
export async function createCheckout(variantId: string, quantity = 1): Promise<string> {
  const d = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(CART_CREATE, { lines: [{ merchandiseId: variantId, quantity }] });
  const url = d.cartCreate.cart?.checkoutUrl;
  if (!url) throw new Error(d.cartCreate.userErrors[0]?.message ?? "Could not create a checkout");
  return url;
}
