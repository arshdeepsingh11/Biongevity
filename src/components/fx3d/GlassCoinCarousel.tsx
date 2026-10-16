"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface Coin { id: string; icon: IconName; title: string; value: string; back: string }

/**
 * Glass coin carousel — thick glass coins on an orbit. The front coin flips to show its back side; tap any
 * coin to bring it forward. Each coin has a real edge (stacked layers) so it reads as a 3D object.
 */
export function GlassCoinCarousel({ coins, className, onPick }: { coins: Coin[]; className?: string; onPick?: (c: Coin) => void }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const n = coins.length;
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => { setFlip(false); setI((x) => (x + 1) % n); }, 3600);
    return () => clearInterval(id);
  }, [n]);
  useEffect(() => { const id = setTimeout(() => setFlip(true), 1500); return () => clearTimeout(id); }, [i]);

  return (
    <div className={cn("relative h-[300px] select-none", className)} style={{ perspective: "1200px" }}>
      {coins.map((c, k) => {
        let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
        const a = Math.abs(off), on = off === 0, ang = off * 0.62;
        const x = Math.sin(ang) * 150, z = (Math.cos(ang) - 1) * 260;
        return (
          <button key={c.id} onClick={() => { if (on) { setFlip((f) => !f); onPick?.(c); } else { setFlip(false); setI(k); } }} aria-label={c.title}
            className="absolute left-1/2 top-1/2 h-[168px] w-[168px] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] sm:h-[190px] sm:w-[190px]"
            style={{ transform: `translate(-50%,-50%) translateX(${x}%) translateZ(${z}px) rotateY(${off * -38}deg)`, zIndex: 40 - a, opacity: a > 3 ? 0 : 1 - a * 0.16, transformStyle: "preserve-3d", pointerEvents: a > 3 ? "none" : "auto" }}>
            <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transformStyle: "preserve-3d", transform: `rotateY(${on && flip ? 180 : 0}deg)` }}>
              {[...Array(6)].map((_, d) => <span key={d} aria-hidden className="absolute inset-0 rounded-full bg-ai/20 ring-1 ring-white/40" style={{ transform: `translateZ(${-d - 1}px)` }} />)}
              <span className="coin-face absolute inset-0 grid place-items-center rounded-full" style={{ backfaceVisibility: "hidden", transform: "translateZ(1px)" }}>
                <span className="flex flex-col items-center px-5 text-center">
                  <span className="icon-tile h-11 w-11"><Icon name={c.icon} size={21} /></span>
                  <span className="mt-2 text-[13px] font-semibold leading-tight">{c.title}</span>
                  <span className="mt-1 text-[18px] font-semibold tracking-tight text-ai">{c.value}</span>
                </span>
              </span>
              <span className="coin-face absolute inset-0 grid place-items-center rounded-full" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(8px)" }}>
                <span className="px-6 text-center text-[12px] leading-snug text-ink/80">{c.back}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
