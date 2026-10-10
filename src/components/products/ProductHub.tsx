"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { DecodeText } from "@/components/fx/DecodeText";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Section } from "@/components/ui/Section";
import { useAI } from "@/components/ai/AIProvider";
import { LAB_TESTS, LAB_COLLECTIONS, LABS_URL } from "@/data/labs";
import { DRUG_PRODUCTS, DRUG_COLLECTIONS, DRUGS_URL } from "@/data/drugs";
import type { CatalogProduct } from "@/data/types";
import type { IconName } from "@/components/ui/icons";

/** Goal → which tests to measure it and which formulas support it (rule-based, no data leaves the device). */
const GOALS: { id: string; label: string; icon: IconName; tests: string[]; drugGoals: string[]; why: string }[] = [
  { id: "energy", label: "Energy", icon: "bolt", tests: ["essential-vitamin-health", "cortisol", "core-amino-acid-balance"], drugGoals: ["energy"], why: "Vitamins, cortisol and amino acids are common energy levers." },
  { id: "longevity", label: "Longevity", icon: "hourglass", tests: ["telomere-length-testing", "core-inflammation-aging", "whole-genome-sequencing-30x"], drugGoals: ["longevity"], why: "Baseline for biological ageing and inherited risk." },
  { id: "sleep", label: "Sleep & stress", icon: "moon", tests: ["cortisol", "dhea-s-dehydroepiandrosterone-sulfate"], drugGoals: ["sleep"], why: "Stress hormones shape sleep and recovery." },
  { id: "focus", label: "Focus", icon: "brain", tests: ["brain-health", "vitamin-d-25-hydroxy-d2-d3"], drugGoals: ["focus"], why: "Cognition markers plus key nutrients." },
  { id: "gut", label: "Gut", icon: "activity", tests: ["biogut"], drugGoals: ["recovery"], why: "Microbiome composition and diversity." },
  { id: "hormones", label: "Hormones", icon: "droplet", tests: ["hormone-health", "total-testosterone", "estradiol-e2"], drugGoals: ["womens-health", "energy"], why: "A broad view of hormone balance." },
  { id: "heart", label: "Heart", icon: "heart", tests: ["hs-crp-high-sensitivity-c-reactive-protein", "pai-1-total-plasminogen-activator-inhibitor-1"], drugGoals: ["longevity"], why: "Inflammation and vascular markers." },
  { id: "performance", label: "Performance", icon: "dumbbell", tests: ["advanced-amino-acid-metabolism", "il-6-interleukin-6"], drugGoals: ["performance", "recovery"], why: "Fuel and recovery signals for training." },
  { id: "skin", label: "Skin", icon: "sparkle", tests: ["bioskin"], drugGoals: ["recovery"], why: "Skin microbiome and antioxidant support." },
];

type Rec = { p: CatalogProduct; reason: string };

function recommend(ids: string[]): Rec[] {
  const gs = GOALS.filter((g) => ids.includes(g.id));
  const tests = new Map<string, Rec>(), drugs = new Map<string, Rec>();
  gs.forEach((g) => {
    g.tests.forEach((h) => { const t = LAB_TESTS.find((x) => x.handle === h); if (t && !tests.has(h)) tests.set(h, { p: t, reason: `Measure · ${g.why}` }); });
    DRUG_PRODUCTS.filter((d) => d.goals?.some((x) => g.drugGoals.includes(x))).forEach((d) => { if (!drugs.has(d.handle)) drugs.set(d.handle, { p: d, reason: `Support · matches your ${g.label.toLowerCase()} goal` }); });
  });
  return [...[...tests.values()].slice(0, 4), ...[...drugs.values()].slice(0, 2)];
}

