"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS, scoreQuiz, type Answers } from "@/lib/quiz";
import { buyUrl, bundleUrl, storeHost } from "@/lib/commerce";
import { formatMoney } from "@/lib/utils";
import { deptById } from "@/data/health";
import { Icon } from "@/components/ui/Icon";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { fireConfetti } from "@/components/fx/Confetti";
import { DotPattern } from "@/components/fx/DotPattern";
import { BarList, Radar } from "@/components/charts/Charts";
import { useAI } from "@/components/ai/AIProvider";

const COLS: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4", 5: "grid-cols-2 sm:grid-cols-5", 6: "grid-cols-2 sm:grid-cols-3" };

/** Find-my-match quiz — 8 short steps, scored on the device, results with charts and electric-bordered top picks. */
export function LongevityQuiz() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const q = QUESTIONS[step];
  const sel = a[q?.id] ?? [];
  const result = useMemo(() => (done ? scoreQuiz(a) : null), [done, a]);

  const pick = (id: string) => {
    if (!q.multi) { setA({ ...a, [q.id]: [id] }); setTimeout(() => next(), 220); return; }
    let s = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel.filter((x) => x !== "none"), id];
    if (id === "none") s = sel.includes("none") ? [] : ["none"];
    if (q.max && s.length > q.max) return;
    setA({ ...a, [q.id]: s });
  };
  const next = () => setStep((s) => { if (s >= QUESTIONS.length - 1) { setDone(true); setTimeout(() => fireConfetti({ x: 0.5, y: 0.35 }), 300); return s; } return s + 1; });
  const restart = () => { setA({}); setStep(0); setDone(false); };

  if (result) return <Results r={result} restart={restart} />;

  const pct = (step / QUESTIONS.length) * 100;
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-8">
      <DotPattern />
      <div className="relative">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-accent">Step {step + 1} of {QUESTIONS.length}</span>
          <span className="flex items-center gap-1.5 text-faint"><Icon name="lock" size={13} />Scored on your device · nothing is sent</span>
        </div>
        <div className="mt-3 flex gap-1">{QUESTIONS.map((_, i) => <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"><span className="block h-full rounded-full bg-iri-x transition-all duration-500" style={{ width: i < step ? "100%" : i === step ? "35%" : "0%" }} /></span>)}</div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <h3 className="mt-6 text-[24px] font-semibold tracking-tight sm:text-[30px]">{q.title}</h3>
            {q.hint && <p className="mt-1 text-[14px] text-muted">{q.hint}</p>}
            <div className={`mt-6 grid gap-2.5 ${COLS[Math.min(6, q.options.length)]}`}>
              {q.options.map((o) => {
                const on = sel.includes(o.id);
                return (
                  <button key={o.id} onClick={() => pick(o.id)} aria-pressed={on}
                    className={`group flex min-h-[64px] items-center gap-3 rounded-2xl p-3 text-left text-[14px] font-medium transition-all duration-200 sm:flex-col sm:items-start sm:p-4 ${on ? "bg-navy text-white shadow-lift" : "bg-canvas hover:-translate-y-0.5 hover:bg-white hover:shadow-card hover:ring-1 hover:ring-accent/25"}`}>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${on ? "bg-white/15 text-white" : "bg-white text-accent"}`}><Icon name={o.icon} size={18} /></span>
                    <span className="leading-snug">{o.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={!step} className="btn-light h-11 disabled:opacity-40"><Icon name="chevron-left" size={15} />Back</button>
          <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-ink/[0.07] sm:block"><div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} /></div>
          {q.multi ? <button onClick={next} disabled={!sel.length} className="btn-dark h-11 disabled:opacity-40">{step === QUESTIONS.length - 1 ? "See my match" : "Continue"}<Icon name="arrow-right" size={15} /></button>
            : <span className="text-[12px] text-faint">Tap an answer</span>}
        </div>
      </div>
    </div>
  );
}

function Results({ r, restart }: { r: ReturnType<typeof scoreQuiz>; restart: () => void }) {
  const { ask } = useAI();
  const dept = deptById(r.dept);
  const bundle = bundleUrl([...r.tests.map((t) => t.p.handle), ...r.formulas.map((f) => f.p.handle)]);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative overflow-hidden rounded-[28px] bg-navy p-6 text-white shadow-lift sm:p-8">
          <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="relative">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-teal-soft">Your longevity match</div>
            <div className="mt-4 flex items-center gap-5">
              <ProgressRing value={r.confidence} size={118} label="Match" dark />
              <div>
                <div className="text-[13px] text-white/60">Focus areas</div>
                <div className="mt-1 flex flex-wrap gap-1.5">{r.top.map((d, i) => <span key={d} className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${i ? "bg-white/10" : "bg-teal text-white"}`}>{d}</span>)}</div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-white/65">Match strength shows how clearly your answers point to these picks. It is not a medical probability or a diagnosis.</p>
            <div className="mt-5 rounded-2xl bg-white/5 p-4"><BarList data={r.scores.slice(0, 5).map((s) => ({ label: s.d, value: s.pct }))} unit="%" max={100} dark /></div>
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
          <div className="text-[13px] font-semibold">Domain profile</div>
          <Radar axes={r.scores.map((s) => s.d.replace("Inflammation & ageing", "Inflammation").replace("Brain & sleep", "Brain/sleep"))} series={[{ name: "Your answers", values: r.scores.map((s) => Math.max(0.08, s.pct / 100)) }]} size={300} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-canvas p-3">
            <span className="flex items-center gap-2 text-[14px]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white"><Icon name={dept.icon} size={16} /></span>Suggested department: <b>{dept.short}</b></span>
            <Link href={`/precision-health/${dept.id}/`} className="text-[13px] font-semibold text-accent">Open →</Link>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between"><h4 className="text-[20px] font-semibold tracking-tight">Tests to measure it</h4><span className="text-[12px] text-faint">BioAro Labs</span></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {r.tests.map((t, i) => <PickCard key={t.p.handle} p={t.p} why={t.why} top={i === 0} badge={i === 0 ? "Best first test" : undefined} />)}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-3 flex items-end justify-between"><h4 className="text-[20px] font-semibold tracking-tight">Formulas to support it</h4><span className="text-[12px] text-faint">BioAro Drugs</span></div>
          <div className="grid gap-4 sm:grid-cols-2">{r.formulas.map((f, i) => <PickCard key={f.p.handle} p={f.p} why={f.why} top={i === 0} color="#5E7F62" />)}</div>
        </div>
        <div>
          <div className="mb-3 flex items-end justify-between"><h4 className="text-[20px] font-semibold tracking-tight">Program</h4><span className="text-[12px] text-faint">Biongevity</span></div>
          <ElectricBorder color="#C2A16A" radius={24}>
            <a href={buyUrl(r.pkg)} target="_blank" rel="noopener" className="block rounded-3xl bg-white p-6 ring-1 ring-ink/[0.06]">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-gold-deep"><Icon name="crown" size={14} />Recommended program</div>
              <div className="mt-2 text-[24px] font-semibold tracking-tight">{r.pkg.name}</div>
              <div className="mt-1 text-[32px] font-semibold tracking-tight">{formatMoney(r.pkg.price)}</div>
              <ul className="mt-3 space-y-1.5 text-[13px] text-muted">{r.pkg.diagnostics.slice(0, 4).map((d) => <li key={d} className="flex gap-2"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-teal" />{d}</li>)}</ul>
              <div className="mt-4 flex items-center justify-between border-t border-ink/[0.06] pt-3 text-[13px] font-semibold"><span className="text-faint">{storeHost(buyUrl(r.pkg))}</span><span className="text-accent">Choose program ↗</span></div>
            </a>
          </ElectricBorder>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-canvas p-4">
        <Icon name="info" size={16} className="text-accent" />
        <span className="flex-1 text-[13px] text-muted">Educational guidance only. A Biongevity clinician reviews results and confirms what is right for you.</span>
        {bundle && <a href={bundle} className="btn-dark h-10 text-[14px]"><Icon name="cart" size={15} />Add all to cart</a>}
        <button onClick={() => ask(`My longevity match focus areas are ${r.top.join(", ")}. Explain what the suggested tests measure and how to prepare.`)} className="btn-light h-10 text-[14px]"><Icon name="bot" size={15} />Ask Xevyo</button>
        <button onClick={restart} className="btn-light h-10 text-[14px]"><Icon name="reset" size={15} />Retake</button>
      </div>
    </motion.div>
  );
}

function PickCard({ p, why, top, badge, color = "#97703F" }: { p: import("@/data/types").CatalogProduct; why: string; top?: boolean; badge?: string; color?: string }) {
  const href = buyUrl(p);
  const card = (
    <a href={href} target="_blank" rel="noopener" className="group flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-ink/[0.06] transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, #8A6A3A, ${color})` }}><Icon name={p.icon} size={20} /></span>
        <span className="text-[16px] font-semibold tabular-nums">{formatMoney(p.price, p.currency)}</span>
      </div>
      {badge && <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-semibold text-accent"><Icon name="star" size={11} />{badge}</span>}
      <div className="mt-2 text-[16px] font-semibold leading-snug">{p.title}</div>
      <div className="mt-1 line-clamp-2 text-[13px] text-muted">{p.bestFor ?? p.summary}</div>
      <div className="mt-2 text-[12px] text-ink/70"><span className="font-semibold text-accent">Why: </span>{why}</div>
      <div className="flex-1" />
      <div className="mt-3 flex items-center justify-between border-t border-ink/[0.06] pt-3 text-[12px]"><span className="text-faint">{storeHost(href)}</span><span className="font-semibold group-hover:text-accent">View & buy ↗</span></div>
    </a>
  );
  return top ? <ElectricBorder color={color} radius={24} className="h-full">{card}</ElectricBorder> : card;
}
