"use client";
import { useMemo, useRef, useState } from "react";
import { BodyHologram, type Hotspot } from "@/components/body/BodyHologram";
import { organById } from "@/lib/body";
import { BP_RISK, LIFE_EXPECTANCY, SLEEP_RISK, STEPS_RISK } from "@/data/intelligence";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Sex = "women" | "men";
type Smoke = "never" | "former" | "current";
interface In { sleep: number; steps: number; sbp: number; drinks: number; bmi: number; smoke: Smoke; sex: Sex }
const START: In = { sleep: 6.2, steps: 4800, sbp: 136, drinks: 9, bmi: 28, smoke: "never", sex: "women" };

const c01 = (x: number) => Math.max(0, Math.min(1, x));
function stepsRR(steps: number) {
  const b = STEPS_RISK.bands; if (steps <= b[0].steps) return b[0].rr; if (steps >= b[b.length - 1].steps) return b[b.length - 1].rr;
  const i = b.findIndex((x) => x.steps >= steps), a = b[i - 1], z = b[i]; return a.rr + ((steps - a.steps) / (z.steps - a.steps)) * (z.rr - a.rr);
}
const bpRR = (sbp: number) => Math.pow(2, (Math.max(BP_RISK.ref, sbp) - BP_RISK.ref) / BP_RISK.doubleEvery);
const sleepRR = (h: number) => (h < 7 ? 1 + (SLEEP_RISK.short - 1) * c01((7 - h) / 1.5) : h > 9 ? 1 + (SLEEP_RISK.long - 1) * c01((h - 9) / 1.5) : 1);

/** On-device strain per organ (0 calm → 1 hot). A transparent teaching model, not a diagnosis. */
function heat(v: In): Record<string, number> {
  const bp = c01((v.sbp - 115) / 50), sl = c01(Math.abs(v.sleep - 7.5) / 2.5), mv = c01((8000 - v.steps) / 6500), al = c01(v.drinks / 21), wt = c01((v.bmi - 24) / 12), sm = v.smoke === "current" ? 1 : v.smoke === "former" ? 0.35 : 0;
  return {
    heart: c01(0.45 * bp + 0.2 * mv + 0.2 * wt + 0.3 * sm), brain: c01(0.45 * sl + 0.3 * bp + 0.25 * al), lungs: c01(0.85 * sm + 0.15 * mv),
    liver: c01(0.6 * al + 0.4 * wt), kidneys: c01(0.75 * bp + 0.2 * wt), pancreas: c01(0.55 * wt + 0.45 * mv), muscles: c01(0.9 * mv),
    gut: c01(0.45 * al + 0.3 * sl + 0.25 * wt), joints: c01(0.7 * wt + 0.2 * mv), skin: c01(0.5 * sm + 0.3 * sl),
  };
}
function lowRisk(v: In) {
  const smoke = v.smoke === "never" ? 1 : v.smoke === "former" ? 0.5 : 0;
  const bmi = v.bmi >= 18.5 && v.bmi < 25 ? 1 : v.bmi < 30 ? 0.5 : 0;
  const move = v.steps >= 7500 ? 1 : v.steps >= 5000 ? 0.5 : 0;
  const alc = v.drinks <= (v.sex === "women" ? 7 : 14) ? 1 : 0;
  return smoke + bmi + move + alc + 0.5; // diet held at "partly" (not asked here)
}

/**
 * Twin heat map — the website version of the app's Heat Map Simulator. Move sleep, steps, blood pressure,
 * alcohol, weight or smoking and watch organs glow hotter or calmer, with healthy years and risk updating live.
 * Figures come from the cited studies; the organ heat is an on-device teaching model. Educational estimate.
 */
