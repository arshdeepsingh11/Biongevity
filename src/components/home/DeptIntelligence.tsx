"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { DEPARTMENTS, deptById } from "@/data/departments";
import { DEPT_EVIDENCE } from "@/data/stats";
import { ORGANS, organById } from "@/lib/body";
import { matchIntent } from "@/lib/intent";
import { TEST_INTEL, goalMatch, type GoalId } from "@/lib/testIntel";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BodyHologram, type Hotspot } from "@/components/body/BodyHologram";
import { EvidenceChart } from "@/components/charts/EvidenceChart";
import { BuyButton } from "@/components/commerce/BuyButton";

/** Which body part each department looks after first (used to place departments on the 3D body). */
export const DEPT_ORGAN: Record<string, string> = {
  cardiology: "heart", "heart-failure": "heart", "internal-medicine": "liver", endocrinology: "thyroid", "respiratory-medicine": "lungs",
  "geriatric-medicine": "brain", nutrition: "stomach", "skin-health": "skin", "pediatric-rheumatology": "joints", "womens-health": "pelvis",
  "mens-health": "pelvis", "gut-health": "gut", dental: "mouth", "mental-health": "brain",
};
const DEPT_GOALS: Record<string, GoalId[]> = {
  cardiology: ["heart"], "heart-failure": ["heart"], "internal-medicine": ["ageing", "metabolic"], endocrinology: ["metabolic", "hormones"], "respiratory-medicine": ["sleep"],
  "geriatric-medicine": ["brain", "ageing"], nutrition: ["metabolic"], "skin-health": ["gut"], "pediatric-rheumatology": ["ageing"], "womens-health": ["hormones"],
  "mens-health": ["hormones"], "gut-health": ["gut"], dental: ["gut"], "mental-health": ["sleep"],
};

/**
 * Department intelligence — the 14 departments placed on a 360° 3D body.
 * Tap a body part (or describe a symptom) → the right department, its evidence chart, key services and a matching BioAro Labs test.
 */
