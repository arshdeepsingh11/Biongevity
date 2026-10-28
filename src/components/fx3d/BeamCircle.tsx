"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface BeamNode { id: string; label: string; icon: IconName; sub?: string }

/**
 * Beam circle — a centre (Biongevity SI) with nodes on a ring; light beams travel from each node into the centre.
 * Hover or tap a node to focus its beam. Pure SVG + CSS; scales to any width.
 */
export function BeamCircle({ nodes, center, className, onSelect, active }: { nodes: BeamNode[]; center: ReactNode; className?: string; onSelect?: (id: string) => void; active?: string | null }) {
  const [hot, setHot] = useState<string | null>(null);
  const [spin, setSpin] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // slow spin, only while on screen
    let raf = 0, seen = false, base = 0, t0 = performance.now();
    const f = (t: number) => { if (!seen || document.hidden) { base += ((t - t0) / 1000) * 3; raf = 0; return; } setSpin(base + ((t - t0) / 1000) * 3); raf = requestAnimationFrame(f); };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !raf) { t0 = performance.now(); raf = requestAnimationFrame(f); } }, { rootMargin: "120px" });
    if (box.current) io.observe(box.current);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  const n = nodes.length, focus = hot ?? active ?? null;
  const pos = (k: number) => { const a = ((k / n) * 360 + spin - 90) * (Math.PI / 180); return { x: 50 + Math.cos(a) * 40, y: 50 + Math.sin(a) * 40 }; };

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[560px]", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="beam-g" x1="0" x2="1"><stop offset="0" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0 }} /><stop offset=".5" style={{ stopColor: "rgb(var(--c-ai-2))" }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai))", stopOpacity: 0 }} /></linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="none" style={{ stroke: "rgb(var(--c-ai) / .14)" }} strokeWidth=".3" strokeDasharray="1 1.4" />
        <circle cx="50" cy="50" r="26" fill="none" style={{ stroke: "rgb(var(--c-ai) / .10)" }} strokeWidth=".3" />
        {nodes.map((nd, k) => {
          const p = pos(k), on = focus === nd.id;
          return (
            <g key={nd.id}>
              <line x1={p.x} y1={p.y} x2="50" y2="50" style={{ stroke: `rgb(var(--c-ai) / ${on ? 0.35 : 0.1})` }} strokeWidth={on ? 0.5 : 0.25} />
              <line x1={p.x} y1={p.y} x2="50" y2="50" stroke="url(#beam-g)" strokeWidth={on ? 1.1 : 0.7} strokeLinecap="round" strokeDasharray="6 40"
                className="beam-dash" style={{ animationDelay: `${k * -0.35}s`, animationDuration: on ? "1.1s" : "2.4s" }} />
            </g>
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/80 shadow-lift ring-1 ring-white backdrop-blur-xl">{center}</div>
      {nodes.map((nd, k) => {
        const p = pos(k), on = focus === nd.id;
        return (
          <button key={nd.id} onMouseEnter={() => setHot(nd.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(nd.id)} onBlur={() => setHot(null)} onClick={() => onSelect?.(nd.id)}
            className={cn("absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-transform duration-300", on && "scale-110")}
            style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-pressed={active === nd.id}>
            <span className={cn("icon-tile h-10 w-10 sm:h-12 sm:w-12", on && "ring-2 ring-ai/40")}><Icon name={nd.icon} size={20} /></span>
            <span className="hidden max-w-[110px] text-center text-[11px] font-semibold leading-tight sm:block">{nd.label}</span>
          </button>
        );
      })}
    </div>
  );
}
