"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PILLARS } from "@/data/health";
import { STREAMS, type StreamName } from "@/data/stats";
import { Icon } from "@/components/ui/Icon";
import { DnaHelix } from "@/components/fx/DnaHelix";
import { DotPattern } from "@/components/fx/DotPattern";
import { Donut, LineChart, Radar, Stat } from "@/components/charts/Charts";

/** Five data streams — hover/tap a stream on the left; the right panel swaps to that stream's real stats and a relevant chart. */
export function DataStreamExplorer() {
  const [i, setI] = useState(0);
  const name = PILLARS[i].t as StreamName;
  const s = STREAMS[name];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-8">
      <div role="tablist" aria-label="Data streams" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {PILLARS.map((p, k) => {
          const on = k === i;
          return (
            <button key={p.t} role="tab" aria-selected={on} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)}
              className={`group relative flex shrink-0 items-center gap-3 rounded-2xl p-3 text-left transition-all duration-300 lg:p-4 ${on ? "bg-white shadow-card ring-1 ring-accent/20" : "hover:bg-white/60"}`}>
              {on && <motion.span layoutId="streamBar" className="absolute inset-y-3 left-0 hidden w-[3px] rounded-full bg-iri lg:block" />}
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all duration-300 ${on ? "bg-iri text-white shadow-glow" : "bg-white text-muted ring-1 ring-ink/[0.06] group-hover:text-accent"}`}><Icon name={p.icon} size={21} /></span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-[15px] font-semibold lg:text-[17px]">{p.t}</span>
                <span className="hidden text-[13px] leading-snug text-muted lg:line-clamp-1">{p.d}</span>
              </span>
              <span className="ml-auto hidden text-[12px] font-semibold tabular-nums text-faint lg:block">0{k + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-7">
        <DotPattern />
        <AnimatePresence mode="wait">
          <motion.div key={name} initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(6px)" }} transition={{ duration: 0.32 }} className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-white"><Icon name={PILLARS[i].icon} size={19} /></span>
              <div><div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">Stream 0{i + 1}</div><div className="text-[22px] font-semibold tracking-tight">{name}</div></div>
            </div>
            <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">{s.lead}</p>
            <div className="mt-5 grid items-center gap-6 md:grid-cols-[1fr_1.15fr]">
              <div className="grid grid-cols-2 gap-3">{s.stats.map((st, k) => <Stat key={st.l} {...st} accent={k === 0} />)}</div>
              <div>
                {name === "Genomics" && <div className="grid grid-cols-[150px_1fr] items-center gap-4"><DnaHelix height={250} /><ul className="space-y-2 text-[13px] text-muted">{["Whole genome (WGS)", "Whole exome (WES)", "Pharmacogenomics", "Hereditary cancer & cardiac panels", "Nutrigenomics"].map((t) => <li key={t} className="flex items-center gap-2"><Icon name="check" size={14} className="text-teal" />{t}</li>)}</ul></div>}
                {name === "Epigenetics" && "clock" in s && <><div className="mb-1 text-[13px] font-semibold">Epigenetic vs chronological age</div><LineChart labels={[...s.clock.labels]} unit=" yrs" series={[{ name: "Epigenetic age", values: [...s.clock.bio], color: "#0F9D8F" }, { name: "Chronological age", values: [...s.clock.chrono], color: "#1E3A8A", dashed: true }]} /><div className="text-[10.5px] text-faint">Illustrative example of a slower-ageing profile.</div></>}
                {name === "Microbiome" && "phyla" in s && <><div className="mb-3 text-[13px] font-semibold">Typical adult gut, by phylum</div><Donut data={[...s.phyla]} center="Gut" sub="composition" size={160} /><div className="mt-2 text-[10.5px] text-faint">Illustrative — composition varies widely between people.</div></>}
                {name === "Biological age" && "trend" in s && <><div className="mb-1 text-[13px] font-semibold">Biological age over a program</div><LineChart labels={[...s.trend.labels]} unit=" yrs" series={[{ name: "Biological age", values: [...s.trend.bio], color: "#2563EB" }, { name: "Chronological age", values: [...s.trend.chrono], color: "#B8873B", dashed: true }]} /><div className="text-[10.5px] text-faint">Illustrative trajectory, not member data.</div></>}
                {name === "Clinical evaluations" && "radar" in s && <><div className="text-center text-[13px] font-semibold">Function profile vs age group</div><Radar axes={[...s.radar.axes]} series={[{ name: "Example profile", values: [...s.radar.you] }, { name: "Age-group reference", values: [...s.radar.ref], color: "#B8873B" }]} size={280} /></>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
