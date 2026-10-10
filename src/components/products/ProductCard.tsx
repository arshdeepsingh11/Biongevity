import type { CatalogProduct } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";
import { buyUrl, storeHost } from "@/lib/commerce";

/** Product card. Opens the real product page on bioarolabs.com / bioarodrugs.com. */
export function ProductCard({ p, reason }: { p: CatalogProduct; reason?: string }) {
  const href = buyUrl(p), host = storeHost(href);
  return (
    <a href={href} target="_blank" rel="noopener" data-scan
      className="card group flex flex-col p-5 hover:-translate-y-1 hover:shadow-lift" aria-label={`${p.title} on ${host}`}>
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-canvas text-ink transition-colors group-hover:bg-iri group-hover:text-white"><Icon name={p.icon} size={20} /></span>
        <span className="text-[16px] font-semibold tabular-nums">{formatMoney(p.price, p.currency)}</span>
      </div>
      <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal">{p.tagline ?? p.vendor}</div>
      <div className="mt-1 text-[16px] font-semibold leading-snug tracking-tight">{p.title}</div>
      <div className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{p.bestFor ?? p.summary}</div>
      {reason && <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-canvas px-3 py-2 text-[12px] text-ink/80"><Icon name="sparkle" size={13} className="mt-0.5 shrink-0 text-accent" />{reason}</div>}
      <div className="flex-1" />
      <div className="mt-4 flex items-center justify-between border-t border-ink/[0.06] pt-3 text-[12px] text-faint">
        <span>{host}</span>
        <span className="flex items-center gap-1 font-semibold text-ink transition-colors group-hover:text-accent">View & buy<Icon name="arrow-up-right" size={13} /></span>
      </div>
    </a>
  );
}
