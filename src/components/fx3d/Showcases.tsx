"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Carousel3D } from "./Carousel3D";
import { CascadeSlider } from "./CascadeSlider";
import { GlassCoinCarousel, type Coin } from "./GlassCoinCarousel";
import { BeamCircle } from "./BeamCircle";
import { Tilt } from "./HoverGallery3D";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { BuyButton } from "@/components/commerce/BuyButton";
import { DEPARTMENTS, deptById } from "@/data/departments";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import { formatMoney } from "@/lib/utils";

/* Site-wide 3D: each page gets the 3D component that fits its content. */

/** Department services on a turning 3D ring. */
export function ServicesRing({ dept }: { dept: string }) {
  const d = deptById(dept);
  const { ask } = useAI();
  const [front, setFront] = useState(0);
  if (!d || d.services.length < 3) return null;
  const s = d.services[front % d.services.length];
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Carousel3D items={d.services} radius={Math.max(300, d.services.length * 62)} cardWidth={220} height={340} onFront={setFront}
        render={(x, on) => (
          <div className={`flex h-full flex-col rounded-[22px] p-5 shadow-card ring-1 transition ${on ? "ring-ai/40" : "ring-ink/[0.06]"}`} style={{ background: "rgb(var(--c-surface))" }}>
            <span className="icon-tile h-12 w-12"><Icon name={x.icon} size={22} /></span>
            <div className="mt-4 text-[16px] font-semibold leading-snug">{x.t}</div>
            <p className="mt-1.5 line-clamp-5 text-[12.5px] leading-snug text-muted">{x.d}</p>
            {x.time && <div className="mt-auto flex items-center gap-1.5 pt-3 text-[11.5px] font-semibold text-ai"><Icon name="clock" size={13} />{x.time}</div>}
          </div>
        )} />
      <AnimatePresence mode="wait">
        <motion.div key={s.t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai">In front · {front % d.services.length + 1}/{d.services.length}</div>
          <div className="mt-1 text-[19px] font-semibold leading-tight">{s.t}</div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.d}</p>
          {s.prep?.length ? <ul className="mt-3 space-y-1">{s.prep.map((p) => <li key={p} className="flex gap-1.5 text-[12.5px]"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-ai" />{p}</li>)}</ul> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => ask(`What happens during "${s.t}" in ${d.name} at Biongevity, how should I prepare, and what will I learn?`, { label: `✦ ${s.t}` })} className="btn-ai h-9 px-3.5 text-[13px]"><XevyoOrb size={18} />Ask SI</button>
            <a href={`/contact/?interest=${encodeURIComponent(`${d.name}: ${s.t}`)}`} className="btn-light h-9 px-3.5 text-[13px]">Book this</a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** BioAro Drugs formulas as glass coins. */
export function FormulaCoins() {
  const { ask } = useAI();
  const [pick, setPick] = useState(DRUG_PRODUCTS[0]);
  const coins: Coin[] = DRUG_PRODUCTS.map((p) => ({ id: p.handle, icon: p.icon, title: p.title, value: formatMoney(p.price), back: p.tagline ?? p.summary.slice(0, 70) }));
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden"><GlassCoinCarousel coins={coins} onPick={(c) => setPick(DRUG_PRODUCTS.find((p) => p.handle === c.id) ?? DRUG_PRODUCTS[0])} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={pick.handle} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <ElectricBorder radius={24} color="rgb(var(--c-ai))">
            <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
              <div className="flex items-center gap-3"><span className="icon-tile h-11 w-11"><Icon name={pick.icon} size={20} /></span><div><div className="text-[17px] font-semibold">{pick.title}</div><div className="text-[12px] text-muted">{pick.tagline}</div></div></div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{pick.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <BuyButton href={pick.url} store="drugs" price={pick.price} size="sm" />
                <button onClick={() => ask(`Explain ${pick.title} in plain words: what is in it, who it may suit, and what to check with my clinician first.`, { label: `✦ ${pick.title}` })} className="btn-ai h-8 px-3 text-[12px]"><XevyoOrb size={16} />Ask SI</button>
              </div>
            </div>
          </ElectricBorder>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Membership packages as a 3D cascade. */
export function PackageCascade() {
  return (
    <div className="-my-4 overflow-hidden py-4"><CascadeSlider items={PACKAGES} label="Biongevity programs" render={(p, on) => (
      <Tilt max={6} className="h-full">
        <div className={`flex h-full flex-col rounded-[26px] p-6 shadow-card ring-1 ${on ? "ring-ai/40" : "ring-ink/[0.06]"}`} style={{ background: "rgb(var(--c-surface))" }}>
          <div className="flex items-center justify-between gap-2"><span className="icon-tile h-11 w-11"><Icon name={p.handle === "elite" ? "crown" : p.handle === "precision" ? "target" : "sprout"} size={20} /></span>{p.featured && <span className="rounded-full bg-ai px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-on-ai">Most complete</span>}</div>
          <div className="mt-4 text-[20px] font-semibold">{p.name}</div>
          <div className="text-[13px] text-muted">{p.cadence}</div>
          <div className="mt-3 text-[30px] font-semibold tracking-tight">{formatMoney(p.price)} <span className="text-[13px] font-medium text-muted">{p.currency}</span></div>
          <ul className="mt-3 space-y-1.5">{p.diagnostics.slice(0, 4).map((x) => <li key={x} className="flex gap-1.5 text-[12.5px] leading-snug"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-ai" /><span className="line-clamp-2">{x}</span></li>)}</ul>
          <a href={p.url} className="btn-dark mt-auto h-10 justify-center text-[13.5px]">Choose {p.name.replace("Biongevity ", "")}</a>
        </div>
      </Tilt>
    )} /></div>
  );
}
