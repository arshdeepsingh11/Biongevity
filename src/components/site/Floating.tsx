"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { UAE_CLINIC, WA, waLink } from "@/content/contact";

/**
 * UAE pages only: the fixed WhatsApp button (bottom right, every page) and, on phones, a sticky bar with
 * Call and Book now so booking is always one tap away. Book now opens WhatsApp with the page's service.
 */
export function Floating() {
  const path = usePathname() ?? "/";
  if (!path.startsWith("/uae")) return null;
  return (
    <>
      <a href={waLink(WA.general)} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" className="wa-fab6">
        <Icon name="whatsapp" size={30} weight="fill" />
        <span className="hidden text-[15px] font-semibold lg:inline">WhatsApp us</span>
      </a>
      <MobileBar />
    </>
  );
}

function MobileBar() {
  // The page's main service (service pages set data-page-item) pre-fills the booking message.
  const path = usePathname();
  const [item, setItem] = useState<string | undefined>();
  useEffect(() => { setItem(document.querySelector<HTMLElement>("[data-page-item]")?.dataset.pageItem); }, [path]);
  return (
    <div className="mbar6 lg:hidden" data-ai="Mobile bar" data-item={item}>
      <div className="flex items-center gap-2 pr-[70px]">
        <a href={UAE_CLINIC.tel} aria-label={`Call ${UAE_CLINIC.phone}`} className="btn6 btn6-ghost h-12 w-12 shrink-0 !px-0"><Icon name="call" size={19} /></a>
        <a href={waLink(item ? WA.book(item) : WA.general)} target="_blank" rel="noopener" data-book className="btn6 btn6-primary h-12 flex-1 text-[15px]"><Icon name="calendar" size={17} />Book now</a>
      </div>
    </div>
  );
}

/** Adds the reveal-on-scroll behaviour to elements with data-rv (CSS in site.css). Content stays visible without JS. */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("rv-on");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const bind = () => document.querySelectorAll("[data-rv]:not(.in)").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add("in"); else io.observe(el);
    });
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [path]);
  return null;
}
