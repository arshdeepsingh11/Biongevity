"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { DEPARTMENTS } from "@/data/health";
import { DEPT_EVIDENCE } from "@/data/stats";
import { Icon } from "@/components/ui/Icon";
import { Stat } from "@/components/charts/Charts";
import { EvidenceChart } from "@/components/charts/EvidenceChart";
import { MagicCard } from "@/components/fx/MagicCard";

/** Nine disciplines — hover a discipline; the right panel changes to its icon, why it matters, cited stats and a chart. */
export function DisciplineExplorer() {
  const [id, setId] = useState(DEPARTMENTS[1].id);
  const d = DEPARTMENTS.find((x) => x.id === id)!;
  const ev = DEPT_EVIDENCE[id];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {DEPARTMENTS.map((x) => {
          const on = x.id === id;
          return (
            <button key={x.id} onMouseEnter={() => setId(x.id)} onFocus={() => setId(x.id)} onClick={() => setId(x.id)} aria-pressed={on}
              className={`group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl p-2 text-center transition-all duration-300 sm:rounded-3xl ${on ? "-translate-y-0.5 bg-navy text-white shadow-lift" : "bg-white ring-1 ring-ink/[0.06] hover:-translate-y-0.5 hover:shadow-card"}`}>
              {on && <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,.55),transparent_70%)]" />}
              <span className={`relative grid h-11 w-11 place-items-center rounded-2xl transition-colors sm:h-14 sm:w-14 ${on ? "bg-white/10 text-white" : "bg-accent-light text-accent"}`}><Icon name={x.icon} size={24} strokeWidth={1.6} /></span>
              <span className="relative text-[12px] font-semibold leading-tight sm:text-[14px]">{x.short}</span>
            </button>
          );
        })}
      </div>
      <MagicCard className="min-h-[440px] p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }}>
            <div className="flex items-start gap-4">
              <motion.span initial={{ rotate: -12, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={d.icon} size={26} /></motion.span>
              <div className="min-w-0"><div className="text-[24px] font-semibold tracking-tight">{d.name}</div><div className="text-[14px] text-accent">{d.tag}</div></div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{ev.why}</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="grid content-start gap-3">{ev.stats.map((s, k) => <Stat key={s.l} {...s} accent={k === 0} />)}</div>
              <div className="rounded-2xl bg-canvas p-4"><EvidenceChart spec={ev.chart} compact /></div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {d.services.slice(0, 3).map((s) => <span key={s.t} className="chip border-ink/10 bg-white text-[12px]">{s.t}</span>)}
              <Link href={`/precision-health/${d.id}/`} className="btn-dark ml-auto h-10 text-[14px]">Explore {d.short}<Icon name="arrow-right" size={14} /></Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </MagicCard>
    </div>
  );
}
