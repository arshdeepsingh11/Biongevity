"use client";
import { AnimatePresence, motion } from "framer-motion";
import { LAB_AREAS, LAB_INTELLIGENCE, LAB_DIFFERENCE, LAB_STEPS, LAB_TESTS, LABS_URL, BIO_FAMILIES, TURNAROUND } from "@/data/labs";
import { Icon } from "@/components/ui/Icon";
import { TabBar, useHashTab } from "@/components/ui/Tabs";
import { AIFlow } from "@/components/fx/AIFlow";
import { MagicCard } from "@/components/fx/MagicCard";
import { BarList, Stat } from "@/components/charts/Charts";
import { CatalogTab } from "@/components/shop/CatalogTab";
import { LongevityQuiz } from "@/components/quiz/LongevityQuiz";
import { HealthPackages } from "./HealthPackages";

const TABS = [
  { id: "intelligence", label: "AI intelligence", icon: "sparkle" },
  { id: "areas", label: "Test areas", icon: "grid" },
  { id: "catalog", label: "All tests", icon: "test-tubes" },
  { id: "packages", label: "Health packages", icon: "box" },
  { id: "process", label: "How it works", icon: "route" },
  { id: "match", label: "Find my test", icon: "target" },
] as const;

/** BioAro Labs hub — AI-connected diagnostics: intelligence, test areas, catalogue, packages, process and matching. */
export function LabsHub() {
  const [tab, go] = useHashTab(TABS);
  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={go} id="labs" />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="mt-8">
          {tab === "intelligence" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat v={String(LAB_TESTS.length)} l="advanced lab tests" accent />
                <Stat v="10" l="Bio test families" />
                <Stat v="100X" l="deepest genome coverage" />
                <Stat v="CLIA" l="registered laboratories, clinician-reviewed results" src="bioarolabs.com" />
              </div>
              <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-8">
                <div className="eyebrow">BioAro Intelligence</div>
                <h3 className="mt-2 text-[26px] font-semibold tracking-tight sm:text-[32px]">Every result, connected by AI.</h3>
                <p className="mt-2 max-w-[62ch] text-[15px] text-muted">Genomics, biomarkers and microbiome results are read together — revealing patterns a single report misses and pointing to the next best step.</p>
                <div className="mt-6"><AIFlow core="BioAro Intelligence" inputs={[{ label: "Genome", icon: "dna" }, { label: "Biomarkers", icon: "test-tube" }, { label: "Microbiome", icon: "gut" }, { label: "Hormones", icon: "flower" }, { label: "Wearables", icon: "wave" }]} outputs={[{ label: "Patterns", icon: "network" }, { label: "Risk signals", icon: "crosshair" }, { label: "Next steps", icon: "route" }]} /></div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">{LAB_INTELLIGENCE.map((x) => <MagicCard key={x.t} className="p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white"><Icon name={x.icon} size={24} weight="duotone" /></span><div className="mt-4 text-[17px] font-semibold">{x.t}</div><p className="mt-1 text-[14px] text-muted">{x.d}</p></MagicCard>)}</div>
              <div className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-ink/[0.06]">
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-ink/[0.06] px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint"><span>Capability</span><span className="w-20 text-center">Typical lab</span><span className="w-20 text-center text-accent">BioAro</span></div>
                {LAB_DIFFERENCE.map((r) => <div key={r.t} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-ink/[0.04] px-5 py-4 last:border-0"><div><div className="text-[15px] font-semibold">{r.t}</div><div className="text-[13px] text-muted">{r.d}</div></div><span className="w-20 text-center text-faint">—</span><span className="grid w-20 place-items-center"><span className="grid h-7 w-7 place-items-center rounded-full bg-teal-light text-teal"><Icon name="check" size={15} weight="bold" /></span></span></div>)}
              </div>
            </div>
          )}

          {tab === "areas" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{BIO_FAMILIES.map((f) => <div key={f.t} className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06]"><Icon name={f.icon} size={26} weight="duotone" className="text-accent" /><div className="mt-2 text-[15px] font-semibold">{f.t}</div><div className="mt-0.5 text-[12.5px] text-muted">{f.d}</div></div>)}</div>
              <div className="grid gap-4 md:grid-cols-2">
                {LAB_AREAS.map((a) => (
                  <details key={a.id} className="group rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] open:ring-accent/25">
                    <summary className="flex cursor-pointer list-none items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-light text-accent"><Icon name={a.icon} size={24} weight="duotone" /></span>
                      <span className="flex-1"><span className="block text-[17px] font-semibold">{a.name}</span><span className="block text-[13px] text-muted">From ${a.from} · {a.explores}</span></span>
                      <Icon name="plus" size={18} className="text-accent transition-transform group-open:rotate-45" />
                    </summary>
                    <dl className="mt-4 grid gap-3 text-[14px]">
                      {[["Sample", a.sample], ["What it shows", a.shows], ["What it doesn't", a.not]].map(([k, v]) => <div key={k} className="rounded-xl bg-canvas p-3"><dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-accent">{k}</dt><dd className="mt-1 text-ink/80">{v}</dd></div>)}
                    </dl>
                  </details>
                ))}
              </div>
            </div>
          )}

          {tab === "catalog" && <CatalogTab kind="tests" onMatch={() => go("match")} />}

          {tab === "packages" && <HealthPackages />}

          {tab === "process" && (
            <div className="space-y-6">
              <div className="relative grid gap-4 md:grid-cols-4">
                <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-[2px] bg-iri-x md:block" />
                {LAB_STEPS.map((s, k) => <div key={s.n} className="relative rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><span className="relative z-[1] grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white ring-4 ring-pearl"><Icon name={["search", "home", "microscope", "chart"][k]} size={22} weight="duotone" /></span><div className="mt-3 text-[12px] font-semibold text-accent">Step {s.n}</div><div className="text-[16px] font-semibold">{s.t}</div><div className="mt-1 text-[13px] text-muted">{s.d}</div></div>)}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-3 text-[14px] font-semibold">Turnaround, upper bound (weeks)</div><BarList data={TURNAROUND} unit=" wks" max={6} /><p className="mt-3 text-[11px] text-faint">Source: BioAro Labs. Most single biomarkers return sooner.</p></div>
                <div className="rounded-[24px] bg-navy p-6"><Icon name="shield" size={28} weight="duotone" className="text-accent" /><div className="mt-3 text-[18px] font-semibold">Clinician-reviewed, privacy-first</div><ul className="mt-3 space-y-2 text-[14px]">{["CLIA-registered laboratories", "Secure results in one connected record", "Prescription required for some genomic tests", "Results explained in plain language"].map((x) => <li key={x} className="flex gap-2"><Icon name="check" size={16} weight="bold" className="mt-0.5 text-teal" />{x}</li>)}</ul></div>
              </div>
              <a href={`${LABS_URL}/shop`} target="_blank" rel="noopener" className="btn-light">Order on bioarolabs.com<Icon name="arrow-up-right" size={14} /></a>
            </div>
          )}

          {tab === "match" && <LongevityQuiz />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
