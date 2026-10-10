"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DRUG_PRODUCTS, DRUG_COLLECTIONS, GOALS, PRINCIPLES, SACHET_POINTS, DRUGS_URL, buildProtocol } from "@/data/drugs";
import { Icon } from "@/components/ui/Icon";
import { TabBar, useHashTab } from "@/components/ui/Tabs";
import { AIFlow } from "@/components/fx/AIFlow";
import { MagicCard } from "@/components/fx/MagicCard";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { BarList, Donut, Stat } from "@/components/charts/Charts";
import { FormulasTab } from "@/components/shop/FormulasTab";
import { AIPanel } from "@/components/ai/AIPanel";
import { buyUrl } from "@/lib/commerce";
import { formatMoney } from "@/lib/utils";

const TABS = [
  { id: "ai", label: "AI protocols", icon: "sparkle" },
  { id: "builder", label: "Protocol builder", icon: "network" },
  { id: "formulas", label: "Formulas", icon: "tablets" },
  { id: "science", label: "Science & quality", icon: "atom" },
] as const;

/** BioAro Drugs hub — AI-guided bioactive protocols: how it works, live builder, formulas and principles. */
export function DrugsHub() {
  const [tab, go] = useHashTab(TABS);
  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={go} id="drugs" />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="mt-8">
          {tab === "ai" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat v={String(DRUG_PRODUCTS.length)} l="bioactive formulas" accent />
                <Stat v={String(DRUG_COLLECTIONS.length)} l="goal collections" />
                <Stat v="0" l="proprietary blends — every dose shown" />
                <Stat v="2 inputs" l="your goals and routine build the protocol" src="bioarodrugs.com" />
              </div>
              <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-8">
                <div className="eyebrow">AI-guided bioactive protocols</div>
                <h3 className="mt-2 text-[26px] font-semibold tracking-tight sm:text-[32px]">From your goals to a daily protocol.</h3>
                <p className="mt-2 max-w-[62ch] text-[15px] text-muted">Tell the AI what you want to improve and how you live. It builds a starting protocol — every ingredient and dose visible — and rebuilds it when your goals change.</p>
                <div className="mt-6"><AIFlow core="Protocol AI" inputs={[{ label: "Energy", icon: "bolt" }, { label: "Sleep", icon: "moon" }, { label: "Focus", icon: "brain" }, { label: "Training", icon: "dumbbell" }, { label: "Longevity", icon: "hourglass" }]} outputs={[{ label: "Morning", icon: "sun" }, { label: "Training", icon: "dumbbell" }, { label: "Evening", icon: "moon" }]} /></div>
              </div>
              <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
                <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-3 text-[14px] font-semibold">Formulas by collection</div><Donut data={DRUG_COLLECTIONS.map((c) => ({ label: c.title, value: DRUG_PRODUCTS.filter((p) => p.category === c.handle).length }))} center={String(DRUG_PRODUCTS.length)} sub="formulas" size={160} /></div>
                <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-3 text-[14px] font-semibold">Price per formula (USD)</div><BarList data={DRUG_PRODUCTS.map((p) => ({ label: p.title, value: p.price }))} format={(v) => `$${v}`} /></div>
              </div>
            </div>
          )}
          {tab === "builder" && <Builder />}
          {tab === "formulas" && <FormulasTab onMatch={() => go("builder")} />}
          {tab === "science" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{PRINCIPLES.map((p) => <MagicCard key={p.n} className="h-full p-5"><div className="text-[28px] font-semibold text-accent/40">{p.n}</div><div className="mt-1 text-[15px] font-semibold">{p.t}</div><p className="mt-1 text-[13px] leading-relaxed text-muted">{p.d}</p></MagicCard>)}</div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[24px] bg-navy p-6"><Icon name="box" size={28} weight="duotone" className="text-accent" /><div className="mt-3 text-[18px] font-semibold">Sachets, designed for real life</div><ul className="mt-3 space-y-2 text-[14px]">{SACHET_POINTS.map((x) => <li key={x} className="flex gap-2"><Icon name="check" size={16} weight="bold" className="mt-0.5 text-teal" />{x}</li>)}</ul></div>
                <AIPanel title="Ask about ingredients" prompts={["What does NMN do?", "Can I take creatine every day?", "Is liposomal glutathione better absorbed?"]} context="BioAro Drugs formulas" />
              </div>
              <a href={`${DRUGS_URL}/shop`} target="_blank" rel="noopener" className="btn-light">Shop on bioarodrugs.com<Icon name="arrow-up-right" size={14} /></a>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Builder() {
  const [goals, setGoals] = useState<string[]>(["energy", "longevity"]);
  const [train, setTrain] = useState("1–3 days");
  const [sleep, setSleep] = useState("Okay");
  const picks = buildProtocol(goals, { train, sleep });
  const seg = (v: string, set: (s: string) => void, opts: string[]) => <div className="inline-flex rounded-full bg-canvas p-1">{opts.map((o) => <button key={o} onClick={() => set(o)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${v === o ? "bg-accent text-white" : "text-muted"}`}>{o}</button>)}</div>;
  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <div className="space-y-5 rounded-[24px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
        <div><div className="text-[15px] font-semibold">What do you want to improve?</div>
          <div className="mt-3 flex flex-wrap gap-2">{GOALS.map((g) => { const on = goals.includes(g.id); return <button key={g.id} aria-pressed={on} onClick={() => setGoals(on ? goals.filter((x) => x !== g.id) : [...goals, g.id])} className={`chip ${on ? "border-transparent bg-accent text-white" : "border-ink/10 bg-white text-muted hover:text-ink"}`}><Icon name={g.icon} size={15} weight="duotone" />{g.label}</button>; })}</div></div>
        <div><div className="mb-2 text-[15px] font-semibold">Training per week</div>{seg(train, setTrain, ["Rarely", "1–3 days", "4+ days"])}</div>
        <div><div className="mb-2 text-[15px] font-semibold">Sleep quality</div>{seg(sleep, setSleep, ["Good", "Okay", "Poor"])}</div>
        <p className="text-[11px] text-faint">Runs in your browser. Educational — check with a clinician if you take medication.</p>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2 text-[13px] text-muted"><span className="h-2 w-2 animate-pulseDot rounded-full bg-teal" />{picks.length ? `${picks.length} formulas matched to your goals` : "Choose at least one goal"}</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {picks.map((p, k) => {
            const card = (
              <a href={buyUrl(p)} target="_blank" rel="noopener" className="flex h-full flex-col rounded-[24px] bg-white p-5 ring-1 ring-ink/[0.06]">
                <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white"><Icon name={p.icon} size={24} weight="duotone" /></span><span className="text-[17px] font-semibold">{formatMoney(p.price)}</span></div>
                <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal">{p.tagline}</div>
                <div className="text-[17px] font-semibold">{p.title}</div><p className="mt-1 text-[13px] text-muted">{p.summary}</p>
                {p.ingredients && <div className="mt-3"><BarList data={p.ingredients.filter((i) => i.amount.endsWith("mg")).map((i) => ({ label: i.name, value: parseInt(i.amount) }))} unit=" mg" /></div>}
                <div className="flex-1" /><div className="mt-3 text-[13px] font-semibold text-accent">View formula ↗</div>
              </a>
            );
            return k === 0 ? <ElectricBorder key={p.handle} className="h-full">{card}</ElectricBorder> : <div key={p.handle}>{card}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
