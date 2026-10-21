"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn } from "@/lib/utils";

/* ── What we do: the BioAro ecosystem around one healthspan record ── */
const NODES = [
  { id: "clinic", t: "Biongevity clinics", icon: "hospital", d: "Precision-health care in Calgary, Dubai and Almelo — cardiology with onsite stress echo, endocrinology, internal medicine, genomics, skin, gut and more, in person or by video.", href: "/clinic/" },
  { id: "labs", t: "BioAro Labs", icon: "test-tubes", d: "47 tests from CLIA-registered labs — whole genome, biomarkers, hormones, inflammation and microbiome — many collected at home.", href: "/precision-health/bioaro-labs/" },
  { id: "drugs", t: "BioAro Drugs", icon: "tablets", d: "Transparent bioactive formulas: every active ingredient and amount disclosed, matched to a goal instead of picked off a shelf.", href: "/precision-health/bioaro-drugs/" },
  { id: "programs", t: "Longevity programs", icon: "crown", d: "Core, Precision and Elite — a baseline, a plan and follow-up over 3, 6 or 12 months, so change is measured, not guessed.", href: "/shop/#depth" },
  { id: "app", t: "Biongevity App", icon: "phone", d: "Your Digital Twin, results, wearables, AI coach and bookings in one place — with a permissioned view for family.", href: "/app/" },
  { id: "bioelr", t: "BioELR", icon: "layers", d: "The longevity-focused health record for clinics and communities: scheduling, billing, devices, AI and HL7 in one system.", href: "/bioelr/" },
] as const;

export function EcosystemOrbit() {
  const { ask } = useAI();
  const [on, setOn] = useState<string>(NODES[0].id);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setOn((c) => NODES[(NODES.findIndex((n) => n.id === c) + 1) % NODES.length].id), 3600);
    return () => clearInterval(t);
  }, [auto]);
  const n = NODES.find((x) => x.id === on)!;
  const pick = (id: string) => { setAuto(false); setOn(id); };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
      {/* orbit diagram */}
      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        <svg viewBox="-260 -260 520 520" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="eco-core"><stop offset="0" stopColor="rgb(var(--c-ai))" stopOpacity=".35" /><stop offset="1" stopColor="rgb(var(--c-ai))" stopOpacity="0" /></radialGradient>
          </defs>
          <circle r="250" fill="url(#eco-core)" opacity=".5" />
          {[110, 175, 230].map((r, i) => <circle key={r} r={r} fill="none" stroke="rgb(var(--c-ai) / .18)" strokeDasharray={i === 1 ? "0" : "3 7"} />)}
          {NODES.map((x, i) => {
            const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2, px = Math.cos(a) * 175, py = Math.sin(a) * 175, act = x.id === on;
            return <line key={x.id} x1="0" y1="0" x2={px} y2={py} stroke={act ? "rgb(var(--c-ai))" : "rgb(var(--c-ai) / .2)"} strokeWidth={act ? 2.5 : 1.2} strokeDasharray={act ? "6 10" : "0"} style={act ? { animation: "beamRun 1s linear infinite" } : undefined} />;
          })}
        </svg>
        {/* centre */}
        <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-center shadow-lift ring-1 ring-ai/25 backdrop-blur-xl">
          <div className="px-2">
            <div className="mx-auto w-fit"><XevyoOrb size={40} live /></div>
            <div className="mt-1 text-[11px] font-semibold leading-tight sm:text-[12.5px]">Your healthspan record</div>
            <div className="hidden text-[10px] text-muted sm:block">explained by Biongevity SI</div>
          </div>
        </div>
        {NODES.map((x, i) => {
          const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2, act = x.id === on;
          return (
            <button key={x.id} onClick={() => pick(x.id)} aria-pressed={act} aria-label={x.t}
              className={cn("absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-transform duration-300", act && "scale-110")}
              style={{ left: `${50 + Math.cos(a) * 33.6}%`, top: `${50 + Math.sin(a) * 33.6}%` }}>
              <span className={cn("grid h-12 w-12 place-items-center rounded-2xl shadow-card ring-1 transition-colors sm:h-14 sm:w-14", act ? "bg-ai text-on-ai ring-ai" : "bg-white/90 text-ai ring-ink/[0.07] backdrop-blur")}><Icon name={x.icon} size={22} /></span>
              <span className={cn("max-w-[92px] text-center text-[11px] font-semibold leading-tight sm:text-[12px]", act ? "text-ai" : "text-ink/75")}>{x.t}</span>
            </button>
          );
        })}
      </div>

      {/* detail */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="rounded-[28px] bg-white/80 p-6 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl sm:p-8">
            <span className="icon-tile h-12 w-12"><Icon name={n.icon} size={22} /></span>
            <div className="mt-4 text-[24px] font-semibold tracking-tight">{n.t}</div>
            <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{n.d}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={n.href} className="btn-dark h-10 px-4 text-[13.5px]">Explore<Icon name="arrow-right" size={14} /></a>
              <button onClick={() => ask(`In plain words, what is ${n.t} at Biongevity and how does it connect to the rest of my care?`, { label: `✦ ${n.t}` })} className="btn-ai h-10 px-4 text-[13px]"><XevyoOrb size={18} />Ask SI</button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {NODES.map((x) => <button key={x.id} onClick={() => pick(x.id)} className={cn("h-8 rounded-full px-3 text-[12px] font-semibold ring-1 transition", x.id === on ? "bg-ai text-on-ai ring-ai" : "bg-white/70 text-muted ring-ink/[0.07] hover:text-ink")}>{x.t}</button>)}
        </div>
      </div>
    </div>
  );
}

