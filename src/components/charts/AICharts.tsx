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

/* ---------- Scatter (value map) ---------- */
export interface ScatterPt { id: string; x: number; y: number; label: string; group?: number; r?: number }
export function Scatter({ points, xLabel, yLabel, active, onPick, height = 300, xFormat = (v: number) => String(Math.round(v)), yFormat = (v: number) => String(Math.round(v)), groups, xLog }: {
  points: ScatterPt[]; xLabel: string; yLabel: string; active?: string | null; onPick?: (id: string) => void; height?: number;
  xFormat?: (v: number) => string; yFormat?: (v: number) => string; groups?: string[];
  /** Log scale on x — useful for prices that span $50 to $1,700. */
  xLog?: boolean;
}) {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);
  const W = 560, H = height, P = { l: 44, r: 14, t: 14, b: 38 };
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const tx = (v: number) => (xLog ? Math.log10(Math.max(1, v)) : v);
  const x0 = xLog ? tx(Math.min(...xs) * 0.8) : Math.min(...xs, 0), x1 = tx(Math.max(...xs) * 1.1), y0 = Math.min(...ys, 0), y1 = Math.max(...ys, 100);
  const X = (v: number) => P.l + ((tx(v) - x0) / (x1 - x0 || 1)) * (W - P.l - P.r);
  const xTicks = xLog ? [50, 100, 200, 500, 1000, 2000].filter((v) => tx(v) >= x0 && tx(v) <= x1) : [0, 0.25, 0.5, 0.75, 1].map((k) => x0 + (x1 - x0) * k);
  const Y = (v: number) => P.t + (1 - (v - y0) / (y1 - y0 || 1)) * (H - P.t - P.b);
  const show = points.find((p) => p.id === (hover ?? active));
  return (
    <div ref={ref} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${yLabel} by ${xLabel}`}>
        <rect x={P.l} y={Y(y1)} width={(W - P.l - P.r) / 2} height={(Y(y0) - Y(y1)) / 2} fill="rgb(var(--c-ai))" fillOpacity=".05" rx="10" />
        <text x={P.l + 8} y={Y(y1) + 16} fontSize="10" fill="rgb(var(--c-ai))" fontWeight="600">High value · lower cost</text>
        {[0.25, 0.5, 0.75, 1].map((k) => { const v = y0 + (y1 - y0) * k; return <g key={k}><line x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke="rgb(var(--c-ink))" strokeOpacity=".06" /><text x={P.l - 6} y={Y(v) + 3} textAnchor="end" fontSize="9.5" fill="rgb(var(--c-faint))">{yFormat(v)}</text></g>; })}
        {xTicks.map((v) => <text key={v} x={X(v)} y={H - 20} textAnchor="middle" fontSize="9.5" fill="rgb(var(--c-faint))">{xFormat(v)}</text>)}
        <text x={(W + P.l) / 2} y={H - 4} textAnchor="middle" fontSize="10.5" fill="rgb(var(--c-muted))" fontWeight="600">{xLabel}</text>
        <text x={12} y={(H - P.b) / 2} textAnchor="middle" fontSize="10.5" fill="rgb(var(--c-muted))" fontWeight="600" transform={`rotate(-90 12 ${(H - P.b) / 2})`}>{yLabel}</text>
        {points.map((p, i) => {
          const sel = p.id === active, hov = p.id === hover;
          return (
            <circle key={p.id} cx={X(p.x)} cy={Y(p.y)} r={(p.r ?? 6) + (sel || hov ? 3 : 0)} fill={PALETTE[(p.group ?? 0) % PALETTE.length]} fillOpacity={sel ? 0.95 : 0.6}
              stroke={sel ? "rgb(var(--c-ink))" : "rgb(var(--c-surface))"} strokeWidth={sel ? 2 : 1.5} className="cursor-pointer"
              style={{ transition: `opacity .5s ${i * 0.012}s, r .2s`, opacity: on ? 1 : 0 }}
              onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onClick={() => onPick?.(p.id)}>
              <title>{p.label}</title>
            </circle>
          );
        })}
      </svg>
      {show && (
        <div className="pointer-events-none absolute right-2 top-2 max-w-[60%] rounded-xl bg-ink px-3 py-2 text-[12px] text-pearl shadow-lift">
          <div className="font-semibold">{show.label}</div><div className="opacity-75">{xLabel}: {xFormat(show.x)} · {yLabel}: {yFormat(show.y)}</div>
        </div>
      )}
      {groups && <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-muted">{groups.map((g, i) => <span key={g} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />{g}</span>)}</div>}
    </div>
  );
}

/* ---------- Heatmap ---------- */
export function Heatmap({ rows, cols, cells, highlightCol }: { rows: string[]; cols: string[]; cells: number[][]; highlightCol?: (c: number) => boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="no-scrollbar overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-[11.5px]">
        <thead><tr><th />{cols.map((c, j) => <th key={c} className={`px-1 pb-1 text-left align-bottom font-semibold ${highlightCol?.(j) ? "text-ai" : "text-muted"}`}><span className="block max-w-[76px] leading-tight">{c}</span></th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r}>
              <th className="whitespace-nowrap pr-2 text-left font-semibold">{r}</th>
              {cols.map((c, j) => {
                const v = cells[i][j];
                return <td key={c} title={`${r} · ${c}: ${v ? "yes" : "no"}`} className="h-7 min-w-[30px] rounded-md" style={{ background: v ? `rgb(var(--c-ai) / ${on ? 0.25 + 0.6 * v : 0})` : "rgb(var(--c-ink) / .04)", transition: `background .5s ${(i + j) * 0.02}s` }} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Timeline (re-test schedule) ---------- */
export function Timeline({ rows, months = 12, start = new Date() }: { rows: { label: string; marks: number[]; sub?: string }[]; months?: number; start?: Date }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const labels = useMemo(() => Array.from({ length: months + 1 }, (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1).toLocaleString("en", { month: "short" })), [months, start]);
  return (
    <div ref={ref}>
      <div className="grid grid-cols-[minmax(96px,30%)_minmax(0,1fr)] items-end gap-2 pb-1 text-[10.5px] text-faint">
        <span />
        <div className="relative h-4">{labels.map((l, i) => (i % 2 === 0 || months <= 6) && <span key={i} className="absolute -translate-x-1/2" style={{ left: `${(i / months) * 100}%` }}>{l}</span>)}</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, ri) => (
          <div key={r.label} className="grid grid-cols-[minmax(96px,30%)_minmax(0,1fr)] items-center gap-2">
            <div className="min-w-0"><div className="truncate text-[12.5px] font-semibold">{r.label}</div>{r.sub && <div className="truncate text-[10.5px] text-muted">{r.sub}</div>}</div>
            <div className="relative h-7 rounded-full bg-canvas">
              <div className="absolute inset-y-[13px] left-0 right-0 bg-ink/[0.08]" />
              {r.marks.map((m, k) => (
                <span key={k} className="absolute top-1/2 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[9px] font-bold"
                  style={{ left: `${(m / months) * 100}%`, background: k === 0 ? "rgb(var(--c-ai))" : "rgb(var(--c-surface))", color: k === 0 ? "rgb(var(--c-on-ai))" : "rgb(var(--c-ai))", boxShadow: "0 0 0 1.5px rgb(var(--c-ai))", transform: `translate(-50%,-50%) scale(${on ? 1 : 0})`, transition: `transform .4s ${(ri * 0.06 + k * 0.08).toFixed(2)}s` }}>
                  {k === 0 ? "B" : k}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10.5px] text-muted"><b className="text-ai">B</b> = baseline · numbers = re-tests</div>
    </div>
  );
}

/* ---------- Range bar: one value against a reference range ---------- */
export function RangeBar({ value, low, high, unit, min, max }: { value: number; low?: number; high?: number; unit?: string; min?: number; max?: number }) {
  const lo = min ?? Math.min(value, low ?? value, high ?? value) * 0.6;
  const hi = max ?? Math.max(value, high ?? value, low ?? value) * 1.35;
  const pct = (v: number) => `${Math.max(0, Math.min(100, ((v - lo) / (hi - lo || 1)) * 100))}%`;
  const out = (low !== undefined && value < low) || (high !== undefined && value > high);
  return (
    <div className="relative mt-2 h-2 rounded-full bg-ink/[0.07]" aria-label={`${value}${unit ?? ""}`}>
      <div className="absolute inset-y-0 rounded-full bg-teal/30" style={{ left: low !== undefined ? pct(low) : "0%", right: high !== undefined ? `calc(100% - ${pct(high)})` : "0%" }} />
      <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white" style={{ left: pct(value), background: out ? "rgb(var(--c-warn))" : "rgb(var(--c-teal))" }} />
    </div>
  );
}
