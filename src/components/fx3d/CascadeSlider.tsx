"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * 3D cascade slider — the active slide sits in front; neighbours fan out behind it, smaller and turned.
 * Drag (mouse), swipe (touch), arrow keys and autoplay. Only the 3D stacking lives in inline styles;
 * everything else is Tailwind, so it can be restyled freely.
 */
export function CascadeSlider<T>({ items, render, autoplay = 4200, className, label = "Slides", onChange }: {
  items: T[]; render: (item: T, active: boolean, i: number) => ReactNode; autoplay?: number; className?: string; label?: string; onChange?: (i: number) => void;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; dx: number } | null>(null);
  const [dx, setDx] = useState(0);
  const n = items.length;
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => { onChange?.(i); }, [i, onChange]);
  useEffect(() => {
    if (!autoplay || paused || n < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(i + 1), autoplay);
    return () => clearTimeout(id);
  }, [i, paused, autoplay, go, n]);

  const down = (e: React.PointerEvent) => { drag.current = { x: e.clientX, dx: 0 }; (e.target as Element).setPointerCapture?.(e.pointerId); setPaused(true); };
  const move = (e: React.PointerEvent) => { if (!drag.current) return; drag.current.dx = e.clientX - drag.current.x; setDx(drag.current.dx); };
  const up = () => { const d = drag.current?.dx ?? 0; drag.current = null; setDx(0); if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1)); setPaused(false); };

  return (
    <div className={cn("relative select-none", className)} role="region" aria-roledescription="carousel" aria-label={label}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }} tabIndex={0}>
      <div className="relative mx-auto h-[380px] touch-pan-y sm:h-[420px]" style={{ perspective: "1400px" }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {items.map((it, k) => {
          let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
          const a = Math.abs(off), shift = dx / 260;
          const o = off + shift;
          const visible = a <= 3;
          return (
            <div key={k} aria-hidden={off !== 0} onClick={() => off !== 0 && go(k)}
              className={cn("absolute left-1/2 top-1/2 w-[min(78vw,300px)] cursor-grab transition-[transform,opacity,filter] duration-[650ms] ease-[cubic-bezier(.2,.8,.2,1)] active:cursor-grabbing", drag.current && "!duration-0")}
              style={{
                transform: `translate(-50%,-50%) translateX(${o * 58}%) translateZ(${-Math.abs(o) * 140}px) rotateY(${o * -24}deg) scale(${1 - Math.min(Math.abs(o), 3) * 0.06})`,
                zIndex: 50 - a, opacity: visible ? 1 - a * 0.18 : 0, filter: a ? `blur(${Math.min(a, 3) * 0.6}px) saturate(${1 - a * 0.15})` : "none",
                pointerEvents: visible ? "auto" : "none",
              }}>
              {render(it, off === 0, k)}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button onClick={() => go(i - 1)} aria-label="Previous" className="btn-light grid h-10 w-10 place-items-center !p-0"><Icon name="chevron-left" size={18} /></button>
        <div className="flex max-w-[60vw] gap-1.5 overflow-hidden">
          {items.map((_, k) => <button key={k} onClick={() => go(k)} aria-label={`Slide ${k + 1}`} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-6 bg-ai" : "w-1.5 bg-ink/15")} />)}
        </div>
        <button onClick={() => go(i + 1)} aria-label="Next" className="btn-light grid h-10 w-10 place-items-center !p-0"><Icon name="chevron-right" size={18} /></button>
      </div>
    </div>
  );
}
