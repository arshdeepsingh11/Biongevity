"use client";
import { useMemo, useState } from "react";
import { LAB_TESTS, LAB_COLLECTIONS, LABS_URL, LAB_STEPS } from "@/data/labs";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/products/ProductCard";
import { BarList, Donut, Stat } from "@/components/charts/Charts";

/** Lab tests — category stats, price ranges, filterable grid. Every card opens the real bioarolabs.com page. */
export function CatalogTab({ onMatch }: { kind: "tests"; onMatch: () => void }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const byCat = LAB_COLLECTIONS.map((c) => { const items = LAB_TESTS.filter((t) => t.category === c.handle); return { c, n: items.length, from: Math.min(...items.map((t) => t.price)) }; }).filter((x) => x.n);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return LAB_TESTS.filter((p) => (cat === "all" || p.category === cat) && (!s || `${p.title} ${p.bestFor ?? ""}`.toLowerCase().includes(s)));
  }, [cat, q]);
  const visible = all ? shown : shown.slice(0, 9);
  const short = (t: string) => t.replace(" & ", " & ").replace("Biological Aging & Healthspan Panels", "Ageing panels").replace("Inflammation & Biological Aging", "Inflammation").replace("Brain Aging & Neurodegeneration", "Brain ageing").replace("Vitamin & Nutritional Status", "Vitamins").replace("Hormone & Steroid Balance", "Hormones").replace("Amino Acids & Metabolism", "Amino acids").replace("Vascular & Organ Stress", "Vascular & organ");

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat v={String(LAB_TESTS.length)} l="tests across BioAro Labs" accent />
        <Stat v={String(byCat.length)} l="categories, from genome to vitamins" />
        <Stat v={`$${Math.min(...LAB_TESTS.map((t) => t.price))}`} l="lowest single-marker price (USD)" />
        <Stat v="100X" l="deepest whole-genome coverage offered" src="bioarolabs.com" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-4 text-[14px] font-semibold">Tests by category</div><Donut data={byCat.map((x) => ({ label: short(x.c.title), value: x.n }))} center={String(LAB_TESTS.length)} sub="tests" size={170} /></div>
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-4 text-[14px] font-semibold">Starting price by category (USD)</div><BarList data={byCat.sort((a, b) => a.from - b.from).map((x) => ({ label: short(x.c.title), value: x.from }))} format={(v) => `$${Math.round(v)}`} /></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">{LAB_STEPS.map((s) => <div key={s.n} className="rounded-2xl bg-canvas p-4"><div className="text-[12px] font-semibold text-accent">{s.n}</div><div className="mt-1 text-[15px] font-semibold">{s.t}</div><div className="mt-1 text-[13px] text-muted">{s.d}</div></div>)}</div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ handle: "all", title: "All", icon: "grid" }, ...LAB_COLLECTIONS].map((c) => (
              <button key={c.handle} onClick={() => { setCat(c.handle); setAll(false); }} className={`chip shrink-0 ${cat === c.handle ? "border-transparent bg-navy text-white" : "border-ink/10 bg-white text-muted hover:text-ink"}`}><Icon name={c.icon} size={14} />{c.handle === "all" ? "All" : short(c.title)}</button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tests" aria-label="Search tests" className="h-11 w-full rounded-full border border-ink/10 bg-white pl-10 pr-4 text-[14px] outline-none focus:border-accent" />
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
        {!shown.length && <div className="mt-6 rounded-2xl bg-canvas p-6 text-center text-[14px] text-muted">No tests match. Try another word or <button onClick={onMatch} className="font-semibold text-accent">take the match quiz</button>.</div>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {shown.length > 9 && <button onClick={() => setAll((v) => !v)} className="btn-light">{all ? "Show less" : `Show all ${shown.length}`}</button>}
          <a href={`${LABS_URL}/shop`} target="_blank" rel="noopener" className="btn-light">Open bioarolabs.com<Icon name="arrow-up-right" size={14} /></a>
        </div>
      </div>
    </div>
  );
}
