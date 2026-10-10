import { shopifyFetch, isShopifyConfigured } from "./client";
import * as Q from "./queries";
import type { ShopifyCart, ShopifyProduct } from "./types";
import type { CatalogProduct } from "@/data/types";
import { CATALOG, productByHandle } from "@/data/catalog";

export { isShopifyConfigured };
export type { ShopifyCart, ShopifyProduct };

/** Merge a live Shopify product over the local record (local keeps rich fields like ingredients). */
export function mergeProduct(sp: ShopifyProduct): CatalogProduct {
  const local = productByHandle(sp.handle);
  const v = sp.variants.nodes[0];
  return {
    ...(local ?? {
      kind: sp.productType === "Lab Test" ? "lab-test" : "supplement",
      vendor: (sp.vendor as CatalogProduct["vendor"]) || "Biongevity",
      category: "", icon: "box", summary: sp.description,
    }),
    handle: sp.handle,
    title: sp.title,
    price: Number(v?.price.amount ?? sp.priceRange.minVariantPrice.amount),
    currency: v?.price.currencyCode ?? sp.priceRange.minVariantPrice.currencyCode,
    image: sp.featuredImage?.url,
    variantId: v?.id,
    availableForSale: sp.availableForSale,
  } as CatalogProduct;
}

export async function getProducts(query?: string): Promise<CatalogProduct[]> {
  if (!isShopifyConfigured) return CATALOG;
  const d = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(Q.PRODUCTS_QUERY, { first: 250, query });
  return d.products.nodes.map(mergeProduct);
}

export async function getProduct(handle: string): Promise<CatalogProduct | undefined> {
  if (!isShopifyConfigured) return productByHandle(handle);
  const d = await shopifyFetch<{ product: ShopifyProduct | null }>(Q.PRODUCT_BY_HANDLE_QUERY, { handle });
  return d.product ? mergeProduct(d.product) : productByHandle(handle);
}

type CartPayload = { cart: ShopifyCart; userErrors: { message: string }[] };

export const cartApi = {
  create: (lines: { merchandiseId: string; quantity: number }[]) =>
    shopifyFetch<{ cartCreate: CartPayload }>(Q.CART_CREATE, { lines }).then((d) => d.cartCreate.cart),
  get: (id: string) => shopifyFetch<{ cart: ShopifyCart | null }>(Q.CART_QUERY, { id }).then((d) => d.cart),
  add: (cartId: string, lines: { merchandiseId: string; quantity: number }[]) =>
    shopifyFetch<{ cartLinesAdd: CartPayload }>(Q.CART_LINES_ADD, { cartId, lines }).then((d) => d.cartLinesAdd.cart),
  update: (cartId: string, lines: { id: string; quantity: number }[]) =>
    shopifyFetch<{ cartLinesUpdate: CartPayload }>(Q.CART_LINES_UPDATE, { cartId, lines }).then((d) => d.cartLinesUpdate.cart),
  remove: (cartId: string, lineIds: string[]) =>
    shopifyFetch<{ cartLinesRemove: CartPayload }>(Q.CART_LINES_REMOVE, { cartId, lineIds }).then((d) => d.cartLinesRemove.cart),
};
