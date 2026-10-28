"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 3D ring carousel — cards stand on a turning ring. Drag or swipe to spin; it keeps turning slowly on its own
 * and snaps the nearest card to the front when you let go. Tap a card to bring it forward.
 */
export function Carousel3D<T>({ items, render, radius = 420, cardWidth = 230, height = 400, speed = 0.06, className, onFront }: {
  items: T[]; render: (item: T, front: boolean) => ReactNode; radius?: number; cardWidth?: number; height?: number; speed?: number; className?: string; onFront?: (i: number) => void;
}) {
  const n = items.length, step = 360 / n;
  const [angle, setAngle] = useState(0);
  const st = useRef({ a: 0, target: null as number | null, drag: false, x: 0, v: 0, hover: false });
  const ring = useRef<HTMLDivElement>(null);
  // Radius from the number of cards (no overlap); the whole ring scales down to fit narrow screens.
  const r = Math.max(radius * 0.6, (n * (cardWidth + 24)) / (2 * Math.PI));
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const f = () => { const w = ring.current?.parentElement?.clientWidth ?? 800; setFit(Math.min(1, w / (r * 1.25 + cardWidth))); };
    f(); addEventListener("resize", f); return () => removeEventListener("resize", f);
  }, [r, cardWidth]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = performance.now(), seen = true;
    // only animate while the ring is on screen
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }, { rootMargin: "120px" });
    if (ring.current) io.observe(ring.current);
    const tick = (t: number) => {
      if (!seen || document.hidden) { raf = 0; return; }
      const dt = Math.min(48, t - last); last = t; const s = st.current;
      if (s.target !== null) { s.a += (s.target - s.a) * 0.12; if (Math.abs(s.target - s.a) < 0.05) { s.a = s.target; s.target = null; } }
      else if (!s.drag) { s.a += s.v; s.v *= 0.93; if (!reduced && !s.hover && Math.abs(s.v) < 0.02) s.a -= speed * dt * 0.06; }
      setAngle(s.a); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [speed]);

  const front = ((Math.round(-angle / step) % n) + n) % n;
  useEffect(() => { onFront?.(front); }, [front, onFront]);
  const snap = () => { const s = st.current; s.target = Math.round(s.a / step) * step; };
  const bring = (k: number) => { const s = st.current; const cur = Math.round(s.a / step); let d = (-k - cur) % n; if (d > n / 2) d -= n; if (d < -n / 2) d += n; s.target = (cur + d) * step; };

  return (
    <div className={cn("relative select-none touch-pan-y", className)} style={{ height, perspective: "1600px" }}
      onMouseEnter={() => { st.current.hover = true; }} onMouseLeave={() => { st.current.hover = false; }}
      onPointerDown={(e) => { const s = st.current; s.drag = true; s.x = e.clientX; s.target = null; (e.currentTarget as Element).setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => { const s = st.current; if (!s.drag) return; const d = (e.clientX - s.x) * 0.25; s.x = e.clientX; s.a += d; s.v = d; }}
      onPointerUp={() => { st.current.drag = false; setTimeout(snap, 380); }} onPointerCancel={() => { st.current.drag = false; snap(); }}>
      <div ref={ring} className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d", transform: `translate(-50%,-50%) scale(${fit}) translateZ(${-r}px) rotateX(-6deg) rotateY(${angle}deg)` }}>
        {items.map((it, k) => {
          const a = k * step, rel = ((((a + angle) % 360) + 540) % 360) - 180, facing = Math.cos((rel * Math.PI) / 180);
          return (
            <div key={k} onClick={() => bring(k)} className="absolute cursor-grab active:cursor-grabbing"
              style={{ width: cardWidth, left: -cardWidth / 2, top: -height * 0.42, transform: `rotateY(${a}deg) translateZ(${r}px)`, backfaceVisibility: "hidden", opacity: 0.35 + Math.max(0, facing) * 0.65, filter: facing < 0.6 ? `blur(${(0.6 - facing) * 2}px)` : "none" }}>
              {render(it, k === front)}
            </div>
          );
        })}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-[15%] bottom-2 h-10 rounded-[50%] bg-ai/10 blur-2xl" />
    </div>
  );
}
