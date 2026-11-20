/**
 * Conversion tracking — every event goes to the dataLayer, where Google Tag Manager (NEXT_PUBLIC_GTM_ID)
 * forwards it to GA4, Meta or anything else the marketing team adds. No personal data is sent.
 *
 * Events: page_view · book_click · whatsapp_click · call_click · enquiry_submit · ai_book_click · region_change
 */
declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

export type TrackEvent = "page_view" | "book_click" | "whatsapp_click" | "call_click" | "enquiry_submit" | "ai_book_click" | "region_change";

export function track(event: TrackEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
  (window.dataLayer ??= []).push({ event, page_path: location.pathname, region: document.documentElement.dataset.region ?? "intl", language: document.documentElement.lang || "en", ...clean });
}

/** The section a clicked element sits in, for `placement` (e.g. "Hero", "Programs & pricing", "Book"). */
export function placementOf(el: Element | null): string {
  const s = el?.closest<HTMLElement>("[data-ai], header, footer, nav, [role=dialog]");
  if (!s) return "page";
  return s.dataset.ai ?? s.tagName.toLowerCase();
}
