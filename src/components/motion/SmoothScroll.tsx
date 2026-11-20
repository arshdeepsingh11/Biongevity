"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

declare global {
  interface Window { __lenis?: Lenis }
}

/**
 * Smooth, inertial scrolling for the whole site (Lenis), kept in step with GSAP's ScrollTrigger.
 * It only eases what the visitor already asked for — never takes the wheel — and is off entirely
 * under prefers-reduced-motion. Dialogs, the AI panel and anything marked `data-lenis-prevent`
 * scroll natively; anchor links glide to their target.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false,
      prevent: (node) => !!node.closest("[data-lenis-prevent], [role='dialog'], [aria-modal='true'], .si-panel"),
    });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!link) return;
      const href = link.getAttribute("href")!;
      if (href.startsWith("/#") && location.pathname !== "/") return;
      const id = href.slice(href.indexOf("#") + 1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -84, duration: 1.1 });
      history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // New page: let the layout settle, then re-measure every scroll-driven animation.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
