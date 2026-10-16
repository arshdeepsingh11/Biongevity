"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { LAB_TESTS } from "@/data/labs";
import { deptById } from "@/data/departments";
import { BuyButton } from "@/components/commerce/BuyButton";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";

type Rel = "pgm" | "pgf" | "mgm" | "mgf" | "father" | "mother" | "sibling";
const PEOPLE: { id: Rel; label: string; degree: 1 | 2; female: boolean }[] = [
  { id: "pgm", label: "Paternal grandmother", degree: 2, female: true }, { id: "pgf", label: "Paternal grandfather", degree: 2, female: false },
  { id: "mgm", label: "Maternal grandmother", degree: 2, female: true }, { id: "mgf", label: "Maternal grandfather", degree: 2, female: false },
  { id: "father", label: "Father", degree: 1, female: false }, { id: "mother", label: "Mother", degree: 1, female: true },
  { id: "sibling", label: "Brother or sister", degree: 1, female: false },
];

export interface Cond { id: string; label: string; icon: IconName; tests: string[]; clinic: string; dept: string; why: string }
/** Conditions and what they suggest. General education — a clinician confirms what applies to you. */
export const CONDS: Cond[] = [
  { id: "heart", label: "Heart disease", icon: "heart", tests: ["hs-CRP", "Disease-Based DNA Test"], clinic: "Lipid panel with ApoB and a one-time Lp(a)", dept: "cardiology", why: "Heart disease in a parent or sibling — especially before 55 in men or 65 in women — raises your own risk and is a reason to check cholesterol particles early." },
  { id: "bp", label: "High blood pressure", icon: "activity", tests: ["Cystatin C"], clinic: "Home or 24-hour blood-pressure monitoring", dept: "cardiology", why: "Blood pressure runs in families; home readings catch it years before symptoms." },
  { id: "stroke", label: "Stroke", icon: "brain", tests: ["hs-CRP", "PAI-1"], clinic: "Blood pressure, lipids and carotid ultrasound if advised", dept: "cardiology", why: "A family history of stroke makes blood pressure and artery health the first things to check." },
  { id: "diabetes", label: "Type 2 diabetes", icon: "droplet", tests: ["Core Inflammation Aging"], clinic: "HbA1c and fasting glucose", dept: "endocrinology", why: "A parent or sibling with type 2 diabetes roughly doubles to triples your own risk; early checks and habits change the course." },
  { id: "colon", label: "Bowel (colorectal) cancer", icon: "gut", tests: ["Disease-Based DNA Test"], clinic: "Ask about starting bowel screening earlier", dept: "gut-health", why: "A close relative with bowel cancer often means screening should start earlier than usual. A microbiome test is not a cancer screen." },
  { id: "breast", label: "Breast or ovarian cancer", icon: "venus", tests: ["Disease-Based DNA Test", "Whole Genome Sequencing 30X"], clinic: "Genetic counselling; earlier breast screening if advised", dept: "womens-health", why: "Some families carry inherited variants (such as BRCA1/2) that a genetic test with counselling can clarify." },
  { id: "prostate", label: "Prostate cancer", icon: "mars", tests: ["Disease-Based DNA Test"], clinic: "Discuss PSA testing and when to start", dept: "mens-health", why: "A father or brother with prostate cancer is a reason to talk about PSA testing earlier." },
  { id: "dementia", label: "Dementia / Alzheimer's", icon: "brain", tests: ["Brain Health"], clinic: "Memory review; manage blood pressure, hearing and sleep", dept: "geriatric-medicine", why: "Family history adds some risk, but blood pressure, activity, hearing and sleep are powerful levers." },
  { id: "bones", label: "Osteoporosis / hip fracture", icon: "bone", tests: ["Vitamin D, 25-Hydroxy", "Vitamin K1"], clinic: "Bone density scan if advised", dept: "geriatric-medicine", why: "A parent's hip fracture is a recognised risk factor for your own bone health." },
];
const findTest = (k: string) => LAB_TESTS.find((t) => t.title.toLowerCase().startsWith(k.toLowerCase()));

