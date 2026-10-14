"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DEPARTMENTS, DEPT_GROUPS } from "@/data/departments";
import { DEPT_EVIDENCE, type ChartSpec } from "@/data/stats";
import { matchIntent } from "@/lib/intent";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";

/** Tiny chart for a tile, drawn from the department's cited evidence spec. */
function MiniViz({ spec }: { spec: ChartSpec }) {
  if (spec.kind === "waffle") return <div className="grid grid-cols-10 gap-[3px]">{Array.from({ length: spec.of }, (_, i) => <span key={i} className={`aspect-square rounded-[2px] ${i < spec.hit ? "bg-accent" : "bg-ink/10"}`} />)}</div>;
  if (spec.kind === "donut") { const t = spec.data.reduce((a, d) => a + d.value, 0), f = spec.data[0].value / t, C = 2 * Math.PI * 16; return <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90"><circle cx="20" cy="20" r="16" fill="none" stroke="rgb(var(--c-ink))" strokeOpacity=".08" strokeWidth="6" /><circle cx="20" cy="20" r="16" fill="none" stroke="rgb(var(--c-accent))" strokeWidth="6" strokeDasharray={`${f * C} ${C}`} /></svg>; }
  const data = spec.data, m = Math.max(...data.map((d) => d.value));
  return <div className="space-y-1">{data.slice(0, 3).map((d) => <div key={d.label} className="flex items-center gap-2"><span className="w-[46%] truncate text-[10px] text-muted">{d.label}</span><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"><span className="block h-full rounded-full bg-iri-x" style={{ width: `${(d.value / m) * 100}%` }} /></span></div>)}</div>;
}

/** Department intelligence — 14 departments as live tiles: AI search, group filter, cited stat, mini chart, hover detail, click to ask. */
export function DeptIntelligence() {
  const { ask } = useAI();
  const [group, setGroup] = useState<string>("All");
  const [q, setQ] = useState("");
  const match = useMemo(() => matchIntent(q), [q]);
  const ranked = useMemo(() => {
    const ids = match?.depts.map((d) => d.x.id) ?? [];
    const list = DEPARTMENTS.filter((d) => group === "All" || d.group === group);
    const r = (id: string) => (ids.includes(id) ? ids.indexOf(id) : 99);
    return ids.length ? [...list].sort((a, b) => r(a.id) - r(b.id)) : list;
  }, [group, match]);
  const hits = new Set(match?.depts.map((d) => d.x.id) ?? []);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-full bg-white p-1 shadow-card ring-1 ring-ink/[0.06]">
          {["All", ...DEPT_GROUPS].map((g) => <button key={g} onClick={() => setGroup(g)} className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${group === g ? "bg-accent text-white" : "text-muted hover:text-ink"}`}>{g}</button>)}
        </div>
        <div className="flex h-11 w-full items-center gap-2 rounded-full bg-white px-4 shadow-card ring-1 ring-ink/[0.06] focus-within:ring-accent/40 md:w-[380px]">
          <Icon name="sparkle" size={17} weight="duotone" className="text-accent" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="AI match: e.g. snoring and tired" aria-label="Match departments" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
          {hits.size > 0 && <span className="hud-label">{hits.size} matched</span>}
        </div>
      </div>

      <motion.div layout className="mt-6 grid auto-rows-[minmax(210px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ranked.map((d, i) => {
          const ev = DEPT_EVIDENCE[d.id], big = i < 2 && !q, hit = hits.has(d.id);
          return (
            <motion.div layout key={d.id} transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className={`hud group relative flex flex-col overflow-hidden rounded-[24px] bg-white p-5 shadow-card ring-1 transition-shadow hover:shadow-lift ${big ? "lg:col-span-2" : ""} ${hit ? "ring-2 ring-accent" : "ring-ink/[0.06]"}`}>
              {hit && <span className="absolute right-4 top-4 rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-white">AI match</span>}
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-iri text-white"><Icon name={d.icon} size={24} weight="duotone" /></span>
                <div className="min-w-0"><div className="text-[17px] font-semibold leading-tight">{d.name}</div><div className="hud-label !text-faint">{d.group}</div></div>
              </div>
              <div className={`mt-4 grid items-end gap-4 ${big ? "sm:grid-cols-[1fr_1.2fr]" : ""}`}>
                <div><div className="text-[30px] font-semibold leading-none tracking-tight text-accent">{ev.stats[0].v}</div><div className="mt-1 text-[12.5px] leading-snug text-muted">{ev.stats[0].l}</div><div className="mt-0.5 text-[10px] text-faint">{ev.stats[0].src}</div></div>
                {big && <div className="rounded-2xl bg-canvas p-3"><MiniViz spec={ev.chart} /><div className="mt-1.5 text-[10px] text-faint">{ev.chart.title}</div></div>}
              </div>
              <div className="flex-1" />
              {/* hover detail */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-white/95 p-4 backdrop-blur transition-transform duration-300 group-hover:pointer-events-auto group-hover:translate-y-0">
                <div className="hud-label !text-muted">{d.areas.length} areas · {d.services.length} services</div>
                <div className="mt-1.5 flex flex-wrap gap-1">{d.services.slice(0, 3).map((s) => <span key={s.t} className="rounded-full bg-canvas px-2 py-0.5 text-[11px]">{s.t}</span>)}</div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/precision-health/${d.id}/`} className="btn-dark h-9 flex-1 px-3 text-[13px]">Open</Link>
                  <button onClick={() => ask(d.prompts[0] ?? `What does ${d.name} at Biongevity cover?`)} className="btn-light h-9 flex-1 px-3 text-[13px]"><Icon name="sparkle" size={14} weight="duotone" />Ask AI</button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
