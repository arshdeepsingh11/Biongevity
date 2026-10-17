"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { VideoText } from "@/components/fx/VideoText";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { MARKERS } from "@/data/intelligence";
import { formatMoney } from "@/lib/utils";

/** Suggested question with a hover/focus popover saying what Biongevity SI will cover. */
export function PromptCard({ q, d, icon, covers }: { q: string; d: string; icon: string; covers: string[] }) {
  const { ask } = useAI();
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button onClick={() => ask(q)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} aria-describedby={show ? `pc-${icon}` : undefined}
        className="group flex w-full items-center gap-3 rounded-2xl bg-white/80 p-3 text-left ring-1 ring-ink/[0.07] backdrop-blur transition hover:-translate-y-0.5 hover:ring-ai/35 sm:p-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center icon-tile ring-1 ring-ai/15"><Icon name={icon} size={19} weight="duotone" /></span>
        <span className="min-w-0 flex-1 text-[14.5px] font-medium leading-snug">{q}</span>
        <Icon name="arrow-right" size={15} className="shrink-0 text-ai transition-transform group-hover:translate-x-0.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div id={`pc-${icon}`} role="tooltip" initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="glass pointer-events-none absolute bottom-[calc(100%+8px)] left-0 right-0 z-20 rounded-2xl bg-white/95 p-3.5 text-left shadow-lift ring-1 ring-ai/15 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai"><XevyoOrb size={14} />What SI will cover</div>
            <p className="mt-1 text-[13px] leading-snug text-ink/80">{d}</p>
            <div className="mt-2 flex flex-wrap gap-1">{covers.map((c) => <span key={c} className="rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-medium text-ai">{c}</span>)}</div>
            <span aria-hidden className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 bg-white ring-1 ring-ai/10 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Stat cards: ticking number + a live mini-visual + hover detail ── */

function DeptDots({ on }: { on: boolean }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {DEPARTMENTS.map((d, i) => (
        <span key={d.id} title={d.short} className={`grid h-4 w-4 place-items-center rounded-[5px] transition-colors duration-300 ${on ? "bg-ai text-white" : "bg-ai/15 text-ai"}`} style={{ transitionDelay: on ? `${i * 35}ms` : "0ms" }}>
          <Icon name={d.icon} size={9} />
        </span>
      ))}
    </div>
  );
}

function TestBars({ on }: { on: boolean }) {
  const counts = LAB_COLLECTIONS.map((c) => LAB_TESTS.filter((t) => t.category === c.handle).length);
  const max = Math.max(...counts);
  return (
    <div className="flex h-9 items-end gap-[3px]">
      {counts.map((n, i) => <motion.span key={i} title={`${LAB_COLLECTIONS[i].title}: ${n}`} className="w-2 rounded-t-[3px] bg-ai/70" initial={{ height: 3 }} animate={{ height: on ? `${(n / max) * 100}%` : `${(n / max) * 55}%` }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.03 }} />)}
    </div>
  );
}

function MarkerOrbit({ on }: { on: boolean }) {
  const N = MARKERS.length;
  return (
    <svg viewBox="-24 -24 48 48" className="h-10 w-10">
      <circle r="19" fill="none" stroke="rgb(var(--c-ai) / .18)" strokeDasharray="2 3" />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: on ? 6 : 24, repeat: Infinity, ease: "linear" }}>
        {MARKERS.map((m, i) => { const a = (i / N) * Math.PI * 2; return <circle key={m.id} cx={Math.cos(a) * 19} cy={Math.sin(a) * 19} r={i % 3 ? 1.4 : 2.1} fill="rgb(var(--c-ai))" />; })}
      </motion.g>
      <circle r="6" fill="rgb(var(--c-ai) / .15)" /><circle r="2.5" fill="rgb(var(--c-ai))" />
    </svg>
  );
}

function FormulaRing({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
      <circle cx="20" cy="20" r="16" fill="none" stroke="rgb(var(--c-ai) / .15)" strokeWidth="4" />
      {DRUG_PRODUCTS.map((p, i) => {
        const seg = (2 * Math.PI * 16) / DRUG_PRODUCTS.length;
        return <motion.circle key={p.handle} cx="20" cy="20" r="16" fill="none" stroke="rgb(var(--c-ai))" strokeWidth="4" strokeDasharray={`${seg - 2} ${2 * Math.PI * 16}`} strokeDashoffset={-seg * i}
          initial={{ opacity: 0.25 }} animate={{ opacity: on ? 1 : 0.25 + (i / DRUG_PRODUCTS.length) * 0.6 }} transition={{ delay: on ? i * 0.06 : 0 }} />;
      })}
    </svg>
  );
}

