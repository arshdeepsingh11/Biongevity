"use client";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

/** A card that leans a few degrees toward the pointer and lifts, with a soft light sweep. Pointer devices only. */
export function Tilt({ children, className = "", max = 6, lift = 6, glare = true }: { children: ReactNode; className?: string; max?: number; lift?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * max, rotateX: -y * max, y: -lift, duration: 0.5, ease: "power2.out", transformPerspective: 900 });
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 1, x: `${x * 60}%`, y: `${y * 60}%`, duration: 0.5, ease: "power2.out" });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: "power3.out" });
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.6 });
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`relative [transform-style:preserve-3d] will-change-transform ${className}`}>
      {children}
      {/* The light sweep is bigger than the card; this layer clips it so it never widens the page on phones. */}
      {glare && <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"><div ref={glareRef} className="absolute inset-[-40%] opacity-0" style={{ background: "radial-gradient(40% 40% at 50% 50%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)" }} /></div>}
    </div>
  );
}
