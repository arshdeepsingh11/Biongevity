"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GOAL_PATHS } from "@/data/intelligence";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { deptById } from "@/data/departments";
import { buyUrl } from "@/lib/commerce";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";

/** Goal pipeline — one goal flows through measure → reveal → support → program → care, step by step. */
export function GoalPipeline() {
  const { ask } = useAI();
  const [gid, setGid] = useState(GOAL_PATHS[0].id);
  const [step, setStep] = useState(0);
  const g = GOAL_PATHS.find((x) => x.id === gid)!;
  const test = LAB_TESTS.find((t) => t.title === g.test)!;
  const formula = DRUG_PRODUCTS.find((p) => p.handle === g.formula)!;
  const dept = deptById(g.dept);

  useEffect(() => { setStep(0); const id = setInterval(() => setStep((s) => (s < 5 ? s + 1 : s)), 420); return () => clearInterval(id); }, [gid]);

  const nodes = [
    { k: "Goal", icon: g.icon, t: g.label, sub: `${g.stat.v} — ${g.stat.l}`, src: g.stat.src },
    { k: "Measure", icon: "test-tube", t: test.title, sub: `BioAro Labs · $${test.price}`, href: buyUrl(test), ext: true },
    { k: "Reveal", icon: "eye", t: "What it shows", sub: g.reveals },
    { k: "Support", icon: formula.icon, t: formula.title, sub: `${formula.tagline} · $${formula.price}`, href: buyUrl(formula), ext: true },
    { k: "Program", icon: "box", t: g.program, sub: "Care team confirms fit and scheduling", href: g.program.startsWith("Biongevity") ? "/shop/?tab=programs" : "/shop/?tab=packages" },
    { k: "Care", icon: dept.icon, t: dept.name, sub: dept.tag, href: `/precision-health/${dept.id}/` },
  ];

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {GOAL_PATHS.map((x) => <button key={x.id} onClick={() => setGid(x.id)} className={`chip shrink-0 ${gid === x.id ? "border-transparent bg-accent text-white shadow-glow" : "border-ink/10 bg-white text-muted hover:text-ink"}`}><Icon name={x.icon} size={16} weight="duotone" />{x.label}</button>)}
      </div>
      <div className="hud relative mt-6 overflow-hidden rounded-[28px] bg-white/85 p-4 shadow-card ring-1 ring-ink/[0.06] backdrop-blur sm:p-6">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative grid gap-3 md:grid-cols-6">
          <div aria-hidden className="absolute left-[8%] right-[8%] top-9 hidden h-[2px] bg-ink/[0.07] md:block"><motion.div className="h-full bg-iri-x" animate={{ width: `${(step / 5) * 100}%` }} transition={{ duration: 0.35 }} /></div>
          {nodes.map((n, i) => {
            const live = i <= step;
            const card = (
              <motion.div initial={false} animate={{ opacity: live ? 1 : 0.35, y: live ? 0 : 6 }} className={`relative h-full rounded-2xl p-3 ring-1 transition-colors ${live ? "bg-white ring-accent/25" : "bg-white/60 ring-ink/[0.05]"}`}>
                <span className={`relative z-[1] mx-auto grid h-12 w-12 place-items-center rounded-2xl ring-4 ring-pearl ${live ? "bg-iri text-white" : "bg-canvas text-faint"}`}><Icon name={n.icon} size={22} weight="duotone" /></span>
                <div className="mt-2 text-center hud-label">{String(i + 1).padStart(2, "0")} · {n.k}</div>
                <div className="mt-1 text-center text-[13.5px] font-semibold leading-snug">{n.t}</div>
                <div className="mt-1 text-center text-[11.5px] leading-snug text-muted">{n.sub}</div>
                {n.src && <div className="mt-1 text-center text-[10px] text-faint">{n.src}</div>}
              </motion.div>
            );
            return <div key={n.k}>{n.href ? (n.ext ? <a href={n.href} target="_blank" rel="noopener" className="block h-full">{card}</a> : <Link href={n.href} className="block h-full">{card}</Link>) : card}</div>;
          })}
        </div>
        <AnimatePresence>
          {step >= 5 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy px-4 py-3">
              <span className="flex items-center gap-2 text-[13.5px]"><Icon name="check" size={16} weight="bold" className="text-teal" />Path built from our catalogue for “{g.label.toLowerCase()}”.</span>
              <button onClick={() => ask(`My goal is to ${g.label.toLowerCase()}. Explain why ${test.title} and ${formula.title} fit, and what ${dept.name} would do.`)} className="btn-dark h-10 text-[13.5px]"><Icon name="sparkle" size={15} weight="duotone" />Ask Xevyo why</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
