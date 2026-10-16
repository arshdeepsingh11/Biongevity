"use client";
import Link from "next/link";
import type { Answers, ScanResult } from "@/lib/scan";
import { RETEST_LABEL } from "@/lib/testIntel";
import { STEPS_RISK, LIFE_EXPECTANCY, BP_RISK } from "@/data/intelligence";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { Radar, Columns, LineChart } from "@/components/charts/Charts";
import { AIChartFrame, ScoreMeter, Timeline } from "@/components/charts/AICharts";
import { BuyButton, StoreNote } from "@/components/commerce/BuyButton";
import { EvidencePill } from "@/components/labs/EvidencePill";

/** Results of the AI Healthspan Scan — charts, priorities, test plan, formulas and care. */
export function ScanResults({ a, r, onRestart }: { a: Answers; r: ScanResult; onRestart: () => void }) {
  const { ask } = useAI();
  const overall = Math.round(r.domains.reduce((s, d) => s + d.score, 0) / r.domains.length);
  const sorted = [...r.domains].sort((x, y) => y.score - x.score);
  const best = sorted[0], low = sorted[sorted.length - 1];
  const summary = {
    age: a.age, sex: a.sex, goals: a.goals, domains: r.domains.map((d) => `${d.label} ${d.score} (${d.lo}-${d.hi})`), habits: `${r.habits.count}/5`,
    priorities: r.priorities, tests: r.tests.map((t) => `${t.t.title} (match ${t.match})`), formulas: r.formulas.map((f) => f.title), program: r.program.name,
  };
  const explain = () => ask("Explain my AI Healthspan Scan in plain words: my strongest and weakest domains, what my top 3 priorities mean, and why these tests were suggested. Keep it encouraging and practical. Not a diagnosis.", {
    label: "✦ Explain my scan", grounding: `Scan summary (educational, on-device): ${JSON.stringify(summary)}`, retrieve: false,
  });
  const plan = [`AI Healthspan Scan plan`, `Program: ${r.program.name}`, ...r.tests.map((t) => `Test: ${t.t.title}`), ...r.formulas.map((f) => `Formula: ${f.title}`)].join("\n");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-lift ai-ring sm:p-8">
        <div aria-hidden className="ai-glow -left-16 -top-24 h-80 w-80" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <div className="relative mx-auto grid h-48 w-48 place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90"><circle cx="60" cy="60" r="52" fill="none" stroke="rgb(var(--c-ink))" strokeOpacity=".07" strokeWidth="9" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(var(--c-ai))" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(overall / 100) * 326.7} 326.7`} style={{ transition: "stroke-dasharray 1.2s" }} /></svg>
            <div className="text-center"><XevyoOrb size={34} className="mx-auto" /><div className="mt-1 text-[44px] font-semibold leading-none tracking-tight tabular-nums">{overall}</div><div className="text-[11.5px] text-muted">healthspan habits score</div></div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2"><AIBadge label="Your snapshot" /><span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-gold-deep">Educational estimate</span></div>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-tight sm:text-[38px]">Strongest: <span className="text-ai-grad">{best.label}</span>. Focus: {low.label}.</h2>
            <ul className="mt-4 space-y-2">
              {r.priorities.map((p, i) => <li key={i} className="flex gap-2.5 text-[15px]"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ai text-[12px] font-bold text-on-ai">{i + 1}</span>{p}</li>)}
              {!r.priorities.length && <li className="text-[15px] text-muted">No urgent lifestyle priorities from your answers — a baseline test is the best next step.</li>}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={explain} className="btn-ai h-11 px-5"><XevyoOrb size={22} />Explain my scan</button>
              <Link href={`/contact/?interest=${encodeURIComponent("Not sure yet")}&plan=${encodeURIComponent(plan)}`} className="btn-dark h-11 px-5">Review with a clinician</Link>
              <button onClick={onRestart} className="btn-light h-11 px-5"><Icon name="reset" size={15} />Retake</button>
            </div>
          </div>
        </div>
      </div>

      {/* Domains */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <AIChartFrame kicker="9 domains" title="Your healthspan radar" illustrative data={r.domains}
          insight={<>Strongest domain: <b>{best.label}</b> ({best.score}). Most room to grow: <b>{low.label}</b> ({low.score}). Ranges widen when we don&apos;t know a value (e.g. blood pressure).</>}>
          <Radar axes={r.domains.map((d) => d.label.replace(" & recovery", "").replace("Physical function", "Function"))} series={[{ name: "You", values: r.domains.map((d) => d.score / 100) }, { name: "Reference (all habits in place)", values: r.domains.map(() => 0.85) }]} size={300} />
        </AIChartFrame>
        <AIChartFrame kicker="With uncertainty" title="Domain scores and ranges" data={r.domains} insight="Scores come from your lifestyle answers, not lab values. Your real domain scores are built in the Biongevity app from tests and wearables.">
          <div className="space-y-3.5">{r.domains.map((d) => <ScoreMeter key={d.label} value={d.score} lo={d.lo} hi={d.hi} label={d.label} />)}</div>
        </AIChartFrame>
      </div>

      {/* Evidence charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AIChartFrame kicker="Five low-risk habits" title={`You have ${r.habits.count} of 5`} source={LIFE_EXPECTANCY.src} data={r.lifeExp}
          insight={<>In this study, each extra habit added about {((LIFE_EXPECTANCY.women.five - LIFE_EXPECTANCY.women.zero) / 5).toFixed(1)} years of life expectancy at age 50. A population average, not a personal prediction.</>}>
          <Columns data={r.lifeExp.map((x) => ({ label: `${x.n}`, value: x.years }))} unit=" yrs" height={150} highlight={`${r.habits.count}`} />
          <div className="mt-3 flex flex-wrap gap-1.5">{r.habits.list.map((h) => <span key={h.t} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${h.ok ? "bg-teal-light text-teal" : h.ok === null ? "bg-canvas text-faint" : "bg-warn/10 text-warn"}`}>{h.ok ? "✓" : h.ok === null ? "?" : "·"} {h.t}</span>)}</div>
        </AIChartFrame>
        <AIChartFrame kicker="Daily steps" title="Mortality risk by steps" source={STEPS_RISK.src} data={STEPS_RISK.bands}
          insight={<>Your band: relative risk <b>{r.stepsRR.toFixed(2)}</b> vs. the least active group. The steepest gains come from the first few thousand extra steps.</>}>
          <LineChart labels={STEPS_RISK.bands.map((b) => `${(b.steps / 1000).toFixed(1)}k`)} series={[{ name: "Relative risk", values: STEPS_RISK.bands.map((b) => b.rr) }]} height={170} min={0.4} max={1.05} />
        </AIChartFrame>
        <AIChartFrame kicker="Blood pressure" title="Risk doubles every +20 mmHg" source={BP_RISK.src} data={{ ref: BP_RISK.ref, yours: r.bpRR }}
          insight={r.bpRR === null ? <>You don&apos;t know your number yet — a 7-day home reading is the single most useful thing to add.</> : <>At your band, cardiovascular risk is about <b>{r.bpRR.toFixed(1)}×</b> the 115 mmHg reference (ages 40–69).</>}>
          <LineChart labels={["115", "125", "135", "145", "155"]} series={[{ name: "Relative risk", values: [1, 1.41, 2, 2.83, 4] }]} height={170} refLine={r.bpRR ? { value: r.bpRR, label: "You" } : undefined} />
        </AIChartFrame>
      </div>
      <p className="text-center text-[12px] text-muted">{r.sleepNote}</p>

      {/* Test plan */}
      <div className="rounded-[28px] bg-canvas p-5 sm:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Ranked for you · BioAro Labs</div><div className="text-[24px] font-semibold tracking-tight">Your baseline tests</div></div>
          <div className="text-right"><div className="text-[12px] text-muted">Total if bought separately</div><div className="text-[22px] font-semibold tabular-nums">${r.total.toFixed(0)} <span className="text-[12px] font-normal text-muted">CAD</span></div></div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {r.tests.map((x, i) => (
            <div key={x.t.handle} className="flex flex-col rounded-[22px] bg-white p-4 ring-1 ring-ink/[0.06]">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center icon-tile"><Icon name={x.t.icon} size={19} weight="duotone" /></span>
                <div className="min-w-0 flex-1"><div className="text-[14.5px] font-semibold leading-snug">{x.t.title}</div><div className="mt-0.5 flex flex-wrap gap-1"><EvidencePill e={x.evidence} />{i === 0 && <span className="rounded-full bg-ai-soft px-2 py-0.5 text-[10.5px] font-semibold text-ai">Top match</span>}</div></div>
              </div>
              <p className="mt-2.5 text-[13px] leading-snug text-muted">{x.reveals}</p>
              <div className="mt-3"><div className="flex justify-between text-[11.5px]"><span className="font-semibold text-ai">✦ AI match</span><span className="tabular-nums">{x.match}%</span></div><div className="mt-1 h-1.5 rounded-full bg-ink/[0.07]"><div className="h-full rounded-full bg-ai" style={{ width: `${x.match}%` }} /></div></div>
              {x.why && <div className="mt-2 text-[11.5px] text-muted">Why: {x.why}</div>}
              <div className="mt-1 text-[11.5px] text-muted">Re-test: {RETEST_LABEL(x.retest)}</div>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <BuyButton href={x.t.url} store="labs" price={x.t.price} size="sm" />
                <button onClick={() => ask(`Explain the ${x.t.title} test: what it measures, who it helps, and how to prepare.`, { label: `✦ About ${x.t.title}` })} className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-ai-soft" aria-label={`Ask Biongevity SI about ${x.t.title}`}><XevyoOrb size={20} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3"><StoreNote store="labs" /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <AIChartFrame kicker="Dynamic testing" title="Your 12-month re-test timeline" data={r.retest}
          insight="Re-testing the same markers against your own baseline shows whether a change is working — it is how the digital twin learns what normal is for you.">
          <Timeline rows={r.retest} />
        </AIChartFrame>
        <div className="space-y-4">
          <div className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Matched formulas · BioAro Drugs</div>
            <div className="mt-3 space-y-2.5">
              {r.formulas.map((f) => (
                <div key={f.handle} className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-accent"><Icon name={f.icon} size={18} weight="duotone" /></span>
                  <div className="min-w-0 flex-1"><div className="text-[14px] font-semibold">{f.title}</div><div className="truncate text-[12px] text-muted">{f.tagline}</div></div>
                  <BuyButton href={f.url} store="drugs" price={f.price} size="sm" label="Buy" />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-faint">Discuss supplements with your clinician, especially if you take medication.</p>
          </div>
          <div className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Suggested care</div>
            <Link href="/shop/#depth" className="mt-3 flex items-center gap-3 rounded-2xl bg-accent-light p-3"><Icon name="crown" size={20} className="text-accent" /><div className="flex-1"><div className="text-[14px] font-semibold">{r.program.name}</div><div className="text-[12px] text-muted">Program from ${r.program.price} CAD · baseline, coach and follow-up</div></div><Icon name="arrow-right" size={15} className="text-accent" /></Link>
            <div className="mt-2 flex flex-wrap gap-2">{r.depts.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className="chip h-8 border-ink/10 bg-white text-[12.5px] hover:border-accent/40"><Icon name={d.icon} size={14} className="text-accent" />{d.short}</Link>)}</div>
          </div>
        </div>
      </div>

      <p className="text-center text-[11.5px] text-faint">Educational estimate from your answers, using published population studies. Not a diagnosis or a personal prediction. Your answers were not stored or sent anywhere.</p>
    </div>
  );
}
