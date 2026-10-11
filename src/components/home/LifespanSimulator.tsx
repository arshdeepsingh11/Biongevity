"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LIFESTYLE_FACTORS, LIFE_EXPECTANCY, SLEEP_RISK, BP_RISK, STEPS_RISK } from "@/data/intelligence";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";

/**
 * Lifestyle → longevity simulator.
 * Life expectancy endpoints: Li et al., Circulation 2018 (0 vs 5 low-risk factors; intermediate counts interpolated).
 * Sleep, blood pressure and steps shown as relative risk from meta-analyses. Population estimates, not a personal prediction.
 */
export function LifespanSimulator() {
  const { ask } = useAI();
  const [sex, setSex] = useState<"women" | "men">("women");
  const [on, setOn] = useState<string[]>(["smoke", "alcohol"]);
  const [sleep, setSleep] = useState(6.5);
  const [sbp, setSbp] = useState(132);
  const [steps, setSteps] = useState(5500);

  const L = LIFE_EXPECTANCY[sex];
  const per = (L.five - L.zero) / 5;
  const le = (n: number) => +(L.zero + per * n).toFixed(1);
  const n = on.length, years = le(n), gain = +(years - L.zero).toFixed(1), left = +(L.five - years).toFixed(1);

  const sleepRR = sleep < 7 ? SLEEP_RISK.short : sleep > 9 ? SLEEP_RISK.long : 1;
  const bpRR = +Math.max(1, Math.pow(2, (sbp - BP_RISK.ref) / BP_RISK.doubleEvery)).toFixed(2);
  const stepsRR = useMemo(() => {
    const b = STEPS_RISK.bands;
    if (steps <= b[0].steps) return 1;
    if (steps >= b[b.length - 1].steps) return b[b.length - 1].rr;
    const i = b.findIndex((x) => x.steps >= steps);
    const a = b[i - 1], c = b[i], f = (steps - a.steps) / (c.steps - a.steps);
    return +(a.rr + (c.rr - a.rr) * f).toFixed(2);
  }, [steps]);

  const lever = n < 5 ? `Adding “${LIFESTYLE_FACTORS.find((f) => !on.includes(f.id))!.label.toLowerCase()}” is worth about +${per.toFixed(1)} years` : sbp >= 135 ? "Bringing blood pressure under 135/85 is your biggest lever" : steps < 8000 ? "Walking toward 8,000+ steps a day is your biggest lever" : "You're on the strongest evidence-based path — keep it";
  const toggle = (id: string) => setOn((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const max = L.five + 2;

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
      <div className="hud space-y-5 rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
        <div className="flex items-center justify-between"><span className="hud-label">Inputs</span>
          <div className="inline-flex rounded-full bg-canvas p-1">{(["women", "men"] as const).map((s) => <button key={s} onClick={() => setSex(s)} className={`rounded-full px-3 py-1 text-[12.5px] font-semibold capitalize ${sex === s ? "bg-accent text-white" : "text-muted"}`}>{s}</button>)}</div>
        </div>
        <div className="space-y-1.5">
          {LIFESTYLE_FACTORS.map((f) => { const c = on.includes(f.id); return (
            <button key={f.id} onClick={() => toggle(f.id)} aria-pressed={c} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${c ? "bg-accent-light" : "bg-canvas hover:bg-accent-light/60"}`}>
              <Icon name={f.icon} size={20} weight="duotone" className={c ? "text-accent" : "text-faint"} />
              <span className="flex-1"><span className="block text-[14px] font-semibold">{f.label}</span><span className="block text-[11.5px] text-muted">{f.detail}</span></span>
              <span className={`relative h-5 w-9 rounded-full transition-colors ${c ? "bg-accent" : "bg-ink/15"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${c ? "left-[18px]" : "left-0.5"}`} /></span>
            </button>
          ); })}
        </div>
        <Slider label="Sleep per night" v={sleep} set={setSleep} min={4} max={10} step={0.5} fmt={(v) => `${v} h`} />
        <Slider label="Systolic blood pressure" v={sbp} set={setSbp} min={100} max={180} step={1} fmt={(v) => `${v} mmHg`} />
        <Slider label="Steps per day" v={steps} set={setSteps} min={2000} max={14000} step={500} fmt={(v) => v.toLocaleString()} />
      </div>

      <div className="space-y-5">
        <div className="hud relative overflow-hidden rounded-[28px] bg-navy p-5 sm:p-7">
          <div className="scanline" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="hud-label">Projected life expectancy at 50</div>
              <div className="mt-2 flex items-baseline gap-2"><motion.span key={years} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[64px] font-semibold leading-none tracking-tight tabular-nums">{years}</motion.span><span className="text-[16px] text-muted">more years</span></div>
              <div className="mt-2 text-[14px]"><b className="text-teal">+{gain} years</b> vs no low-risk habits{left > 0 && <> · <b className="text-accent">{left} years</b> still on the table</>}</div>
              <div className="mt-4 rounded-2xl bg-white p-3 text-[13.5px]"><div className="hud-label !text-muted">Biggest lever</div><div className="mt-1 font-semibold">{lever}</div></div>
            </div>
            <div>
              <div className="hud-label">Low-risk habits vs remaining years ({sex})</div>
              <div className="mt-3 flex h-[170px] items-end gap-2">
                {[0, 1, 2, 3, 4, 5].map((k) => { const v = le(k), act = k === n; return (
                  <div key={k} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className={`text-[11px] font-semibold tabular-nums ${act ? "text-accent" : "text-muted"}`}>{v}</span>
                    <motion.div className={`w-full rounded-t-lg ${act ? "bg-iri" : "bg-accent/25"}`} initial={false} animate={{ height: `${(v / max) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
                    <span className={`text-[11px] ${act ? "font-semibold text-accent" : "text-faint"}`}>{k}</span>
                  </div>
                ); })}
              </div>
            </div>
          </div>
          <p className="relative mt-4 text-[10.5px] text-muted">Source: {LIFE_EXPECTANCY.src}. Endpoints published; intermediate values interpolated.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Risk title="Sleep" icon="moon" rr={sleepRR} note={sleep < 7 ? "Short sleep" : sleep > 9 ? "Long sleep" : "7–9 h reference"} src={SLEEP_RISK.src} />
          <Risk title="Blood pressure" icon="gauge" rr={bpRR} note={`vs ${BP_RISK.ref} mmHg · cardiovascular death`} src={BP_RISK.src} />
          <Risk title="Daily steps" icon="steps" rr={stepsRR} note="vs ~3,500 steps/day" src={STEPS_RISK.src} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => ask(`I have ${n} of 5 low-risk habits, sleep ${sleep} hours, systolic BP ${sbp} and walk ${steps} steps a day. What should I focus on first?`)} className="btn-dark"><Icon name="sparkle" size={16} weight="duotone" />Ask Xevyo for my plan</button>
          <span className="text-[11.5px] text-faint">Population estimates from published studies — not a personal prediction or diagnosis.</span>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, v, set, min, max, step, fmt }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step: number; fmt: (v: number) => string }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[13.5px]"><span className="font-semibold">{label}</span><span className="font-mono text-[13px] tabular-nums text-accent">{fmt(v)}</span></span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="mt-1.5 w-full accent-[#97703F]" aria-label={label} />
    </label>
  );
}

function Risk({ title, icon, rr, note, src }: { title: string; icon: string; rr: number; note: string; src: string }) {
  const good = rr <= 1, pct = Math.min(100, (rr / 2.5) * 100);
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
      <div className="flex items-center gap-2 text-[14px] font-semibold"><Icon name={icon} size={18} weight="duotone" className="text-accent" />{title}</div>
      <div className={`mt-2 text-[30px] font-semibold tabular-nums ${good ? "text-teal" : "text-[#B4691F]"}`}>×{rr.toFixed(2)}</div>
      <div className="text-[12px] text-muted">relative risk · {note}</div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]"><motion.div className={`h-full rounded-full ${good ? "bg-teal" : "bg-[#C9895B]"}`} animate={{ width: `${pct}%` }} /></div>
      <div className="mt-2 text-[10px] leading-snug text-faint">{src}</div>
    </div>
  );
}
