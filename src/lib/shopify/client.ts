/**
 * Shopify Storefront API client (browser-safe, public Storefront token).
 * Works in the static export and inside Capacitor — no server required.
 * When env vars are missing, `isShopifyConfigured` is false and the app runs
 * on the local catalog with a local cart (demo mode).
 */
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "";
const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-01";

export const isShopifyConfigured = Boolean(domain && token && !domain.startsWith("your-store"));

export class ShopifyError extends Error {}

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isShopifyConfigured) throw new ShopifyError("Shopify is not configured (see .env.example)");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new ShopifyError(`Shopify ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}
