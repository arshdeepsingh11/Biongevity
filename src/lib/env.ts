/**
 * Public runtime configuration (static export → only NEXT_PUBLIC_* values exist in the browser).
 * Never put secrets here. Biongevity SI and Shopify must expose browser-safe, rate-limited endpoints/tokens.
 */
export const env = {
  xevyoUrl: process.env.NEXT_PUBLIC_XEVYO_URL ?? "",
  xevyoKey: process.env.NEXT_PUBLIC_XEVYO_PUBLIC_KEY ?? "",
  xevyoModel: process.env.NEXT_PUBLIC_XEVYO_MODEL ?? "",
  shopifyDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
  /** Public Storefront API token of this site's Headless channel (safe in the browser, read-only catalog + checkout). */
  shopifyToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "",
  /** Forms Worker (deploy/forms): saves contact enquiries and serves /admin. Base URL, no trailing slash. */
  formsUrl: (process.env.NEXT_PUBLIC_FORMS_URL ?? "").replace(/\/$/, ""),
  /** Where the contact form posts. Defaults to the forms Worker; empty = open a pre-filled email instead. */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || (process.env.NEXT_PUBLIC_FORMS_URL ? `${process.env.NEXT_PUBLIC_FORMS_URL.replace(/\/$/, "")}/contact` : ""),
  /**
   * Google Tag Manager container. Default: Biongevity's GTM-PH9BZ2TR. Set NEXT_PUBLIC_GTM_ID="off" to disable (e.g. local tests).
   * GA4 (G-GKPG2B7BWE) is added INSIDE GTM as a "Google tag", not in the code, so page views are never counted twice.
   */
  gtmId: (process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PH9BZ2TR") === "off" ? "" : (process.env.NEXT_PUBLIC_GTM_ID || "GTM-PH9BZ2TR"),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://biongevity.com",
  /** Biongevity member app (digital twin, results, coach). The website only links to it. */
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || "https://app.biongevity.com").replace(/\/$/, ""),
};

/** Book a consultation — the member app's consultation categories (one place for every booking). */
export const BOOK_URL = `${env.appUrl}/en/patient/cons-categories`;

export const xevyoEnabled = Boolean(env.xevyoUrl);
export const shopifyEnabled = Boolean(env.shopifyDomain);
