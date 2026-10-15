"use client";
import { useState } from "react";
import Link from "next/link";
import { PARENT_CONCERNS, FAMILY_DOMAINS, FAMILY_BP } from "@/data/family";
import { LAB_TESTS } from "@/data/labs";
import { DEPARTMENTS } from "@/data/departments";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { LineChart } from "@/components/charts/Charts";
import { AIChartFrame } from "@/components/charts/AICharts";
import { BuyButton } from "@/components/commerce/BuyButton";
import { env } from "@/lib/env";

/** Family care planner — for adult children looking after a parent. On-device; Xevyo drafts on click. */
export function FamilyPlanner() {
  const { ask } = useAI();
  const [age, setAge] = useState(78);
  const [picked, setPicked] = useState<string[]>(["memory", "heart"]);
  const [far, setFar] = useState(true);
  const chosen = PARENT_CONCERNS.filter((c) => picked.includes(c.id));
  const tests = [...new Set(chosen.flatMap((c) => c.tests))].map((h) => LAB_TESTS.find((t) => t.handle === h)).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const depts = [...new Set(chosen.map((c) => c.dept))].map((id) => DEPARTMENTS.find((d) => d.id === id)!).filter(Boolean);
  const checks = chosen.flatMap((c) => c.checks.map((k) => ({ k, c: c.t })));
  const toggle = (id: string) => setPicked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="relative overflow-hidden rounded-[30px] bg-white p-5 shadow-card ai-ring sm:p-7">
      <div aria-hidden className="ai-glow -right-16 -top-20 h-64 w-64" />
      <div className="relative flex flex-wrap items-center gap-3"><XevyoOrb size={44} live halo /><div className="min-w-[200px] flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Family care planner</div><div className="text-[22px] font-semibold tracking-tight">What is worrying you about your parent?</div></div><AIBadge label="Nothing stored" /></div>
      <div className="relative mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-5">
          <label className="block"><span className="flex justify-between text-[13px] font-semibold"><span>Parent&apos;s age</span><span className="tabular-nums text-ai">{age}</span></span><input type="range" min={60} max={95} value={age} onChange={(e) => setAge(Number(e.target.value))} className="mt-2 w-full accent-[rgb(var(--c-ai))]" aria-label="Parent's age" /></label>
          <div className="grid grid-cols-2 gap-2">
            {PARENT_CONCERNS.map((c) => <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={picked.includes(c.id)} className={`flex items-center gap-2 rounded-2xl p-3 text-left text-[13.5px] font-medium ring-1 transition ${picked.includes(c.id) ? "bg-ai-soft ring-ai/50 text-ink" : "bg-canvas ring-ink/[0.06] hover:ring-ai/30"}`}><Icon name={c.icon} size={18} className="text-ai" />{c.t}</button>)}
          </div>
          <label className="flex items-center gap-2 text-[13.5px]"><input type="checkbox" checked={far} onChange={(e) => setFar(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--c-ai))]" />I live far away from them</label>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-canvas p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">✦ Your checklist · {checks.length} steps</div>
            <ul className="mt-2 space-y-1.5">{checks.map(({ k, c }) => <li key={k} className="flex gap-2 text-[13.5px]"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-teal" /><span>{k} <span className="text-[11px] text-faint">· {c}</span></span></li>)}
              {far && <li className="flex gap-2 text-[13.5px]"><Icon name="check" size={15} className="mt-0.5 shrink-0 text-teal" />Use a virtual visit and the app&apos;s family view to follow trends from afar</li>}</ul>
          </div>
          <div className="flex flex-wrap gap-2">{depts.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className="chip h-9 border-ink/10 bg-white hover:border-accent/40"><Icon name={d.icon} size={15} className="text-accent" />{d.short}</Link>)}{far && <Link href="/clinic/virtual/" className="chip h-9 border-ink/10 bg-white hover:border-accent/40"><Icon name="video" size={15} className="text-accent" />Virtual Clinic</Link>}</div>
          {tests.length > 0 && <div className="space-y-2">{tests.map((t) => <div key={t.handle} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/[0.06]"><Icon name={t.icon} size={18} className="text-accent" /><div className="min-w-[150px] flex-1 text-[13.5px] font-semibold">{t.title}<div className="text-[11.5px] font-normal text-muted">{/p-tau|amyloid/i.test(t.title) ? "Ordered as part of a medical memory evaluation" : t.bestFor}</div></div><BuyButton href={t.url} store="labs" price={t.price} size="sm" /></div>)}</div>}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => ask(`I'm an adult child caring for my ${age}-year-old parent${far ? " from far away" : ""}. Concerns: ${chosen.map((c) => c.t).join(", ") || "general"}. Draft a kind, practical plan for the next 4 weeks and questions for their doctor. Not a diagnosis.`, { label: "✦ Draft a 4-week care plan" })} className="btn-ai h-11 px-5"><XevyoOrb size={22} />Draft a 4-week plan</button>
            <Link href={`/contact/?interest=${encodeURIComponent("Family member / parent care")}`} className="btn-light h-11 px-5">Talk to a coordinator</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Illustrative family view (the real one lives in the app, with the parent's permission). */
export function FamilyViewDemo() {
  const [dom, setDom] = useState(FAMILY_DOMAINS);
  const drop = FAMILY_BP.sys[0] - FAMILY_BP.sys[FAMILY_BP.sys.length - 1];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]">
        <div className="flex items-center gap-2"><span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-gold-deep">Illustrative</span><span className="text-[12px] text-muted">Your parent chooses what you see</span></div>
        <ul className="mt-3 divide-y divide-ink/[0.06]">
          {dom.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-2.5 text-[14px]">{d.t}
              <button role="switch" aria-checked={d.on} onClick={() => setDom((s) => s.map((x) => (x.id === d.id ? { ...x, on: !x.on } : x)))} className={`relative h-6 w-10 rounded-full transition ${d.on ? "bg-ai" : "bg-ink/15"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${d.on ? "left-[18px]" : "left-0.5"}`} /></button>
            </li>
          ))}
        </ul>
        <a href={env.appUrl} className="btn-dark mt-4 h-10 w-full text-[14px]">Set up family access in the app<Icon name="arrow-up-right" size={14} /></a>
      </div>
      <AIChartFrame kicker="Shared trend" title="Dad's home blood pressure, 8 weeks" illustrative data={FAMILY_BP}
        insight={<>Average systolic fell <b>{drop} mmHg</b> and is now near the home target of 135/85. Xevyo flags trends for the care team — it never changes medicines.</>}>
        {dom.find((d) => d.id === "bp")?.on
          ? <LineChart labels={FAMILY_BP.labels} series={[{ name: "Systolic", values: FAMILY_BP.sys }, { name: "Diastolic", values: FAMILY_BP.dia, dashed: true }]} refLine={{ value: 135, label: "Home target 135" }} height={210} />
          : <div className="grid h-[210px] place-items-center rounded-2xl bg-canvas text-[13px] text-muted">Hidden — your parent turned off blood-pressure sharing.</div>}
      </AIChartFrame>
    </div>
  );
}