/**
 * Family health tree — add grandparents, parents and siblings with simple conditions. On your device, Biongevity SI
 * weighs close relatives (parents, siblings) twice as much as grandparents and early onset more, then suggests the
 * tests and departments that matter for you — and for your brothers and sisters. Nothing is stored or sent.
 */
export function FamilyTree() {
  const { ask } = useAI();
  const [map, setMap] = useState<Record<Rel, string[]>>({ pgm: [], pgf: ["heart"], mgm: ["bones"], mgf: [], father: ["bp"], mother: ["diabetes"], sibling: [] });
  const [early, setEarly] = useState<Record<Rel, boolean>>({ pgm: false, pgf: true, mgm: false, mgf: false, father: false, mother: false, sibling: false });
  const [open, setOpen] = useState<Rel | null>("father");

  const ranked = useMemo(() => {
    const score: Record<string, { s: number; who: string[] }> = {};
    for (const p of PEOPLE) for (const c of map[p.id]) {
      const w = (p.degree === 1 ? 1 : 0.5) * (early[p.id] ? 1.6 : 1);
      score[c] = score[c] ?? { s: 0, who: [] }; score[c].s += w; score[c].who.push(p.label.toLowerCase());
    }
    return Object.entries(score).map(([id, v]) => ({ c: CONDS.find((x) => x.id === id)!, ...v })).sort((a, b) => b.s - a.s);
  }, [map, early]);
  const toggle = (r: Rel, c: string) => setMap((m) => ({ ...m, [r]: m[r].includes(c) ? m[r].filter((x) => x !== c) : [...m[r], c] }));

  const Node = ({ p }: { p: (typeof PEOPLE)[number] }) => {
    const n = map[p.id].length, on = open === p.id;
    return (
      <button onClick={() => setOpen(on ? null : p.id)} aria-expanded={on}
        className={cn("relative flex w-full flex-col items-center rounded-2xl bg-white p-2.5 text-center shadow-card ring-1 transition sm:p-3", on ? "ring-ai/50" : "ring-ink/[0.06] hover:ring-ai/30")}>
        <span className={cn("grid h-9 w-9 place-items-center rounded-full sm:h-11 sm:w-11", n ? "bg-ai-soft text-ai" : "bg-canvas text-faint")}><Icon name={p.female ? "venus" : "mars"} size={17} /></span>
        <span className="mt-1.5 text-[11px] font-semibold leading-tight sm:text-[12.5px]">{p.label}</span>
        <span className="mt-1 flex min-h-[14px] flex-wrap justify-center gap-0.5">{map[p.id].map((c) => <span key={c} className="h-2 w-2 rounded-full bg-ai" title={CONDS.find((x) => x.id === c)?.label} />)}</span>
        {early[p.id] && n > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-gold px-1.5 text-[9.5px] font-bold text-white">early</span>}
      </button>
    );
  };
  const person = PEOPLE.find((p) => p.id === open);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-[30px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Your family tree · tap a person</div>
        <div className="relative mt-4">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">{PEOPLE.slice(0, 4).map((p) => <Node key={p.id} p={p} />)}</div>
          <svg aria-hidden viewBox="0 0 100 10" preserveAspectRatio="none" className="block h-7 w-full"><path d="M12.5 0V5H37.5V0M25 5V10M62.5 0V5H87.5V0M75 5V10" fill="none" style={{ stroke: "rgb(var(--c-ai) / .35)" }} strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg>
          <div className="grid grid-cols-4 gap-2 sm:gap-3"><div className="col-span-2 px-[14%]"><Node p={PEOPLE[4]} /></div><div className="col-span-2 px-[14%]"><Node p={PEOPLE[5]} /></div></div>
          <svg aria-hidden viewBox="0 0 100 10" preserveAspectRatio="none" className="block h-8 w-full"><path d="M25 0V4H75V0M50 4V7M37.5 7H62.5M37.5 7V10M62.5 7V10" fill="none" style={{ stroke: "rgb(var(--c-ai) / .35)" }} strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="col-start-2"><div className="flex w-full flex-col items-center rounded-2xl bg-ai-soft p-2.5 text-center ring-1 ring-ai/30 sm:p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-ai shadow-card sm:h-11 sm:w-11"><Icon name="user" size={18} /></span><span className="mt-1.5 text-[11px] font-semibold sm:text-[12.5px]">You</span></div></div>
            <div className="col-start-3"><Node p={PEOPLE[6]} /></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {person && (
            <motion.div key={person.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-2xl bg-canvas p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[14px] font-semibold">{person.label}: conditions</div>
                <label className="flex items-center gap-2 text-[12px] text-muted"><input type="checkbox" checked={early[person.id]} onChange={(e) => setEarly((x) => ({ ...x, [person.id]: e.target.checked }))} className="h-4 w-4 accent-[rgb(var(--c-ai))]" />Diagnosed early (before 55 men / 65 women)</label>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {CONDS.map((c) => { const on = map[person.id].includes(c.id); return (
                  <button key={c.id} onClick={() => toggle(person.id, c.id)} aria-pressed={on} className={cn("chip text-[12.5px]", on ? "border-ai/40 bg-white text-ai shadow-card" : "border-ink/10 bg-white/60")}><Icon name={c.icon} size={13} />{c.label}</button>
                ); })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-3 text-[11px] text-faint">Runs on your device · nothing is stored or sent · education, not a diagnosis.</p>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="rounded-[30px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
          <div className="flex items-center justify-between"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ What matters for you</div><span className="text-[11px] text-faint">and your siblings</span></div>
          {!ranked.length && <p className="mt-4 text-[13.5px] text-muted">Tap a person and add any conditions you know about. Suggestions appear here.</p>}
          <ol className="mt-3 space-y-2.5">
            {ranked.map(({ c, s, who }, i) => {
              const d = deptById(c.dept), level = s >= 1.5 ? "High priority" : s >= 1 ? "Worth checking" : "Good to know";
              return (
                <motion.li layout key={c.id} className="rounded-2xl bg-canvas p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="icon-tile h-10 w-10"><Icon name={c.icon} size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5"><span className="text-[14.5px] font-semibold">{i + 1}. {c.label}</span><span className={cn("rounded-full px-2 py-px text-[10.5px] font-semibold", s >= 1.5 ? "bg-ai text-on-ai" : "bg-ai-soft text-ai")}>{level}</span></div>
                      <div className="text-[11.5px] text-faint">From your {who.join(", ")}</div>
                      <p className="mt-1 text-[12.5px] leading-snug text-muted">{c.why}</p>
                      <p className="mt-1.5 text-[12.5px]"><span className="font-semibold">With your clinician: </span>{c.clinic}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {c.tests.map((k) => { const t = findTest(k); return t ? <BuyButton key={k} href={t.url} store="labs" price={t.price} size="sm" label={t.title.replace(/ \(.*\)/, "")} /> : null; })}
                        <Link href={`/precision-health/${d.id}/`} className="chip border-ink/10 bg-white text-[12px]"><Icon name={d.icon} size={13} />{d.short}</Link>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
          {ranked.length > 0 && (
            <button onClick={() => ask(`My family history: ${PEOPLE.filter((p) => map[p.id].length).map((p) => `${p.label}: ${map[p.id].map((c) => CONDS.find((x) => x.id === c)!.label).join(", ")}${early[p.id] ? " (early)" : ""}`).join("; ")}. What does this mean for me and my siblings, which checks matter first, and what should I ask my clinician?`, { label: "✦ Explain my family history" })}
              className="btn-ai mt-4 h-10 w-full text-[13px]"><XevyoOrb size={20} />Explain for me and my siblings</button>
          )}
        </div>
      </div>
    </div>
  );
}
