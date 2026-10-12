"use client";
import type { CatalogProduct } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";
import { useCart } from "@/components/shop/CartProvider";

/** Product card — opens the shared detail drawer; "Add" puts it in the one site-wide bag. */
export function ProductCard({ p, reason }: { p: CatalogProduct; reason?: string }) {
  const cart = useCart();
  const id = `${p.vendor === "BioAro Labs" ? "test" : "formula"}:${p.handle}`;
  const inBag = cart.has(id);
  return (
    <div className="card group flex flex-col p-5 hover:-translate-y-1 hover:shadow-lift">
      <button onClick={() => cart.setView(id)} className="text-left" aria-label={`${p.title} details`}>
        <div className="flex items-start justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-canvas text-accent transition-colors group-hover:bg-iri group-hover:text-white"><Icon name={p.icon} size={22} weight="duotone" /></span>
          <span className="text-[16px] font-semibold tabular-nums">{formatMoney(p.price, p.currency)}</span>
        </div>
        <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal">{p.tagline ?? p.vendor}</div>
        <div className="mt-1 text-[16px] font-semibold leading-snug tracking-tight">{p.title}</div>
        <div className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{p.bestFor ?? p.summary}</div>
        {reason && <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-canvas px-3 py-2 text-[12px] text-ink/80"><Icon name="sparkle" size={13} weight="duotone" className="mt-0.5 shrink-0 text-accent" />{reason}</div>}
      </button>
      <div className="flex-1" />
      <div className="mt-4 flex items-center justify-between border-t border-ink/[0.06] pt-3 text-[12px] text-faint">
        <span>{p.vendor} · CAD</span>
        <button onClick={() => (inBag ? cart.setOpen(true) : cart.add(id))} className={`flex h-8 items-center gap-1 rounded-full px-3 text-[12px] font-semibold ${inBag ? "bg-teal-light text-teal" : "bg-accent text-white"}`}>
          <Icon name={inBag ? "check" : "plus"} size={13} weight="bold" />{inBag ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}
