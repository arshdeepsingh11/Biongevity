"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STREAMS } from "@/data/stats";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";

type Kind = "signal" | "stream" | "core" | "output";
interface N { id: string; label: string; icon: string; kind: Kind; x: number; y: number; parent?: string; info: { title: string; body: string; stats?: { v: string; l: string; src?: string }[] }; q: string }

const W = 1100, H = 580;
const S = (name: keyof typeof STREAMS) => STREAMS[name];
const streamInfo = (name: keyof typeof STREAMS) => ({ title: name, body: S(name).lead, stats: [...S(name).stats].slice(0, 3) });

/** Node graph: signals → streams → BioELR core → outputs. Positions are in viewBox units. */
const NODES: N[] = [
  { id: "core", label: "BioELR", icon: "sparkle", kind: "core", x: 640, y: 290, info: { title: "BioELR — your electronic longevity record", body: "Every stream lands in one record. AI reads them together, finds patterns across systems and hands clinicians a prioritised picture.", stats: [{ v: "5", l: "data streams fused" }, { v: "1", l: "shared record" }, { v: "24/7", l: "continuous analysis" }] }, q: "How does BioELR combine genomics, microbiome and clinical data?" },
  { id: "gen", label: "Genomics", icon: "dna", kind: "stream", x: 360, y: 80, info: streamInfo("Genomics"), q: "What can whole genome sequencing tell me about my health?" },
  { id: "epi", label: "Epigenetics", icon: "layers", kind: "stream", x: 330, y: 185, info: streamInfo("Epigenetics"), q: "What is an epigenetic clock and can I change it?" },
  { id: "mic", label: "Microbiome", icon: "gut", kind: "stream", x: 320, y: 290, info: streamInfo("Microbiome"), q: "How does the gut microbiome affect immunity and metabolism?" },
  { id: "bio", label: "Biological age", icon: "hourglass", kind: "stream", x: 330, y: 395, info: streamInfo("Biological age"), q: "How is biological age measured and how can I lower it?" },
  { id: "cli", label: "Clinical", icon: "stethoscope", kind: "stream", x: 360, y: 500, info: streamInfo("Clinical evaluations"), q: "Which clinical tests best predict healthy ageing?" },
  { id: "wgs", label: "WGS 30X", icon: "dna", kind: "signal", parent: "gen", x: 150, y: 45, info: { title: "Whole Genome Sequencing 30X", body: "Reads the complete genome at clinical-grade depth for inherited risk, traits and medication response.", stats: [{ v: "30X", l: "read depth" }, { v: "4–6 wks", l: "turnaround", src: "BioAro Labs" }] }, q: "What is the difference between 30X and 100X genome sequencing?" },
  { id: "pgx", label: "Pharmacogenomics", icon: "pill", kind: "signal", parent: "gen", x: 160, y: 115, info: { title: "Pharmacogenomics", body: "Shows how your genes affect the way you process common medicines — dose and drug choice.", stats: [{ v: "1×", l: "test, useful for life" }] }, q: "What does a pharmacogenomics test show?" },
  { id: "meth", label: "Methylation clock", icon: "clock", kind: "signal", parent: "epi", x: 150, y: 185, info: { title: "DNA methylation clock", body: "Estimates epigenetic age from methylation at hundreds of CpG sites.", stats: [{ v: "353", l: "CpGs in the Horvath clock", src: "Horvath, 2013" }] }, q: "How accurate are epigenetic age clocks?" },
  { id: "gut", label: "Gut diversity", icon: "gut", kind: "signal", parent: "mic", x: 150, y: 255, info: { title: "Gut microbiome diversity", body: "At-home stool test showing which microbes live in your gut and how balanced they are.", stats: [{ v: "~38T", l: "bacterial cells", src: "Sender et al., 2016" }] }, q: "What does a gut microbiome test measure?" },
  { id: "flora", label: "Skin · oral · vaginal", icon: "flower", kind: "signal", parent: "mic", x: 165, y: 325, info: { title: "BioSkin · BioDental · BioFemme", body: "Microbiome tests for skin, mouth and vaginal health — each linked to symptoms and treatment.", stats: [{ v: "3", l: "site-specific microbiome tests" }] }, q: "When is a skin or oral microbiome test useful?" },
  { id: "telo", label: "Telomeres", icon: "dna", kind: "signal", parent: "bio", x: 145, y: 395, info: { title: "Telomere length", body: "A research marker of cellular ageing, compared with age-matched references.", stats: [{ v: "$299", l: "BioAro Labs test" }] }, q: "Do telomeres really show how fast I'm ageing?" },
  { id: "vo2", label: "VO₂ max", icon: "walk", kind: "signal", parent: "cli", x: 150, y: 465, info: { title: "VO₂ max", body: "Cardiorespiratory fitness — one of the strongest predictors of longevity.", stats: [{ v: "5×", l: "risk, low vs elite fitness", src: "Mandsager et al., 2018" }] }, q: "How can I improve my VO2 max?" },
  { id: "bp", label: "Blood pressure", icon: "gauge", kind: "signal", parent: "cli", x: 160, y: 535, info: { title: "Blood pressure", body: "Home and 24-hour readings — the most accurate picture of true pressure.", stats: [{ v: "135/85", l: "home target", src: "Hypertension Canada" }] }, q: "Is 135/85 high blood pressure at home?" },
  { id: "age", label: "Biological age", icon: "hourglass", kind: "output", x: 960, y: 140, info: { title: "Biological age estimate", body: "Molecular and clinical markers summarised as one age that can move — and be re-tested.", stats: [{ v: "9", l: "blood markers in PhenoAge", src: "Levine et al., 2018" }] }, q: "What does my biological age estimate mean?" },
  { id: "risk", label: "Risk forecast", icon: "crosshair", kind: "output", x: 990, y: 290, info: { title: "Risk forecast", body: "Genetic, biomarker and lifestyle risk read together to prioritise what to check next.", stats: [{ v: "74%", l: "of deaths are from chronic disease", src: "WHO" }] }, q: "How is my health risk forecast calculated?" },
  { id: "plan", label: "Personal plan", icon: "route", kind: "output", x: 960, y: 440, info: { title: "Personal plan", body: "Care, tests, nutrition, movement and formulas — reviewed by a clinician and tracked over time.", stats: [{ v: "4", l: "steps from referral to plan" }] }, q: "What goes into a Biongevity personal plan?" },
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const edges: [string, string][] = [
  ...NODES.filter((n) => n.parent).map((n) => [n.id, n.parent!] as [string, string]),
  ...NODES.filter((n) => n.kind === "stream").map((n) => [n.id, "core"] as [string, string]),
  ...NODES.filter((n) => n.kind === "output").map((n) => ["core", n.id] as [string, string]),
];
const curve = (a: N, b: N) => { const mx = (a.x + b.x) / 2; return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`; };

/** Fusion engine — hover any node for its data; click to ask Xevyo about it. */
export function FusionEngine() {
  const { ask } = useAI();
  const [hot, setHot] = useState("core");
  const node = byId[hot];
  const lit = useMemo(() => {
    const s = new Set([hot]);
    edges.forEach(([a, b]) => { if (a === hot || b === hot) { s.add(a); s.add(b); } });
    if (node.kind === "signal" && node.parent) s.add("core");
    if (node.kind !== "output") NODES.filter((n) => n.kind === "output").forEach((n) => s.add(n.id));
    return s;
  }, [hot, node]);
  const edgeLit = (a: string, b: string) => lit.has(a) && lit.has(b);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="hud relative overflow-hidden rounded-[28px] bg-white/85 shadow-card ring-1 ring-ink/[0.06] backdrop-blur">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-70" />
        <div className="scanline" />
        <div className="no-scrollbar relative overflow-x-auto"><div className="relative w-full min-w-[760px] md:min-w-0" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <defs><linearGradient id="fe" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--c-gold))" /><stop offset=".6" stopColor="rgb(var(--c-accent))" /><stop offset="1" stopColor="rgb(var(--c-teal-soft))" /></linearGradient></defs>
            {edges.map(([a, b]) => {
              const d = curve(byId[a], byId[b]), on = edgeLit(a, b);
              return (
                <g key={a + b}>
                  <path d={d} fill="none" stroke="rgb(var(--c-accent))" strokeOpacity={on ? 0.25 : 0.08} strokeWidth={on ? 2 : 1.2} />
                  <path d={d} fill="none" stroke="url(#fe)" strokeWidth={on ? 2.4 : 1} strokeOpacity={on ? 1 : 0.35} strokeDasharray="5 9" style={{ animation: `flow ${on ? 1 : 2.6}s linear infinite`, transition: "stroke-width .3s, stroke-opacity .3s" }} />
                  {on && <circle r="3.5" fill="rgb(var(--c-accent))"><animateMotion dur="1.8s" repeatCount="indefinite" path={d} /></circle>}
                </g>
              );
            })}
            <circle cx={640} cy={290} r="78" fill="none" stroke="rgb(var(--c-gold))" strokeOpacity=".35" strokeDasharray="2 8" style={{ transformOrigin: "640px 290px", animation: "spinSlow 24s linear infinite" }} />
          </svg>
          {NODES.map((n) => {
            const on = lit.has(n.id), active = hot === n.id;
            const size = n.kind === "core" ? "h-[22%] min-h-[64px] aspect-square rounded-full" : n.kind === "signal" ? "rounded-xl px-2 py-1.5" : "rounded-2xl px-2.5 py-2";
            return (
              <button key={n.id} onMouseEnter={() => setHot(n.id)} onFocus={() => setHot(n.id)} onClick={() => { setHot(n.id); ask(n.q); }}
                aria-label={`${n.label} — click to ask Xevyo`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${size} ${n.kind === "core" ? "grid place-items-center bg-iri text-white shadow-glow" : `flex items-center gap-1.5 bg-white shadow-card ring-1 ${active ? "ring-accent scale-[1.06]" : on ? "ring-accent/30" : "ring-ink/[0.06] opacity-60"}`}`}
                style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}>
                {n.kind === "core"
                  ? <span className="text-center"><Icon name="sparkle" size={22} weight="duotone" className="mx-auto" /><span className="block text-[11px] font-semibold sm:text-[13px]">BioELR</span></span>
                  : <><Icon name={n.icon} size={n.kind === "signal" ? 14 : 18} weight="duotone" className={n.kind === "output" ? "text-teal" : "text-accent"} /><span className={`whitespace-nowrap font-semibold ${n.kind === "signal" ? "hidden text-[11px] sm:inline" : "text-[11px] sm:text-[13px]"}`}>{n.label}</span></>}
              </button>
            );
          })}
        </div></div>
        <div className="relative flex items-center justify-between border-t border-ink/[0.06] px-4 py-2.5 text-[11.5px] text-muted">
          <span className="hud-label"><span className="md:hidden">Swipe · </span>Hover a node · click to ask</span>
          <span className="flex items-center gap-3"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" />signal</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal" />output</span></span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] lg:h-full">
        <AnimatePresence mode="wait">
          <motion.div key={hot} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            <div className="hud-label">{node.kind === "core" ? "Core" : node.kind === "output" ? "AI output" : node.kind === "stream" ? "Data stream" : "Signal"}</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white"><Icon name={node.icon} size={24} weight="duotone" /></span>
              <div className="text-[19px] font-semibold leading-tight">{node.info.title}</div>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{node.info.body}</p>
            {node.info.stats && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {node.info.stats.map((s) => <div key={s.l} className="rounded-xl bg-canvas p-3"><div className="text-[20px] font-semibold tabular-nums text-accent">{s.v}</div><div className="text-[11.5px] leading-snug text-muted">{s.l}</div>{s.src && <div className="mt-0.5 text-[10px] text-faint">{s.src}</div>}</div>)}
              </div>
            )}
            <button onClick={() => ask(node.q)} className="mt-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-accent-light px-4 py-3 text-left text-[13.5px] font-semibold text-accent hover:bg-accent/15">
              <span className="flex items-center gap-2"><Icon name="sparkle" size={16} weight="duotone" />{node.q}</span><Icon name="arrow-up-right" size={15} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
