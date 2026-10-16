/**
 * Public runtime configuration (static export → only NEXT_PUBLIC_* values exist in the browser).
 * Never put secrets here. Biongevity SI and Shopify must expose browser-safe, rate-limited endpoints/tokens.
 */
export const env = {
  xevyoUrl: process.env.NEXT_PUBLIC_XEVYO_URL ?? "",
  xevyoKey: process.env.NEXT_PUBLIC_XEVYO_PUBLIC_KEY ?? "",
  xevyoModel: process.env.NEXT_PUBLIC_XEVYO_MODEL ?? "",
  shopifyDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://biongevity.com",
  /** Biongevity member app (digital twin, results, coach). The website only links to it. */
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || "https://app.biongevity.com").replace(/\/$/, ""),
};

export const xevyoEnabled = Boolean(env.xevyoUrl);
export const shopifyEnabled = Boolean(env.shopifyDomain);
