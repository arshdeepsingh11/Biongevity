"use client";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LIFESTYLE_FACTORS, LIFE_EXPECTANCY, SLEEP_RISK, BP_RISK, STEPS_RISK } from "@/data/intelligence";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BodyHologram } from "@/components/body/BodyHologram";
import { NumberTicker } from "@/components/fx/NumberTicker";

/**
 * AI Longevity Lab (was: lifestyle simulator).
 * Describe your week in your own words → parsed ON YOUR DEVICE into five habits plus sleep, blood pressure and steps.
 * Outputs use published population figures only:
 *  • Life expectancy at 50 with 0–5 low-risk habits: Li et al., Circulation 2018 (partial habits interpolated, labelled)
 *  • Sleep, blood pressure and steps as relative risk from meta-analyses (sources shown)
 * The 3D body shows WHERE each habit acts. Not a personal prediction.
 */
type Level = 0 | 0.5 | 1;
const LEVELS: { v: Level; l: string }[] = [{ v: 0, l: "No" }, { v: 0.5, l: "Partly" }, { v: 1, l: "Yes" }];

/** Where each habit / risk acts in the body (organ ids from lib/body.ts). */
const ACTS: Record<string, string[]> = {
  smoke: ["lungs", "heart", "mouth", "skin"], bmi: ["heart", "liver", "pancreas", "joints"], move: ["heart", "muscles", "brain"],
  alcohol: ["liver", "brain", "heart"], diet: ["gut", "heart", "pancreas"], sleep: ["brain", "heart"], bp: ["heart", "brain", "kidneys", "eyes"], steps: ["muscles", "heart", "joints"],
};

/** On-device reader for a free-text description. Returns only what it found. */
function readWeek(t: string) {
  const s = t.toLowerCase(), out: Partial<{ h: Record<string, Level>; sleep: number; sbp: number; steps: number }> = { h: {} };
  const num = (re: RegExp) => { const m = s.match(re); return m ? parseFloat(m[1].replace(/,/g, "")) : undefined; };
  const sl = num(/(\d+(?:\.\d)?)\s*(?:h|hrs?|hours?)\b[^.]{0,20}sleep|sleep[^.\d]{0,20}(\d+(?:\.\d)?)/) ?? num(/sleep[^.\d]{0,20}(\d+(?:\.\d)?)/);
  if (sl && sl > 2 && sl < 13) out.sleep = sl;
  const st = num(/(\d[\d,.]*)\s*k?\s*steps/); if (st) out.steps = st < 50 ? st * 1000 : st;
  const bp = s.match(/(\d{2,3})\s*\/\s*(\d{2,3})/); if (bp) out.sbp = +bp[1];
  if (/never smok|don.?t smoke|non-?smoker|no smoking/.test(s)) out.h!.smoke = 1; else if (/quit smok|ex-?smoker|used to smoke/.test(s)) out.h!.smoke = 0.5; else if (/smok|cigarette|vape/.test(s)) out.h!.smoke = 0;
  if (/no alcohol|don.?t drink|sober|teetotal/.test(s)) out.h!.alcohol = 1; else { const d = num(/(\d+)\s*(?:drinks?|beers?|glasses)/); if (d !== undefined) out.h!.alcohol = d <= 7 ? 1 : d <= 14 ? 0.5 : 0; }
  if (/overweight|obes|bmi\s*(?:2[6-9]|[3-4]\d)/.test(s)) out.h!.bmi = 0; else if (/healthy weight|normal weight|bmi\s*(?:19|2[0-4])/.test(s)) out.h!.bmi = 1;
  const ex = num(/(?:gym|run|exercise|work ?out|train|swim|cycle|walk)[^.\d]{0,20}(\d)\s*(?:x|times|days)/) ?? num(/(\d)\s*(?:x|times|days)[^.]{0,20}(?:gym|run|exercise|work ?out|walk)/);
  if (ex !== undefined) out.h!.move = ex >= 5 ? 1 : ex >= 2 ? 0.5 : 0; else if (/sedentary|desk all day|no exercise/.test(s)) out.h!.move = 0;
  if (/fast food|takeaway|junk|processed|sugary/.test(s)) out.h!.diet = 0; else if (/vegetables|whole ?food|mediterranean|home ?cook|salad|fish/.test(s)) out.h!.diet = 1;
  return out;
}

const EXAMPLE_WEEK = "I sleep about 6 hours, walk 4,000 steps, gym twice a week, never smoked, BP 136/88, 10 glasses of wine a week, mostly home cooked";

