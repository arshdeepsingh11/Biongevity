"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { cn } from "@/lib/utils";

type Sex = "women" | "men";
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={cn("rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6", className)}>{children}</div>;
const Seg = <T extends string | number>({ v, set, opts }: { v: T; set: (x: T) => void; opts: [T, string][] }) => (
  <div className="grid gap-1 rounded-2xl bg-canvas p-0.5 text-[12px] font-semibold" style={{ gridTemplateColumns: `repeat(${opts.length}, minmax(0,1fr))` }}>
    {opts.map(([k, l]) => <button key={String(k)} onClick={() => set(k)} className={cn("rounded-xl px-1 py-1.5 leading-tight", v === k ? "bg-white text-ai shadow-card" : "text-muted")}>{l}</button>)}
  </div>
);
const Slider = ({ label, v, set, min, max, step = 1, fmt }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; fmt?: (n: number) => string }) => (
  <label className="block"><span className="flex justify-between text-[12.5px]"><span className="font-medium">{label}</span><span className="font-semibold tabular-nums">{fmt ? fmt(v) : v}</span></span>
    <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} aria-label={label} className="mt-1 w-full accent-[rgb(var(--c-ai))]" /></label>
);

/* ───────────── Fitness age (HUNT, Nes et al. 2011) ───────────── */
const HUNT = {
  women: { c: 74.74, age: 0.247, wc: 0.259, hr: 0.114, pa: 0.198, avg: { wc: 86, hr: 72, pa: 1.5 } },
  men: { c: 100.27, age: 0.296, wc: 0.369, hr: 0.155, pa: 0.226, avg: { wc: 96, hr: 70, pa: 1.5 } },
};
/**
 * Fitness age — estimates VO₂max without a treadmill using the published HUNT non-exercise model (waist, resting
 * heart rate, activity), then finds the age at which an average person has your fitness. Educational estimate.
 */
