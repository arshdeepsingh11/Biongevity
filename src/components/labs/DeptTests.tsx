"use client";
import { TEST_INTEL, goalMatch, RETEST_LABEL, type GoalId } from "@/lib/testIntel";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BuyButton, StoreNote } from "@/components/commerce/BuyButton";
import { EvidencePill } from "./EvidencePill";

/** Department → the goals its patients usually bring (drives the on-device test match). */
const DEPT_GOALS: Record<string, GoalId[]> = {
  cardiology: ["heart"], "heart-failure": ["heart"], "internal-medicine": ["ageing", "metabolic"], endocrinology: ["metabolic", "hormones"],
  "respiratory-medicine": ["sleep"], "geriatric-medicine": ["brain", "ageing"], nutrition: ["metabolic", "ageing"], "skin-health": ["gut"],
  "womens-health": ["hormones"], "mens-health": ["hormones"], "gut-health": ["gut"], dental: ["gut"], "mental-health": ["sleep"],
};
const SKIN = /bioskin/i, DENTAL = /biodental/i;

/** "AI test match" strip on department pages — the BioAro Labs tests that fit this specialty, with Buy links. */
export function DeptTests({ dept, name }: { dept: string; name: string }) {
  const { ask } = useAI();
  const goals = DEPT_GOALS[dept];
  if (!goals) return null;
  const picks = TEST_INTEL
    .map((x) => ({ ...x, m: Math.round(goalMatch(x, goals) * 0.5 + x.utility * 0.5 + (dept === "skin-health" && SKIN.test(x.t.title) ? 30 : 0) + (dept === "dental" && DENTAL.test(x.t.title) ? 30 : 0)) }))
    .filter((x) => !/cell-free/i.test(x.t.title))
    .sort((a, b) => b.m - a.m)
    .filter((x, i, arr) => arr.findIndex((y) => y.t.category === x.t.category) === i)
    .slice(0, 3);
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-5 ai-ring sm:p-6">
      <div aria-hidden className="ai-glow -right-14 -top-14 h-48 w-48" />
      <div className="relative flex flex-wrap items-center gap-3">
        <XevyoOrb size={38} live />
        <div className="min-w-[200px] flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ AI test match · BioAro Labs</div><div className="text-[18px] font-semibold tracking-tight">Tests that often help in {name}</div></div>
        <button onClick={() => ask(`Which BioAro Labs tests are most useful before a ${name} visit, and what should I bring to the appointment?`, { label: `✦ Tests before ${name}` })} className="text-[13px] font-semibold text-ai underline">Ask Xevyo</button>
      </div>
      <div className="relative mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {picks.map((x) => (
          <div key={x.t.handle} className="flex flex-col rounded-2xl bg-canvas p-4">
            <div className="flex items-start gap-2.5"><Icon name={x.t.icon} size={18} className="mt-0.5 text-accent" /><div className="min-w-0 flex-1 text-[14px] font-semibold leading-snug">{x.t.title}</div></div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5"><EvidencePill e={x.evidence} /><span className="text-[11px] text-muted">{RETEST_LABEL(x.retest)}</span></div>
            <p className="mt-2 text-[12.5px] leading-snug text-muted">{x.reveals}</p>
            <div className="mt-auto pt-3"><BuyButton href={x.t.url} store="labs" price={x.t.price} size="sm" /></div>
          </div>
        ))}
      </div>
      <div className="relative mt-3"><StoreNote store="labs" /></div>
    </div>
  );
}
