"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EVIDENCE, type EvidenceCard, type Grade, type Topic } from "@/data/evidence";
import { LAB_TESTS } from "@/data/labs";
import { deptById } from "@/data/departments";
import { Icon } from "@/components/ui/Icon";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";

const GRADES: Grade[] = ["High", "Moderate", "Low", "Very low"];
const G_N: Record<Grade, number> = { High: 4, Moderate: 3, Low: 2, "Very low": 1 };
const TOPICS: ("All" | Topic)[] = ["All", "Heart", "Lifestyle", "Biomarkers", "Supplements"];
const fmtN = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n));

/** Forest-plot strip on a log scale (0.25× → 6×). Left of 1 = lower risk. */
function Forest({ r }: { r: NonNullable<EvidenceCard["ratio"]> }) {
  const x = (v: number) => ((Math.log(v) - Math.log(0.25)) / (Math.log(6) - Math.log(0.25))) * 100;
  const better = r.hi < 1, worse = r.lo > 1;
  return (
    <div className="mt-3">
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
        <div className="absolute top-1 h-6 w-px bg-ink/30" style={{ left: `${x(1)}%` }} />
        <div className={cn("absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full", better ? "bg-teal" : worse ? "bg-warn" : "bg-muted")} style={{ left: `${x(r.lo)}%`, width: `${Math.max(1, x(r.hi) - x(r.lo))}%` }} />
        <div className={cn("absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[3px] shadow-card", better ? "bg-teal" : worse ? "bg-warn" : "bg-muted")} style={{ left: `${x(r.v)}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-faint"><span>0.25×</span><span>lower risk ← 1 → higher risk</span><span>6×</span></div>
      <div className="mt-1 text-[12px]"><span className="font-semibold tabular-nums">{r.v.toFixed(2)}</span> <span className="text-muted">(95% CI {r.lo.toFixed(2)}–{r.hi.toFixed(2)}) · {r.label}</span></div>
    </div>
  );
}

function GradePill({ g }: { g: Grade }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2 py-0.5 text-[11px] font-semibold" title="GRADE certainty of evidence">
      <span className="flex gap-0.5">{[1, 2, 3, 4].map((k) => <span key={k} className={cn("h-1.5 w-1.5 rounded-full", k <= G_N[g] ? "bg-ai" : "bg-ink/15")} />)}</span>{g}
    </span>
  );
}

/**
 * Living evidence engine — every number on this site, auditable: study design, number of studies and people,
 * effect size with confidence interval, and a GRADE certainty rating. Filter, sort and ask Biongevity SI to explain.
 */
export function EvidenceEngine() {
  const { ask } = useAI();
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const [minGrade, setMinGrade] = useState<Grade>("Very low");
  const [sort, setSort] = useState<"grade" | "people" | "year">("grade");
  const [q, setQ] = useState("");
  const list = useMemo(() => EVIDENCE
    .filter((e) => (topic === "All" || e.topic === topic) && G_N[e.grade] >= G_N[minGrade] && (!q || `${e.title} ${e.claim} ${e.source}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => (sort === "grade" ? G_N[b.grade] - G_N[a.grade] || b.people - a.people : sort === "people" ? b.people - a.people : b.year - a.year)), [topic, minGrade, sort, q]);
  const studies = list.reduce((s, e) => s + e.studies, 0), people = list.reduce((s, e) => s + e.people, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([["Evidence cards", list.length, "", 0], ["Studies", studies, "", 0], ["People studied", Number((people / 1e6).toFixed(1)), "M", 1], ["High-certainty", list.filter((e) => e.grade === "High").length, "", 0]] as [string, number, string, number][]).map(([k, v, suf, dec]) => (
          <div key={k} className="rounded-[22px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]"><div className="text-[28px] font-semibold tracking-tight"><NumberTicker value={v} suffix={suf} decimals={dec} /></div><div className="text-[12px] text-muted">{k}</div></div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] bg-white p-3 shadow-card ring-1 ring-ink/[0.06] lg:flex-row lg:items-center">
        <label className="relative flex-1"><Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a topic, study or journal…" aria-label="Search evidence" className="h-10 w-full rounded-full bg-canvas pl-9 pr-4 text-[14px] outline-none focus:ring-2 focus:ring-ai/30" /></label>
        <div className="no-scrollbar flex gap-1 overflow-x-auto">{TOPICS.map((t) => <button key={t} onClick={() => setTopic(t)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold", topic === t ? "bg-ink text-pearl" : "text-muted hover:text-ink")}>{t}</button>)}</div>
        <select value={minGrade} onChange={(e) => setMinGrade(e.target.value as Grade)} aria-label="Minimum certainty" className="h-10 rounded-full bg-canvas px-3 text-[12.5px] font-semibold outline-none">{GRADES.map((g) => <option key={g} value={g}>{g === "Very low" ? "Any certainty" : `${g}+ certainty`}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort" className="h-10 rounded-full bg-canvas px-3 text-[12.5px] font-semibold outline-none"><option value="grade">Sort: certainty</option><option value="people">Sort: people studied</option><option value="year">Sort: newest</option></select>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((e, i) => {
          const test = e.test ? LAB_TESTS.find((t) => t.title.toLowerCase().startsWith(e.test!.toLowerCase())) : undefined, d = e.dept ? deptById(e.dept) : undefined;
          return (
            <motion.article key={e.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex flex-col rounded-[26px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
              <div className="flex items-center justify-between gap-2"><span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai">{e.topic}</span><GradePill g={e.grade} /></div>
              <h3 className="mt-1.5 text-[17px] font-semibold leading-snug">{e.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{e.claim}</p>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-xl bg-canvas p-2"><div className="text-[15px] font-semibold">{e.studies}</div><div className="text-[10px] text-muted">{e.studies === 1 ? "study" : "studies"}</div></div>
                <div className="rounded-xl bg-canvas p-2"><div className="text-[15px] font-semibold">{fmtN(e.people)}</div><div className="text-[10px] text-muted">people</div></div>
                <div className="rounded-xl bg-canvas p-2"><div className="text-[15px] font-semibold">{e.year}</div><div className="text-[10px] text-muted">published</div></div>
              </div>
              {e.ratio ? <Forest r={e.ratio} /> : <div className="mt-3 rounded-xl bg-ai-soft/60 px-3 py-2 text-[13px] font-semibold text-ai">{e.effect}</div>}
              {e.ratio && <div className="mt-1 text-[12.5px] font-semibold">{e.effect}</div>}
              <p className="mt-2 text-[11.5px] text-faint"><span className="font-semibold text-muted">Why {e.grade.toLowerCase()}: </span>{e.why}</p>
              <p className="mt-1 text-[11.5px] text-faint">{e.design} · {e.source}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                <button onClick={() => ask(`Explain this evidence in plain words and what it means for me: ${e.title} — ${e.claim} (${e.source}; ${e.design}; ${e.studies} studies, ${e.people.toLocaleString()} people; effect: ${e.effect}; GRADE ${e.grade}).`, { label: `✦ Explain: ${e.title}` })} className="btn-ai h-8 px-3 text-[12px]"><XevyoOrb size={16} />Explain</button>
                {test && <a href={test.url} target="_blank" rel="noopener" className="chip border-ink/10 bg-white text-[12px]"><Icon name="test-tube" size={13} />{test.title.replace(/ \(.*\)/, "")}</a>}
                {d && <Link href={`/precision-health/${d.id}/`} className="chip border-ink/10 bg-white text-[12px]"><Icon name={d.icon} size={13} />{d.short}</Link>}
              </div>
            </motion.article>
          );
        })}
      </div>
      {!list.length && <p className="text-center text-[14px] text-muted">No cards match — try another topic or a lower certainty.</p>}
      <p className="text-[11.5px] text-faint">GRADE rates how certain the evidence is: High (further research is very unlikely to change it) to Very low. Summaries are curated and paraphrased from the cited papers — always check the original. Last reviewed October 2026.</p>
    </div>
  );
}
