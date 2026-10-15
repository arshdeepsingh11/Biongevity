"use client";
import { useId, useMemo, useState, type ReactNode } from "react";
import { useInView } from "./useInView";
import { PALETTE } from "./Charts";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";

/*
 * AI chart kit — dependency-free SVG charts that follow the active theme.
 * Every chart can sit inside <AIChartFrame>, which adds an on-device "✦ AI insight" line
 * and an "Explain this chart" button (Xevyo, on click, with the chart data as context).
 */

/* ---------- Frame: title + AI insight + explain ---------- */
export function AIChartFrame({ title, kicker, insight, data, source, children, className, illustrative }: {
  title: string; kicker?: string; insight?: ReactNode; data?: unknown; source?: string; children: ReactNode; className?: string; illustrative?: boolean;
}) {
  const { ask } = useAI();
  const explain = () => ask(`Explain the chart "${title}" in plain words: what it shows, what stands out, and what it means for an adult aged 40–65.`, {
    label: `✦ Explain chart: ${title}`, grounding: data ? `Chart data (JSON): ${JSON.stringify(data).slice(0, 3500)}` : undefined,
  });
  return (
    <figure className={`relative min-w-0 overflow-hidden rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07] sm:p-6 ${className ?? ""}`}>
      <figcaption className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          {kicker && <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">{kicker}</div>}
          <div className="text-[16.5px] font-semibold leading-snug tracking-tight">{title}</div>
        </div>
        {illustrative && <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[10.5px] font-semibold text-gold-deep">Illustrative</span>}
        <button onClick={explain} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ai-soft pl-1 pr-3 text-[12px] font-semibold text-ai ring-1 ring-ai/20 hover:ring-ai/45">
          <XevyoOrb size={22} />Explain
        </button>
      </figcaption>
      <div className="mt-4">{children}</div>
      {insight && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-ai-soft/60 px-3.5 py-2.5 text-[13px] leading-snug">
          <span aria-hidden className="mt-px font-semibold text-ai">✦</span>
          <span><span className="font-semibold text-ai">AI insight · </span>{insight}</span>
        </div>
      )}
      {source && <div className="mt-2 text-[10.5px] text-faint">Source: {source}</div>}
    </figure>
  );
}

/* ---------- Sparkline ---------- */
export function Sparkline({ values, width = 120, height = 34, color = "rgb(var(--c-ai))", className, fill = true }: { values: number[]; width?: number; height?: number; color?: string; className?: string; fill?: boolean }) {
  const id = useId().replace(/:/g, "");
  if (values.length < 2) return null;
  const lo = Math.min(...values), hi = Math.max(...values), r = hi - lo || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - 3 - ((v - lo) / r) * (height - 6)]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} aria-hidden>
      <defs><linearGradient id={`sp${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {fill && <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#sp${id})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}
