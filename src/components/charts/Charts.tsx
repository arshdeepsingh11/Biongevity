"use client";
import { useId, useState } from "react";
import { useInView } from "./useInView";

/* Biongevity chart kit — dependency-free SVG, animates once in view, accessible labels.
   Colours follow the active theme (CSS variables --c-chart-1…7). */
export const PALETTE = [1, 2, 3, 4, 5, 6, 7].map((n) => `rgb(var(--c-chart-${n}))`);

type Pt = { label: string; value: number; color?: string; note?: string };

/* ---------- Line / area ---------- */
export function LineChart({ labels, series, height = 200, unit = "", min, max, refLine, className }: {
  labels: string[]; series: { name: string; values: number[]; color?: string; dashed?: boolean }[];
  height?: number; unit?: string; min?: number; max?: number; refLine?: { value: number; label: string }; className?: string;
}) {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hi, setHi] = useState<number | null>(null);
  const id = useId().replace(/:/g, "");
  const W = 520, H = height, P = { l: 34, r: 12, t: 14, b: 26 };
  const all = series.flatMap((s) => s.values).concat(refLine ? [refLine.value] : []);
  const lo = min ?? Math.floor(Math.min(...all) * 0.95), top = max ?? Math.ceil(Math.max(...all) * 1.05);
  const x = (i: number) => P.l + (i / Math.max(1, labels.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - lo) / (top - lo || 1)) * (H - P.t - P.b);
  const ticks = [lo, lo + (top - lo) / 2, top];
  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={series.map((s) => s.name).join(" vs ")}
        onMouseLeave={() => setHi(null)}>
        {ticks.map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="rgb(var(--c-ink))" strokeOpacity=".07" /><text x={P.l - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="rgb(var(--c-faint))">{Math.round(t * 10) / 10}</text></g>)}
        {labels.map((l, i) => (i % Math.ceil(labels.length / 7) === 0 || i === labels.length - 1) && <text key={l + i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="rgb(var(--c-faint))">{l}</text>)}
        {refLine && <g><line x1={P.l} x2={W - P.r} y1={y(refLine.value)} y2={y(refLine.value)} stroke="rgb(var(--c-gold))" strokeDasharray="4 4" /><text x={W - P.r} y={y(refLine.value) - 5} textAnchor="end" fontSize="10" fill="rgb(var(--c-gold-deep))" fontWeight="600">{refLine.label}</text></g>}
        {series.map((s, si) => {
          const c = s.color ?? PALETTE[si];
          const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
          return (
            <g key={s.name}>
              {si === 0 && !s.dashed && <>
                <defs><linearGradient id={`a${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={c} stopOpacity=".22" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
                <path d={`${d} L${x(s.values.length - 1)} ${H - P.b} L${x(0)} ${H - P.b} Z`} fill={`url(#a${id})`} style={{ opacity: on ? 1 : 0, transition: "opacity 1s .4s" }} />
              </>}
              <path d={d} fill="none" stroke={c} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "5 5" : "1200"}
                strokeDashoffset={s.dashed ? 0 : on ? 0 : 1200} style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1)", opacity: s.dashed && !on ? 0 : 1 }} />
            </g>
          );
        })}
        {labels.map((_, i) => <rect key={i} x={x(i) - (W / labels.length) / 2} y={0} width={W / labels.length} height={H} fill="transparent" onMouseEnter={() => setHi(i)} onTouchStart={() => setHi(i)} />)}
        {hi !== null && <g pointerEvents="none">
          <line x1={x(hi)} x2={x(hi)} y1={P.t} y2={H - P.b} stroke="rgb(var(--c-ink))" strokeOpacity=".15" />
          {series.map((s, si) => <circle key={s.name} cx={x(hi)} cy={y(s.values[hi])} r="4" fill="rgb(var(--c-surface))" stroke={s.color ?? PALETTE[si]} strokeWidth="2" />)}
          <g transform={`translate(${Math.min(x(hi) + 8, W - 130)},${P.t})`}>
            <rect width="122" height={18 + series.length * 15} rx="8" fill="rgb(var(--c-ink))" />
            <text x="8" y="14" fontSize="10" fill="rgb(var(--c-surface))" fillOpacity=".6">{labels[hi]}</text>
            {series.map((s, si) => <text key={s.name} x="8" y={29 + si * 15} fontSize="11" fill="rgb(var(--c-surface))"><tspan fill={s.color ?? PALETTE[si]}>●</tspan> {s.name}: {s.values[hi]}{unit}</text>)}
          </g>
        </g>}
      </svg>
      {series.length > 1 && <Legend items={series.map((s, i) => ({ label: s.name, color: s.color ?? PALETTE[i], dashed: s.dashed }))} />}
    </div>
  );
}

