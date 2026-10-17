"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LAB_COLLECTIONS, LAB_TESTS, SHOP_META, shopSlug, shopIcon } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";
import { GOAL_TAGS, TEST_INTEL, goalMatch, RETEST_LABEL, type GoalId } from "@/lib/testIntel";
import { Icon } from "@/components/ui/Icon";
import { Tilt } from "@/components/fx3d/HoverGallery3D";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { BuyButton } from "@/components/commerce/BuyButton";
import { EvidencePill } from "@/components/labs/EvidencePill";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn, formatMoney } from "@/lib/utils";

/* Hero artwork per category — drawn, so it follows the theme. A real product photo (t.image) replaces it when set. */
function Motif({ cat }: { cat: string }) {
  const s = { stroke: "rgb(var(--c-ai))", fill: "none", strokeWidth: 2.2, strokeLinecap: "round" as const };
  switch (cat) {
    case "genome-sequencing":
      return <g>{Array.from({ length: 11 }, (_, i) => { const y = 18 + i * 10, a = Math.sin(i * 0.75) * 26; return <g key={i}><line x1={120 - a} y1={y} x2={120 + a} y2={y} style={{ stroke: "rgb(var(--c-ai-2) / .45)" }} strokeWidth="2" /><circle cx={120 - a} cy={y} r="4" style={{ fill: "rgb(var(--c-ai))" }} /><circle cx={120 + a} cy={y} r="4" style={{ fill: "rgb(var(--c-ai-hi))" }} /></g>; })}</g>;
    case "microbiome":
      return <g>{[[70, 50, 16], [120, 40, 22], [165, 70, 14], [95, 95, 18], [150, 112, 12], [60, 110, 10], [190, 40, 9]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r * 1.4} ry={r} transform={`rotate(${i * 37} ${x} ${y})`} style={{ fill: `rgb(var(--c-ai${i % 2 ? "-hi" : ""}) / .28)`, stroke: "rgb(var(--c-ai) / .6)" }} />{[0, 1, 2].map((k) => <circle key={k} cx={x - r / 2 + k * (r / 2)} cy={y} r="1.8" style={{ fill: "rgb(var(--c-ai))" }} />)}</g>)}</g>;
    case "brain-aging-neurodegeneration":
      return <g><path d="M120 22c-28 0-48 18-48 44 0 14 6 24 14 30 0 14 12 24 26 24h16c14 0 26-10 26-24 8-6 14-16 14-30 0-26-20-44-48-44z" {...s} /><path d="M120 22v98M96 46c10 4 14 12 12 22M144 46c-10 4-14 12-12 22M90 84c10-2 18 2 22 10M150 84c-10-2-18 2-22 10" {...s} strokeWidth="1.6" />{[[100, 60], [140, 60], [110, 98], [132, 98]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" style={{ fill: "rgb(var(--c-ai-hi))" }} />)}</g>;
    case "hormone-steroid-balance":
      return <g>{[[90, 50], [118, 34], [146, 50], [146, 82], [118, 98], [90, 82]].map(([x, y], i, a) => <line key={i} x1={x} y1={y} x2={a[(i + 1) % 6][0]} y2={a[(i + 1) % 6][1]} {...s} />)}{[[146, 82], [174, 66], [174, 98], [146, 114]].map(([x, y], i, a) => i < 3 && <line key={`b${i}`} x1={x} y1={y} x2={a[i + 1][0]} y2={a[i + 1][1]} {...s} />)}<circle cx="118" cy="66" r="7" style={{ fill: "rgb(var(--c-ai-hi) / .5)" }} /><text x="62" y="54" fontSize="12" style={{ fill: "rgb(var(--c-ai))" }} fontWeight="700">OH</text></g>;
    case "vitamin-nutritional-status":
      return <g>{[[80, 50, -30], [130, 40, 20], [100, 95, 60], [160, 90, -10]].map(([x, y, r], i) => <g key={i} transform={`rotate(${r} ${x} ${y})`}><rect x={x - 26} y={y - 11} width="52" height="22" rx="11" style={{ fill: "rgb(var(--c-surface))", stroke: "rgb(var(--c-ai) / .5)" }} /><rect x={x} y={y - 11} width="26" height="22" rx="11" style={{ fill: `rgb(var(--c-ai${i % 2 ? "-2" : "-hi"}) / .8)` }} /></g>)}<text x="56" y="128" fontSize="13" fontWeight="800" style={{ fill: "rgb(var(--c-ai) / .7)" }}>A · D · E · K</text></g>;
    case "inflammation-biological-aging":
      return <g><path d="M30 100 Q60 60 90 92 T150 80 T210 60" {...s} /><path d="M30 112 Q70 90 110 104 T210 90" {...s} style={{ stroke: "rgb(var(--c-ai-hi) / .7)" }} />{[50, 90, 130, 170].map((x, i) => <g key={i}><circle cx={x} cy={44 + (i % 2) * 14} r={10 - i} style={{ fill: "rgb(var(--c-warn) / .18)", stroke: "rgb(var(--c-warn) / .55)" }} /><circle cx={x} cy={44 + (i % 2) * 14} r="2.5" style={{ fill: "rgb(var(--c-warn))" }} /></g>)}</g>;
    case "vascular-organ-stress":
      return <g><path d="M40 80 C80 40 100 120 140 70 S200 60 210 90" {...s} strokeWidth="9" style={{ stroke: "rgb(var(--c-artery) / .35)" }} /><path d="M40 80 C80 40 100 120 140 70 S200 60 210 90" {...s} strokeWidth="2" />{[60, 100, 140, 180].map((x, i) => <circle key={i} cx={x} cy={i % 2 ? 84 : 66} r="4" style={{ fill: "rgb(var(--c-artery))" }} />)}<path d="M150 104c8-10 24-10 28 2 4 12-8 22-14 26-6-4-18-14-14-28z" {...s} /></g>;
    case "amino-acids-metabolism":
      return <g>{Array.from({ length: 8 }, (_, i) => { const x = 40 + i * 24, y = 70 + Math.sin(i) * 24; return <g key={i}>{i < 7 && <line x1={x} y1={y} x2={x + 24} y2={70 + Math.sin(i + 1) * 24} {...s} />}<circle cx={x} cy={y} r="9" style={{ fill: `rgb(var(--c-ai${i % 2 ? "" : "-hi"}) / .3)`, stroke: "rgb(var(--c-ai))" }} /></g>; })}</g>;
    case "biological-aging-healthspan-panels":
      return <g><path d="M96 24h48M96 116h48M100 24c0 26 40 30 40 46s-40 20-40 46M140 24c0 26-40 30-40 46s40 20 40 46" {...s} /><path d="M108 104c4-8 20-8 24 0z" style={{ fill: "rgb(var(--c-ai-hi) / .7)" }} />{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${170 + (i % 2) * 18} ${36 + i * 22})`}><rect x="-3" y="-9" width="6" height="18" rx="3" style={{ fill: "rgb(var(--c-ai) / .55)" }} /><rect x="-3" y={-9 - (4 - i) * 2} width="6" height={(4 - i) * 2} rx="2" style={{ fill: "rgb(var(--c-ai-hi))" }} /></g>)}</g>;
    default:
      return <g><circle cx="120" cy="70" r="40" {...s} /><path d="M120 30v80M80 70h80" {...s} /></g>;
  }
}

/** The test's own icon from bioarolabs.com, on a glass tile; our line icon if it cannot load. */
export function ShopIcon({ t, size = 40 }: { t: CatalogProduct; size?: number }) {
  const [bad, setBad] = useState(false);
  const src = shopIcon(shopSlug(t.title));
  return (
    <span className="icon-tile overflow-hidden bg-white/90 backdrop-blur" style={{ width: size, height: size }}>
      {src && !bad ? <img src={src} alt="" onError={() => setBad(true)} className="h-[78%] w-[78%] object-contain" loading="lazy" /> : <Icon name={t.icon} size={size * 0.48} />}
    </span>
  );
}

const seed = (h: string) => [...h].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
export function TestHero({ t, className }: { t: CatalogProduct; className?: string }) {
  const id = `sh-${t.handle}`, k = seed(t.handle), rot = (k % 24) - 12, dx = (k % 40) - 20, sc = 0.86 + ((k >> 3) % 20) / 100;
  const [bad, setBad] = useState(false);
  if (t.image && !bad) return <img src={t.image} alt={`${t.title} — BioAro Labs`} onError={() => setBad(true)} className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]", className)} loading="lazy" />;
  return (
    <svg viewBox="0 0 240 150" className={cn("h-full w-full", className)} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "rgb(var(--c-surface))" }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-soft))" }} /></linearGradient>
        <radialGradient id={`${id}-glow`} cx=".5" cy=".45" r=".55"><stop offset="0" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0.35 }} /><stop offset="1" style={{ stopColor: "rgb(var(--c-ai-hi))", stopOpacity: 0 }} /></radialGradient>
      </defs>
      <rect width="240" height="150" fill={`url(#${id}-bg)`} />
      <rect width="240" height="150" fill={`url(#${id}-glow)`} />
      <g transform={`translate(${dx} 0) rotate(${rot} 120 70) translate(120 70) scale(${sc}) translate(-120 -70)`}><g className="origin-center transition-transform duration-700 group-hover:scale-[1.06]"><Motif cat={t.category} /></g></g>
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={(k >> i) % 240} cy={((k >> (i + 2)) % 120) + 8} r={1.2 + (i % 3)} style={{ fill: "rgb(var(--c-ai-hi) / .35)" }} />)}
      <path d="M0 128 C70 112 150 146 240 120 L240 150 L0 150 Z" style={{ fill: "rgb(var(--c-ai-2) / .10)" }} />
    </svg>
  );
}

