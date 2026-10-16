"use client";
import { motion } from "framer-motion";
import { DEPT_EXTRA } from "@/data/deptExtra";
import { deptById } from "@/data/departments";
import { Organ3D } from "@/components/body/Organ3D";
import { Tilt } from "@/components/fx3d/HoverGallery3D";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";

/** What a department offers in practice, how it connects to the rest of the record, its 3D organ, and its sources. */
export function DeptDeepDive({ dept }: { dept: string }) {
  const x = DEPT_EXTRA[dept], d = deptById(dept);
  const { ask } = useAI();
  if (!x) return null;
  return (
    <div className="space-y-8">
      {x.organ && <Organ3D organ={x.organ} />}

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-[22px] font-semibold tracking-tight">What we offer in {d.short}</h3>
          {x.numbers && <div className="flex flex-wrap gap-2">{x.numbers.map((n) => <span key={n.l} className="rounded-full bg-white px-3 py-1 text-[12px] ring-1 ring-ink/[0.06]"><b className="text-ai">{n.v}</b> {n.l}</span>)}</div>}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {x.offer.map((o, i) => (
            <motion.div key={o.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Tilt max={6} className="h-full">
                <button onClick={() => ask(`Tell me about "${o.t}" in ${d.name} at Biongevity: ${o.d} Who is it for and what happens?`, { label: `✦ ${o.t}` })} className="group flex h-full w-full flex-col rounded-[22px] bg-white p-4 text-left shadow-card ring-1 ring-ink/[0.06] transition hover:ring-ai/30">
                  <span className="icon-tile h-10 w-10"><Icon name={o.icon} size={19} /></span>
                  <span className="mt-3 text-[15px] font-semibold leading-snug">{o.t}</span>
                  <span className="mt-1 text-[12.5px] leading-snug text-muted">{o.d}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11.5px] font-semibold text-ai opacity-70 transition group-hover:opacity-100"><XevyoOrb size={14} />Ask SI</span>
                </button>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-[24px] bg-white p-5 ring-1 ring-ink/[0.06]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Connected care</div>
          <ul className="mt-2 space-y-2">{x.links.map((l) => <li key={l.t} className="flex gap-2.5 text-[13px]"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ai" /><span><b>{l.t}.</b> <span className="text-muted">{l.d}</span></span></li>)}</ul>
        </div>
        <div className="rounded-[24px] bg-white p-5 ring-1 ring-ink/[0.06]">
          {x.partner && <>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">BioAro group clinic</div>
            <div className="mt-1 text-[17px] font-semibold">{x.partner.name}</div>
            <p className="text-[13px] text-muted">{x.partner.line}</p>
            <a href={x.partner.url} target="_blank" rel="noopener noreferrer" className="btn-light mt-3 h-9 px-3.5 text-[12.5px]">Visit {x.partner.name.split(" (")[0]}<Icon name="arrow-up-right" size={13} /></a>
          </>}
          <div className={`${x.partner ? "mt-4 border-t border-ink/[0.06] pt-3" : ""}`}>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">Sources</div>
            <ul className="mt-1 space-y-0.5">{x.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-muted underline decoration-ink/20 underline-offset-2 hover:text-ai">{s.name}</a></li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
