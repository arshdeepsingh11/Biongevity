"use client";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right";

/** Brings its children into view once, the first time they cross the viewport (see `.rv` in globals.css). */
export function Reveal({ children, as: Tag = "div", delay = 0, className = "", variant = "up", style, id }:
  { children: ReactNode; as?: ElementType; delay?: number; className?: string; variant?: RevealVariant; style?: CSSProperties; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.dataset.shown = "true"; return; }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.shown = "true"; io.unobserve(entry.target); }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} id={id} data-shown="false" data-variant={variant} className={`rv ${className}`} style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}>
      {children}
    </Tag>
  );
}