export function ProductHub() {
  const { ask } = useAI();
  const [goals, setGoals] = useState<string[]>(["energy", "longevity"]);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [recs, setRecs] = useState<Rec[]>([]);
  const [tab, setTab] = useState<"tests" | "formulas">("tests");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);

  const run = () => {
    if (!goals.length) return;
    setPhase("run");
    setTimeout(() => { setRecs(recommend(goals)); setPhase("done"); }, 1100);
  };

  const list = tab === "tests" ? LAB_TESTS : DRUG_PRODUCTS;
  const cols = tab === "tests" ? LAB_COLLECTIONS : DRUG_COLLECTIONS;
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter((p) => (cat === "all" || p.category === cat) && (!s || `${p.title} ${p.summary} ${p.bestFor ?? ""}`.toLowerCase().includes(s)));
  }, [list, cat, q]);
  const visible = all ? shown : shown.slice(0, 9);

  return (
    <Section ai="Products" id="products">
      <div className="container-x">
        <Eyebrow>BioAro Labs × BioAro Drugs</Eyebrow>
        <h2 data-reveal className="h-section mt-3 max-w-[18ch]">Measure your biology. Then act on it.</h2>
        <p data-reveal className="lede mt-4 max-w-[60ch]">{LAB_TESTS.length} lab tests and {DRUG_PRODUCTS.length} bioactive formulas. Tell the AI your goals, or browse. Every product opens on its official store.</p>

        {/* AI match */}
        <div data-reveal className="relative mt-10 overflow-hidden rounded-5xl border border-white/[0.08] bg-surface p-6 sm:p-8">
          <ShineBorder radius={32} width={1} />
          <div aria-hidden data-ai-fx className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-aqua/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-aqua"><Icon name="sparkle" size={15} /><DecodeText text="AI MATCH · RULE-BASED · ON-DEVICE" /></div>
            <button onClick={() => ask("Which BioAro Labs test and BioAro Drugs formula fit my goals?")} className="chip border-white/10 bg-canvas text-[13px]"><Icon name="message" size={14} />Ask AI instead</button>
          </div>
          <div className="relative mt-3 text-[24px] font-semibold tracking-tight sm:text-[28px]">What do you want to improve?</div>
          <div className="relative mt-5 flex flex-wrap gap-2">
            {GOALS.map((g) => { const on = goals.includes(g.id); return (
              <button key={g.id} aria-pressed={on} onClick={() => { setGoals((s) => (on ? s.filter((x) => x !== g.id) : [...s, g.id])); setPhase("idle"); }}
                className={`chip ${on ? "border-aqua/50 bg-aqua/10 text-ink shadow-[0_0_18px_rgba(0,229,192,.18)]" : "border-white/10 bg-canvas text-muted hover:text-ink"}`}>
                <Icon name={g.icon} size={15} />{g.label}
              </button>
            ); })}
          </div>
          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            <button onClick={run} disabled={!goals.length || phase === "run"} className="btn-dark h-12 px-6 disabled:opacity-40">
              <Icon name="cpu" size={16} />{phase === "run" ? "Synthesizing…" : "Run analysis"}
            </button>
            <span className="text-[12px] text-faint">Matches goals to tests and formulas. Not medical advice — confirm with a clinician.</span>
          </div>
          <AnimatePresence mode="wait">
            {phase === "run" && (
              <motion.div key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative mt-6 grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((i) => <div key={i} className="h-36 animate-pulse rounded-4xl bg-canvas" style={{ animationDelay: `${i * 120}ms` }} />)}
              </motion.div>
            )}
            {phase === "done" && (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6">
                <div className="mb-3 flex items-center gap-2 text-[13px] text-muted"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-aqua" />{recs.length} matches · measure first, then support</div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recs.map((r) => <ProductCard key={r.p.handle} p={r.p} reason={r.reason} />)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Browse */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" className="inline-flex rounded-full bg-surface p-1 ring-1 ring-white/[0.08]">
            {([["tests", `Lab tests · ${LAB_TESTS.length}`], ["formulas", `Formulas · ${DRUG_PRODUCTS.length}`]] as const).map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setCat("all"); setAll(false); }}
                className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-all ${tab === id ? "bg-ink text-night" : "text-muted hover:text-ink"}`}>{label}</button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products"
              className="h-11 w-full rounded-full border border-white/10 bg-surface pl-10 pr-4 text-[14px] outline-none placeholder:text-faint focus:border-sky" />
          </div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {[{ handle: "all", title: "All" }, ...cols].map((c) => (
            <button key={c.handle} onClick={() => { setCat(c.handle); setAll(false); }} className={`chip shrink-0 ${cat === c.handle ? "border-sky/50 bg-sky/10 text-ink" : "border-white/10 bg-surface text-muted hover:text-ink"}`}>{c.title}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {shown.length > 9 && <button onClick={() => setAll((v) => !v)} className="btn-light">{all ? "Show less" : `Show all ${shown.length}`}</button>}
          <a href={tab === "tests" ? `${LABS_URL}/shop` : `${DRUGS_URL}/shop`} target="_blank" rel="noopener" className="btn-light">
            Open {tab === "tests" ? "bioarolabs.com" : "bioarodrugs.com"}<Icon name="arrow-up-right" size={14} />
          </a>
        </div>
      </div>
    </Section>
  );
}