export function FitnessAge() {
  const { ask } = useAI();
  const [sex, setSex] = useState<Sex>("women");
  const [age, setAge] = useState(52), [wc, setWc] = useState(88), [hr, setHr] = useState(68);
  const [freq, setFreq] = useState(2), [dur, setDur] = useState(0.38), [int, setInt] = useState(2);
  const m = HUNT[sex], pa = freq * dur * int;
  const vo2 = Math.max(10, m.c - m.age * age - m.wc * wc - m.hr * hr + m.pa * pa);
  const fitAge = Math.max(20, Math.min(95, (m.c - m.wc * m.avg.wc - m.hr * m.avg.hr + m.pa * m.avg.pa - vo2) / m.age));
  const diff = fitAge - age;
  const better = Math.max(10, m.c - m.age * age - m.wc * wc - m.hr * hr + m.pa * Math.min(9, (Math.min(3, freq + 1)) * Math.max(dur, 0.75) * Math.max(int, 2)));
  const gain = ((better - vo2) / m.age);
  const pct = Math.min(100, Math.max(0, ((vo2 - 15) / 45) * 100));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="space-y-3.5">
        <Seg v={sex} set={setSex} opts={[["women", "Woman"], ["men", "Man"]]} />
        <Slider label="Age" v={age} set={setAge} min={25} max={85} fmt={(n) => `${n} years`} />
        <Slider label="Waist (at the navel)" v={wc} set={setWc} min={60} max={140} fmt={(n) => `${n} cm`} />
        <Slider label="Resting heart rate" v={hr} set={setHr} min={40} max={100} fmt={(n) => `${n} bpm`} />
        <div><div className="mb-1 text-[12.5px] font-medium">How often do you exercise?</div><Seg v={freq} set={setFreq} opts={[[0, "Rarely"], [1, "Once a week"], [2, "2–3× a week"], [3, "Most days"]]} /></div>
        <div><div className="mb-1 text-[12.5px] font-medium">For how long?</div><Seg v={dur} set={setDur} opts={[[0.1, "<15 min"], [0.38, "15–29"], [0.75, "30–60"], [1, "60+ min"]]} /></div>
        <div><div className="mb-1 text-[12.5px] font-medium">How hard?</div><Seg v={int} set={setInt} opts={[[1, "Easy"], [2, "Sweaty, out of breath"], [3, "Near my limit"]]} /></div>
      </Card>
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Fitness age</div><div className="mt-1 text-[52px] font-semibold leading-none tracking-tight"><NumberTicker value={Math.round(fitAge)} /></div>
            <div className={cn("mt-1 text-[13px] font-semibold", Math.round(diff) < 0 ? "text-teal" : Math.round(diff) > 0 ? "text-warn" : "text-muted")}>{Math.round(diff) === 0 ? "About the same as your age" : Math.round(diff) < 0 ? `${Math.abs(Math.round(diff))} years younger than your age` : `${Math.round(diff)} years older than your age`}</div></div>
          <div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Estimated VO₂max</div><div className="mt-1 text-[52px] font-semibold leading-none tracking-tight"><NumberTicker value={Number(vo2.toFixed(1))} decimals={1} /></div><div className="mt-1 text-[13px] text-muted">mL/kg/min</div></div>
        </div>
        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-ink/[0.06]"><motion.div className="h-full rounded-full bg-ai-grad" animate={{ width: `${pct}%` }} /></div>
        <div className="mt-1 flex justify-between text-[10.5px] text-faint"><span>15</span><span>30</span><span>45</span><span>60 mL/kg/min</span></div>
        {gain > 0.5 && <div className="mt-4 rounded-2xl bg-ai-soft/70 p-3 text-[13px]"><span className="font-semibold text-ai">Biggest lever: </span>one more session a week of 30+ minutes, sweaty and out of breath, is worth about <b>{gain.toFixed(0)} years</b> of fitness age in this model.</div>}
        <p className="mt-3 text-[11.5px] text-faint">VO₂max is one of the strongest predictors of lifespan (Mandsager et al., JAMA Netw Open 2018). Estimate from the HUNT non-exercise model (Nes et al., Med Sci Sports Exerc 2011): VO₂ = {m.c} − {m.age}·age − {m.wc}·waist − {m.hr}·resting HR + {m.pa}·activity index. Fitness age compares you with an average {sex === "women" ? "woman" : "man"} (waist {m.avg.wc} cm, resting HR {m.avg.hr}). Educational estimate — a treadmill test measures it.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => ask(`My estimated VO2max is ${vo2.toFixed(1)} mL/kg/min and my fitness age is about ${Math.round(fitAge)} (I am ${age}). Explain what this means and a safe 12-week plan to improve it.`, { label: "✦ Explain my fitness age" })} className="btn-ai h-10 px-4 text-[13px]"><XevyoOrb size={20} />Explain & plan</button>
          <Link href="/precision-health/cardiology/" className="btn-light h-10 px-4 text-[13px]">Exercise stress echo<Icon name="arrow-right" size={14} /></Link>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Genes vs lifestyle (Khera et al., NEJM 2016) ───────────── */
const GENE_HR = { low: 1, mid: Math.sqrt(1.91), high: 1.91 };
const LIFE_HR = { fav: 0.54, mid: Math.sqrt(0.54), unfav: 1 };
type GK = keyof typeof GENE_HR; type LK = keyof typeof LIFE_HR;
/**
 * Genes vs lifestyle — four healthy habits against inherited heart risk. A favourable lifestyle was linked with about
 * half the coronary risk in every genetic group. Relative risks from the study; middle groups interpolated (marked).
 */
