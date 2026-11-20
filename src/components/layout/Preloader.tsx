"use client";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { gsap, reducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";

const KEY = "bg-intro";

/**
 * A short curtain on the first visit of a session: the mark rises in, a thin line draws under it,
 * then the curtain lifts. Only the logo — no counter, no bar. Skipped on later pages in the same
 * tab and under reduced motion. Fires `bg:ready` so the hero can start its own entrance in time.
 */
export function Preloader() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = true;
    try { seen = sessionStorage.getItem(KEY) === "1"; sessionStorage.setItem(KEY, "1"); } catch { /* storage blocked */ }
    if (seen || reducedMotion()) { markReady(); return; }
    setShow(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!show || !el) return;
    const tl = gsap.timeline({ onComplete: () => setShow(false) });
    tl.fromTo(el.querySelector("[data-mark]"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out" }, 0.1)
      .to(el.querySelector("[data-line]"), { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 0.45)
      .add(markReady, 1.15)
      .to(el.querySelector("[data-inner]"), { yPercent: -30, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.15)
      .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 1.25);
    return () => { tl.kill(); };
  }, [show]);

  if (!show) return null;
  return (
    <div ref={ref} aria-hidden className="fixed inset-0 z-[200] grid place-items-center bg-pearl text-ink">
      <div data-inner className="relative flex flex-col items-center">
        <span data-mark className="block opacity-0"><LogoMark size={64} /></span>
        <span data-line className="mt-6 block h-px w-24 origin-left scale-x-0 bg-ai-2" />
      </div>
    </div>
  );
}
