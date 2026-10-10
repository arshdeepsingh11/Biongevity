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
  const [id, setId] = useState(DEPARTMENTS[0].id);
  const d = DEPARTMENTS.find((x) => x.id === id)!;
  const ev = DEPT_EVIDENCE[id];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="grid content-start grid-cols-2 gap-2">
        {DEPARTMENTS.map((x) => {
          const on = x.id === id;
          return (
            <button key={x.id} onMouseEnter={() => setId(x.id)} onFocus={() => setId(x.id)} onClick={() => setId(x.id)} aria-pressed={on}
              className={`group flex h-[68px] items-center gap-3 rounded-2xl px-3 text-left transition-colors duration-200 ${on ? "bg-accent text-white shadow-glow" : "bg-white ring-1 ring-ink/[0.06] hover:bg-accent-light"}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-white/20 text-white" : "bg-accent-light text-accent"}`}><Icon name={x.icon} size={22} weight="duotone" /></span>
              <span className="min-w-0"><span className="block truncate text-[14px] font-semibold leading-tight">{x.short}</span><span className={`block truncate text-[11.5px] ${on ? "text-white/80" : "text-faint"}`}>{x.group}</span></span>
            </button>
          );
        })}
      </div>
      <MagicCard className="p-5 sm:p-7 lg:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }}>
            <div className="flex items-start gap-4">
              <motion.span initial={{ rotate: -12, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={d.icon} size={28} weight="duotone" /></motion.span>
              <div className="min-w-0"><div className="text-[24px] font-semibold tracking-tight">{d.name}</div><div className="text-[14px] text-accent">{d.tag}</div></div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{ev.why}</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="grid content-start gap-3">{ev.stats.map((s, k) => <Stat key={s.l} {...s} accent={k === 0} />)}</div>
              <div className="rounded-2xl bg-canvas p-4 md:h-[250px] md:overflow-hidden"><EvidenceChart spec={ev.chart} compact /></div>
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