/* ── How we do it: the protocol as a living loop ── */
const STEPS = [
  { t: "Baseline", icon: "scan", d: "A full health evaluation: clinic assessment, advanced labs, genome and epigenetic analysis. Your starting point, measured." },
  { t: "Personal plan", icon: "route", d: "Guideline-based care and lifestyle changes chosen for you — tests, formulas, visits — with a clear reason for each." },
  { t: "Monitoring", icon: "wave", d: "Follow-ups, re-tests and wearables over months. Biongevity SI watches the trends against your own baseline." },
  { t: "Holistic care", icon: "users", d: "A multidisciplinary team, education and community — and family who can follow along with your permission." },
] as const;

export function ProtocolLoop() {
  const [i, setI] = useState(0);
  useEffect(() => { if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; const t = setInterval(() => setI((x) => (x + 1) % STEPS.length), 3000); return () => clearInterval(t); }, []);
  const R = 120, C = 2 * Math.PI * R;
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[400px]">
        <svg viewBox="-160 -160 320 320" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle r={R} fill="none" stroke="rgb(var(--c-ai) / .14)" strokeWidth="14" />
          <circle r={R} fill="none" stroke="rgb(var(--c-ai))" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C / 4 - 10} ${C}`} strokeDashoffset={-(C / 4) * i - 5} style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)" }} />
        </svg>
        {STEPS.map((s, k) => {
          const a = (k / 4) * Math.PI * 2 - Math.PI / 2 + Math.PI / 4;
          return (
            <button key={s.t} onClick={() => setI(k)} aria-pressed={i === k} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(a) * 37.5}%`, top: `${50 + Math.sin(a) * 37.5}%` }}>
              <span className={cn("grid h-12 w-12 place-items-center rounded-full shadow-card ring-4 transition-all", i === k ? "scale-110 bg-ai text-on-ai ring-ai/25" : "bg-white text-ai ring-white/60")}><Icon name={s.icon} size={20} /></span>
            </button>
          );
        })}
        <div className="absolute inset-0 grid place-items-center text-center">
          <div><div className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Step {i + 1} of 4</div><div className="mt-1 text-[22px] font-semibold tracking-tight">{STEPS[i].t}</div><div className="mt-1 text-[12px] text-muted">…and round again</div></div>
        </div>
      </div>
      <ol className="space-y-2.5">
        {STEPS.map((s, k) => (
          <li key={s.t}>
            <button onClick={() => setI(k)} className={cn("flex w-full gap-4 rounded-[22px] p-4 text-left ring-1 transition", i === k ? "bg-white/85 shadow-card ring-ai/30 backdrop-blur" : "ring-transparent hover:bg-white/50")}>
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold", i === k ? "bg-ai text-on-ai" : "bg-ai-soft text-ai")}>{k + 1}</span>
              <span><span className="block text-[17px] font-semibold">{s.t}</span><span className="mt-0.5 block text-[14px] leading-relaxed text-muted">{s.d}</span></span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── What makes it different: the data that builds up over time, as a 3D stack ── */
const LAYERS = [
  { t: "Genome", d: "Read once, useful for life", icon: "dna" },
  { t: "Labs & biomarkers", d: "Re-tested to show direction", icon: "test-tubes" },
  { t: "Microbiome", d: "Gut, skin and oral ecosystems", icon: "gut" },
  { t: "Wearables", d: "Sleep, HRV, heart rate, steps", icon: "wave" },
  { t: "Clinic & lifestyle", d: "Visits, plans and what changed", icon: "stethoscope" },
] as const;
