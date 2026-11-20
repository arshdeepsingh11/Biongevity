"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { UAE_CLINIC, waLink } from "@/content/contact";
import { isUaePath, localeFromPath, t } from "@/i18n";

/**
 * Dubai pages only: the fixed WhatsApp button (bottom corner, every page) and, on phones, a sticky bar with
 * Call and Book now so booking is always one tap away. Book now opens WhatsApp with the page's service.
 */
export function Floating() {
  const path = usePathname() ?? "/";
  if (!isUaePath(path)) return null;
  const x = t(localeFromPath(path));
  return (
    <aside aria-label={x.whatsappUs}>
      <a href={waLink(x.wa.general)} target="_blank" rel="noopener" aria-label={x.whatsappUs} data-item="Floating WhatsApp" className="wa-fab6">
        <Icon name="whatsapp" size={30} weight="fill" />
        <span className="hidden text-[15px] font-semibold lg:inline">{x.whatsappUs}</span>
      </a>
      <MobileBar />
    </aside>
  );
}

function MobileBar() {
  // The page's main service (service pages set data-page-item / data-page-track) pre-fills the booking message.
  const path = usePathname() ?? "/";
  const x = t(localeFromPath(path));
  const [item, setItem] = useState<{ text?: string; track?: string }>({});
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-page-item]");
    setItem({ text: el?.dataset.pageItem, track: el?.dataset.pageTrack ?? el?.dataset.pageItem });
  }, [path]);
  return (
    <div className="mbar6 lg:hidden" data-ai="Mobile bar">
      <div className="flex items-center gap-2 pe-[70px]">
        <a href={UAE_CLINIC.tel} aria-label={`${x.call} ${UAE_CLINIC.phone}`} className="btn6 btn6-ghost h-12 w-12 shrink-0 !px-0"><Icon name="call" size={19} /></a>
        <a href={waLink(item.text ? x.wa.book(item.text) : x.wa.general)} target="_blank" rel="noopener" data-book data-item={item.track ?? "Mobile bar"} className="btn6 btn6-primary h-12 flex-1 text-[15px]"><Icon name="calendar" size={17} />{x.bookNow}</a>
      </div>
    </div>
  );
}

/** Adds the reveal-on-scroll behaviour to elements with data-rv (CSS in site.css). Content stays visible without JS. */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Anything already on screen stays visible (one measurement pass, before hiding the rest) → no flicker at load.
    const h = innerHeight;
    document.querySelectorAll("[data-rv]:not(.in)").forEach((el) => { if (el.getBoundingClientRect().top < h * 0.95) el.classList.add("in"); });
    document.documentElement.classList.add("rv-on");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    // Observe each remaining [data-rv] element once (no measuring on every DOM change: that forced extra layouts).
    const seen = new WeakSet<Element>();
    const bind = () => document.querySelectorAll("[data-rv]:not(.in)").forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
    bind();
    let queued = 0;
    const mo = new MutationObserver(() => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; bind(); }); });
    mo.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(queued); };
  }, [path]);
  // Spotlight cards (.spot6): the glow follows the pointer. One listener for the whole page.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(".spot6");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);
  return null;
}