export function LifespanSimulator() {
  const { ask } = useAI();
  const [sex, setSex] = useState<"women" | "men">("women");
  const [h, setH] = useState<Record<string, Level>>({ smoke: 1, bmi: 0.5, move: 0.5, alcohol: 1, diet: 0.5 });
  const [sleep, setSleep] = useState(6.5);
  const [sbp, setSbp] = useState(134);
  const [steps, setSteps] = useState(5200);
  const [text, setText] = useState("");
  const [read, setRead] = useState<string[]>([]);
  const [focus, setFocus] = useState<string | null>(null);

  const L = LIFE_EXPECTANCY[sex], per = (L.five - L.zero) / 5;
  const n = Object.values(h).reduce<number>((a, b) => a + b, 0);
  const years = +(L.zero + per * n).toFixed(1), onTable = +(L.five - years).toFixed(1);
  const sleepRR = sleep < 7 ? SLEEP_RISK.short : sleep > 9 ? SLEEP_RISK.long : 1;
  const bpRR = +Math.max(1, Math.pow(2, (sbp - BP_RISK.ref) / BP_RISK.doubleEvery)).toFixed(2);
  const stepsRR = useMemo(() => {
    const b = STEPS_RISK.bands; if (steps <= b[0].steps) return 1; if (steps >= b[b.length - 1].steps) return b[b.length - 1].rr;
    const i = b.findIndex((x) => x.steps >= steps), a = b[i - 1], c = b[i]; return +(a.rr + (c.rr - a.rr) * ((steps - a.steps) / (c.steps - a.steps))).toFixed(2);
  }, [steps]);

  // where it acts: missing habits + elevated risks light up the body
  const intensity = useMemo(() => {
    const m: Record<string, number> = {};
    const add = (k: string, w: number) => ACTS[k].forEach((o) => (m[o] = Math.min(1, (m[o] ?? 0) + w)));
    Object.entries(h).forEach(([k, v]) => v < 1 && add(k, (1 - v) * 0.6));
    if (sleepRR > 1) add("sleep", 0.5); if (bpRR > 1.3) add("bp", Math.min(0.8, (bpRR - 1) * 0.5)); if (stepsRR > 0.62) add("steps", 0.45);
    if (focus) { const only: Record<string, number> = {}; ACTS[focus].forEach((o) => (only[o] = 1)); return only; }
    return m;
  }, [h, sleepRR, bpRR, stepsRR, focus]);

  const missing = LIFESTYLE_FACTORS.filter((f) => h[f.id] < 1).sort((a, b) => h[a.id] - h[b.id]);
  const lever = bpRR >= 1.7 ? { k: "bp", t: `Bring blood pressure toward 120 — at ${sbp} mmHg risk is about ${bpRR}× the reference.` }
    : missing[0] ? { k: missing[0].id, t: `“${missing[0].label}” is worth about +${((1 - h[missing[0].id]) * per).toFixed(1)} years in the study population.` }
    : steps < 7800 ? { k: "steps", t: "Walking toward 7,800+ steps a day is your next biggest lever." } : { k: "sleep", t: "You're on the strongest evidence-based path — protect your sleep and keep it." };

  const understand = () => {
    const src = text.trim() || EXAMPLE_WEEK;
    if (!text.trim()) setText(EXAMPLE_WEEK);
    const r = readWeek(src), got: string[] = [];
    if (r.h && Object.keys(r.h).length) { setH((s) => ({ ...s, ...r.h })); Object.entries(r.h).forEach(([k, v]) => got.push(`${LIFESTYLE_FACTORS.find((f) => f.id === k)!.label}: ${LEVELS.find((l) => l.v === v)!.l}`)); }
    if (r.sleep) { setSleep(r.sleep); got.push(`Sleep ${r.sleep} h`); }
    if (r.sbp) { setSbp(r.sbp); got.push(`BP ${r.sbp}`); }
    if (r.steps) { setSteps(Math.round(r.steps / 100) * 100); got.push(`${Math.round(r.steps).toLocaleString()} steps`); }
    setRead(got.length ? got : ["Nothing specific found — try numbers like “6 hours sleep, 4000 steps, 130/85”"]);
  };

  const max = L.five;
  const bars = [{ k: "Baseline", v: L.zero, base: 0 }, ...LIFESTYLE_FACTORS.map((f, i) => ({ k: f.label, v: per * h[f.id], base: L.zero + per * LIFESTYLE_FACTORS.slice(0, i).reduce((a, g) => a + h[g.id], 0), id: f.id }))];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
      {/* Inputs */}
      <div className="space-y-4 rounded-[30px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
        <div className="relative overflow-hidden rounded-2xl bg-ai-soft/60 p-3 ring-1 ring-ai/15">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-ai"><XevyoOrb size={20} live />Tell Xevyo about your week</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} aria-label="Describe your week"
            placeholder="e.g. I sleep about 6 hours, walk 4,000 steps, gym twice a week, never smoked, BP 136/88, a few glasses of wine"
            className="mt-2 w-full resize-none rounded-xl bg-white/90 p-3 text-[13.5px] outline-none ring-1 ring-ink/[0.06] focus:ring-ai/40" />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button onClick={understand} className="btn-ai h-9 px-4 text-[13px]">{text.trim() ? "Read my week" : "Read an example week"}</button>
            <button onClick={() => setText(EXAMPLE_WEEK)} className="text-[12px] font-semibold text-ai underline">Try an example</button>
          </div>
          {read.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{read.map((r) => <span key={r} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-ink ring-1 ring-ai/20">✦ {r}</span>)}</div>}
          <p className="mt-1.5 text-[10.5px] text-faint">Read on your device — nothing is sent.</p>
        </div>

        <div className="flex items-center justify-between"><span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">Five habits</span>
          <div className="inline-flex rounded-full bg-canvas p-0.5">{(["women", "men"] as const).map((s) => <button key={s} onClick={() => setSex(s)} className={`rounded-full px-3 py-1 text-[12px] font-semibold capitalize ${sex === s ? "bg-white shadow-card" : "text-muted"}`}>{s}</button>)}</div>
        </div>
        <div className="space-y-2">
          {LIFESTYLE_FACTORS.map((f) => (
            <div key={f.id} onMouseEnter={() => setFocus(f.id)} onMouseLeave={() => setFocus(null)} className="flex items-center gap-3 rounded-2xl bg-canvas px-3 py-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-accent ring-1 ring-ink/[0.05]"><Icon name={f.icon} size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-semibold leading-tight">{f.label}</span><span className="block truncate text-[11px] text-muted">{f.detail}</span></span>
              <div role="radiogroup" aria-label={f.label} className="relative grid shrink-0 grid-cols-3 rounded-full bg-white p-0.5 ring-1 ring-ink/[0.06]">
                <motion.span layout aria-hidden className="absolute inset-y-0.5 w-1/3 rounded-full bg-ai" style={{ left: `calc(${(h[f.id] * 2) / 3 * 100}% + ${h[f.id] === 0 ? 2 : h[f.id] === 1 ? -2 : 0}px)` }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                {LEVELS.map((l) => <button key={l.l} role="radio" aria-checked={h[f.id] === l.v} onClick={() => setH((s) => ({ ...s, [f.id]: l.v }))} className={`relative z-[1] w-[46px] py-1 text-[11px] font-semibold transition-colors ${h[f.id] === l.v ? "text-on-ai" : "text-muted"}`}>{l.l}</button>)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Dial label="Sleep" unit="h" v={sleep} set={setSleep} min={4} max={10} step={0.5} warn={sleep < 7 || sleep > 9} onFocus={() => setFocus("sleep")} onBlur={() => setFocus(null)} />
          <Dial label="Systolic" unit="mmHg" v={sbp} set={setSbp} min={100} max={180} step={1} warn={sbp >= 135} onFocus={() => setFocus("bp")} onBlur={() => setFocus(null)} />
          <Dial label="Steps" unit="/day" v={steps} set={setSteps} min={2000} max={14000} step={250} warn={steps < 7000} fmt={(v) => `${(v / 1000).toFixed(1)}k`} onFocus={() => setFocus("steps")} onBlur={() => setFocus(null)} />
        </div>
        <p className="text-[10.5px] text-faint">Drag a dial (or use arrow keys). &ldquo;Partly&rdquo; counts as half a habit — an illustrative interpolation of the study.</p>
      </div>

      {/* Outputs */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[30px] bg-white p-6 ai-ring">
            <div aria-hidden className="ai-glow -right-16 -top-16 h-56 w-56" />
            <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Big k="Life expectancy at 50" v={years} unit="yrs" sub={`${n.toFixed(1)} of 5 habits`} />
              <Big k="Healthy years on the table" v={onTable} unit="yrs" sub="with all five habits" ai />
              <Big k="Risk from your numbers" v={+(sleepRR * bpRR * (stepsRR / 0.47 > 1 ? stepsRR / 0.47 : 1)).toFixed(2)} unit="×" sub="combined, vs best band" />
            </div>
            <div className="relative mt-5 flex items-start gap-3 rounded-2xl bg-ai-soft/70 p-3.5">
              <XevyoOrb size={30} live />
              <div className="min-w-0 flex-1 text-[14px]"><b className="text-ai">Biggest lever · </b>{lever.t}</div>
              <button onClick={() => ask(`My week: habits ${JSON.stringify(h)}, sleep ${sleep} h, systolic ${sbp}, ${steps} steps. Explain my biggest longevity lever and a realistic 4-week plan. Population data only — not a diagnosis.`, { label: "✦ Plan my biggest lever" })} className="shrink-0 rounded-full bg-ai px-3 py-1.5 text-[12px] font-semibold text-on-ai">Plan it</button>
            </div>
          </div>

          {/* Waterfall */}
          <figure className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]">
            <figcaption className="flex items-baseline justify-between"><span className="text-[15px] font-semibold">How your habits add up</span><span className="text-[11px] text-faint">{LIFE_EXPECTANCY.src.split("(")[0]}</span></figcaption>
            <div className="mt-4 space-y-2">
              {bars.map((b, i) => (
                <div key={b.k} className="grid grid-cols-[120px_minmax(0,1fr)_48px] items-center gap-2 text-[12px]" onMouseEnter={() => b.id && setFocus(b.id)} onMouseLeave={() => setFocus(null)}>
                  <span className="truncate font-medium">{b.k}</span>
                  <div className="relative h-5 rounded-md bg-ink/[0.04]">
                    {i > 0 && <span className="absolute inset-y-0 rounded-md bg-ai/15" style={{ left: `${(b.base / max) * 100}%`, width: `${(per / max) * 100}%` }} />}
                    <motion.span className={`absolute inset-y-0 rounded-md ${i === 0 ? "bg-ink/25" : "bg-ai bg-ai-grad"}`} initial={false} animate={{ left: `${(b.base / max) * 100}%`, width: `${(b.v / max) * 100}%` }} transition={{ type: "spring", stiffness: 140, damping: 22 }} />
                  </div>
                  <span className="text-right tabular-nums text-muted">{i === 0 ? b.v.toFixed(1) : `+${b.v.toFixed(1)}`}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-faint">Light bars show the years each missing habit could add. Population averages for adults at 50.</p>
          </figure>

          {/* Risk meters */}
          <figure className="grid grid-cols-1 gap-3 rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07] sm:grid-cols-3">
            <Risk k="Sleep" rr={sleepRR} note={sleep < 7 ? "short sleep" : sleep > 9 ? "long sleep" : "7–9 h"} src="Cappuccio 2010" />
            <Risk k="Blood pressure" rr={bpRR} note={`${sbp} mmHg vs 115`} src="PSC, Lancet 2002" />
            <Risk k="Steps" rr={stepsRR} note={`${steps.toLocaleString()} a day`} src="Paluch 2022" lowerIsBetter />
          </figure>
        </div>

        {/* Body impact */}
        <div className="overflow-hidden rounded-[30px] bg-white ring-1 ring-ink/[0.07]">
          <div className="flex items-center gap-2 px-5 pt-4"><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Where it acts</span><span className="ml-auto text-[11px] text-muted">{focus ? LIFESTYLE_FACTORS.find((f) => f.id === focus)?.label ?? focus : "All gaps"}</span></div>
          <BodyHologram intensity={intensity} labels={false} height={520} compact autoRotate />
          <p className="px-5 pb-4 text-[11.5px] leading-snug text-muted">Glow = the organs a habit affects most. Hover a habit or dial to see just its effect.</p>
        </div>
      </div>
    </div>
  );
}

function Big({ k, v, unit, sub, ai }: { k: string; v: number; unit: string; sub: string; ai?: boolean }) {
  return (
    <div>
      <div className="text-[11.5px] font-medium text-muted">{k}</div>
      <div className={`mt-1 text-[40px] font-semibold leading-none tracking-tight tabular-nums ${ai ? "text-ai-grad" : ""}`}><NumberTicker value={v} decimals={unit === "×" ? 2 : 1} /><span className="ml-1 text-[15px] font-medium text-muted">{unit}</span></div>
      <div className="mt-1 text-[11.5px] text-faint">{sub}</div>
    </div>
  );
}