/* ---------- Bars (horizontal, labelled) ---------- */
export function BarList({ data, unit = "", max, className, format, dark }: { data: Pt[]; unit?: string; max?: number; className?: string; format?: (v: number) => string; dark?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const m = max ?? Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className={`space-y-2.5 ${className ?? ""}`}>
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]"><span className={`font-medium ${dark ? "text-white/80" : "text-ink"}`}>{d.label}</span><span className={`tabular-nums font-semibold ${dark ? "text-white" : "text-ink"}`}>{format ? format(d.value) : d.value}{unit}</span></div>
          <div className={`mt-1 h-2 overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.06]"}`}>
            <div className="h-full rounded-full" style={{ width: on ? `${(d.value / m) * 100}%` : 0, background: d.color ?? `linear-gradient(90deg, ${PALETTE[0]}, ${PALETTE[1]})`, transition: `width 1.1s cubic-bezier(.2,.7,.2,1) ${i * 0.08}s` }} />
          </div>
          {d.note && <div className="mt-0.5 text-[11px] text-faint">{d.note}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------- Columns (vertical) ---------- */
export function Columns({ data, unit = "", height = 160, className, highlight }: { data: Pt[]; unit?: string; height?: number; className?: string; highlight?: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const m = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className={className}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const hot = highlight ? d.label === highlight : false;
          return (
            <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[11px] font-semibold tabular-nums text-ink opacity-0 transition-opacity group-hover:opacity-100" style={{ opacity: hot ? 1 : undefined }}>{d.value}{unit}</span>
              <div className="w-full max-w-[44px] rounded-t-lg" style={{ height: on ? `${(d.value / m) * 100}%` : "2%", background: d.color ?? (hot ? "linear-gradient(180deg,rgb(var(--c-ai-hi)),rgb(var(--c-ai)))" : "linear-gradient(180deg,rgb(var(--c-accent-soft)),rgb(var(--c-gold-deep)))"), opacity: highlight && !hot ? 0.45 : 1, transition: `height 1s cubic-bezier(.2,.7,.2,1) ${i * 0.06}s` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">{data.map((d) => <span key={d.label} className="flex-1 truncate text-center text-[10px] text-faint">{d.label}</span>)}</div>
    </div>
  );
}

/* ---------- Donut ---------- */
export function Donut({ data, size = 180, thickness = 22, center, sub, className }: { data: Pt[]; size?: number; thickness?: number; center?: string; sub?: string; className?: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hi, setHi] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0);
  const r = (size - thickness) / 2, C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div ref={ref} className={`flex flex-col items-center gap-4 sm:flex-row ${className ?? ""}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={data.map((d) => `${d.label} ${d.value}`).join(", ")}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--c-ink))" strokeOpacity=".06" strokeWidth={thickness} />
          {data.map((d, i) => {
            const len = (d.value / total) * C, off = acc; acc += len;
            return <circle key={d.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color ?? PALETTE[i % PALETTE.length]}
              strokeWidth={thickness} strokeOpacity={hi === null || hi === i ? 1 : 0.35} strokeDasharray={`${on ? Math.max(0, len - 2) : 0} ${C}`} strokeDashoffset={-off}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} style={{ transition: `stroke-dasharray 1.2s cubic-bezier(.2,.7,.2,1) ${i * 0.1}s, stroke-opacity .2s` }} />;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div><div className="text-[22px] font-semibold tracking-tight">{hi !== null ? `${Math.round((data[hi].value / total) * 100)}%` : center}</div><div className="max-w-[90px] text-[11px] leading-tight text-muted">{hi !== null ? data[hi].label : sub}</div></div>
        </div>
      </div>
      <ul className="grid w-full gap-1.5">
        {data.map((d, i) => (
          <li key={d.label} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-[13px] transition-colors ${hi === i ? "bg-ink/[0.04]" : ""}`}>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color ?? PALETTE[i % PALETTE.length] }} />
            <span className="flex-1 text-muted">{d.label}</span><span className="font-semibold tabular-nums">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Radar ---------- */
export function Radar({ axes, series, size = 260, className }: { axes: string[]; series: { name: string; values: number[]; color?: string }[]; size?: number; className?: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const c = size / 2, R = size / 2 - 58, n = axes.length;
  const pt = (i: number, v: number) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [c + Math.cos(a) * R * v, c + Math.sin(a) * R * v]; };
  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${size} ${size}`} overflow="visible" className="mx-auto w-full max-w-[360px]" role="img" aria-label={`Radar: ${axes.join(", ")}`}>
        {[0.25, 0.5, 0.75, 1].map((k) => <polygon key={k} points={axes.map((_, i) => pt(i, k).join(",")).join(" ")} fill="none" stroke="rgb(var(--c-ink))" strokeOpacity={k === 1 ? 0.14 : 0.06} />)}
        {axes.map((a, i) => { const [x, y] = pt(i, 1); const [lx, ly] = pt(i, 1.2); return <g key={a}><line x1={c} y1={c} x2={x} y2={y} stroke="rgb(var(--c-ink))" strokeOpacity=".06" /><text x={lx} y={ly + 3} textAnchor={Math.abs(lx - c) < 8 ? "middle" : lx > c ? "start" : "end"} fontSize="10.5" fill="rgb(var(--c-muted))" fontWeight="500">{a}</text></g>; })}
        {series.map((s, si) => {
          const col = s.color ?? PALETTE[si];
          return (
            <g key={s.name} style={{ transform: `scale(${on ? 1 : 0.2})`, transformOrigin: `${c}px ${c}px`, transition: `transform 1s cubic-bezier(.2,.7,.2,1) ${si * 0.15}s`, opacity: on ? 1 : 0 }}>
              <polygon points={s.values.map((v, i) => pt(i, v).join(",")).join(" ")} fill={col} fillOpacity={si ? 0.08 : 0.18} stroke={col} strokeWidth="2" strokeDasharray={si ? "4 4" : undefined} strokeLinejoin="round" />
              {!si && s.values.map((v, i) => { const [x, y] = pt(i, v); return <circle key={i} cx={x} cy={y} r="3.5" fill="rgb(var(--c-surface))" stroke={col} strokeWidth="2" />; })}
            </g>
          );
        })}
      </svg>
      {series.length > 1 && <Legend items={series.map((s, i) => ({ label: s.name, color: s.color ?? PALETTE[i], dashed: i > 0 }))} center />}
    </div>
  );
}

/* ---------- Gauge (semi-circle with zones) ---------- */
export function Gauge({ value, min, max, zones, label, unit = "", size = 240 }: { value: number; min: number; max: number; zones: { to: number; color: string; label: string }[]; label?: string; unit?: string; size?: number }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const c = size / 2, r = size / 2 - 18;
  const ang = (v: number) => Math.PI + ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * Math.PI;
  const arc = (a0: number, a1: number) => `M${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)}`;
  let from = min;
  const zone = zones.find((z) => value <= z.to) ?? zones[zones.length - 1];
  const a = on ? ang(value) : Math.PI;
  return (
    <div ref={ref} className="text-center">
      <svg viewBox={`0 0 ${size} ${size / 2 + 16}`} className="mx-auto w-full max-w-[280px]" role="img" aria-label={`${label ?? ""} ${value}${unit}: ${zone.label}`}>
        {zones.map((z) => { const p = arc(ang(from), ang(z.to)); from = z.to; return <path key={z.label} d={p} stroke={z.color} strokeWidth="14" fill="none" strokeOpacity=".9" />; })}
        <g style={{ transform: `rotate(${(a * 180) / Math.PI}deg)`, transformOrigin: `${c}px ${c}px`, transition: "transform 1.2s cubic-bezier(.2,.9,.2,1)" }}>
          <line x1={c} y1={c} x2={c + r - 22} y2={c} stroke="rgb(var(--c-ink))" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx={c} cy={c} r="7" fill="rgb(var(--c-ink))" />
      </svg>
      <div className="-mt-1 text-[26px] font-semibold tracking-tight tabular-nums">{value}{unit}</div>
      <div className="text-[13px] font-semibold" style={{ color: zone.color }}>{zone.label}</div>
    </div>
  );
}

/* ---------- Waffle (1 in N) ---------- */
export function Waffle({ of, hit, label, color = "rgb(var(--c-accent))" }: { of: number; hit: number; label: string; color?: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(of, 10)}, minmax(0,1fr))` }}>
        {Array.from({ length: of }, (_, i) => (
          <span key={i} className="aspect-square rounded-[4px]" style={{ background: i < hit && on ? color : "rgb(var(--c-shadow)/.08)", transition: `background .4s ${i * 0.04}s` }} />
        ))}
      </div>
      <div className="mt-2 text-[12px] text-muted">{label}</div>
    </div>
  );
}

/* ---------- Stat tile ---------- */
export function Stat({ v: value, l: label, src: source, accent }: { v: string; l: string; src?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? "bg-navy text-white" : "bg-white ring-1 ring-ink/[0.06]"}`}>
      <div className={`text-[24px] font-semibold leading-none tracking-tight tabular-nums sm:text-[28px] ${accent ? "" : "text-ink"}`}>{value}</div>
      <div className={`mt-1.5 text-[13px] leading-snug ${accent ? "text-white/75" : "text-muted"}`}>{label}</div>
      {source && <div className={`mt-1 text-[10.5px] ${accent ? "text-white/45" : "text-faint"}`}>Source: {source}</div>}
    </div>
  );
}

export function Legend({ items, center }: { items: { label: string; color: string; dashed?: boolean }[]; center?: boolean }) {
  return (
    <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted ${center ? "justify-center" : ""}`}>
      {items.map((it) => <span key={it.label} className="flex items-center gap-1.5"><span className="h-[3px] w-4 rounded-full" style={{ background: it.dashed ? `repeating-linear-gradient(90deg, ${it.color} 0 4px, transparent 4px 7px)` : it.color }} />{it.label}</span>)}
    </div>
  );
}
