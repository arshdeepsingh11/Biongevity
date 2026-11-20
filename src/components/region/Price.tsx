"use client";
import { useRegion } from "./RegionProvider";
import { convertPrice } from "@/lib/region";

/**
 * A CAD list price in the visitor's currency. In the UAE it shows AED, converted at the indicative rate and
 * marked with an asterisk; put <PriceNote /> once on the page to explain the asterisk.
 */
export function Price({ cad, from, className }: { cad: number; from?: boolean; className?: string }) {
  const { region, price } = useRegion();
  const { approx } = convertPrice(cad, region);
  return <span className={className}>{from && <span className="text-[0.6em] font-normal text-muted">from </span>}{price(cad)}{approx && <sup className="ml-0.5 text-[0.55em] font-semibold text-accent" title="Indicative AED price">*</sup>}</span>;
}

/** Currency code for the current region (CAD / AED). */
export function Currency() {
  const { currency } = useRegion();
  return <>{currency}</>;
}

/** Footnote for converted AED prices. Renders nothing for International visitors. */
export function PriceNote({ className }: { className?: string }) {
  const { isUAE } = useRegion();
  if (!isUAE) return null;
  return <p className={className ?? "mt-5 text-center text-[12.5px] text-faint"}>* AED prices are indicative, converted from our CAD list; the Dubai clinic confirms the exact AED price when you book.</p>;
}
