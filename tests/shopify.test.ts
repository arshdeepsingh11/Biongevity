import { afterEach, describe, expect, it, vi } from "vitest";

// env.ts reads NEXT_PUBLIC_* on first import, so set them first and import fresh.
async function client(token = "public-token") {
  vi.stubEnv("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN", "test-store.myshopify.com");
  vi.stubEnv("NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN", token);
  vi.resetModules();
  return import("@/lib/shopify");
}
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });
const node = { id: "gid://p/1", handle: "biogut", title: "BioGut", description: "Gut test", productType: "BioGut", featuredImage: { url: "https://cdn/x.jpg", altText: null }, priceRange: { minVariantPrice: { amount: "279.0", currencyCode: "CAD" } }, variants: { nodes: [{ id: "gid://v/1", availableForSale: true }] } };

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("Shopify storefront client", () => {
  it("is disabled until both the domain and the token are set", async () => {
    expect((await client("")).shopifyStoreEnabled).toBe(false);
    expect((await client()).shopifyStoreEnabled).toBe(true);
  });

  it("reads products through this site's token and maps them", async () => {
    const f = vi.fn().mockResolvedValue(json({ data: { products: { nodes: [node] } } }));
    vi.stubGlobal("fetch", f);
    const { fetchStoreProducts } = await client();
    expect(await fetchStoreProducts()).toEqual([{ id: "gid://p/1", handle: "biogut", title: "BioGut", description: "Gut test", type: "BioGut", image: { url: "https://cdn/x.jpg", alt: "BioGut" }, price: 279, currency: "CAD", variantId: "gid://v/1", available: true }]);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://test-store.myshopify.com/api/2025-10/graphql.json");
    expect(init.headers["X-Shopify-Storefront-Access-Token"]).toBe("public-token");
  });

  it("handles a product with no image or variant", async () => {
    const { toStoreProduct } = await client();
    const p = toStoreProduct({ ...node, featuredImage: null, variants: { nodes: [] } });
    expect(p.image).toBeNull();
    expect(p.available).toBe(false);
  });

  it("throws on GraphQL and HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ errors: [{ message: "Bad token" }] })));
    const { fetchStoreProducts } = await client();
    await expect(fetchStoreProducts()).rejects.toThrow("Bad token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({}, 401)));
    await expect(fetchStoreProducts()).rejects.toThrow("401");
  });

  it("returns the hosted checkout URL, or Shopify's own error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ data: { cartCreate: { cart: { checkoutUrl: "https://checkout/1" }, userErrors: [] } } })));
    const { createCheckout } = await client();
    expect(await createCheckout("gid://v/1")).toBe("https://checkout/1");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ data: { cartCreate: { cart: null, userErrors: [{ message: "Sold out" }] } } })));
    await expect(createCheckout("gid://v/1")).rejects.toThrow("Sold out");
  });
});
