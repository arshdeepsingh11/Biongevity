"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";
import { placementOf, track } from "@/lib/track";

/**
 * Loads Google Tag Manager when NEXT_PUBLIC_GTM_ID is set and records the conversion events the site cares about:
 * page views on every route change, and clicks on Book now, WhatsApp, Call and the AI assistant's booking nudge.
 * One delegated listener covers every button, so new pages are tracked automatically.
 */
export function Analytics() {
  const path = usePathname();
  const first = useRef(true);

  // Region follows the URL: /uae/… is the Dubai clinic site, everything else is International.
  useEffect(() => { document.documentElement.dataset.region = path.startsWith("/uae") ? "uae" : "intl"; }, [path]);

  useEffect(() => {
    if (first.current) { first.current = false; if (env.gtmId) return; } // GTM records the first page view itself
    track("page_view", { page_title: document.title });
  }, [path]);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const text = (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 40), placement = placementOf(a);
      // data-item = the service or department the button is about (e.g. "HydraFacial"), so ads can be tied to services.
      const item = a.closest<HTMLElement>("[data-item]")?.dataset.item;
      if (a.hasAttribute("data-book")) track(a.closest("[data-ai-cta]") ? "ai_book_click" : "book_click", { placement, text, item, channel: a.href.startsWith("https://wa.me/") ? "whatsapp" : "link" });
      else if (a.href.startsWith("https://wa.me/")) track(a.closest("[data-ai-cta]") ? "ai_book_click" : "whatsapp_click", { placement, text, item, channel: "whatsapp" });
      else if (a.href.startsWith("tel:")) track("call_click", { placement, text, item });
    };
    document.addEventListener("click", on, { capture: true });
    return () => document.removeEventListener("click", on, { capture: true });
  }, []);

  if (!env.gtmId) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${env.gtmId}');`}</Script>
      <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${env.gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="gtm" /></noscript>
    </>
  );
}
