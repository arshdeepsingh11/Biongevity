"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TOUR, TWIN_SYSTEMS, TWIN_EXAMPLE, STATUS_WORDS, TWIN_PATH } from "@/data/twin";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BodyHologram } from "@/components/body/BodyHologram";
import { LineChart } from "@/components/charts/Charts";
import { Sparkline } from "@/components/charts/AICharts";
import { env } from "@/lib/env";

const TWIN_URL = `${env.appUrl}${TWIN_PATH}`;

/**
 * Digital Twin guided tour — a 360° 3D twin on the left, a six-step tour on the right.
 * Each step shows a working preview of the matching part of the app (example data) and explains it in plain words.
 */
export function TwinTour() {
  const { ask } = useAI();
  const [i, setI] = useState(0);
  const [sys, setSys] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);
  const step = TOUR[i];
  useEffect(() => { if (!auto) return; const t = setTimeout(() => setI((x) => (x + 1) % TOUR.length), 9000); return () => clearTimeout(t); }, [auto, i]);
  const go = (n: number) => { setAuto(false); setI(n); };
  const s = TWIN_SYSTEMS.find((x) => x.id === sys);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* 3D twin */}
      <div className="relative overflow-hidden rounded-[34px] bg-white ring-1 ring-ink/[0.07]">
        <div className="absolute left-4 top-4 z-[4] flex items-center gap-2 rounded-full bg-white/80 py-1 pl-1 pr-3 text-[12px] font-semibold ring-1 ring-ink/[0.06] backdrop-blur-md"><XevyoOrb size={24} live />Your twin · <span className="text-gold-deep">Example</span></div>
        <BodyHologram height={680} selected={sys ?? (step.id === "body" ? "heart" : null)} onSelect={(id) => { setSys(id); setAuto(false); }}
          hotspots={TWIN_SYSTEMS.map((x) => ({ id: x.id, label: x.label, status: x.status, tone: x.tone }))} />
        <AnimatePresence>
          {s && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute inset-x-4 bottom-16 z-[4] rounded-2xl bg-white/90 p-4 shadow-lift ring-1 ring-ink/[0.06] backdrop-blur-xl">
              <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${s.tone === "good" ? "bg-teal" : "bg-ai-2"}`} /><b className="text-[15px]">{s.label}</b><span className="text-[12.5px] text-muted">· {s.status}</span><button onClick={() => setSys(null)} className="ml-auto text-faint" aria-label="Close"><Icon name="x" size={14} /></button></div>
              <p className="mt-1 text-[13px] text-muted">{s.why}</p>
              <button onClick={() => ask(`In my Biongevity digital twin, ${s.label} shows "${s.status}". What does that status mean and what could I do?`, { label: `✦ What does “${s.status}” mean for ${s.label}?` })} className="mt-2 text-[12.5px] font-semibold text-ai">✦ Ask Xevyo what this means</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* tour */}
      <div className="flex flex-col gap-4">
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {TOUR.map((t, k) => (
            <button key={t.id} onClick={() => go(k)} aria-current={k === i ? "step" : undefined}
              className={`relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full py-1.5 pl-1.5 pr-3.5 text-[12.5px] font-semibold ring-1 transition ${k === i ? "bg-ink text-pearl ring-ink" : "bg-white ring-ink/[0.07] hover:ring-ai/40"}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[10.5px] ${k === i ? "bg-ai text-on-ai" : "bg-canvas text-muted"}`}>{t.n}</span>{t.s}
              {k === i && auto && <motion.span key={`p${i}`} className="absolute bottom-0 left-0 h-[2px] bg-ai-2" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 9, ease: "linear" }} />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.28 }} className="flex flex-col gap-4">
            <div className="rounded-[28px] bg-white p-6 ring-1 ring-ink/[0.07]">
              <div className="flex items-center gap-3"><span className="icon-tile h-12 w-12"><Icon name={step.icon} size={22} /></span><div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Step {step.n} · {step.where}</div><div className="text-[24px] font-semibold leading-tight tracking-tight">{step.t}</div></div></div>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/85">{step.plain}</p>
              <ul className="mt-3 grid gap-1.5">{step.points.map((p) => <li key={p} className="flex gap-2 text-[13.5px] text-muted"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-teal" />{p}</li>)}</ul>
            </div>
            <Preview id={step.id} onSystem={(id) => { setSys(id); setAuto(false); }} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <button onClick={() => go((i + TOUR.length - 1) % TOUR.length)} className="btn-light h-11 px-4"><Icon name="chevron-left" size={16} />Back</button>
          <button onClick={() => go((i + 1) % TOUR.length)} className="btn-light h-11 px-4">Next<Icon name="chevron-right" size={16} /></button>
          <a href={TWIN_URL} className="btn-ai ml-auto h-11 px-5"><Icon name="fingerprint" size={17} />Open my Digital Twin<Icon name="arrow-up-right" size={14} /></a>
        </div>
      </div>
    </div>
  );
}

/** A working preview of each part of the app screen (example data). */
function Preview({ id, onSystem }: { id: string; onSystem: (id: string) => void }) {
  const [metric, setMetric] = useState("HRV");
  const [range, setRange] = useState("Weekly");
  const [extraSleep, setExtraSleep] = useState(1);
  const E = TWIN_EXAMPLE;
  const card = "rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]";
  if (id === "scores") return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Ring label="Health Score" v={E.health} word="Low" tone="attention" />
      <Ring label="Recovery Score" v={E.recovery} word="Fair" tone="mid" />
      <div className={`${card} flex flex-col justify-between`}><div className="text-[13px] font-semibold text-muted">HRV Status</div><div className="text-[40px] font-semibold leading-none tracking-tight">{E.hrv}<span className="ml-1 text-[14px] text-muted">ms</span></div><Sparkline values={[48, 44, 40, 31, 22, 15, 10]} width={140} height={30} color="rgb(var(--c-ai-2))" /><div className="text-[11px] text-gold-deep">Example</div></div>
    </div>
  );
  if (id === "monitor") return (
    <div className={card}>
      <div className="flex items-center justify-between"><b className="text-[16px]">Live Health Monitor</b><span className="flex items-center gap-1.5 text-[11px] font-semibold text-teal"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-teal" />Live · Example</span></div>
      <div className="mt-3 divide-y divide-ink/[0.06]">
        {[["heart-plain", "Heart rate", `${E.hr} bpm`, [44, 42, 41, 43, 40, 40]], ["wave", "HRV", `${E.hrv} ms`, [30, 22, 18, 14, 12, 10]], ["steps", "Steps", E.steps.toLocaleString(), [1200, 2400, 3100, 4600, 5200, 6703]], ["moon", "Sleep", "6 h 12 m", [7, 6.6, 6.2, 6.4, 6.0, 6.2]]].map(([ic, l, v, s]) => (
          <div key={l as string} className="flex items-center gap-3 py-2.5"><span className="icon-tile h-10 w-10"><Icon name={ic as string} size={18} /></span><div className="flex-1"><div className="text-[12.5px] text-muted">{l as string}</div><div className="text-[18px] font-semibold">{v as string}</div></div><Sparkline values={s as number[]} width={110} height={30} /></div>
        ))}
      </div>
    </div>
  );
  if (id === "body") return (
    <div className={card}>
      <div className="grid grid-cols-2 gap-2">{TWIN_SYSTEMS.map((x) => <button key={x.id} onClick={() => onSystem(x.id)} className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-left hover:ring-1 hover:ring-ai/30"><span className={`h-2 w-2 rounded-full ${x.tone === "good" ? "bg-teal" : "bg-ai-2"}`} /><span className="flex-1 text-[13px] font-semibold">{x.label}</span><span className={`text-[11px] ${x.tone === "good" ? "text-teal" : "text-ai"}`}>{x.status}</span></button>)}</div>
      <div className="mt-3 grid gap-1.5">{STATUS_WORDS.map((w) => <div key={w.t} className="text-[12.5px] text-muted"><b className={w.tone === "good" ? "text-teal" : "text-ai"}>{w.t}</b> — {w.d}</div>)}</div>
    </div>
  );
  if (id === "trends") {
    const vals = E.trends[metric][range], labels = vals.map((_, k) => (range === "Daily" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][k] : range === "Weekly" ? `W${k + 1}` : range === "Monthly" ? `M${k + 1}` : `${2023 + k}`));
    const first = vals[0], last = vals[vals.length - 1], dir = last > first ? "up" : "down";
    return (
      <div className={card}>
        <div className="flex flex-wrap gap-1.5">{Object.keys(E.trends).map((m) => <button key={m} onClick={() => setMetric(m)} className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${metric === m ? "bg-ink text-pearl" : "bg-canvas text-muted"}`}>{m}</button>)}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">{["Daily", "Weekly", "Monthly", "Yearly"].map((r) => <button key={r} onClick={() => setRange(r)} className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${range === r ? "bg-ai-soft text-ai" : "text-muted"}`}>{r}</button>)}<span className="ml-auto text-[11px] text-gold-deep">Example</span></div>
        <LineChart key={metric + range} labels={labels} series={[{ name: metric, values: vals }]} height={180} />
        <div className="mt-2 rounded-xl bg-ai-soft/60 px-3 py-2 text-[12.5px]"><b className="text-ai">✦ AI read · </b>{metric} is trending {dir} ({first} → {last}). Look at the direction over weeks — one day rarely matters.</div>
      </div>
    );
  }
  if (id === "simulate") {
    const rec = Math.min(95, Math.round(E.recovery + extraSleep * 7)), hrv = Math.round(E.hrv + extraSleep * 6);
    return (
      <div className={card}>
        <div className="flex items-baseline justify-between"><b className="text-[16px]">What if I sleep more?</b><span className="text-[11px] text-gold-deep">Illustrative</span></div>
        <input type="range" min={0} max={2} step={0.5} value={extraSleep} onChange={(e) => setExtraSleep(+e.target.value)} className="mt-3 w-full accent-[rgb(var(--c-ai))]" aria-label="Extra sleep" />
        <div className="text-[12.5px] text-muted">+{extraSleep} h a night for 2 weeks</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-canvas p-3"><div className="text-[12px] text-muted">Recovery Score</div><div className="text-[28px] font-semibold">{E.recovery} → <span className="text-ai-grad">{rec}</span></div></div>
          <div className="rounded-2xl bg-canvas p-3"><div className="text-[12px] text-muted">HRV</div><div className="text-[28px] font-semibold">{E.hrv} → <span className="text-ai-grad">{hrv}</span> <span className="text-[13px] text-muted">ms</span></div></div>
        </div>
        <p className="mt-2 text-[12px] text-muted">The heat map lights Brain and Heart — the systems sleep touches most. In the app, simulations use your own data and say how confident they are.</p>
      </div>
    );
  }
  return (
    <div className={card}>
      <div className="flex items-center gap-2"><XevyoOrb size={28} live /><b className="text-[16px]">AI Insight</b><span className="ml-auto rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-semibold text-ai">New</span></div>
      <p className="mt-2 text-[15px] leading-relaxed">Your sleep duration is below recommended levels — aim for 7–9 hours. Your HRV dropped on the nights you slept under 6 hours.</p>
      <div className="mt-3 rounded-2xl bg-canvas p-3 text-[13px]"><b>Small next step:</b> lights out 30 minutes earlier on weeknights for 2 weeks. Xevyo will check in.</div>
      <div className="mt-3 flex gap-2"><span className="rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-pearl">Chat with Coach</span><span className="rounded-full bg-canvas px-3 py-1.5 text-[12.5px] font-semibold text-muted">English · 日本語</span></div>
    </div>
  );
}

function Ring({ label, v, word, tone }: { label: string; v: number; word: string; tone: "attention" | "mid" }) {
  const c = 2 * Math.PI * 30;
  return (
    <div className="flex items-center justify-between rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]">
      <div><div className="text-[13px] font-semibold text-muted">{label}</div><div className="mt-1 text-[40px] font-semibold leading-none tracking-tight">{v}<span className="text-[14px] text-muted">/100</span></div><div className="mt-2 text-[11px] text-gold-deep">Example</div></div>
      <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90"><circle cx="36" cy="36" r="30" fill="none" stroke="rgb(var(--c-ink))" strokeOpacity=".08" strokeWidth="6" /><circle cx="36" cy="36" r="30" fill="none" stroke={tone === "attention" ? "rgb(var(--c-danger))" : "rgb(var(--c-ai-2))"} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`} />
        <text x="36" y="40" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgb(var(--c-ink))" transform="rotate(90 36 36)">{word}</text></svg>
    </div>
  );
}
