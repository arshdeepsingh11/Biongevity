"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TEST_INTEL, GOAL_TAGS, goalMatch, RETEST_LABEL, EVIDENCE_SCORE, type Evidence, type GoalId, type TestIntel } from "@/lib/testIntel";
import { LAB_COLLECTIONS } from "@/data/labs";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { Donut, BarList, PALETTE } from "@/components/charts/Charts";
import { AIChartFrame, Scatter, Sparkline } from "@/components/charts/AICharts";
import { BuyButton, StoreNote } from "@/components/commerce/BuyButton";
import { EvidencePill } from "./EvidencePill";

type Sort = "match" | "utility" | "low" | "high";
const EVIDENCE: Evidence[] = ["Clinically validated", "Supportive evidence", "Exploratory"];

/**
 * AI Test Navigator — all BioAro Labs tests, scored on your device for your goals.
 * Value map (price vs. test utility), evidence mix, compare up to 3, and Buy on bioarolabs.com.
 */
export function TestNavigator() {
  const { ask } = useAI();
  const [goals, setGoals] = useState<GoalId[]>(["heart", "ageing"]);
  const [ev, setEv] = useState<Evidence | "all">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("match");
  const [sel, setSel] = useState<string | null>(null);
  const [cmp, setCmp] = useState<string[]>([]);
  const [more, setMore] = useState(false);

  const rows = useMemo(() => {
    const w = q.toLowerCase().split(/\s+/).filter(Boolean);
    return TEST_INTEL
      .map((x) => ({ ...x, match: Math.round(goalMatch(x, goals) * 0.5 + x.utility * 0.5) }))
      .filter((x) => (ev === "all" || x.evidence === ev) && w.every((k) => `${x.t.title} ${x.reveals} ${x.categoryLabel}`.toLowerCase().includes(k)))
      .sort((a, b) => (sort === "match" ? b.match - a.match : sort === "utility" ? b.utility - a.utility : sort === "low" ? a.t.price - b.t.price : b.t.price - a.t.price));
  }, [goals, ev, q, sort]);

  const top = rows[0];
  const selected = TEST_INTEL.find((x) => x.t.handle === sel) ?? null;
  const evMix = EVIDENCE.map((e, i) => ({ label: e, value: TEST_INTEL.filter((x) => x.evidence === e).length, color: PALETTE[i] }));
  const perCat = LAB_COLLECTIONS.map((c) => ({ label: c.title.replace(/ & /g, " & "), value: TEST_INTEL.filter((x) => x.t.category === c.handle).length })).sort((a, b) => b.value - a.value);
  const prices = TEST_INTEL.map((x) => x.t.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  const lifetime = TEST_INTEL.filter((x) => x.retest === 0).length;
  const best = [...rows].filter((x) => x.match >= 60).sort((a, b) => a.t.price - b.t.price)[0];
  const toggle = (g: GoalId) => setGoals((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  const toggleCmp = (h: string) => setCmp((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h].slice(-3)));
  const compared = cmp.map((h) => TEST_INTEL.find((x) => x.t.handle === h)!).filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Header + goals */}
      <div className="relative overflow-hidden rounded-[30px] bg-white p-5 shadow-card ai-ring sm:p-6">
        <div aria-hidden className="ai-glow -right-16 -top-16 h-60 w-60" />
        <div className="relative flex flex-wrap items-center gap-3">
          <XevyoOrb size={44} live halo />
          <div className="min-w-[200px] flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">AI Test Navigator</div><div className="text-[22px] font-semibold tracking-tight">{TEST_INTEL.length} BioAro Labs tests, ranked for you</div></div>
          <AIBadge label="Scored on your device" />
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {GOAL_TAGS.map((g) => <button key={g.id} onClick={() => toggle(g.id)} aria-pressed={goals.includes(g.id)} className={`chip h-9 ${goals.includes(g.id) ? "border-ai bg-ai text-on-ai" : "border-ink/10 bg-canvas hover:border-ai/40"}`}><Icon name={g.icon} size={15} />{g.label}</button>)}
        </div>
        {top && (
          <div className="relative mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-ai-soft/70 px-4 py-3 text-[13.5px]">
            <span className="font-semibold text-ai">✦ AI pick:</span>
            <span><b>{top.t.title}</b> fits your goals best ({top.match}%).{best && best.t.handle !== top.t.handle && <> Best value: <b>{best.t.title}</b> at ${best.t.price}.</>}</span>
            <button onClick={() => ask(`I care about ${goals.join(", ")}. Why would ${top.t.title}${best ? ` or ${best.t.title}` : ""} be a good first BioAro Labs test, and what would I do with the results?`, { label: "✦ Why this pick?" })} className="ml-auto font-semibold text-ai underline">Why?</button>
          </div>
        )}
      </div>

      {/* AI stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { v: `${TEST_INTEL.length}`, l: "tests in the catalogue", s: perCat.map((c) => c.value) },
          { v: `${evMix[0].value}`, l: "clinically validated", s: [evMix[2].value, evMix[1].value, evMix[0].value] },
          { v: `$${median}`, l: "median price (CAD)", s: prices.filter((_, i) => i % 4 === 0) },
          { v: `${lifetime}`, l: "done once — results for life", s: [1, 2, 2, 3, lifetime] },
        ].map((k) => (
          <div key={k.l} className="flex items-end justify-between gap-3 rounded-[22px] bg-white p-4 ring-1 ring-ink/[0.06]">
            <div><div className="text-[30px] font-semibold leading-none tracking-tight tabular-nums">{k.v}</div><div className="mt-1.5 text-[12px] text-muted">{k.l}</div></div>
            <Sparkline values={k.s} width={86} height={34} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <AIChartFrame kicker="Value map" title="Price vs. test utility" data={rows.slice(0, 20).map((x) => ({ test: x.t.title, price: x.t.price, utility: x.utility, evidence: x.evidence }))}
          insight={<>Top-left = more useful for less. Utility = 40% evidence · 30% actionability · 20% cost · 10% breadth — the same rules for every test. Tap a dot for details.</>}>
          <Scatter points={rows.map((x) => ({ id: x.t.handle, x: x.t.price, y: x.utility, label: x.t.title, group: x.categoryIndex, r: 4 + (x.match / 100) * 6 }))}
            xLabel="Price (CAD, log scale)" yLabel="Utility" xLog active={sel} onPick={setSel} xFormat={(v) => `$${Math.round(v)}`} />
        </AIChartFrame>
        <div className="grid gap-4">
          <AIChartFrame kicker="Evidence" title="How strong is the science?" data={evMix} insight={<>{Math.round((evMix[0].value / TEST_INTEL.length) * 100)}% of tests use clinically validated markers. Exploratory tests are shown as context, never as a verdict.</>}>
            <Donut data={evMix} size={150} thickness={18} center={`${TEST_INTEL.length}`} sub="tests" />
          </AIChartFrame>
          <AIChartFrame kicker="Catalogue" title="Tests by area" data={perCat}>
            <BarList data={perCat.slice(0, 6)} />
          </AIChartFrame>
        </div>
      </div>

      {/* Selected detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="relative overflow-hidden rounded-[26px] bg-white p-5 ai-ring">
            <div className="flex flex-wrap items-start gap-4">
              <span className="grid h-12 w-12 place-items-center icon-tile"><Icon name={selected.t.icon} size={22} weight="duotone" /></span>
              <div className="min-w-[220px] flex-1">
                <div className="text-[20px] font-semibold tracking-tight">{selected.t.title}</div>
                <div className="mt-1 flex flex-wrap gap-1.5"><EvidencePill e={selected.evidence} /><span className="rounded-full bg-canvas px-2 py-0.5 text-[10.5px] font-semibold text-muted">{selected.categoryLabel}</span></div>
                <p className="mt-2 text-[14px] text-muted">{selected.reveals} {selected.t.bestFor && <>Best for: {selected.t.bestFor}</>}</p>
                <div className="mt-2 text-[12.5px] text-muted">Re-test: {RETEST_LABEL(selected.retest)} · Utility {selected.utility}/100 · Actionability {Math.round(selected.actionability * 100)}%</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <BuyButton href={selected.t.url} store="labs" price={selected.t.price} />
                <button onClick={() => ask(`Explain the BioAro Labs ${selected.t.title} test in plain words: what it measures, who should consider it, how to prepare and what the results can and can't tell me.`, { label: `✦ About ${selected.t.title}` })} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ai"><XevyoOrb size={20} />Explain this test</button>
                <button onClick={() => setSel(null)} className="text-[12px] text-faint underline">Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-10 min-w-[220px] flex-1 items-center gap-2 rounded-full bg-white px-4 ring-1 ring-ink/[0.08] focus-within:ring-ai/40">
          <Icon name="search" size={16} className="text-faint" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tests, e.g. vitamin, gut, testosterone" aria-label="Search tests" className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </div>
        <select value={ev} onChange={(e) => setEv(e.target.value as Evidence | "all")} aria-label="Evidence" className="h-10 rounded-full bg-white px-3 text-[13px] ring-1 ring-ink/[0.08]"><option value="all">All evidence</option>{EVIDENCE.map((e) => <option key={e}>{e}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort" className="h-10 rounded-full bg-white px-3 text-[13px] ring-1 ring-ink/[0.08]"><option value="match">Best AI match</option><option value="utility">Highest utility</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.slice(0, more ? rows.length : 9).map((x) => (
          <div key={x.t.handle} className={`flex flex-col rounded-[22px] bg-white p-4 ring-1 transition ${cmp.includes(x.t.handle) ? "ring-ai/60" : "ring-ink/[0.06]"}`}>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-light text-accent"><Icon name={x.t.icon} size={18} weight="duotone" /></span>
              <button onClick={() => setSel(x.t.handle)} className="min-w-0 flex-1 text-left"><span className="block text-[14.5px] font-semibold leading-snug hover:text-accent">{x.t.title}</span><span className="mt-0.5 block text-[11.5px] text-muted">{x.categoryLabel}</span></button>
              <label className="flex items-center gap-1 text-[11px] text-muted"><input type="checkbox" checked={cmp.includes(x.t.handle)} onChange={() => toggleCmp(x.t.handle)} className="h-3.5 w-3.5 accent-[rgb(var(--c-ai))]" />Compare</label>
            </div>
            <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-muted">{x.reveals}</p>
            <div className="mt-2.5 flex items-center gap-2"><EvidencePill e={x.evidence} /><span className="text-[11px] text-muted">{RETEST_LABEL(x.retest)}</span></div>
            <div className="mt-2.5"><div className="flex justify-between text-[11px]"><span className="font-semibold text-ai">✦ AI match</span><span className="tabular-nums">{x.match}%</span></div><div className="mt-1 h-1.5 rounded-full bg-ink/[0.07]"><div className="h-full rounded-full bg-ai transition-all" style={{ width: `${x.match}%` }} /></div></div>
            <div className="mt-auto flex items-center gap-2 pt-3.5">
              <BuyButton href={x.t.url} store="labs" price={x.t.price} size="sm" />
              <button onClick={() => ask(`Explain the ${x.t.title} test and whether it fits someone focused on ${goals.join(" and ") || "healthy ageing"}.`, { label: `✦ About ${x.t.title}` })} className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-ai-soft" aria-label={`Ask Xevyo about ${x.t.title}`}><XevyoOrb size={20} /></button>
            </div>
          </div>
        ))}
      </div>
      {rows.length > 9 && <div className="text-center"><button onClick={() => setMore((m) => !m)} className="btn-light">{more ? "Show fewer" : `Show all ${rows.length} tests`}</button></div>}
      <StoreNote store="labs" />

      {/* Compare tray */}
      <AnimatePresence>
        {compared.length > 0 && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="sticky bottom-[calc(96px+var(--safe-bottom))] z-[30] rounded-[24px] bg-white/95 p-4 shadow-lift ring-1 ring-ai/30 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-2"><XevyoOrb size={26} /><div className="flex-1 text-[14px] font-semibold">Compare {compared.length} test{compared.length > 1 ? "s" : ""}</div>
              {compared.length > 1 && <button onClick={() => ask(`Compare these BioAro Labs tests for me: ${compared.map((c) => `${c.t.title} ($${c.t.price}, ${c.evidence})`).join("; ")}. Which suits which person, and is there overlap?`, { label: "✦ Compare with Xevyo" })} className="btn-ai h-9 px-4 text-[13px]">Compare with Xevyo</button>}
              <button onClick={() => setCmp([])} className="text-[12px] text-faint underline">Clear</button></div>
            <div className="no-scrollbar mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] text-[12.5px]">
                <tbody>
                  {([["Test", (c: TestIntel) => <b>{c.t.title}</b>], ["Price", (c: TestIntel) => `$${c.t.price}`], ["Evidence", (c: TestIntel) => <EvidencePill e={c.evidence} />], ["Utility", (c: TestIntel) => `${c.utility}/100`], ["Evidence score", (c: TestIntel) => EVIDENCE_SCORE[c.evidence].toFixed(2)], ["Re-test", (c: TestIntel) => RETEST_LABEL(c.retest)], ["", (c: TestIntel) => <BuyButton href={c.t.url} store="labs" size="sm" />]] as const).map(([k, f]) => (
                    <tr key={k} className="border-t border-ink/[0.05]"><th className="w-28 py-1.5 pr-2 text-left font-semibold text-muted">{k}</th>{compared.map((c) => <td key={c.t.handle} className="py-1.5 pr-3 align-top">{f(c)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
