"use client";
import { Icon } from "@/components/ui/Icon";
import { LAB_COLLECTIONS } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";
import { cn, formatMoney } from "@/lib/utils";

export const collectionOf = (t: CatalogProduct) => LAB_COLLECTIONS.find((c) => c.handle === t.category);

/** Kit artwork for a BioAro test: a glass card with a sample tube, the collection icon and soft light. Pure SVG, theme colours. */
export function TestArt({ t, className }: { t: CatalogProduct; className?: string }) {
  const id = `ta-${t.handle}`;
  return (
    <svg viewBox="0 0 240 150" className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "rgb(var(--c-surface))" }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-soft))" }} /></linearGradient>
        <linearGradient id={`${id}-tube`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: "rgb(var(--c-ai-hi))" }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-2))" }} /></linearGradient>
        <radialGradient id={`${id}-glow`} cx=".75" cy=".3" r=".6"><stop offset="0" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0.55 }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0 }} /></radialGradient>
      </defs>
      <rect width="240" height="150" rx="18" fill={`url(#${id}-bg)`} />
      <rect width="240" height="150" rx="18" fill={`url(#${id}-glow)`} />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={30 + i * 14} cy={128} r="2" style={{ fill: "rgb(var(--c-ai) / .25)" }} />)}
      <g transform="translate(170 22) rotate(14)">
        <rect x="0" y="0" width="22" height="92" rx="11" style={{ fill: "rgb(255 255 255 / .75)", stroke: "rgb(var(--c-ai) / .25)" }} />
        <rect x="3" y="44" width="16" height="45" rx="8" fill={`url(#${id}-tube)`} />
        <rect x="-2" y="-6" width="26" height="14" rx="5" style={{ fill: "rgb(var(--c-ink) / .85)" }} />
        <rect x="5" y="10" width="4" height="70" rx="2" style={{ fill: "rgb(255 255 255 / .8)" }} />
      </g>
      <path d="M0 110 C60 90 120 130 240 96 L240 150 L0 150 Z" style={{ fill: "rgb(var(--c-ai-2) / .10)" }} />
    </svg>
  );
}

/** Front face used by every 3D test component. */
export function TestFace({ t, compact = false, className }: { t: CatalogProduct; compact?: boolean; className?: string }) {
  const c = collectionOf(t);
  return (
    <div className={cn("relative flex h-full flex-col overflow-hidden rounded-[22px] text-left shadow-card ring-1 ring-ink/[0.06]", className)} style={{ background: "rgb(var(--c-surface))" }}>
      <div className="relative aspect-[16/10] w-full">
        <TestArt t={t} />
        <span className="absolute left-3 top-3"><span className="icon-tile h-10 w-10"><Icon name={t.icon} size={19} /></span></span>
        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-ink shadow-card backdrop-blur">{formatMoney(t.price)}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ai">{c?.title ?? "BioAro Labs"}</div>
        <div className={cn("mt-0.5 font-semibold leading-snug", compact ? "text-[14px]" : "text-[16px]")}>{t.title}</div>
        {!compact && <p className="mt-1 line-clamp-2 text-[12.5px] text-muted">{t.bestFor ?? t.summary}</p>}
      </div>
    </div>
  );
}
