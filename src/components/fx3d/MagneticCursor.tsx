"use client";
import { useEffect, useRef } from "react";

/**
 * Magnetic cursor — a soft ring follows the mouse; primary buttons (and anything with data-magnetic) gently pull
 * toward the pointer and the ring wraps them. Mouse only, off for touch and reduced motion.
 */
export function MagneticCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ring.current!, d = dot.current!;
    document.documentElement.classList.add("has-magnetic");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, w = 34, h = 34, tw = 34, th = 34, rad = 999, raf = 0;
    let target: HTMLElement | null = null;
    const SEL = "[data-magnetic], .btn-ai, .btn-dark";
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY; r.style.opacity = "1"; d.style.opacity = "1";
      const el = (e.target as HTMLElement | null)?.closest?.(SEL) as HTMLElement | null;
      if (el !== target) { if (target) target.style.translate = ""; target = el; }
      if (target) {
        const b = target.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        target.style.translate = `${(x - cx) * 0.18}px ${(y - cy) * 0.28}px`;
        tw = b.width + 10; th = b.height + 10; rad = Math.min(b.height / 2 + 5, 28);
      } else { tw = th = 34; rad = 999; }
    };
    const leave = () => { r.style.opacity = "0"; d.style.opacity = "0"; if (target) target.style.translate = ""; target = null; };
    const loop = () => {
      if (target) { const b = target.getBoundingClientRect(); rx += (b.left + b.width / 2 - rx) * 0.25; ry += (b.top + b.height / 2 - ry) * 0.25; }
      else { rx += (x - rx) * 0.2; ry += (y - ry) * 0.2; }
      w += (tw - w) * 0.2; h += (th - h) * 0.2;
      r.style.transform = `translate(${rx - w / 2}px, ${ry - h / 2}px)`; r.style.width = `${w}px`; r.style.height = `${h}px`; r.style.borderRadius = `${rad}px`;
      d.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); document.documentElement.classList.remove("has-magnetic"); if (target) target.style.translate = ""; };
  }, []);
  return (
    <>
      <div ref={ring} aria-hidden className="magnetic-ring pointer-events-none fixed left-0 top-0 z-[200] opacity-0" />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[201] h-1.5 w-1.5 rounded-full bg-ai opacity-0" />
    </>
  );
}
