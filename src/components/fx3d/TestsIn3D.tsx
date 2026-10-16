"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { BuyButton } from "@/components/commerce/BuyButton";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { LAB_COLLECTIONS, LAB_TESTS } from "@/data/labs";
import { RETEST_LABEL, TEST_INTEL } from "@/lib/testIntel";
import { formatMoney } from "@/lib/utils";
import { CascadeSlider } from "./CascadeSlider";
import { Carousel3D } from "./Carousel3D";
import { GlassCoinCarousel, type Coin } from "./GlassCoinCarousel";
import { HoverGallery3D } from "./HoverGallery3D";
import { PageFlip3D } from "./PageFlip3D";
import { BeamCircle } from "./BeamCircle";
import { TestFace, collectionOf } from "./TestFace";

type Mode = "cascade" | "ring" | "coins" | "gallery" | "book" | "beam";
const MODES: { id: Mode; label: string; icon: "layers" | "orbit" | "gem" | "grid" | "book" | "network" }[] = [
  { id: "cascade", label: "Cascade", icon: "layers" },
  { id: "ring", label: "3D ring", icon: "orbit" },
  { id: "coins", label: "Glass coins", icon: "gem" },
  { id: "gallery", label: "Gallery", icon: "grid" },
  { id: "book", label: "Page flip", icon: "book" },
  { id: "beam", label: "Beam circle", icon: "network" },
];

/**
 * BioAro tests in 3D — one catalogue, six interactive views. Pick a collection on the beam circle or the chips,
 * then explore the tests as a cascade, a ring, glass coins, a tilt gallery or a book. Every card can be explained
 * by Biongevity SI and bought on bioarolabs.com.
 */
export function TestsIn3D({ initial = "cascade" as Mode }: { initial?: Mode }) {
  const { ask } = useAI();
  const [mode, setMode] = useState<Mode>(initial);
  const [col, setCol] = useState<string | null>(null);
  const [front, setFront] = useState(0);
  const tests = useMemo(() => (col ? LAB_TESTS.filter((t) => t.category === col) : LAB_TESTS.filter((_, k) => k % 3 === 0)).slice(0, 14), [col]);
  const current = tests[Math.min(front, tests.length - 1)] ?? tests[0];
  const intel = current ? TEST_INTEL.find((x) => x.t.handle === current.handle) : undefined;
  const coins: Coin[] = LAB_COLLECTIONS.map((c) => {
    const list = LAB_TESTS.filter((t) => t.category === c.handle), from = Math.min(...list.map((t) => t.price));
    return { id: c.handle, icon: c.icon, title: c.title.replace(/ &.*$/, ""), value: `from ${formatMoney(from)}`, back: `${list.length} tests · ${c.description}` };
  });

  const card = (t: (typeof LAB_TESTS)[number], active: boolean) => active
    ? <ElectricBorder className="h-full" radius={22}><TestFace t={t} /></ElectricBorder>
    : <TestFace t={t} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="View" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {MODES.map((m) => (
            <button key={m.id} role="tab" aria-selected={mode === m.id} onClick={() => { setMode(m.id); setFront(0); }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold ring-1 transition ${mode === m.id ? "bg-ink text-pearl ring-ink" : "bg-white text-muted ring-ink/[0.07] hover:text-ink"}`}>
              <Icon name={m.icon} size={15} />{m.label}
            </button>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:max-w-[52%] lg:px-0">
          <button onClick={() => { setCol(null); setFront(0); }} className={`chip shrink-0 text-[12.5px] ${!col ? "border-ai/40 bg-ai-soft text-ai" : "border-ink/10 bg-white"}`}>Featured</button>
          {LAB_COLLECTIONS.map((c) => (
            <button key={c.handle} onClick={() => { setCol(c.handle); setFront(0); }} className={`chip shrink-0 text-[12.5px] ${col === c.handle ? "border-ai/40 bg-ai-soft text-ai" : "border-ink/10 bg-white"}`}>
              <Icon name={c.icon} size={13} />{c.title.replace(/ &.*$/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative min-w-0 overflow-hidden rounded-[32px] bg-white p-3 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
          
          <AnimatePresence mode="wait">
            <motion.div key={`${mode}-${col}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="relative">
              {mode === "cascade" && <CascadeSlider items={tests} label="BioAro tests" onChange={setFront} render={(t, a) => card(t, a)} />}
              {mode === "ring" && <Carousel3D items={tests.slice(0, 10)} cardWidth={220} height={420} onFront={setFront} render={(t, f) => card(t, f)} />}
              {mode === "coins" && <GlassCoinCarousel coins={coins} onPick={(c) => { setCol(c.id); }} />}
              {mode === "gallery" && <HoverGallery3D items={tests.slice(0, 8)} render={(t) => <button onClick={() => setFront(tests.indexOf(t))} className="block h-full w-full text-left"><TestFace t={t} compact /></button>} />}
              {mode === "book" && (
                <PageFlip3D cover={<BookCover title={col ? collectionOf(tests[0])?.title ?? "BioAro tests" : "BioAro Labs · featured tests"} count={tests.length} />}
                  pages={tests.slice(0, 9).map((t) => <BookPage key={t.handle} t={t} />)} />
              )}
              {mode === "beam" && (
                <BeamCircle nodes={LAB_COLLECTIONS.map((c) => ({ id: c.handle, label: c.title.replace(/ &.*$/, ""), icon: c.icon }))} active={col}
                  onSelect={(id) => { setCol(id); setMode("cascade"); setFront(0); }}
                  center={<div className="flex flex-col items-center text-center"><XevyoOrb size={44} live /><div className="mt-1 text-[11px] font-semibold leading-tight">Biongevity SI</div><div className="text-[10px] text-muted">tap a collection</div></div>} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {current && (
          <AnimatePresence mode="wait">
            <motion.aside key={current.handle} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.25 }}
              className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6">
              <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ In focus</span>{intel && <span className="rounded-full bg-ai-soft px-2 py-0.5 text-[10.5px] font-semibold text-ai">{intel.evidence}</span>}</div>
              <div className="mt-1 text-[22px] font-semibold leading-tight tracking-tight">{current.title}</div>
              <div className="mt-1 text-[13px] text-muted">{collectionOf(current)?.title}</div>
              <p className="mt-3 text-[14px] leading-relaxed">{intel?.reveals ?? current.bestFor ?? current.summary}</p>
              {intel && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[["Value score", `${intel.utility}`], ["Action", `${Math.round(intel.actionability * 100)}%`], ["Re-test", intel.retest === 0 ? "Once" : intel.retest === 12 ? "Yearly" : `${intel.retest} mo`]].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-canvas p-2.5"><div className="text-[16px] font-semibold text-ai">{v}</div><div className="text-[10.5px] text-muted">{k}</div></div>
                  ))}
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <BuyButton href={current.url} store="labs" price={current.price} />
                <button onClick={() => ask(`Explain the ${current.title} in plain words: what it measures, who it suits, and what I would do with the result.`, { label: `✦ Explain ${current.title}` })} className="btn-ai h-10 px-4 text-[13.5px]"><XevyoOrb size={20} />Ask SI</button>
              </div>
              <p className="mt-3 text-[11px] text-faint">Scores are on-device estimates from our catalogue rules. Checkout opens on bioarolabs.com; prices in CAD.</p>
            </motion.aside>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