export function DeptIntelligence() {
  const { ask } = useAI();
  const [organ, setOrgan] = useState("heart");
  const [deptId, setDeptId] = useState("cardiology");
  const [q, setQ] = useState("");
  const match = useMemo(() => matchIntent(q), [q]);
  const ranked = match?.depts.map((d) => d.x) ?? [];

  const pickOrgan = (id: string) => { setOrgan(id); const d = DEPARTMENTS.find((x) => DEPT_ORGAN[x.id] === id) ?? DEPARTMENTS.find((x) => organById(id)?.depts.includes(x.id)); if (d) setDeptId(d.id); };
  const pickDept = (id: string) => { setDeptId(id); setOrgan(DEPT_ORGAN[id] ?? "heart"); };
  const onType = (v: string) => { setQ(v); const m = matchIntent(v); if (m?.depts[0]) pickDept(m.depts[0].x.id); };

  const d = deptById(deptId), ev = DEPT_EVIDENCE[d.id], o = organById(organ);
  const deptsHere = DEPARTMENTS.filter((x) => DEPT_ORGAN[x.id] === organ || o?.depts.includes(x.id));
  const test = TEST_INTEL.filter((x) => !/cell-free/i.test(x.t.title)).map((x) => ({ x, m: goalMatch(x, DEPT_GOALS[d.id] ?? ["ageing"]) * 0.5 + x.utility * 0.5 })).sort((a, b) => b.m - a.m)[0]?.x;
  const used = new Set(Object.values(DEPT_ORGAN));
  const hotspots: Hotspot[] = ORGANS.filter((x) => used.has(x.id)).map((x) => ({ id: x.id, tone: x.id === organ ? "focus" : ranked.some((r) => DEPT_ORGAN[r.id] === x.id) ? "attention" : "neutral" }));

  return (
    <div className="space-y-5">
      <div className="mx-auto flex h-14 max-w-[720px] items-center gap-3 rounded-full bg-white pl-2 pr-2 shadow-lift ai-ring">
        <XevyoOrb size={40} live />
        <input value={q} onChange={(e) => onType(e.target.value)} placeholder="Describe a symptom — e.g. short of breath climbing stairs" aria-label="Describe a symptom"
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
        {ranked.length > 0 && <span className="hidden shrink-0 rounded-full bg-ai-soft px-3 py-1 text-[12px] font-semibold text-ai sm:inline">✦ {ranked.length} matched</span>}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[32px] bg-white ring-1 ring-ink/[0.07]">
          <BodyHologram hotspots={hotspots} selected={organ} onSelect={pickOrgan} height={620} />
          <div className="pointer-events-none absolute left-4 top-4 hidden rounded-2xl sm:block bg-white/80 px-3 py-2 ring-1 ring-ink/[0.06] backdrop-blur-md">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai">Selected</div>
            <div className="text-[15px] font-semibold">{o?.label}</div>
            <div className="max-w-[180px] text-[11.5px] leading-snug text-muted">{o?.plain}</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
            {deptsHere.length > 1 && (
              <div className="flex flex-wrap gap-1.5">{deptsHere.map((x) => <button key={x.id} onClick={() => setDeptId(x.id)} className={`chip h-8 text-[12.5px] ${x.id === d.id ? "border-ai bg-ai text-on-ai" : "border-ink/10 bg-white"}`}>{x.short}</button>)}</div>
            )}
            <div className="rounded-[28px] bg-white p-6 ring-1 ring-ink/[0.07]">
              <div className="flex items-start gap-4">
                <span className="icon-tile h-14 w-14"><Icon name={d.icon} size={26} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{d.group}</div>
                  <div className="text-[26px] font-semibold leading-tight tracking-tight">{d.name}</div>
                  <div className="text-[14px] text-accent">{d.tag}</div>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted">{d.summary}</p>
              {ev && <div className="mt-4 grid grid-cols-2 gap-2">{ev.stats.slice(0, 2).map((s) => <div key={s.l} className="rounded-2xl bg-canvas p-3"><div className="text-[24px] font-semibold leading-none tracking-tight">{s.v}</div><div className="mt-1 text-[11.5px] leading-snug text-muted">{s.l}</div></div>)}</div>}
              <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">{d.services.slice(0, 4).map((s) => <div key={s.t} className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-[12.5px] font-medium"><Icon name={s.icon} size={15} className="shrink-0 text-accent" /><span className="truncate">{s.t}</span></div>)}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/precision-health/${d.id}/`} className="btn-dark h-10 px-4 text-[14px]">Open {d.short}<Icon name="arrow-right" size={14} /></Link>
                <button onClick={() => ask(`What does ${d.name} at Biongevity look after, and when should someone consider it?`, { label: `✦ About ${d.name}` })} className="btn-light h-10 px-4 text-[14px]"><XevyoOrb size={20} />Ask Biongevity SI</button>
              </div>
            </div>
            {ev && <div className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]"><EvidenceChart spec={ev.chart} compact /></div>}
            {test && (
              <div className="flex flex-wrap items-center gap-3 rounded-[22px] bg-ai-soft/60 p-4 ring-1 ring-ai/15">
                <Icon name={test.t.icon} size={20} className="text-ai" />
                <div className="min-w-[160px] flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ai">✦ AI test match</div><div className="text-[14px] font-semibold">{test.t.title}</div></div>
                <BuyButton href={test.t.url} store="labs" price={test.t.price} size="sm" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(ranked.length ? [...ranked, ...DEPARTMENTS.filter((x) => !ranked.includes(x))] : DEPARTMENTS).map((x, i) => (
          <button key={x.id} onClick={() => pickDept(x.id)} className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-[13px] font-semibold ring-1 transition ${x.id === d.id ? "bg-ink text-pearl ring-ink" : "bg-white ring-ink/[0.07] hover:ring-ai/40"}`}>
            <Icon name={x.icon} size={16} className={x.id === d.id ? "" : "text-accent"} />{x.short}{ranked.length > 0 && i < ranked.length && <span className="rounded-full bg-ai px-1.5 text-[10px] text-on-ai">{i + 1}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
