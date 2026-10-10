import Link from "next/link";
import type { CatalogProduct } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";
import { AddToCart } from "./AddToCart";

export function productHref(p: CatalogProduct) {
  return p.kind === "lab-test" ? `/labs/tests/${p.handle}/` : `/drugs/products/${p.handle}/`;
}

export function ProductCard({ p }: { p: CatalogProduct }) {
  return (
    <div data-scan className="card group flex flex-col p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link href={productHref(p)} className="flex-1">
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-canvas text-ink transition-colors group-hover:bg-iri group-hover:text-white">
            {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <Icon name={p.icon} size={22} />}
          </span>
          <span className="text-[17px] font-semibold">{formatMoney(p.price, p.currency)}</span>
        </div>
        {p.tagline && <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-violet">{p.tagline}</div>}
        <div className={`${p.tagline ? "mt-1" : "mt-4"} text-[17px] font-semibold leading-snug tracking-tight`}>{p.title}</div>
        <div className="mt-2 text-[13px] leading-relaxed text-muted">{p.kind === "lab-test" && p.bestFor ? <><span className="font-semibold text-ink/70">Best suited for · </span>{p.bestFor}</> : p.summary}</div>
        {p.format && <div className="mt-2 text-[12px] text-faint">{p.format}</div>}
      </Link>
      <div className="mt-5 flex items-center gap-2">
        <AddToCart product={p} compact />
        <Link href={productHref(p)} className="btn h-9 px-3 text-[13px] text-muted hover:text-ink">Details<Icon name="arrow-right" size={13} /></Link>
      </div>
    </div>
  );
}
