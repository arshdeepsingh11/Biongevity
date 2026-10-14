"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MARKERS, SYSTEMS } from "@/data/intelligence";
import { deptById } from "@/data/departments";
import { LAB_TESTS } from "@/data/labs";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";

const W = 1000, H = 640, CX = W / 2, CY = H / 2;
const ring = (i: number, n: number, rx: number, ry: number, off = 0) => { const a = -Math.PI / 2 + off + (i / n) * Math.PI * 2; return { x: CX + Math.cos(a) * rx, y: CY + Math.sin(a) * ry }; };
const SYS_POS = Object.fromEntries(SYSTEMS.map((s, i) => [s.id, ring(i, SYSTEMS.length, 190, 150)]));
const MK_POS = Object.fromEntries(MARKERS.map((m, i) => [m.id, ring(i, MARKERS.length, 430, 275, Math.PI / MARKERS.length)]));

/**
 * Biomarker constellation — how markers, body systems and departments connect.
 * Hover to trace connections; click to ask Xevyo. Every link and figure comes from cited data.
 */
export function Constellation() {
  const { ask } = useAI();
  const [sel, setSel] = useState<{ kind: "m" | "s"; id: string }>({ kind: "m", id: "bp" });
  const lit = useMemo(() => {
    const s = new Set<string>();
    if (sel.kind === "m") { s.add(`m:${sel.id}`); MARKERS.find((m) => m.id === sel.id)!.systems.forEach((x) => s.add(`s:${x}`)); }
    else { s.add(`s:${sel.id}`); MARKERS.filter((m) => m.systems.includes(sel.id)).forEach((m) => s.add(`m:${m.id}`)); }
    return s;
  }, [sel]);

  const m = sel.kind === "m" ? MARKERS.find((x) => x.id === sel.id)! : null;
  const sys = sel.kind === "s" ? SYSTEMS.find((x) => x.id === sel.id)! : null;
  const depts = [...new Set((m ? m.systems.flatMap((id) => SYSTEMS.find((s) => s.id === id)!.depts) : sys!.depts))].slice(0, 4).map(deptById);
  const test = m?.test ? LAB_TESTS.find((t) => t.title === m.test) : undefined;
  const q = m ? `What does ${m.label} tell me, and what range should I aim for?` : `How do ${sys!.label.toLowerCase()} connect to the rest of my health?`;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="hud relative overflow-hidden rounded-[28px] bg-white/85 shadow-card ring-1 ring-ink/[0.06] backdrop-blur">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(var(--c-gold-soft)/.9),transparent_60%)]" />
        <div className="no-scrollbar relative overflow-x-auto"><div className="relative w-full min-w-[680px] md:min-w-0" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <ellipse cx={CX} cy={CY} rx="190" ry="150" fill="none" stroke="rgb(var(--c-accent))" strokeOpacity=".12" strokeDasharray="3 6" />
            <ellipse cx={CX} cy={CY} rx="430" ry="275" fill="none" stroke="rgb(var(--c-accent))" strokeOpacity=".08" strokeDasharray="2 8" />
            {MARKERS.flatMap((mk) => mk.systems.map((sid) => {
              const a = MK_POS[mk.id], b = SYS_POS[sid], on = lit.has(`m:${mk.id}`) && lit.has(`s:${sid}`);
              return <line key={mk.id + sid} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? "rgb(var(--c-accent))" : "rgb(var(--c-accent))"} strokeOpacity={on ? 0.85 : 0.07} strokeWidth={on ? 1.8 : 1} strokeDasharray={on ? "4 6" : undefined} style={on ? { animation: "flow 1.2s linear infinite" } : undefined} />;
            }))}
            {SYSTEMS.map((s) => <line key={s.id} x1={CX} y1={CY} x2={SYS_POS[s.id].x} y2={SYS_POS[s.id].y} stroke="rgb(var(--c-teal-soft))" strokeOpacity={lit.has(`s:${s.id}`) ? 0.6 : 0.12} />)}
          </svg>
          <div className="absolute left-1/2 top-1/2 grid h-[16%] min-h-[56px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-iri text-white shadow-glow" style={{ aspectRatio: "1" }}>
            <span className="text-center"><Icon name="user" size={20} weight="duotone" className="mx-auto" /><span className="block text-[10px] font-semibold sm:text-[12px]">You</span></span>
          </div>
          {SYSTEMS.map((s) => {
            const p = SYS_POS[s.id], on = lit.has(`s:${s.id}`), act = sel.kind === "s" && sel.id === s.id;
            return (
              <button key={s.id} onMouseEnter={() => setSel({ kind: "s", id: s.id })} onClick={() => { setSel({ kind: "s", id: s.id }); ask(`How do ${s.label.toLowerCase()} connect to the rest of my health?`); }}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold shadow-card transition-all sm:text-[12.5px] ${act ? "bg-accent text-white" : on ? "bg-white text-ink ring-1 ring-accent/40" : "bg-white/90 text-muted ring-1 ring-ink/[0.06]"}`}
                style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}>
                <Icon name={s.icon} size={15} weight="duotone" /><span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
          {MARKERS.map((mk) => {
            const p = MK_POS[mk.id], on = lit.has(`m:${mk.id}`), act = sel.kind === "m" && sel.id === mk.id;
            return (
              <button key={mk.id} onMouseEnter={() => setSel({ kind: "m", id: mk.id })} onClick={() => { setSel({ kind: "m", id: mk.id }); ask(`What does ${mk.label} tell me, and what range should I aim for?`); }}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-[10.5px] font-semibold transition-all sm:text-[12px] ${act ? "bg-teal text-white shadow-card" : on ? "bg-white text-ink shadow-card ring-1 ring-teal/50" : "bg-white/70 text-faint ring-1 ring-ink/[0.05]"}`}
                style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}>
                <Icon name={mk.icon} size={13} weight="duotone" />{mk.short}
              </button>
            );
          })}
        </div></div>
        <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.06] px-4 py-2.5 text-[11.5px] text-muted">
          <span className="hud-label">{MARKERS.length} biomarkers · {SYSTEMS.length} systems · hover to trace · click to ask</span>
          <span className="flex items-center gap-3"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" />system</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal" />biomarker</span></span>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
        <AnimatePresence mode="wait">
          <motion.div key={sel.kind + sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            <div className="hud-label">{m ? "Biomarker" : "Body system"}</div>
            <div className="mt-2 flex items-center gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${m ? "bg-teal" : "bg-iri"}`}><Icon name={(m ?? sys)!.icon} size={24} weight="duotone" /></span>
              <div><div className="text-[19px] font-semibold leading-tight">{m?.label ?? sys!.label}</div>{m && <div className="text-[12px] text-muted">{m.how}</div>}</div>
            </div>
            {m ? (
              <>
                <div className="mt-4 rounded-xl bg-canvas p-3"><div className="hud-label !text-muted">Reference</div><div className="mt-1 text-[14px] font-semibold">{m.range}</div></div>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/85">{m.fact}</p>
                <p className="mt-1 text-[10.5px] text-faint">Source: {m.src}</p>
              </>
            ) : (
              <>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/85">{sys!.why}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{MARKERS.filter((x) => x.systems.includes(sys!.id)).map((x) => <button key={x.id} onClick={() => setSel({ kind: "m", id: x.id })} className="rounded-full bg-teal-light px-2.5 py-1 text-[12px] font-semibold text-teal">{x.short}</button>)}</div>
              </>
            )}
            <div className="mt-4 hud-label !text-muted">Connected care</div>
            <div className="mt-1.5 space-y-1">{depts.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-[13.5px] hover:bg-canvas"><Icon name={d.icon} size={17} weight="duotone" className="text-accent" />{d.name}<Icon name="arrow-right" size={13} className="ml-auto text-faint" /></Link>)}</div>
            {test && <a href={test.url} target="_blank" rel="noopener" className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5 text-[13px]"><span className="flex items-center gap-2"><Icon name="test-tube" size={16} weight="duotone" className="text-teal" />{test.title}</span><span className="font-semibold">${test.price}</span></a>}
            <button onClick={() => ask(q)} className="mt-3 flex w-full items-center justify-between gap-2 rounded-2xl bg-accent-light px-4 py-3 text-left text-[13.5px] font-semibold text-accent hover:bg-accent/15"><span className="flex items-center gap-2"><Icon name="sparkle" size={16} weight="duotone" />Ask Xevyo about this</span><Icon name="arrow-up-right" size={15} /></button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
