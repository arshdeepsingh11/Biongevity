"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { Icon } from "@/components/ui/Icon";
import { useShopifyCatalog } from "@/hooks/useShopifyCatalog";
import { useAI } from "@/components/ai/AIProvider";
import type { CatalogProduct, Collection } from "@/data/types";

type Sort = "featured" | "price-asc" | "price-desc";

export function CatalogBrowser({ products, collections, vendor, aiPrompt }: { products: CatalogProduct[]; collections: Collection[]; vendor: string; aiPrompt: string }) {
  const sp = useSearchParams();
  const { ask } = useAI();
  const { items, live } = useShopifyCatalog(products, vendor);
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  useEffect(() => { const c = sp.get("c"); if (c) setCat(c); }, [sp]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = items.filter((p) => (cat === "all" || p.category === cat) && (!s || `${p.title} ${p.summary} ${p.bestFor ?? ""}`.toLowerCase().includes(s)));
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [items, cat, q, sort]);

  return (
    <div>
      <div className="sticky top-[calc(62px+var(--safe-top))] z-20 -mx-4 bg-canvas/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:px-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Icon name="search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${items.length} products`} aria-label="Search products"
              className="h-11 w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-[15px] outline-none focus:border-violet" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort" className="h-11 rounded-full border border-black/10 bg-white px-4 text-[14px]">
            <option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
          </select>
          <button onClick={() => ask(aiPrompt)} className="btn h-11 bg-iri px-4 text-[14px] text-white"><Icon name="sparkle" size={15} />Ask AI</button>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="tablist">
          {[{ handle: "all", title: "All" } as Collection, ...collections].map((c) => (
            <button key={c.handle} role="tab" aria-selected={cat === c.handle} onClick={() => setCat(c.handle)}
              className={`chip shrink-0 ${cat === c.handle ? "border-ink bg-ink text-white" : "border-black/10 bg-white text-ink"}`}>{c.title}</button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[13px] text-faint">
        <span>{shown.length} results</span>
        <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-amber-400"}`} />{live ? "Live from Shopify" : "Catalog preview · prices from site"}</span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
      {!shown.length && <div className="py-20 text-center text-muted">No products match. <button className="text-violet" onClick={() => { setQ(""); setCat("all"); }}>Clear filters</button></div>}
    </div>
  );
}
