"use client";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { TWIN_SYSTEMS, TWIN_EXAMPLE, TWIN_PATH, STATUS_WORDS } from "@/data/twin";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

/* ── Inside the app: a working replica of the Digital Twin overview (dark, like the real screen). Example values. ── */

const C = { bg: "#0a0e13", panel: "#121820", line: "rgba(255,255,255,.07)", text: "#e9eef4", dim: "#8a96a5", good: "#4ade80", warn: "#fbbf24", accent: "#38bdf8", violet: "#a78bfa" };

type Part = "score" | "recovery" | "hrv" | "monitor" | "body" | "trends";
const PARTS: Record<Part, { t: string; icon: string; what: string; from: string; use: string }> = {
  score: { t: "Health Score", icon: "gauge", what: "One 0–100 number for your overall picture right now, across sleep, heart, metabolism, labs and activity.", from: "Your lab results, clinic visits and wearable data, weighted by how recent they are.", use: "Watch the direction over weeks. Tap it in the app to see which parts pulled it up or down." },
  recovery: { t: "Recovery Score", icon: "bolt", what: "How ready your body is today — whether to push hard or take it easy.", from: "Last night's sleep, your overnight HRV and resting heart rate from your watch or ring.", use: "Plan the day: train when it is high, recover when it is low." },
  hrv: { t: "HRV status", icon: "wave", what: "Heart rate variability: the tiny gaps between heartbeats, in milliseconds. Higher usually means better recovery.", from: "Your wearable, measured overnight and compared with your own baseline.", use: "A few low days in a row is a cue to sleep, de-stress — and the care team sees it too." },
  monitor: { t: "Live Health Monitor", icon: "activity", what: "Your latest heart rate, HRV, steps and sleep, streaming in from your device.", from: "Apple Health, Health Connect, Garmin, Oura and other connected devices.", use: "Glance at today; gaps just mean the device wasn't worn." },
  body: { t: "Your body, system by system", icon: "fingerprint", what: "A model of you with each system marked Excellent, Good or Needs attention — compared with you, not with strangers.", from: "Everything above plus your BioAro lab results and clinician notes.", use: "Tap a system to see what moved and why. Biongevity SI explains; your clinician decides." },
  trends: { t: "Health Trends", icon: "chart", what: "Charts of HRV, sleep, resting heart rate and steps — daily, weekly, monthly or yearly.", from: "The same live data, stored in your BioELR record.", use: "Look for the trend, not one bad day. Share a chart with your clinician in one tap." },
};

/* body pins (viewBox 0 0 200 440) */
const PINS: Record<string, [number, number]> = { brain: [100, 26], eyes: [113, 42], lungs: [118, 118], heart: [92, 124], liver: [84, 162], gut: [104, 192], muscles: [151, 160], spine: [120, 330] };

/** Smooth a polyline into a closed bezier path (Catmull-Rom). */
function smooth(pts: [number, number][]) {
  const n = pts.length, p = (i: number) => pts[(i + n) % n];
  let d = `M${p(0)[0]},${p(0)[1]}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1), [x1, y1] = p(i), [x2, y2] = p(i + 1), [x3, y3] = p(i + 2);
    d += ` C${x1 + (x2 - x0) / 6},${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6},${y2 - (y3 - y1) / 6} ${x2},${y2}`;
  }
  return d + "Z";
}
const RIGHT: [number, number][] = [[108, 62], [111, 76], [128, 82], [146, 90], [154, 104], [157, 140], [161, 182], [166, 222], [170, 246], [165, 256], [157, 248], [151, 222], [145, 186], [139, 148], [134, 168], [131, 204], [137, 236], [137, 290], [133, 350], [129, 404], [134, 424], [114, 428], [111, 400], [109, 340], [105, 282], [100, 262]];
const BODY = smooth([...RIGHT, ...RIGHT.slice(0, -1).reverse().map(([x, y]) => [200 - x, y] as [number, number])]);

function Ring({ v, size = 92, color, label }: { v: number; size?: number; color: string; label: string }) {
  const r = size / 2 - 7, L = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={L}
          initial={{ strokeDashoffset: L }} whileInView={{ strokeDashoffset: L * (1 - v / 100) }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut" }} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="absolute text-center"><div className="text-[24px] font-semibold leading-none" style={{ color: C.text }}>{v}</div><div className="mt-1 text-[9.5px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>{label}</div></div>
    </div>
  );
}

function Spark({ data, color, h = 60 }: { data: number[]; color: string; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data), W = 260;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, h - 6 - ((v - min) / (max - min || 1)) * (h - 14)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" className="h-[60px] w-full">
      <defs><linearGradient id={`sp-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${W},${h} L0,${h} Z`} fill={`url(#sp-${color.slice(1)})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3.5 : 0} fill={color} />)}
    </svg>
  );
}

