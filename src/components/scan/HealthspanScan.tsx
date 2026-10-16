"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS, EMPTY_ANSWERS, answered, runScan, type Answers } from "@/lib/scan";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { ScanResults } from "./ScanResults";

/**
 * AI Healthspan Scan — 12 one-tap questions, then an on-device profile with charts,
 * a ranked BioAro Labs test plan (buy on bioarolabs.com), formulas (buy on bioarodrugs.com) and a re-test timeline.
 * Answers stay in this browser tab. Biongevity SI is called only if you press "Explain my scan".
 */
export function HealthspanScan() {
  const [a, setA] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"ask" | "think" | "done">("ask");
  const q = QUESTIONS[step];
  const result = useMemo(() => (phase === "done" ? runScan(a) : null), [phase, a]);

  useEffect(() => { if (phase !== "think") return; const t = setTimeout(() => setPhase("done"), 1400); return () => clearTimeout(t); }, [phase]);

  const pick = (v: string) => {
    if (q.multi) {
      const cur = a[q.id] as string[];
      const next = v === "none" ? ["none"] : cur.includes(v) ? cur.filter((x) => x !== v) : [...cur.filter((x) => x !== "none"), v].slice(-(q.id === "goals" ? 3 : 5));
      setA({ ...a, [q.id]: next });
    } else {
      setA({ ...a, [q.id]: v });
      setTimeout(() => (step < QUESTIONS.length - 1 ? setStep(step + 1) : setPhase("think")), 180);
    }
  };
  const next = () => (step < QUESTIONS.length - 1 ? setStep(step + 1) : setPhase("think"));
  const restart = () => { setA(EMPTY_ANSWERS); setStep(0); setPhase("ask"); scrollTo({ top: 0, behavior: "smooth" }); };

  if (phase === "done" && result) return <ScanResults a={a} r={result} onRestart={restart} />;

  return (
    <div className="relative mx-auto max-w-[760px] overflow-hidden rounded-[32px] bg-white p-5 shadow-lift ai-ring sm:p-8">
      <div aria-hidden className="ai-glow -right-20 -top-24 h-72 w-72" />
      <div className="relative flex items-center gap-3">
        <XevyoOrb size={44} live halo={phase === "think"} />
        <div className="flex-1">
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ai">AI Healthspan Scan</div>
          <div className="text-[13px] text-muted">{phase === "think" ? "Reading your answers on your device…" : `Question ${step + 1} of ${QUESTIONS.length} · about 2 minutes`}</div>
        </div>
        <AIBadge label="On-device" className="hidden sm:inline-flex" />
      </div>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
        <motion.div className="h-full rounded-full bg-ai bg-ai-grad" animate={{ width: `${((phase === "think" ? QUESTIONS.length : step) / QUESTIONS.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        {phase === "think" ? (
          <motion.div key="think" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative grid min-h-[300px] place-items-center text-center">
            <div>
              <XevyoOrb size={96} live halo className="mx-auto" />
              <div className="mt-5 text-[20px] font-semibold tracking-tight">Building your healthspan snapshot</div>
              <ul className="mt-3 space-y-1 text-[13.5px] text-muted">
                {["Scoring 9 health domains", "Matching 47 BioAro Labs tests", "Planning your re-tests"].map((t, i) => (
                  <motion.li key={t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.3 }}><span className="text-ai">✦</span> {t}</motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="relative min-h-[300px] pt-7">
            <h2 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-[32px]">{q.q}</h2>
            {q.help && <p className="mt-1.5 text-[14px] text-muted">{q.help}</p>}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {q.options.map((o) => {
                const on = q.multi ? (a[q.id] as string[]).includes(o.v) : a[q.id] === o.v;
                return (
                  <button key={o.v} onClick={() => pick(o.v)} aria-pressed={on}
                    className={`inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-[15px] font-medium ring-1 transition ${on ? "bg-ai text-on-ai ring-ai shadow-ai" : "bg-canvas ring-ink/[0.08] hover:bg-white hover:ring-ai/40"}`}>
                    {on && <Icon name="check" size={15} />}{o.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "ask" && (
        <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-ink/[0.06] pt-4">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={!step} className="inline-flex items-center gap-1 text-[14px] font-semibold text-muted hover:text-ink disabled:opacity-30"><Icon name="chevron-left" size={16} />Back</button>
          <p className="hidden text-[11.5px] text-faint sm:block">Answers stay in this tab. Educational, not a diagnosis.</p>
          <button onClick={next} className="btn-ai h-11 px-5">{step === QUESTIONS.length - 1 ? "See my results" : answered(a, q) ? "Next" : "Skip"}<Icon name="arrow-right" size={16} /></button>
        </div>
      )}
    </div>
  );
}

/** Small entry card used on the home page and elsewhere. */
export function ScanTeaser({ className }: { className?: string }) {
  const { ask } = useAI();
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-white p-6 ai-ring ${className ?? ""}`}>
      <div aria-hidden className="ai-glow -right-12 -top-12 h-48 w-48" />
      <div className="relative flex items-center gap-3"><XevyoOrb size={48} live halo /><AIBadge label="2-minute scan" /></div>
      <div className="relative mt-4 text-[24px] font-semibold leading-tight tracking-tight">Where should <span className="text-ai-grad">your healthspan</span> start?</div>
      <p className="relative mt-2 text-[14.5px] text-muted">12 one-tap questions. A radar of 9 health domains, the BioAro Labs tests that fit you, and a 12-month re-test plan.</p>
      <div className="relative mt-5 flex flex-wrap gap-2">
        <Link href="/scan/" className="btn-ai h-11 px-5">Start the AI scan<Icon name="arrow-right" size={16} /></Link>
        <button onClick={() => ask("What does the Biongevity AI Healthspan Scan measure, and how should I use the results?", { label: "✦ What does the scan measure?" })} className="btn-light h-11 px-5">What does it measure?</button>
      </div>
      <div className="relative mt-6 grid grid-cols-3 gap-2">
        {[["radar", "9-domain radar"], ["test-tubes", "Ranked BioAro tests"], ["calendar", "Re-test timeline"]].map(([i, t]) => (
          <div key={t} className="rounded-2xl bg-ai-soft/60 p-3 text-center"><Icon name={i} size={20} className="mx-auto text-ai" /><div className="mt-1.5 text-[12px] font-semibold leading-tight">{t}</div></div>
        ))}
      </div>
    </div>
  );
}
