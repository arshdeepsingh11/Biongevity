"use client";
import { useMemo, useState } from "react";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { Columns, PALETTE } from "@/components/charts/Charts";
import { AIChartFrame, DoseClock, Heatmap } from "@/components/charts/AICharts";
import { BuyButton, StoreNote } from "@/components/commerce/BuyButton";

/** Key ingredients per formula (from the BioAro Drugs product descriptions) and the usual time of day. */
const KEY: Record<string, { ing: string[]; hour: number; when: string }> = {
  "longevity-plus": { ing: ["NMN", "Resveratrol", "CoQ10", "Curcumin", "Vitamin B12", "Vitamin D3"], hour: 8, when: "Breakfast, with food" },
  glutara: { ing: ["Glutathione", "Vitamin C", "Hyaluronic acid", "B vitamins", "Piperine"], hour: 9.5, when: "Morning, in water" },
  "creagen-brain-boost": { ing: ["Creatine", "Magnesium", "Vitamin B12"], hour: 12.5, when: "Midday" },
  "creagen-femme-energy": { ing: ["Creatine", "Iron", "Vitamin B12"], hour: 13, when: "Midday, with food" },
  "creagen-raw-power": { ing: ["Creatine"], hour: 17, when: "With exercise" },
  "creagen-pro-power": { ing: ["Creatine", "Beta-alanine", "Electrolytes"], hour: 17.5, when: "During or after exercise" },
  "cellomega-plus": { ing: ["Omega-3", "Antioxidants"], hour: 19, when: "Dinner, with food" },
  sleepo: { ing: ["Sleep blend"], hour: 22, when: "30 min before bed" },
};

/**
 * AI Protocol Studio — pick formulas; see a daily dose clock, ingredient overlap with AI watch-outs,
 * and monthly cost. On-device logic only; Biongevity SI reviews on click. Purchase on bioarodrugs.com.
 */
