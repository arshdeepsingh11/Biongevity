"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Node = { label: string; icon: string };

/**
 * AI flow diagram — inputs stream into an AI core and resolve into outputs.
 * Animated beams (SVG dash flow) + a cycling "active" signal. Light, GPU-cheap.
 */
export function AIFlow({ inputs, core, outputs, height = 340 }: { inputs: Node[]; core: string; outputs: Node[]; height?: number }) {
  const [hot, setHot] = useState(0);
  useEffect(() => { const t = setInterval(() => setHot((h) => (h + 1) % inputs.length), 1400); return () => clearInterval(t); }, [inputs.length]);
  const W = 1000, H = height, cx = W / 2, cy = H / 2;
  const yAt = (i: number, n: number) => (H / (n + 1)) * (i + 1);
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="af-l" x1="0" x2="1"><stop offset="0" stopColor="#C2A16A" stopOpacity=".25" /><stop offset="1" stopColor="#97703F" /></linearGradient>
          <linearGradient id="af-r" x1="0" x2="1"><stop offset="0" stopColor="#97703F" /><stop offset="1" stopColor="#7FA083" stopOpacity=".5" /></linearGradient>
          <radialGradient id="af-c"><stop offset="0" stopColor="#F1E6D1" /><stop offset="1" stopColor="#F1E6D1" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={H * 0.42} fill="url(#af-c)" />
        {inputs.map((_, i) => {
          const y = yAt(i, inputs.length), d = `M210 ${y} C ${cx - 140} ${y}, ${cx - 160} ${cy}, ${cx - 70} ${cy}`;
          return <g key={i}><path d={d} fill="none" stroke="#97703F" strokeOpacity=".12" strokeWidth="2" /><path d={d} fill="none" stroke="url(#af-l)" strokeWidth={hot === i ? 3 : 1.6} strokeDasharray="6 10" style={{ animation: `flow ${hot === i ? 0.9 : 2.2}s linear infinite`, transition: "stroke-width .3s" }} /></g>;
        })}
        {outputs.map((_, i) => {
          const y = yAt(i, outputs.length), d = `M${cx + 70} ${cy} C ${cx + 160} ${cy}, ${cx + 140} ${y}, ${W - 210} ${y}`;
          return <g key={i}><path d={d} fill="none" stroke="#5E7F62" strokeOpacity=".12" strokeWidth="2" /><path d={d} fill="none" stroke="url(#af-r)" strokeWidth="1.8" strokeDasharray="6 10" style={{ animation: "flow 1.6s linear infinite" }} /></g>;
        })}
        <circle cx={cx} cy={cy} r="64" fill="none" stroke="#C2A16A" strokeOpacity=".35" strokeDasharray="3 7" style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spinSlow 22s linear infinite" }} />
        <circle cx={cx} cy={cy} r="80" fill="none" stroke="#7FA083" strokeOpacity=".25" strokeDasharray="1 9" style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spinSlow 30s linear infinite reverse" }} />
      </svg>
      {inputs.map((n, i) => (
        <div key={n.label} className={`absolute left-0 flex w-[21%] -translate-y-1/2 items-center gap-2 rounded-xl bg-white px-2.5 py-2 text-[12px] font-semibold shadow-card ring-1 transition-all duration-300 sm:text-[13px] ${hot === i ? "text-accent ring-accent/40" : "ring-ink/[0.06]"}`} style={{ top: `${(yAt(i, inputs.length) / H) * 100}%` }}>
          <Icon name={n.icon} size={18} weight="duotone" className="shrink-0 text-accent" /><span className="truncate">{n.label}</span>
        </div>
      ))}
      <div className="absolute left-1/2 top-1/2 grid h-[30%] min-h-[64px] w-auto -translate-x-1/2 -translate-y-1/2 place-items-center" style={{ aspectRatio: "1" }}>
        <div className="grid h-full w-full place-items-center rounded-full bg-iri text-center text-white shadow-glow">
          <div><Icon name="sparkle" size={22} weight="duotone" className="mx-auto" /><div className="mt-0.5 px-2 text-[10px] font-semibold leading-tight sm:text-[12px]">{core}</div></div>
        </div>
      </div>
      {outputs.map((n, i) => (
        <div key={n.label} className="absolute right-0 flex w-[21%] -translate-y-1/2 items-center gap-2 rounded-xl bg-white px-2.5 py-2 text-[12px] font-semibold shadow-card ring-1 ring-teal/25 sm:text-[13px]" style={{ top: `${(yAt(i, outputs.length) / H) * 100}%` }}>
          <Icon name={n.icon} size={18} weight="duotone" className="shrink-0 text-teal" /><span className="truncate">{n.label}</span>
        </div>
      ))}
    </div>
  );
}
