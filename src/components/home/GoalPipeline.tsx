"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GOAL_PATHS } from "@/data/intelligence";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import { deptById } from "@/data/departments";
import { TEST_INTEL } from "@/lib/testIntel";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BuyButton } from "@/components/commerce/BuyButton";
import { EvidencePill } from "@/components/labs/EvidencePill";

/**
 * From goal to plan — one goal flows through six steps: Goal → Measure → Reveal → Support → Program → Care.
 * Plays automatically like a story; tap any step to open it. Built from our own catalogue on your device.
 */
export function GoalPipeline() {
  const { ask } = useAI();
  const [gid, setGid] = useState(GOAL_PATHS[0].id);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(true);
  const g = GOAL_PATHS.find((x) => x.id === gid)!;
  const test = LAB_TESTS.find((t) => t.title === g.test)!;
  const intel = TEST_INTEL.find((x) => x.t.handle === test.handle);
  const formula = DRUG_PRODUCTS.find((p) => p.handle === g.formula)!;
  const dept = deptById(g.dept);
  const program = PACKAGES.find((p) => g.program.includes(p.name.replace("Biongevity ", "")));

  useEffect(() => { setStep(0); setPlay(true); }, [gid]);
  useEffect(() => { if (!play) return; const id = setTimeout(() => (step < 5 ? setStep(step + 1) : setPlay(false)), 1700); return () => clearTimeout(id); }, [play, step]);

  const nodes = [
    { k: "Goal", icon: g.icon, t: g.label },
    { k: "Measure", icon: "test-tube", t: test.title.replace(/\s*\(.*\)/, "") },
    { k: "Reveal", icon: "eye", t: "What it shows" },
    { k: "Support", icon: formula.icon, t: formula.title },
    { k: "Program", icon: "crown", t: g.program },
    { k: "Care", icon: dept.icon, t: dept.short },
  ];

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Choose a goal" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-8">
        {GOAL_PATHS.map((x) => {
          const on = gid === x.id;
          return (
            <button key={x.id} role="tab" onClick={() => setGid(x.id)} aria-selected={on}
              className={`group relative flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-[14px] font-semibold ring-1 transition md:flex-col md:gap-2.5 md:rounded-[22px] md:px-2 md:py-4 md:text-center md:text-[13px] ${on ? "bg-ink text-pearl ring-ink shadow-lift" : "bg-white text-ink ring-ink/[0.07] hover:-translate-y-0.5 hover:ring-ai/40"}`}>
              <span className={`grid h-8 w-8 place-items-center rounded-full md:h-11 md:w-11 md:rounded-[14px] ${on ? "bg-ai bg-ai-grad text-on-ai" : "icon-tile"}`}><Icon name={x.icon} size={18} /></span>
              <span className="leading-tight">{x.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-[32px] bg-white p-5 shadow-card ring-1 ring-ink/[0.07] sm:p-7">
        <div aria-hidden className="ai-glow -left-20 -top-24 h-72 w-72 !opacity-[0.12]" />
        {/* flow rail */}
        <div className="relative">
          <div aria-hidden className="absolute left-[8%] right-[8%] top-[30px] hidden h-[3px] rounded-full bg-ink/[0.06] md:block">
            <motion.div className="relative h-full rounded-full bg-ai bg-ai-grad" animate={{ width: `${(step / 5) * 100}%` }} transition={{ type: "spring", stiffness: 80, damping: 18 }}>
              <span className="absolute -right-1.5 -top-[5px] h-3.5 w-3.5 rounded-full bg-ai-2 shadow-[0_0_0_4px_rgb(var(--c-ai-2)/.2),0_0_18px_rgb(var(--c-ai-2)/.8)]" />
            </motion.div>
          </div>
          <div className="relative grid grid-cols-3 gap-3 md:grid-cols-6">
            {nodes.map((n, i) => {
              const live = i <= step, on = i === step;
              return (
                <button key={n.k} onClick={() => { setPlay(false); setStep(i); }} className="group flex flex-col items-center text-center">
                  <motion.span animate={{ scale: on ? 1.08 : 1 }} className={`relative grid h-[60px] w-[60px] place-items-center rounded-[20px] transition ${live ? "icon-tile" : "bg-canvas text-faint ring-1 ring-ink/[0.06]"}`}>
                    <Icon name={n.icon} size={24} />
                    {on && <span className="absolute -inset-1.5 rounded-[24px] ring-2 ring-ai/40" />}
                  </motion.span>
                  <span className={`mt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] ${live ? "text-ai" : "text-faint"}`}>{String(i + 1).padStart(2, "0")} {n.k}</span>
                  <span className={`mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug ${live ? "" : "text-faint"}`}>{n.t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* step detail */}
        <AnimatePresence mode="wait">
          <motion.div key={`${gid}-${step}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
            className="relative mt-7 grid grid-cols-1 items-center gap-5 rounded-[26px] bg-canvas p-5 md:grid-cols-[1fr_auto] sm:p-6">
            {step === 0 && <Detail kicker="Your goal" title={g.label} body={<><span className="text-[34px] font-semibold tracking-tight text-ai-grad">{g.stat.v}</span> <span className="text-muted">{g.stat.l}</span></>} note={`Source: ${g.stat.src}`} />}
            {step === 1 && <Detail kicker="Measure · BioAro Labs" title={test.title} body={<>{intel && <EvidencePill e={intel.evidence} />} <span className="ml-1 text-muted">{intel?.reveals ?? test.summary}</span></>} action={<BuyButton href={test.url} store="labs" price={test.price} />} />}
            {step === 2 && <Detail kicker="Reveal" title="What the result can show" body={<span className="text-[16px] leading-relaxed">{g.reveals}</span>} note="Results are reviewed with a clinician and tracked against your own baseline." />}
            {step === 3 && <Detail kicker="Support · BioAro Drugs" title={`${formula.title} — ${formula.tagline}`} body={<span className="text-muted">{formula.summary}</span>} action={<BuyButton href={formula.url} store="drugs" price={formula.price} />} note="Discuss supplements with your clinician, especially with medication." />}
            {step === 4 && <Detail kicker="Program" title={g.program} body={<span className="text-muted">{program ? `${program.diagnostics.slice(0, 3).join(" · ")}` : "Clinic services plus BioAro lab tests, priced by the care team."}</span>} action={<Link href={program ? "/shop/#depth" : "/shop/#browse"} className="btn-dark h-10 px-4 text-[14px]">See program<Icon name="arrow-right" size={14} /></Link>} />}
            {step === 5 && <Detail kicker="Care" title={dept.name} body={<span className="text-muted">{dept.tag} {dept.summary.split(". ")[0]}.</span>} action={<div className="flex flex-wrap gap-2"><Link href={`/precision-health/${dept.id}/`} className="btn-dark h-10 px-4 text-[14px]">Open {dept.short}</Link><button onClick={() => ask(`My goal is to ${g.label.toLowerCase()}. Explain why ${test.title} and ${formula.title} fit, and what ${dept.name} would do.`, { label: `✦ Why this path for “${g.label}”?` })} className="btn-ai h-10 px-4 text-[14px]"><XevyoOrb size={20} />Ask Xevyo why</button></div>} />}
          </motion.div>
        </AnimatePresence>
        <div className="relative mt-4 flex items-center justify-between text-[12px] text-muted">
          <button onClick={() => { if (step === 5) setStep(0); setPlay((p) => !p); }} className="inline-flex items-center gap-1.5 font-semibold text-ai"><Icon name={play ? "stop" : "play"} size={14} />{play ? "Pause" : "Play the path"}</button>
          <span>Built on your device from our catalogue · {step + 1}/6</span>
        </div>
      </div>
    </div>
  );
}
