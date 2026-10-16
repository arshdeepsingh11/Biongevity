"use client";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * 3D page flip — a two-page book. Pages turn on their spine with a curl shadow; click a page edge, drag, swipe
 * or use the buttons. On phones it shows one page at a time.
 */
export function PageFlip3D({ pages, className, cover }: { pages: ReactNode[]; className?: string; cover?: ReactNode }) {
  const sheets: { front: ReactNode; back: ReactNode }[] = [];
  const all = cover ? [cover, ...pages] : pages;
  for (let k = 0; k < all.length; k += 2) sheets.push({ front: all[k], back: all[k + 1] ?? <div className="h-full rounded-[18px]" style={{ background: "rgb(var(--c-canvas))" }} /> });
  const [turned, setTurned] = useState(0);
  const [x0, setX0] = useState<number | null>(null);
  const next = () => setTurned((t) => Math.min(sheets.length, t + 1));
  const prev = () => setTurned((t) => Math.max(0, t - 1));

  return (
    <div className={cn("select-none", className)}>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[860px] touch-pan-y sm:aspect-[16/9]" style={{ perspective: "2200px", transformStyle: "preserve-3d" }}
        onPointerDown={(e) => setX0(e.clientX)} onPointerUp={(e) => { if (x0 !== null) { const d = e.clientX - x0; if (d < -40) next(); if (d > 40) prev(); } setX0(null); }}>
        <div aria-hidden className="absolute inset-y-[4%] left-1/2 w-px -translate-x-1/2 bg-ink/10" />
        {sheets.map((s, k) => {
          const isTurned = k < turned;
          return (
            <div key={k} className="absolute inset-y-0 left-1/2 w-1/2 transition-transform duration-[900ms] ease-[cubic-bezier(.3,.7,.2,1)]"
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d", transform: `rotateY(${isTurned ? -180 : 0}deg) translateZ(${-k * 0.6}px)`, zIndex: isTurned ? k : sheets.length - k }}>
              <button onClick={next} aria-label="Next page" className="absolute inset-0 overflow-hidden rounded-r-[18px] p-2 text-left" style={{ backfaceVisibility: "hidden" }}>
                {s.front}<span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink/10 to-transparent" />
              </button>
              <button onClick={prev} aria-label="Previous page" className="absolute inset-0 overflow-hidden rounded-l-[18px] p-2 text-left" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                {s.back}<span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink/10 to-transparent" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-muted">
        <button onClick={prev} disabled={!turned} className="btn-light h-10 px-4 disabled:opacity-40"><Icon name="chevron-left" size={16} />Back</button>
        <span>{Math.min(turned * 2 + 1, all.length)} / {all.length}</span>
        <button onClick={next} disabled={turned >= sheets.length} className="btn-light h-10 px-4 disabled:opacity-40">Turn<Icon name="chevron-right" size={16} /></button>
      </div>
    </div>
  );
}
