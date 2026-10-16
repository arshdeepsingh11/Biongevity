"use client";
import { useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AIChartFrame } from "@/components/charts/AICharts";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { STEPS_RISK, SLEEP_RISK, BP_RISK, LIFE_EXPECTANCY } from "@/data/intelligence";

/*
 * AI Evidence board — four published findings as live instruments. Drag along any curve (or use the slider)
 * to put yourself on it; the insight recalculates on your device. Curves are drawn between the published points.
 */

type Pt = [number, number];
const interp = (pts: Pt[], x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0); }
  return pts[pts.length - 1][1];
};

/** Interactive curve: hover crosshair, drag a handle, glowing tracer, optional zones. */
function Curve({ pts, x, setX, xMin, xMax, yMin, yMax, fmtX, fmtY, zones, pts2, label2 }: {
  pts: Pt[]; x: number; setX: (v: number) => void; xMin: number; xMax: number; yMin: number; yMax: number;
  fmtX: (v: number) => string; fmtY: (v: number) => string; zones?: { from: number; to: number; tone: "good" | "warn" }[]; pts2?: Pt[]; label2?: string;
}) {
  const id = useId().replace(/:/g, "");
  const W = 520, H = 190, P = { l: 36, r: 12, t: 12, b: 26 };
  const X = (v: number) => P.l + ((v - xMin) / (xMax - xMin)) * (W - P.l - P.r);
  const Y = (v: number) => P.t + (1 - (v - yMin) / (yMax - yMin)) * (H - P.t - P.b);
  const svg = useRef<SVGSVGElement>(null);
  const [hov, setHov] = useState<number | null>(null);
  const drag = useRef(false);
  const toX = (cx: number) => { const r = svg.current!.getBoundingClientRect(); const px = ((cx - r.left) / r.width) * W; return Math.max(xMin, Math.min(xMax, xMin + ((px - P.l) / (W - P.l - P.r)) * (xMax - xMin))); };
  const sample = (p: Pt[]) => Array.from({ length: 60 }, (_, i) => { const v = xMin + ((xMax - xMin) * i) / 59; return [X(v), Y(interp(p, v))] as Pt; });
  const line = (p: Pt[]) => sample(p).map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`).join(" ");
  const d = line(pts), y = interp(pts, x), hx = hov ?? x, hy = interp(pts, hx);
  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" role="slider" aria-valuemin={xMin} aria-valuemax={xMax} aria-valuenow={Math.round(x)} aria-valuetext={`${fmtX(x)}: ${fmtY(y)}`} tabIndex={0}
      onKeyDown={(e) => { const st = (xMax - xMin) / 40; if (e.key === "ArrowRight") setX(Math.min(xMax, x + st)); if (e.key === "ArrowLeft") setX(Math.max(xMin, x - st)); }}
      onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); setX(toX(e.clientX)); }}
      onPointerMove={(e) => { const v = toX(e.clientX); setHov(v); if (drag.current) setX(v); }}
      onPointerUp={() => (drag.current = false)} onPointerLeave={() => { setHov(null); drag.current = false; }}>
      <defs>
        <linearGradient id={`f${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="rgb(var(--c-ai))" stopOpacity=".22" /><stop offset="1" stopColor="rgb(var(--c-ai))" stopOpacity="0" /></linearGradient>
        <filter id={`g${id}`}><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {zones?.map((z, i) => <rect key={i} x={X(z.from)} y={P.t} width={X(z.to) - X(z.from)} height={H - P.t - P.b} fill={z.tone === "good" ? "rgb(var(--c-teal) / .07)" : "rgb(var(--c-warn) / .06)"} />)}
      {[0, 0.5, 1].map((k) => { const v = yMin + (yMax - yMin) * k; return <g key={k}><line x1={P.l} x2={W - P.r} y1={Y(v)} y2={Y(v)} stroke="rgb(var(--c-ink) / .06)" /><text x={P.l - 6} y={Y(v) + 3} textAnchor="end" fontSize="10" fill="rgb(var(--c-faint))">{fmtY(v)}</text></g>; })}
      {[0, 0.25, 0.5, 0.75, 1].map((k) => { const v = xMin + (xMax - xMin) * k; return <text key={k} x={X(v)} y={H - 8} textAnchor="middle" fontSize="10" fill="rgb(var(--c-faint))">{fmtX(v)}</text>; })}
      <path d={`${d} L${X(xMax)},${H - P.b} L${X(xMin)},${H - P.b} Z`} fill={`url(#f${id})`} />
      {pts2 && <path d={line(pts2)} fill="none" stroke="rgb(var(--c-ai-2) / .7)" strokeWidth="2" strokeDasharray="5 4" />}
      {pts2 && label2 && <text x={W - P.r} y={Y(interp(pts2, xMax)) - 6} textAnchor="end" fontSize="10" fill="rgb(var(--c-ai-2))">{label2}</text>}
      <path d={d} fill="none" stroke="rgb(var(--c-ai))" strokeWidth="2.6" strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgb(var(--c-ai-hi))" strokeWidth="3" strokeDasharray="10 400" className="beam-dash" filter={`url(#g${id})`} />
      {pts.map(([a, b], i) => <circle key={i} cx={X(a)} cy={Y(b)} r="3" fill="rgb(var(--c-surface))" stroke="rgb(var(--c-ai))" strokeWidth="1.5" />)}
      {hov !== null && <g pointerEvents="none"><line x1={X(hx)} x2={X(hx)} y1={P.t} y2={H - P.b} stroke="rgb(var(--c-ink) / .25)" strokeDasharray="3 3" />
        <rect x={Math.min(W - 92, X(hx) + 6)} y={Math.max(P.t, Y(hy) - 28)} width="86" height="22" rx="7" fill="rgb(var(--c-ink) / .85)" /><text x={Math.min(W - 92, X(hx) + 6) + 43} y={Math.max(P.t, Y(hy) - 28) + 15} textAnchor="middle" fontSize="10.5" fill="#fff">{fmtX(hx)} · {fmtY(hy)}</text></g>}
      <line x1={X(x)} x2={X(x)} y1={Y(y)} y2={H - P.b} stroke="rgb(var(--c-ai) / .5)" />
      <motion.circle cx={X(x)} cy={Y(y)} r="11" fill="rgb(var(--c-ai) / .18)" animate={{ r: [9, 13, 9] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <circle cx={X(x)} cy={Y(y)} r="6" fill="rgb(var(--c-ai))" stroke="#fff" strokeWidth="2" style={{ cursor: "grab" }} />
    </svg>
  );
}

function Slider({ v, set, min, max, step, label, fmt }: { v: number; set: (n: number) => void; min: number; max: number; step: number; label: string; fmt: (n: number) => string }) {
  return (
    <label className="mt-2 flex items-center gap-3 text-[12px] text-muted">
      <span className="w-24 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer accent-[rgb(var(--c-ai))]" />
      <span className="w-16 shrink-0 text-right font-semibold tabular-nums text-ink">{fmt(v)}</span>
    </label>
  );
}

const HABIT_LIST = ["Never smoke", "Healthy weight", "30+ min activity", "Moderate alcohol", "Quality diet"];

export function EvidenceBoard() {
  // Steps (published bands)
  const stepPts: Pt[] = STEPS_RISK.bands.map((b) => [b.steps, b.rr]);
  const [steps, setSteps] = useState(5000);
  const rrSteps = interp(stepPts, steps);
  // Blood pressure (risk doubles every +20 mmHg from 115)
  const bpRR = (bp: number) => Math.pow(2, (bp - BP_RISK.ref) / BP_RISK.doubleEvery);
  const bpPts: Pt[] = useMemo(() => Array.from({ length: 8 }, (_, i) => { const b = 115 + i * 10; return [b, bpRR(b)] as Pt; }), []);
  const [bp, setBp] = useState(138);
  // Sleep (U-shape from the meta-analysis: short +12%, long +30% vs 7–8 h)
  const sleepPts: Pt[] = [[4.5, SLEEP_RISK.short + 0.06], [6, SLEEP_RISK.short], [7, 1], [8, 1], [9, SLEEP_RISK.long - 0.08], [10, SLEEP_RISK.long]];
  const [sleep, setSleep] = useState(6.2);
  const rrSleep = interp(sleepPts, sleep);
  // Habits
  const [habits, setHabits] = useState<boolean[]>([true, false, true, false, false]);
  const n = habits.filter(Boolean).length;
  const per = (s: "women" | "men") => (LIFE_EXPECTANCY[s].five - LIFE_EXPECTANCY[s].zero) / 5;
  const yrsW = LIFE_EXPECTANCY.women.zero + per("women") * n, yrsM = LIFE_EXPECTANCY.men.zero + per("men") * n;
  const habitPtsW: Pt[] = [0, 1, 2, 3, 4, 5].map((k) => [k, LIFE_EXPECTANCY.women.zero + per("women") * k]);
  const habitPtsM: Pt[] = [0, 1, 2, 3, 4, 5].map((k) => [k, LIFE_EXPECTANCY.men.zero + per("men") * k]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <AIChartFrame kicker="Movement · drag the curve" title="Mortality risk falls with daily steps" source={STEPS_RISK.src} data={{ bands: STEPS_RISK.bands, you: { steps, relativeRisk: rrSteps } }}
        insight={<>At <b>{Math.round(steps).toLocaleString()}</b> steps the published curve sits at <b>{rrSteps.toFixed(2)}×</b> — about <b>{Math.max(0, Math.round((1 - rrSteps) * 100))}% lower</b> risk than ~3,500 steps.{steps < 7800 ? <> Adding {Math.round(7800 - steps).toLocaleString()} steps reaches the 7,800 band.</> : <> You are past the point where most of the benefit is gained.</>}</>}>
        <Curve pts={stepPts} x={steps} setX={setSteps} xMin={3500} xMax={10900} yMin={0.4} yMax={1.05} fmtX={(v) => `${(v / 1000).toFixed(1)}k`} fmtY={(v) => `${v.toFixed(2)}×`} zones={[{ from: 7800, to: 10900, tone: "good" }]} />
        <Slider v={Math.round(steps)} set={setSteps} min={3500} max={10900} step={100} label="Your daily steps" fmt={(v) => v.toLocaleString()} />
      </AIChartFrame>

      <AIChartFrame kicker="Blood pressure · drag the curve" title="Risk doubles with every +20 mmHg" source={BP_RISK.src} data={{ ref: BP_RISK.ref, doubleEvery: BP_RISK.doubleEvery, you: { systolic: bp, relativeRisk: bpRR(bp) } }}
        insight={<>At <b>{Math.round(bp)} mmHg</b>, vascular death risk is about <b>{bpRR(bp).toFixed(1)}×</b> the 115 baseline (ages 40–69).{bp > 135 ? <> Lowering by 10 mmHg would cut it to {bpRR(bp - 10).toFixed(1)}×. Home readings above 135/85 are worth a review.</> : <> Within the home target of 135/85.</>}</>}>
        <Curve pts={bpPts} x={bp} setX={setBp} xMin={115} xMax={185} yMin={0} yMax={11.5} fmtX={(v) => `${Math.round(v)}`} fmtY={(v) => `${v.toFixed(0)}×`} zones={[{ from: 115, to: 135, tone: "good" }, { from: 135, to: 185, tone: "warn" }]} />
        <Slider v={Math.round(bp)} set={setBp} min={115} max={185} step={1} label="Your systolic" fmt={(v) => `${v} mmHg`} />
      </AIChartFrame>

      <AIChartFrame kicker="Sleep · drag the curve" title="Too little and too much sleep both carry risk" source={SLEEP_RISK.src} data={{ ...SLEEP_RISK, you: { hours: sleep, relativeRisk: rrSleep } }}
        insight={<>{sleep >= 7 && sleep <= 8 ? <>At <b>{sleep.toFixed(1)} h</b> you are in the 7–8 hour reference band.</> : sleep < 7 ? <>At <b>{sleep.toFixed(1)} h</b>, risk is about <b>+{Math.round((rrSleep - 1) * 100)}%</b> vs 7–8 h. Short sleep often tracks stress, apnea or shift work.</> : <>At <b>{sleep.toFixed(1)} h</b>, risk is about <b>+{Math.round((rrSleep - 1) * 100)}%</b>. Long sleep is often a sign worth checking, not a cause.</>}</>}>
        <Curve pts={sleepPts} x={sleep} setX={setSleep} xMin={4.5} xMax={10} yMin={0.9} yMax={1.4} fmtX={(v) => `${v.toFixed(1)}h`} fmtY={(v) => `${v.toFixed(2)}×`} zones={[{ from: 7, to: 8, tone: "good" }]} />
        <Slider v={Number(sleep.toFixed(1))} set={setSleep} min={4.5} max={10} step={0.1} label="Your sleep" fmt={(v) => `${v.toFixed(1)} h`} />
      </AIChartFrame>

      <AIChartFrame kicker="Five habits · tap to add" title="Life expectancy at 50, by healthy habits" source={LIFE_EXPECTANCY.src} data={{ ...LIFE_EXPECTANCY, you: { habits: HABIT_LIST.filter((_, i) => habits[i]) } }}
        insight={<>With <b>{n} of 5</b> habits, this study estimates about <b><NumberTicker value={yrsW} decimals={1} duration={600} /></b> years of life ahead at 50 for women and <b><NumberTicker value={yrsM} decimals={1} duration={600} /></b> for men. Each habit is worth roughly {per("women").toFixed(1)} years.</>}>
        <Curve pts={habitPtsW} pts2={habitPtsM} label2="Men" x={n} setX={(v) => { const k = Math.round(v); setHabits(HABIT_LIST.map((_, i) => i < k)); }} xMin={0} xMax={5} yMin={20} yMax={45} fmtX={(v) => `${Math.round(v)}`} fmtY={(v) => `${v.toFixed(0)}y`} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {HABIT_LIST.map((h, i) => (
            <button key={h} onClick={() => setHabits((x) => x.map((b, k) => (k === i ? !b : b)))} aria-pressed={habits[i]}
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ring-1 transition ${habits[i] ? "bg-ai text-on-ai ring-ai" : "bg-white text-muted ring-ink/10 hover:text-ai"}`}>{habits[i] ? "✓ " : "+ "}{h}</button>
          ))}
        </div>
      </AIChartFrame>
    </div>
  );
}