export function ProtocolStudio() {
  const { ask } = useAI();
  const [picked, setPicked] = useState<string[]>(["longevity-plus", "cellomega-plus", "creagen-brain-boost"]);
  const items = DRUG_PRODUCTS.filter((p) => picked.includes(p.handle)).sort((a, b) => (KEY[a.handle]?.hour ?? 0) - (KEY[b.handle]?.hour ?? 0));
  const ingredients = useMemo(() => [...new Set(items.flatMap((p) => KEY[p.handle]?.ing ?? []))], [items]);
  const cells = items.map((p) => ingredients.map((i) => ((KEY[p.handle]?.ing ?? []).includes(i) ? 1 : 0)));
  const dupes = ingredients.filter((_, j) => cells.reduce((s, r) => s + r[j], 0) > 1);
  const cost = items.map((p, i) => ({ label: p.title.replace("Creagen ", ""), value: p.price, color: PALETTE[i % PALETTE.length] }));
  const total = cost.reduce((s, c) => s + c.value, 0);
  const toggle = (h: string) => setPicked((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h]));

  const watch = [
    ...dupes.map((d) => `${d} appears in ${cells.filter((r) => r[ingredients.indexOf(d)]).length} formulas — one daily source is usually enough.`),
    ingredients.includes("Iron") ? "Iron: take apart from coffee, tea and calcium; check ferritin before long-term use." : "",
    ingredients.includes("Omega-3") ? "Omega-3: tell your clinician if you take blood thinners." : "",
    items.length > 4 ? "Five or more products: simpler protocols are easier to keep." : "",
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[30px] bg-white p-5 shadow-card ai-ring sm:p-6">
        <div aria-hidden className="ai-glow -left-16 -top-16 h-60 w-60" />
        <div className="relative flex flex-wrap items-center gap-3">
          <XevyoOrb size={44} live halo />
          <div className="min-w-[200px] flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">AI Protocol Studio</div><div className="text-[22px] font-semibold tracking-tight">Build a daily protocol you can actually keep</div></div>
          <AIBadge label="Checks overlap on your device" />
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {DRUG_PRODUCTS.map((p) => <button key={p.handle} onClick={() => toggle(p.handle)} aria-pressed={picked.includes(p.handle)} className={`chip h-9 ${picked.includes(p.handle) ? "border-ai bg-ai text-on-ai" : "border-ink/10 bg-canvas hover:border-ai/40"}`}><Icon name={picked.includes(p.handle) ? "check" : p.icon} size={14} />{p.title}</button>)}
        </div>
      </div>

      {items.length ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AIChartFrame kicker="Your day" title="Dose clock" data={items.map((p) => ({ product: p.title, time: KEY[p.handle]?.when }))} insight={<>{items.length} product{items.length > 1 ? "s" : ""} spread over {new Set(items.map((p) => Math.floor((KEY[p.handle]?.hour ?? 0) / 6))).size} parts of the day. Pair each with a habit you already have — breakfast, lunch, a workout, bedtime.</>}>
              <DoseClock doses={items.map((p) => ({ label: `${p.title} · ${KEY[p.handle]?.when}`, hour: KEY[p.handle]?.hour ?? 9 }))} />
            </AIChartFrame>
            <AIChartFrame kicker="Overlap check" title="Ingredients across your formulas" data={{ products: items.map((p) => p.title), ingredients, duplicates: dupes }}
              insight={dupes.length ? <>Overlap found: <b>{dupes.join(", ")}</b>. See the watch-outs below.</> : <>No ingredient appears twice. Clean protocol.</>} className="lg:col-span-2">
              <Heatmap rows={items.map((p) => p.title)} cols={ingredients} cells={cells} highlightCol={(j) => dupes.includes(ingredients[j])} />
              {watch.length > 0 && <ul className="mt-3 space-y-1.5">{watch.map((w) => <li key={w} className="flex gap-2 rounded-xl bg-warn/10 px-3 py-2 text-[12.5px] text-warn"><Icon name="info" size={14} className="mt-0.5 shrink-0" />{w}</li>)}</ul>}
            </AIChartFrame>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
            <AIChartFrame kicker="Budget" title={`About $${total.toFixed(0)} CAD per order`} data={cost} insight={<>Largest share: <b>{[...cost].sort((a, b) => b.value - a.value)[0]?.label}</b>. Prices as listed on bioarodrugs.com; the store shows the final price.</>}>
              <Columns data={cost} unit="" height={150} />
            </AIChartFrame>
            <div className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.07]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Your protocol · buy on BioAro Drugs</div>
              <div className="mt-3 space-y-2">
                {items.map((p, i) => (
                  <div key={p.handle} className="flex flex-wrap items-center gap-3 rounded-2xl bg-canvas p-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-snow" style={{ background: PALETTE[i % PALETTE.length] }}>{i + 1}</span>
                    <div className="min-w-[140px] flex-1"><div className="text-[14px] font-semibold">{p.title}</div><div className="text-[12px] text-muted">{KEY[p.handle]?.when} · {p.format}</div></div>
                    <BuyButton href={p.url} store="drugs" price={p.price} size="sm" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => ask(`Review this supplement protocol for a mid-age adult: ${items.map((p) => `${p.title} (${(KEY[p.handle]?.ing ?? []).join(", ")}) at ${KEY[p.handle]?.when}`).join("; ")}. Point out overlaps, timing tips and what to discuss with a clinician. Do not prescribe.`, { label: "✦ Review my protocol" })} className="btn-ai h-10 px-4 text-[14px]"><XevyoOrb size={20} />Review with Xevyo</button>
                <a href="https://bioarodrugs.com/us" target="_blank" rel="noopener" className="btn-light h-10 px-4 text-[14px]">Open BioAro Drugs AI<Icon name="arrow-up-right" size={14} /></a>
              </div>
              <div className="mt-3"><StoreNote store="drugs" /></div>
            </div>
          </div>
        </>
      ) : <div className="rounded-[24px] bg-canvas p-8 text-center text-[14px] text-muted">Pick at least one formula to build your protocol.</div>}
      <p className="text-[11.5px] text-faint">Supplements are not a substitute for medical care. Check with your clinician, especially if you take medication, are pregnant or have a health condition.</p>
    </div>
  );
}
