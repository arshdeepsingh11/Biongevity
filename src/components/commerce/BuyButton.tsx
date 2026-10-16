import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const STORES = {
  labs: { name: "BioAro Labs", host: "bioarolabs.com" },
  drugs: { name: "BioAro Drugs", host: "bioarodrugs.com" },
} as const;

/**
 * Buy button for partner stores. Purchases happen on the partner site:
 * the button opens the real product page (new tab) — this website never takes payment.
 */
export function BuyButton({ href, store, price, className, size = "md", label, hideStore }: {
  href: string; store: keyof typeof STORES; price?: number; className?: string; size?: "sm" | "md"; label?: string; hideStore?: boolean;
}) {
  const s = STORES[store];
  return (
    <a href={href} target="_blank" rel="noopener" aria-label={`${label ?? "Buy"} on ${s.name} (opens ${s.host})`}
      className={cn("group inline-flex items-center justify-center gap-1.5 rounded-full bg-ink font-semibold text-pearl transition hover:brightness-125",
        size === "sm" ? "h-8 px-3 text-[12px]" : "h-10 px-4 text-[13.5px]", className)}>
      <Icon name="bag" size={size === "sm" ? 13 : 15} />
      <span>{label ?? "Buy"}{price !== undefined && <span className="ml-1 opacity-80">${price % 1 ? price.toFixed(2) : price}</span>}</span>
      {!hideStore && <span className="hidden opacity-70 sm:inline">· {s.name}</span>}
      <Icon name="arrow-up-right" size={size === "sm" ? 12 : 14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Small honest note under a buy area. */
export function StoreNote({ store }: { store: keyof typeof STORES }) {
  return <p className="text-[11px] text-faint">Checkout opens on {STORES[store].host}. Prices in CAD as listed; the store shows the final price.</p>;
}
