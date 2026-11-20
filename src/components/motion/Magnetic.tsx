"use client";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

/** Wraps a button so it drifts a few pixels toward the pointer while hovered and springs back on leave. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength, duration: 0.5, ease: "power3.out" });
  };
  const onLeave = () => { if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" }); };
  return <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`inline-block will-change-transform ${className}`}>{children}</div>;
}
