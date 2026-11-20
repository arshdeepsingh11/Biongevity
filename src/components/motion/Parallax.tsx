"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

/** Moves its children a little slower (or faster) than the page as it scrolls through the viewport. */
export function Parallax({ children, speed = 0.18, className = "", scale = false }: { children: ReactNode; speed?: number; className?: string; scale?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { yPercent: -speed * 50, scale: scale ? 1.12 : 1 }, {
        yPercent: speed * 50, scale: 1, ease: "none",
        scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [speed, scale]);
  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>;
}