/** A tile in the dark dashboard: click it to have the explainer below tell you what it is for. */
function Tile({ part, on, set, className, children }: { part: Part; on: Part; set: (p: Part) => void; className?: string; children: React.ReactNode }) {
  return (
    <div onClick={() => set(part)}
      className={cn("relative cursor-pointer rounded-2xl p-3 text-left transition sm:p-4", className)}
      style={{ background: C.panel, boxShadow: on === part ? `0 0 0 1.5px ${C.accent}, 0 0 28px -6px ${C.accent}` : `inset 0 0 0 1px ${C.line}` }}>
      {children}
      <button type="button" onClick={(e) => { e.stopPropagation(); set(part); }} aria-label={`What is ${PARTS[part].t}?`} aria-pressed={on === part}
        className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold" style={{ background: on === part ? C.accent : "rgba(255,255,255,.08)", color: on === part ? C.bg : C.dim }}>?</button>
    </div>
  );
}

export function AppTwin() {
  const { ask } = useAI();
  const [part, setPartRaw] = useState<Part>("body");
  const explain = useRef<HTMLDivElement>(null);
  // phones: the explainer sits under the screen, so bring it into view when a new part is tapped
  const setPart = (p: Part) => {
    setPartRaw((old) => {
      if (old !== p && !matchMedia("(min-width: 1024px)").matches) setTimeout(() => explain.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
      return p;
    });
  };
  const [sys, setSys] = useState("heart");
  const [metric, setMetric] = useState<"HRV" | "Sleep" | "Resting HR" | "Steps">("HRV");
  const s = TWIN_SYSTEMS.find((x) => x.id === sys)!;
  const P = PARTS[part];
  const tone = (t: string) => (t === "attention" ? C.warn : C.good);
  const trend = useMemo(() => TWIN_EXAMPLE.trends[metric].Weekly, [metric]);
  const app = `${env.appUrl}${TWIN_PATH}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      {/* the app screen */}
      <div className="overflow-hidden rounded-[30px] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,.55)]" style={{ background: "#05070a" }}>
        <div className="overflow-hidden rounded-[24px]" style={{ background: C.bg, color: C.text }}>
          {/* app top bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
            <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></span>
            <span className="ml-2 truncate rounded-full px-3 py-1 text-[11px]" style={{ background: "rgba(255,255,255,.05)", color: C.dim }}>app.biongevity.com · Digital Twin</span>
            <span className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: "rgba(251,191,36,.14)", color: C.warn }}>Example</span>
          </div>

          <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-[1fr_1.15fr_1fr]">
            {/* left: scores + live monitor */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <Tile part="score" on={part} set={setPart} className="flex items-center gap-3">
                <Ring v={TWIN_EXAMPLE.health} color={C.accent} label="Health" size={84} />
                <div className="min-w-0 max-sm:hidden"><div className="text-[12px] font-semibold">Health Score</div><div className="text-[11px]" style={{ color: C.dim }}>Overall picture</div></div>
              </Tile>
              <Tile part="recovery" on={part} set={setPart} className="flex items-center gap-3">
                <Ring v={TWIN_EXAMPLE.recovery} color={C.good} label="Recovery" size={84} />
                <div className="min-w-0 max-sm:hidden"><div className="text-[12px] font-semibold">Recovery</div><div className="text-[11px]" style={{ color: C.dim }}>Ready today?</div></div>
              </Tile>
              <Tile part="hrv" on={part} set={setPart}>
                <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>HRV status</div>
                <div className="mt-1 text-[26px] font-semibold leading-none">{TWIN_EXAMPLE.hrv}<span className="ml-1 text-[12px] font-normal" style={{ color: C.dim }}>ms</span></div>
                <div className="mt-1 text-[11px]" style={{ color: C.warn }}>Below your baseline</div>
              </Tile>
              <Tile part="monitor" on={part} set={setPart}>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em]" style={{ color: C.dim }}><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full" style={{ background: C.good }} /><span className="relative h-2 w-2 rounded-full" style={{ background: C.good }} /></span>Live</div>
                <svg viewBox="0 0 120 30" className="mt-1 h-8 w-full overflow-hidden">
                  <path d="M0 15 H20 L24 15 L27 6 L31 25 L34 11 L37 15 H60 L64 15 L67 6 L71 25 L74 11 L77 15 H100 L104 15 L107 6 L111 25 L114 11 L117 15 H120" fill="none" stroke={C.good} strokeWidth="1.6" strokeDasharray="52" style={{ animation: "xvEcg 1.4s linear infinite" }} />
                </svg>
                <div className="mt-1 flex justify-between text-[11px]"><span><b className="text-[14px]">{TWIN_EXAMPLE.hr + 22}</b> bpm</span><span style={{ color: C.dim }}>{TWIN_EXAMPLE.steps.toLocaleString("en-CA")} steps</span></div>
              </Tile>
            </div>

            {/* centre: the body */}
            <Tile part="body" on={part} set={setPart} className="!p-2">
              <div className="flex items-center justify-between px-2 pt-1 text-[11px] uppercase tracking-[0.14em]" style={{ color: C.dim }}><span>My twin</span><span className="pr-7">Front</span></div>
              <div className="relative mx-auto aspect-[200/440] w-full max-w-[230px]">
                <svg viewBox="0 0 200 440" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="twin-skin" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#38bdf8" stopOpacity=".38" /><stop offset="1" stopColor="#a78bfa" stopOpacity=".16" /></linearGradient>
                    <pattern id="twin-grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="rgba(56,189,248,.16)" strokeWidth=".5" /></pattern>
                  </defs>
                  <ellipse cx="100" cy="434" rx="56" ry="5" fill="rgba(56,189,248,.18)" />
                  <ellipse cx="100" cy="34" rx="21" ry="26" fill="url(#twin-skin)" stroke="rgba(56,189,248,.65)" strokeWidth="1" />
                  <path d={BODY} fill="url(#twin-skin)" stroke="rgba(56,189,248,.65)" strokeWidth="1" />
                  <path d={BODY} fill="url(#twin-grid)" />
                  {/* spine + ribs hint */}
                  <path d="M100 80 V250" stroke="rgba(167,139,250,.35)" strokeWidth="1.2" strokeDasharray="3 3" />
                  {[0, 1, 2, 3].map((k) => <path key={k} d={`M${82 - k} ${104 + k * 12} Q100 ${98 + k * 12} ${118 + k} ${104 + k * 12}`} fill="none" stroke="rgba(167,139,250,.22)" strokeWidth="1" />)}
                  {/* scan line */}
                  <rect x="40" width="120" height="2" fill="rgba(56,189,248,.55)" style={{ animation: "twinScan 4.5s ease-in-out infinite" }} />
                </svg>
                {TWIN_SYSTEMS.map((x) => {
                  const [px, py] = PINS[x.id] ?? [100, 200], c = tone(x.tone), sel = sys === x.id;
                  return (
                    <span key={x.id} role="button" tabIndex={0} aria-label={`${x.label}: ${x.status}`} aria-pressed={sel}
                      onClick={(e) => { e.stopPropagation(); setSys(x.id); setPart("body"); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setSys(x.id); setPart("body"); } }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer" style={{ left: `${(px / 200) * 100}%`, top: `${(py / 440) * 100}%` }}>
                      <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: c, opacity: 0.25, animation: "haloPulse 2.2s ease-out infinite" }} />
                      <span className="relative block rounded-full" style={{ width: sel ? 14 : 10, height: sel ? 14 : 10, background: c, boxShadow: `0 0 0 2px ${C.bg}, 0 0 12px ${c}` }} />
                      {sel && <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(10,14,19,.85)", color: c, boxShadow: `inset 0 0 0 1px ${c}55` }}>{x.label}</span>}
                    </span>
                  );
                })}
              </div>
              <div className="mx-2 mb-1 mt-1 rounded-xl px-3 py-2 text-[11.5px]" style={{ background: "rgba(255,255,255,.04)" }}>
                <span className="font-semibold" style={{ color: tone(s.tone) }}>{s.label} · {s.status}</span>
                <span className="block" style={{ color: C.dim }}>{s.why}</span>
              </div>
            </Tile>

            {/* right: systems list + trends */}
            <div className="grid content-start gap-3">
              <div className="rounded-2xl p-3" style={{ background: C.panel, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>Body systems</div>
                <div className="grid grid-cols-2 gap-1">
                  {TWIN_SYSTEMS.map((x) => (
                    <button key={x.id} type="button" onClick={() => { setSys(x.id); setPart("body"); }} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[11.5px] transition"
                      style={{ background: sys === x.id ? "rgba(56,189,248,.12)" : "transparent" }}>
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: tone(x.tone) }} /><span className="truncate">{x.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Tile part="trends" on={part} set={setPart}>
                <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>Health trends · weekly</div>
                <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                  {(["HRV", "Sleep", "Resting HR", "Steps"] as const).map((m) => (
                    <span key={m} role="button" tabIndex={0} onClick={() => { setMetric(m); setPart("trends"); }} onKeyDown={(e) => { if (e.key === "Enter") { setMetric(m); setPart("trends"); } }}
                      className="cursor-pointer rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: metric === m ? C.violet : "rgba(255,255,255,.06)", color: metric === m ? C.bg : C.dim }}>{m}</span>
                  ))}
                </div>
                <div className="mt-2"><Spark data={trend} color={C.violet} /></div>
                <div className="flex justify-between text-[10px]" style={{ color: C.dim }}><span>7 wk ago</span><span>now</span></div>
              </Tile>
            </div>
          </div>
        </div>
      </div>

      {/* the explainer: what this part is, where it comes from, what you do with it */}
      <div ref={explain} className="scroll-mb-28 lg:sticky lg:top-28">
        <AnimatePresence mode="wait">
          <motion.div key={part} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}
            className="rounded-[26px] bg-white/80 p-5 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl">
            <div className="flex items-center gap-3"><span className="icon-tile h-11 w-11"><Icon name={P.icon} size={20} /></span><div><div className="hud-label">You tapped</div><div className="text-[18px] font-semibold leading-tight">{P.t}</div></div></div>
            <dl className="mt-4 space-y-3 text-[13.5px] leading-relaxed">
              <div><dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">What it is</dt><dd className="text-ink/85">{P.what}</dd></div>
              <div><dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Where it comes from</dt><dd className="text-muted">{P.from}</dd></div>
              <div><dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">What you do with it</dt><dd className="text-muted">{P.use}</dd></div>
            </dl>
            {part === "body" && (
              <div className="mt-4 space-y-1.5 border-t border-ink/[0.06] pt-3">
                {STATUS_WORDS.map((w) => <div key={w.t} className="flex gap-2 text-[12px]"><span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: w.tone === "attention" ? C.warn : C.good }} /><span><b className="font-semibold">{w.t}</b> <span className="text-muted">— {w.d}</span></span></div>)}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => ask(`In the Biongevity app's Digital Twin, explain "${P.t}" in plain words: what it shows, where the data comes from and what I should do with it.`, { label: `✦ ${P.t}` })} className="btn-ai h-10 px-4 text-[13px]"><XevyoOrb size={18} />Ask SI</button>
              <a href={app} target="_blank" rel="noopener" className="btn-light h-10 px-4 text-[13px]">Open the real app<Icon name="arrow-up-right" size={13} /></a>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 px-1 text-[11.5px] text-faint">Tap any part of the screen. Values are examples shaped like the real app; your own twin uses your data. Not a diagnosis.</p>
      </div>
    </div>
  );
}
