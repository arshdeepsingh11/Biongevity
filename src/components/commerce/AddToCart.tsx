"use client";
import { useCart } from "./CartProvider";
import { fireConfetti, originFromEvent } from "@/components/fx/Confetti";
import { Icon } from "@/components/ui/Icon";
import type { CatalogProduct } from "@/data/types";
import { cn } from "@/lib/utils";

export function AddToCart({ product, className, label = "Add to bag", compact }: { product: CatalogProduct; className?: string; label?: string; compact?: boolean }) {
  const { add, busy } = useCart();
  return (
    <button disabled={busy || product.availableForSale === false} onClick={(e) => { fireConfetti(originFromEvent(e)); add(product); }}
      className={cn(compact ? "btn h-9 bg-ink px-3.5 text-[13px] text-white" : "btn-dark", "disabled:opacity-50", className)} aria-label={`${label}: ${product.title}`}>
      <Icon name="bag" size={compact ? 14 : 16} />{product.availableForSale === false ? "Sold out" : label}
    </button>
  );
}