export function TwinWhatIf() {
  const { ask } = useAI();
  const [v, setV] = useState<In>(START);
  const base = useRef(START);
  const h = useMemo(() => heat(v), [v]);
  const h0 = useMemo(() => heat(base.current), []);
  const L = LIFE_EXPECTANCY[v.sex], per = (L.five - L.zero) / 5;
  const years = L.zero + per * lowRisk(v), years0 = L.zero + per * lowRisk({ ...base.current, sex: v.sex });
  const rr = { bp: bpRR(v.sbp), sleep: sleepRR(v.sleep), steps: stepsRR(v.steps) };
  const top = Object.entries(h).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const hotspots: Hotspot[] = top.map(([id, x]) => ({ id, label: organById(id)?.label, status: `${Math.round(x * 100)}%`, tone: x > 0.55 ? "attention" : x > 0.3 ? "focus" : "good" }));
  const set = <K extends keyof In>(k: K) => (x: In[K]) => setV((s) => ({ ...s, [k]: x }));

  const sliders: { k: "sleep" | "steps" | "sbp" | "drinks" | "bmi"; label: string; min: number; max: number; step: number; fmt: (n: number) => string; icon: "moon" | "steps" | "heart" | "wine" | "scale" }[] = [
    { k: "sleep", label: "Sleep", min: 4, max: 10, step: 0.1, fmt: (n) => `${n.toFixed(1)} h`, icon: "moon" },
    { k: "steps", label: "Steps a day", min: 1000, max: 15000, step: 100, fmt: (n) => n.toLocaleString(), icon: "steps" },
    { k: "sbp", label: "Systolic blood pressure", min: 100, max: 180, step: 1, fmt: (n) => `${n} mmHg`, icon: "heart" },
    { k: "drinks", label: "Alcoholic drinks a week", min: 0, max: 30, step: 1, fmt: (n) => `${n}`, icon: "wine" },
    { k: "bmi", label: "BMI", min: 18, max: 40, step: 0.5, fmt: (n) => n.toFixed(1), icon: "scale" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
      <div className="space-y-3 rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Your levers</div>
          <div className="flex rounded-full bg-canvas p-0.5 text-[11.5px] font-semibold">
            {(["women", "men"] as Sex[]).map((s) => <button key={s} onClick={() => set("sex")(s)} className={cn("rounded-full px-2.5 py-1 capitalize", v.sex === s ? "bg-white text-ai shadow-card" : "text-muted")}>{s}</button>)}
          </div>
        </div>
        {sliders.map((s) => (
          <label key={s.k} className="block">
            <span className="flex items-center justify-between text-[12.5px]"><span className="flex items-center gap-1.5 font-medium"><Icon name={s.icon} size={14} className="text-ai" />{s.label}</span><span className="font-semibold tabular-nums">{s.fmt(v[s.k])}</span></span>
            <input type="range" min={s.min} max={s.max} step={s.step} value={v[s.k]} onChange={(e) => set(s.k)(Number(e.target.value))} className="mt-1 w-full accent-[rgb(var(--c-ai))]" aria-label={s.label} />
          </label>
        ))}
        <div>
          <div className="text-[12.5px] font-medium">Smoking</div>
          <div className="mt-1 grid grid-cols-3 gap-1 rounded-full bg-canvas p-0.5 text-[12px] font-semibold">
            {(["never", "former", "current"] as Smoke[]).map((s) => <button key={s} onClick={() => set("smoke")(s)} className={cn("rounded-full py-1.5 capitalize", v.smoke === s ? "bg-white text-ai shadow-card" : "text-muted")}>{s}</button>)}
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => setV({ ...START, sex: v.sex })} className="btn-light h-9 flex-1 px-3 text-[12.5px]"><Icon name="reset" size={14} />Reset</button>
          <button onClick={() => setV({ ...v, sleep: 7.5, steps: 8500, sbp: 120, drinks: Math.min(v.drinks, 5), bmi: Math.min(v.bmi, 24.5), smoke: v.smoke === "current" ? "former" : v.smoke })} className="btn-ai h-9 flex-1 px-3 text-[12.5px]">Best case</button>
        </div>
      </div>

      <div className="relative min-w-0 overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-ink/[0.06]">
        <BodyHologram height={620} intensity={h} hotspots={hotspots} autoRotate ar />
        <div className="pointer-events-none absolute left-3 top-3 rounded-2xl bg-white/85 px-3 py-2 shadow-card ring-1 ring-ink/[0.06] backdrop-blur">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Heat map · strain</div>
          <div className="mt-1 h-1.5 w-32 rounded-full" style={{ background: "linear-gradient(90deg, rgb(var(--c-teal) / .5), rgb(var(--c-gold)), rgb(var(--c-artery)))" }} />
          <div className="mt-0.5 flex justify-between text-[10px] text-faint"><span>calm</span><span>hot</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Healthy years from 50</div>
          <div className="mt-1 flex items-baseline gap-1.5"><span className="text-[44px] font-semibold leading-none tracking-tight"><NumberTicker value={Number(years.toFixed(1))} decimals={1} /></span><span className="text-muted">years</span></div>
          <div className={cn("mt-1 text-[13px] font-semibold", years - years0 >= 0 ? "text-teal" : "text-warn")}>{years - years0 >= 0 ? "+" : ""}{(years - years0).toFixed(1)} vs where you started</div>
          <p className="mt-2 text-[11px] text-faint">{LIFE_EXPECTANCY.src}. Diet held at &ldquo;partly&rdquo;.</p>
        </div>
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Risk vs reference</div>
          {([["Blood pressure", rr.bp, BP_RISK.src], ["Sleep", rr.sleep, SLEEP_RISK.src], ["Steps", rr.steps, STEPS_RISK.src]] as const).map(([k, x, src]) => (
            <div key={k} className="mt-3">
              <div className="flex justify-between text-[12.5px]"><span className="font-medium">{k}</span><span className={cn("font-semibold tabular-nums", x > 1.15 ? "text-warn" : "text-ink")}>{x.toFixed(2)}×</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]"><div className="h-full rounded-full bg-ai transition-all duration-500" style={{ width: `${Math.min(100, (x / 2.5) * 100)}%` }} /></div>
              <div className="mt-0.5 truncate text-[10px] text-faint" title={src}>{src}</div>
            </div>
          ))}
        </div>
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Organs changing most</div>
          <div className="mt-2 space-y-1.5">
            {Object.keys(h).map((id) => ({ id, d: h[id] - h0[id] })).sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 4).map(({ id, d }) => (
              <div key={id} className="flex items-center justify-between text-[12.5px]"><span>{organById(id)?.label}</span><span className={cn("font-semibold tabular-nums", d > 0.02 ? "text-warn" : d < -0.02 ? "text-teal" : "text-muted")}>{d > 0 ? "▲" : d < 0 ? "▼" : "•"} {Math.abs(Math.round(d * 100))}</span></div>
            ))}
          </div>
          <button onClick={() => ask(`In the Biongevity twin heat map I set sleep ${v.sleep.toFixed(1)} h, ${v.steps} steps a day, blood pressure ${v.sbp}, ${v.drinks} drinks a week, BMI ${v.bmi}, smoking: ${v.smoke}. The hottest areas are ${top.map(([id]) => organById(id)?.label).join(", ")}. Explain what this means and the first 3 changes worth making.`, { label: "✦ Explain my heat map" })}
            className="btn-ai mt-4 h-10 w-full text-[13px]"><XevyoOrb size={20} />Explain my heat map</button>
        </div>
        <p className="px-1 text-[11px] text-faint">Educational estimate. Organ heat is a transparent teaching model built on your device; the years and risk figures come from the studies cited.</p>
      </div>
    </div>
  );
}
