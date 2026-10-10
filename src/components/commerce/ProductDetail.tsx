"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProduct, isShopifyConfigured } from "@/lib/shopify";
import { AddToCart } from "./AddToCart";
import { ProductCard } from "./ProductCard";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { formatMoney } from "@/lib/utils";
import type { CatalogProduct } from "@/data/types";

export function ProductDetail({ initial, related, back }: { initial: CatalogProduct; related: CatalogProduct[]; back: { href: string; label: string } }) {
  const [p, setP] = useState(initial);
  const { ask } = useAI();
  useEffect(() => {
    if (!isShopifyConfigured) return;
    getProduct(initial.handle).then((x) => x && setP(x)).catch(() => undefined);
  }, [initial.handle]);

  return (
    <>
      <section data-ai={p.title} className="relative z-[1] pb-12 pt-[calc(96px+var(--safe-top))] sm:pt-[120px]">
        <div className="container-x">
          <Link href={back.href} className="inline-flex items-center gap-1 text-[14px] font-medium text-muted hover:text-ink"><Icon name="chevron-left" size={16} />{back.label}</Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div data-reveal className="relative grid aspect-square place-items-center overflow-hidden rounded-5xl bg-gradient-to-br from-white via-[#F1EFFF] to-[#EAF2FF] shadow-card">
              <div aria-hidden data-ai-fx className="absolute h-2/3 w-2/3 rounded-full bg-iri opacity-20 blur-3xl" />
              {p.image ? <img src={p.image} alt={p.title} className="relative h-full w-full object-cover" />
                : <span className="relative grid h-40 w-40 place-items-center rounded-[40px] bg-white text-ink shadow-lift"><Icon name={p.icon} size={72} strokeWidth={1.2} /></span>}
            </div>
            <div data-reveal className="flex flex-col">
              <div className="text-[13px] font-semibold text-violet">{p.vendor}{p.tagline ? ` · ${p.tagline}` : ""}</div>
              <h1 className="mt-2 text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">{p.title}</h1>
              <div className="mt-3 text-[26px] font-semibold">{formatMoney(p.price, p.currency)}</div>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">{p.summary}</p>
              {p.bestFor && <div className="mt-4 rounded-2xl bg-white p-4 text-[15px] ring-1 ring-black/[0.05]"><span className="font-semibold">Best suited for · </span>{p.bestFor}</div>}
              {p.format && <div className="mt-3 text-[14px] text-faint">{p.format}{p.directions ? ` · ${p.directions}` : ""}</div>}
              <div className="mt-7 flex flex-wrap gap-3">
                <AddToCart product={p} className="h-12 px-7 text-[16px]" />
                <button onClick={() => ask(`Explain ${p.title} — what it is for and what it doesn't tell or do`)} className="btn relative h-12 overflow-hidden bg-white px-6 shadow-card"><ShineBorder radius={999} /><Icon name="sparkle" size={16} className="text-violet" />Ask AI</button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[12px] text-muted">
                {(p.kind === "lab-test" ? [["shield", "CLIA-registered labs"], ["stethoscope", "Clinician-reviewed"], ["lock", "Secure results"]] : [["layers", "Full formulation"], ["check", "No proprietary blends"], ["box", "Ships from BioAro"]]).map(([i, t]) => (
                  <div key={t} className="rounded-2xl bg-white p-3 ring-1 ring-black/[0.04]"><Icon name={i} size={18} className="mx-auto mb-1 text-violet" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {p.ingredients && (
        <section data-ai="Formulation" className="relative z-[1] pb-12">
          <div className="container-x max-w-[900px]">
            <div className="card overflow-hidden">
              <div className="border-b border-black/[0.06] p-5"><div className="text-[19px] font-semibold">Formulation</div><div className="text-[13px] text-muted">All {p.ingredients.length} actives with their amounts · {p.format}</div></div>
              {p.ingredients.map((i) => (
                <div key={i.name} data-scan className="flex items-center justify-between gap-4 border-b border-black/[0.04] px-5 py-4 last:border-0">
                  <div><div className="text-[15px] font-semibold">{i.name}</div><div className="text-[13px] text-muted">{i.why}</div></div>
                  <div className="shrink-0 text-[15px] font-semibold">{i.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section data-ai="Related" className="relative z-[1] pb-20">
          <div className="container-x">
            <h2 className="text-[26px] font-semibold tracking-tight">You may also consider</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ProductCard key={r.handle} p={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