const STATS = [
  { n: DEPARTMENTS.length, l: "departments", h: "/precision-health/", icon: "stethoscope", V: DeptDots, sub: "Specialty care + precision programs, one record", list: DEPARTMENTS.slice(0, 6).map((d) => d.short) },
  { n: LAB_TESTS.length, l: "BioAro lab tests", h: "/precision-health/bioaro-labs/", icon: "test-tubes", V: TestBars, sub: `${LAB_COLLECTIONS.length} categories · from ${formatMoney(Math.min(...LAB_TESTS.map((t) => t.price)))}`, list: LAB_COLLECTIONS.slice(0, 5).map((c) => c.title.split(" ")[0]) },
  { n: MARKERS.length, l: "biomarkers connected", h: "#constellation", icon: "wave", V: MarkerOrbit, sub: "Each linked to body systems and evidence", list: MARKERS.slice(0, 6).map((m) => m.short) },
  { n: DRUG_PRODUCTS.length, l: "AI-matched formulas", h: "/precision-health/bioaro-drugs/", icon: "tablets", V: FormulaRing, sub: "Matched to your goals, not picked off a shelf", list: DRUG_PRODUCTS.slice(0, 4).map((p) => p.title.split(" ")[0]) },
] as const;

export function HeroStats() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((s, i) => (
        <Link key={s.l} href={s.h} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
          className="group relative overflow-hidden rounded-[22px] bg-white/70 p-4 ring-1 ring-ink/[0.06] backdrop-blur transition-transform hover:-translate-y-1 hover:ring-ai/30">
          <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-ai/10 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-60" />
          <div className="relative flex items-start justify-between gap-2">
            <span className="icon-tile h-8 w-8"><Icon name={s.icon} size={15} /></span>
            <s.V on={hover === i} />
          </div>
          <div className="relative mt-3 text-[32px] font-semibold leading-none tracking-tight tabular-nums"><NumberTicker value={s.n} duration={1800} /></div>
          <div className="relative mt-1 hud-label !text-muted">{s.l}</div>
          <AnimatePresence initial={false} mode="wait">
            {hover === i ? (
              <motion.div key="on" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative mt-2 flex flex-wrap gap-1">
                {s.list.map((x) => <span key={x} className="rounded-full bg-ai-soft px-1.5 py-px text-[10.5px] font-medium text-ai">{x}</span>)}
              </motion.div>
            ) : (
              <motion.p key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative mt-2 text-[11.5px] leading-snug text-faint">{s.sub}</motion.p>
            )}
          </AnimatePresence>
        </Link>
      ))}
    </div>
  );
}

/* ── Hero headline: the first line keeps changing; "guided by SI." plays the life film inside its letters ── */
const LINES = ["More good years,", "Longer healthspan,", "Stronger decades,", "Sharper later years,", "Healthier families,", "Earlier answers,"];
/** The life-cycle film behind "guided by SI." (YouTube id). Change it here. */
export const LIFE_FILM_YOUTUBE = "egeDXHcNeNw";
/** Start the film from the middle of life (seconds). */
export const LIFE_FILM_START = 50;

export function HeroHeadline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % LINES.length), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <h1 className="h-display mt-6">
      <span className="sr-only">More good years, guided by SI.</span>
      <span aria-hidden className="relative block h-[1.12em] overflow-hidden text-[min(1em,9.4vw)]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={LINES[i]} className="absolute inset-x-0 top-0 block whitespace-nowrap"
            initial={{ y: "70%", opacity: 0, filter: "blur(10px)" }} animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }} exit={{ y: "-70%", opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}>
            {LINES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden className="mt-1 block">
        <VideoText youtube={LIFE_FILM_YOUTUBE} className="text-[1.22em] font-extrabold leading-[1.1] tracking-[-0.045em]">guided by SI.</VideoText>
      </span>
    </h1>
  );
}