/**
 * Shop-style BioAro catalogue — category by category, each test as a card with its icon, hero artwork,
 * description and CAD price (as listed on bioarolabs.com). Pick goals and Biongevity SI highlights the matches
 * (on-device scoring: evidence × goal match). Checkout happens on bioarolabs.com.
 */
export function ShopCatalog() {
  const { ask } = useAI();
  const [cat, setCat] = useState<string>("all");
  const [goals, setGoals] = useState<GoalId[]>([]);
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const intel = useMemo(() => new Map(TEST_INTEL.map((x) => [x.t.handle, x])), []);
  const cats = cat === "all" ? LAB_COLLECTIONS : LAB_COLLECTIONS.filter((c) => c.handle === cat);
  const order = (list: CatalogProduct[]) => [...list].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : (intel.get(b.handle)!.utility + goalMatch(intel.get(b.handle)!, goals)) - (intel.get(a.handle)!.utility + goalMatch(intel.get(a.handle)!, goals)));
  const toggle = (g: GoalId) => setGoals((x) => (x.includes(g) ? x.filter((y) => y !== g) : [...x, g]));

  return (
    <div>
      <div className="sticky top-[calc(64px+var(--safe-top))] z-20 -mx-4 space-y-2 bg-gradient-to-b from-[rgb(var(--c-pearl))] via-[rgb(var(--c-pearl)/.92)] to-transparent px-4 pb-4 pt-2">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {[{ handle: "all", title: "All tests", icon: "test-tubes" }, ...LAB_COLLECTIONS].map((c) => {
            const n = c.handle === "all" ? LAB_TESTS.length : LAB_TESTS.filter((t) => t.category === c.handle).length;
            return (
              <button key={c.handle} onClick={() => setCat(c.handle)} aria-pressed={cat === c.handle}
                className={cn("flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-[12.5px] font-semibold ring-1 transition", cat === c.handle ? "bg-ink text-pearl ring-ink" : "bg-white text-ink ring-ink/[0.07] hover:ring-ai/40")}>
                <span className="icon-tile h-6 w-6"><Icon name={c.icon} size={12} /></span>{c.title.replace(" & ", " & ")}<span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-ai"><XevyoOrb size={16} />SI match:</span>
          {GOAL_TAGS.map((g) => <button key={g.id} onClick={() => toggle(g.id)} aria-pressed={goals.includes(g.id)} className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold ring-1 transition", goals.includes(g.id) ? "bg-ai text-on-ai ring-ai" : "bg-white/80 text-muted ring-ink/[0.07] hover:text-ai")}>{g.label}</button>)}
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort tests" className="ml-auto h-8 rounded-full bg-white px-3 text-[12px] font-semibold outline-none ring-1 ring-ink/[0.07]">
            <option value="featured">Sort: SI ranking</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-2 space-y-12">
        {cats.map((c) => {
          const list = order(LAB_TESTS.filter((t) => t.category === c.handle));
          if (!list.length) return null;
          const lo = Math.min(...list.map((t) => t.price)), hi = Math.max(...list.map((t) => t.price));
          return (
            <section key={c.handle} aria-labelledby={`cat-${c.handle}`} className="scroll-mt-40" id={`cat-${c.handle}`}>
              <div className="flex flex-wrap items-end gap-3">
                <span className="icon-tile h-12 w-12"><Icon name={c.icon} size={22} /></span>
                <div className="min-w-0 flex-1">
                  <h3 id={`cat-${c.handle}`} className="text-[22px] font-semibold tracking-tight">{c.title}</h3>
                  <p className="text-[13.5px] text-muted">{c.description}</p>
                </div>
                <div className="text-right text-[12px] text-muted"><div className="font-semibold text-ink">{list.length} test{list.length > 1 ? "s" : ""}</div>{formatMoney(lo)}{lo !== hi && ` – ${formatMoney(hi)}`} CAD</div>
              </div>
              <motion.div layout className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence>
                  {list.map((t) => {
                    const x = intel.get(t.handle)!, m = goalMatch(x, goals), pick = goals.length > 0 && m >= 60, meta = SHOP_META[shopSlug(t.title) ?? ""];
                    const card = (
                      <article className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-card ring-1 ring-ink/[0.06]">
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <TestHero t={t} />
                          <span className="absolute left-3 top-3 icon-tile h-10 w-10"><Icon name={t.icon} size={19} /></span>
                          <span aria-hidden className="absolute -bottom-3 -right-2 text-ai opacity-[0.12] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110"><Icon name={t.icon} size={84} /></span>
                          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[12.5px] font-semibold shadow-card backdrop-blur">{formatMoney(t.price)}</span>
                          {pick && <span className="absolute bottom-3 left-3 rounded-full bg-ai px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-on-ai">✦ SI match {m}%</span>}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="flex items-center justify-between gap-2"><span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ai">{c.title.split(" & ")[0]}</span><EvidencePill e={x.evidence} /></div>
                          <h4 className="mt-1 text-[15.5px] font-semibold leading-snug">{t.title}</h4>
                          <p className="mt-1 line-clamp-3 text-[12.5px] leading-snug text-muted">{t.bestFor ?? x.reveals}</p>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-faint"><Icon name="clock" size={12} />{RETEST_LABEL(x.retest)}</div>
                          <div className="mt-auto flex items-center gap-2 pt-3">
                            <BuyButton href={t.url} store="labs" price={t.price} size="sm" className="flex-1" hideStore />
                            <button onClick={() => ask(`Explain the ${t.title} (${formatMoney(t.price)} CAD) in plain words: what it measures, who it is for, and what I would do with the result.`, { label: `✦ ${t.title}` })} aria-label={`Ask SI about ${t.title}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ai-soft ring-1 ring-ai/20 hover:ring-ai/45"><XevyoOrb size={18} /></button>
                          </div>
                        </div>
                      </article>
                    );
                    return (
                      <motion.div key={t.handle} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
                        <Tilt max={7} className="h-full">{pick ? <ElectricBorder radius={22} color="rgb(var(--c-ai))" className="h-full">{card}</ElectricBorder> : card}</Tilt>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </section>
          );
        })}
      </div>
      <p className="mt-8 text-[11.5px] text-faint">Prices in CAD as listed on bioarolabs.com — checkout happens there. Artwork is illustrative; SI match is calculated on your device from evidence and the goals you pick. Education, not a diagnosis.</p>
    </div>
  );
}
