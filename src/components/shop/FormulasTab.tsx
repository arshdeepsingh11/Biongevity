"use client";
import { DRUG_PRODUCTS, DRUGS_URL, PERSONAS, EXAMPLE_PROTOCOL, PRINCIPLES } from "@/data/drugs";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/products/ProductCard";
import { BarList } from "@/components/charts/Charts";
import { MagicCard } from "@/components/fx/MagicCard";
import { OrbitingCircles } from "@/components/fx/OrbitingCircles";

/** Formulas — LONgevity+ ingredient chart, protocol timeline, personas and the full formula range. */
export function FormulasTab({ onMatch }: { onMatch: () => void }) {
  const lp = DRUG_PRODUCTS.find((p) => p.handle === "longevity-plus")!;
  const mg = (lp.ingredients ?? []).filter((i) => i.amount.endsWith("mg")).map((i) => ({ label: i.name, value: parseInt(i.amount), note: i.why }));
  const byHandle = (h: string) => DRUG_PRODUCTS.find((p) => p.handle === h)!;
  return (
    <div className="space-y-10">
      <div className="grid items-center gap-6 overflow-hidden rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06] sm:p-8 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <OrbitingCircles radius={104} duration={30} items={(lp.ingredients ?? []).map((i) => <span key={i.name} className="whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold shadow-card ring-1 ring-ink/[0.06]">{i.name}</span>)}>
            <div className="grid h-24 w-24 place-items-center rounded-full bg-iri text-center text-white shadow-glow"><div><div className="text-[15px] font-semibold leading-tight">LONgevity+</div><div className="text-[10px] text-white/75">NAD+ booster</div></div></div>
          </OrbitingCircles>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-teal">Flagship formula · ${lp.price}</div>
          <h3 className="mt-1 text-[28px] font-semibold tracking-tight">What's in LONgevity+, per serving</h3>
          <p className="mt-2 text-[14px] text-muted">{lp.summary} Transparent amounts — no proprietary blends.</p>
          <div className="mt-5"><BarList data={mg} unit=" mg" /></div>
          <div className="mt-3 text-[12px] text-faint">Also: Vitamin B12 250 µg · Vitamin D3 25 µg (1,000 IU). Source: bioarodrugs.com. {lp.directions}</div>
          <a href={lp.url} target="_blank" rel="noopener" className="btn-dark mt-5">View LONgevity+<Icon name="arrow-up-right" size={14} /></a>
        </div>
      </div>

      <div>
        <h3 className="text-[22px] font-semibold tracking-tight">An example day</h3>
        <p className="mt-1 text-[14px] text-muted">How formulas fit together across a day. An illustration from BioAro Drugs, not a recommendation.</p>
        <div className="relative mt-5 grid gap-4 md:grid-cols-3">
          <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-[2px] bg-gradient-to-r from-accent via-teal to-gold md:block" />
          {EXAMPLE_PROTOCOL.map((s, i) => (
            <div key={s.slot} className="relative">
              <span className="relative z-[1] grid h-12 w-12 place-items-center rounded-full bg-navy text-white ring-4 ring-white"><Icon name={["sun", "dumbbell", "moon"][i]} size={20} /></span>
              <div className="mt-3 text-[16px] font-semibold">{s.slot}</div><div className="text-[12px] text-faint">{s.hint}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">{s.handles.map((h) => <a key={h} href={byHandle(h).url} target="_blank" rel="noopener" className="chip border-ink/10 bg-white text-[12px] hover:text-accent">{byHandle(h).title}</a>)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERSONAS.map((p) => (
          <MagicCard key={p.t} className="p-5">
            <div className="text-[16px] font-semibold">{p.t}</div><p className="mt-1 text-[13px] text-muted">{p.d}</p>
            <div className="mt-3 flex flex-wrap gap-1">{p.tags.map((t) => <span key={t} className="rounded-full bg-canvas px-2 py-0.5 text-[11px] text-muted">{t}</span>)}</div>
          </MagicCard>
        ))}
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3"><h3 className="text-[22px] font-semibold tracking-tight">All formulas · {DRUG_PRODUCTS.length}</h3><button onClick={onMatch} className="text-[14px] font-semibold text-accent">Match formulas to my goals →</button></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{DRUG_PRODUCTS.map((p) => <ProductCard key={p.handle} p={p} />)}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{PRINCIPLES.map((p) => <div key={p.n} className="rounded-2xl bg-canvas p-4"><div className="text-[12px] font-semibold text-teal">{p.n}</div><div className="mt-1 text-[14px] font-semibold">{p.t}</div><div className="mt-1 text-[12.5px] leading-relaxed text-muted">{p.d}</div></div>)}</div>
      <div className="flex justify-center"><a href={`${DRUGS_URL}/shop`} target="_blank" rel="noopener" className="btn-light">Open bioarodrugs.com<Icon name="arrow-up-right" size={14} /></a></div>
    </div>
  );
}
