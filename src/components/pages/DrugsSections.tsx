"use client";
import { useState } from "react";
import Link from "next/link";
import { ProtocolBuilder } from "./ProtocolBuilder";
import { CoverflowCarousel } from "@/components/fx/CoverflowCarousel";
import { Text3DFlip } from "@/components/fx/Text3DFlip";
import { AddToCart } from "@/components/commerce/AddToCart";
import { useCart, productsFromHandles } from "@/components/commerce/CartProvider";
import { fireConfetti } from "@/components/fx/Confetti";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Section } from "@/components/ui/Section";
import { DRUG_PRODUCTS, PERSONAS, EXAMPLE_PROTOCOL } from "@/data/drugs";
import { formatMoney } from "@/lib/utils";

export function BuilderAndPersonas() {
  const [preset, setPreset] = useState<string[] | undefined>();
  return (
    <>
      <Section ai="Protocol builder" className="!pt-0"><div className="container-x"><ProtocolBuilder preset={preset} /></div></Section>
      <Section ai="Start where you are">
        <div className="container-x">
          <Eyebrow>Explore your protocol</Eyebrow>
          <h2 data-reveal className="h-section mt-3">Start where you are.</h2>
          <p data-reveal className="lede mt-3 max-w-[64ch]">Four common starting points. Each one opens BioAro Drugs AI with those goals already selected — the protocol it builds is still derived from your answers.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERSONAS.map((p) => (
              <div key={p.t} data-reveal data-scan className="card flex flex-col p-6">
                <div className="text-[20px] font-semibold">{p.t}</div>
                <p className="mt-2 text-[14px] text-muted">{p.d}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="rounded-full bg-canvas px-2.5 py-1 text-[12px] text-muted">{t}</span>)}</div>
                <div className="flex-1" />
                <button onClick={() => setPreset([...p.goals])} className="btn-light mt-6">Build this protocol<Icon name="arrow-right" size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export function ProductRange() {
  return (
    <Section ai="Product range" className="overflow-hidden">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <div><Eyebrow>Built to work together</Eyebrow><h2 className="h-section mt-3"><Text3DFlip text="Science-led formulas." /></h2>
          <p className="lede mt-3 max-w-[56ch]">Scroll or swipe through the range. Every formula lists what is inside and how much.</p></div>
        <Link href="/drugs/shop/" className="btn-light">Shop all products</Link>
      </div>
      <CoverflowCarousel items={DRUG_PRODUCTS} cardWidth={290} render={(p) => (
        <div className="flex h-[400px] flex-col rounded-4xl bg-white p-6 shadow-lift ring-1 ring-black/[0.05]">
          <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wider text-violet">{p.tagline}</span></div>
          <div className="relative my-5 grid flex-1 place-items-center rounded-3xl bg-gradient-to-br from-[#F4F2FF] to-[#EAF2FF]">
            <span className="grid h-20 w-20 place-items-center rounded-[26px] bg-white shadow-lift"><Icon name={p.icon} size={36} /></span>
          </div>
          <Link href={`/drugs/products/${p.handle}/`} className="text-[22px] font-semibold tracking-tight">{p.title}</Link>
          <div className="mt-1 line-clamp-2 text-[13px] text-muted">{p.summary}</div>
          <div className="mt-4 flex items-center justify-between"><span className="text-[18px] font-semibold">{formatMoney(p.price)}</span><AddToCart product={p} compact label="Add" /></div>
        </div>
      )} />
    </Section>
  );
}

export function ExampleProtocol() {
  const { addMany } = useCart();
  const all = EXAMPLE_PROTOCOL.flatMap((s) => productsFromHandles(s.handles));
  const total = all.reduce((n, p) => n + p.price, 0);
  return (
    <Section ai="Example protocol">
      <div className="container-x">
        <Eyebrow>Your BioAro Drugs protocol</Eyebrow>
        <h2 data-reveal className="h-section mt-3">One person. One protocol.</h2>
        <p data-reveal className="lede mt-3 max-w-[60ch]">Here is what a protocol looks like when it is built around a goal rather than a shelf. Example only — not a recommendation.</p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {EXAMPLE_PROTOCOL.map((s) => (
            <div key={s.slot} data-reveal className="card p-6">
              <div className="text-[19px] font-semibold">{s.slot}</div><div className="text-[13px] text-faint">{s.hint}</div>
              <div className="mt-4 space-y-2">
                {productsFromHandles(s.handles).map((p) => (
                  <Link key={p.handle} href={`/drugs/products/${p.handle}/`} data-scan className="block rounded-2xl bg-canvas p-4">
                    <div className="flex justify-between font-semibold"><span>{p.title}</span><span>{formatMoney(p.price)}</span></div>
                    <div className="mt-1 text-[13px] text-muted">{p.directions}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-ink p-5 text-white">
          <div><span className="text-white/60">{all.length} formulas · </span><span className="text-[20px] font-semibold">{formatMoney(total)}</span></div>
          <button onClick={() => { fireConfetti(); addMany(all); }} className="btn bg-white text-ink">Add this protocol to bag</button>
        </div>
      </div>
    </Section>
  );
}