export function GenesVsLifestyle() {
  const { ask } = useAI();
  const [gene, setGene] = useState<GK>("high");
  const [habits, setHabits] = useState({ smoke: true, bmi: true, active: false, diet: false });
  const n = Object.values(habits).filter(Boolean).length, life: LK = n >= 3 ? "fav" : n === 2 ? "mid" : "unfav";
  const rr = (g: GK, l: LK) => (GENE_HR[g] * LIFE_HR[l]) / (GENE_HR.low * LIFE_HR.fav);
  const H: { k: keyof typeof habits; t: string; icon: IconName }[] = [{ k: "smoke", t: "No current smoking", icon: "no-smoking" }, { k: "bmi", t: "BMI under 30", icon: "scale" }, { k: "active", t: "Exercise at least weekly", icon: "walk" }, { k: "diet", t: "Healthy diet pattern", icon: "salad" }];
  const max = rr("high", "unfav");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card className="space-y-4">
        <div><div className="mb-1 text-[12.5px] font-medium">Your genetic heart risk</div><Seg v={gene} set={setGene} opts={[["low", "Low (bottom 20%)"], ["mid", "Middle / unknown"], ["high", "High (top 20%)"]]} /></div>
        <div className="space-y-1.5">
          <div className="text-[12.5px] font-medium">Your habits</div>
          {H.map((h) => <button key={h.k} onClick={() => setHabits((x) => ({ ...x, [h.k]: !x[h.k] }))} aria-pressed={habits[h.k]} className={cn("flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-[13px] font-medium ring-1 transition", habits[h.k] ? "bg-ai-soft text-ink ring-ai/30" : "bg-canvas text-muted ring-transparent")}><Icon name={habits[h.k] ? "check" : h.icon} size={15} className={habits[h.k] ? "text-ai" : ""} />{h.t}</button>)}
        </div>
        <div className="rounded-2xl bg-canvas p-3 text-[12.5px]">Lifestyle: <span className="font-semibold text-ai">{life === "fav" ? "Favourable (3–4 habits)" : life === "mid" ? "Intermediate (2 habits)" : "Unfavourable (0–1 habits)"}</span></div>
      </Card>
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Relative coronary risk · vs low genes + favourable habits</div>
        <div className="mt-4 space-y-2.5">
          {(["high", "mid", "low"] as GK[]).map((g) => (
            <div key={g}>
              <div className="mb-1 text-[11.5px] font-semibold text-muted">{g === "high" ? "High genetic risk" : g === "mid" ? "Middle genetic risk*" : "Low genetic risk"}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["fav", "mid", "unfav"] as LK[]).map((l) => { const v = rr(g, l), you = g === gene && l === life; return (
                  <div key={l} className={cn("relative overflow-hidden rounded-xl p-2.5 text-center ring-1 transition", you ? "ring-2 ring-ai shadow-lift" : "ring-ink/[0.05]")} style={{ background: `rgb(var(--c-ai-2) / ${0.08 + (v / max) * 0.5})` }}>
                    <div className="text-[17px] font-semibold tabular-nums">{v.toFixed(1)}×</div><div className="text-[10px] text-muted">{l === "fav" ? "favourable" : l === "mid" ? "intermediate*" : "unfavourable"}</div>
                    {you && <span className="absolute right-1 top-1 rounded-full bg-ai px-1.5 text-[9px] font-bold text-on-ai">you</span>}
                  </div>
                ); })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-ai-soft/70 p-3 text-[13px]">{gene === "high" ? <>With <b>high genetic risk</b>, 10-year coronary events were <b>10.7%</b> with an unfavourable lifestyle vs <b>5.1%</b> with a favourable one (ARIC cohort).</> : <>A favourable lifestyle was linked with <b>46% lower</b> relative coronary risk in every genetic group.</>} Your genes are not your fate.</div>
        <p className="mt-3 text-[11px] text-faint">Khera et al., NEJM 2016 (4 studies, 55,685 people): high vs low genetic risk HR 1.91; favourable vs unfavourable lifestyle HR 0.54. *Middle groups are interpolated for illustration. Educational estimate — a genome test and clinician review place your actual genetic risk.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => ask(`I have ${gene} genetic heart risk and ${n} of 4 healthy habits (${H.filter((h) => habits[h.k]).map((h) => h.t).join(", ") || "none"}). Explain what Khera et al. 2016 found and which habit to change first.`, { label: "✦ Genes vs lifestyle for me" })} className="btn-ai h-10 px-4 text-[13px]"><XevyoOrb size={20} />Explain for me</button>
          <Link href="/precision-health/bioaro-labs/#explore-3d" className="btn-light h-10 px-4 text-[13px]">Genome tests<Icon name="arrow-right" size={14} /></Link>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Intervention ranking ───────────── */
type GradeW = "High" | "Moderate" | "Low" | "None";
interface Iv { id: string; t: string; icon: IconName; benefit: number; grade: GradeW; cost: 0 | 1 | 2 | 3; costL: string; effort: number; src: string; applies: (p: Prof) => number; dept?: string }
