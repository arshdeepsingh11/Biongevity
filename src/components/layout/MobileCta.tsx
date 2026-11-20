"use client";
import { usePathname } from "next/navigation";
import { BOOK_URL } from "@/lib/env";
import { Icon } from "@/components/ui/Icon";
import { useRegion } from "@/components/region/RegionProvider";

/** Phones and tablets: a sticky bar along the bottom with Call (the region's clinic) and Book now, so booking is always one tap away. */
export function MobileCta() {
  const path = usePathname();
  const { office } = useRegion();
  if (/^\/(admin|login)/.test(path)) return null;
  return (
    <div className="mobile-cta fixed inset-x-0 bottom-0 z-[90] lg:hidden">
      <div className="flex items-center gap-2 px-3 pb-[calc(10px+var(--safe-bottom))] pt-2">
        <a href={office.tel} data-call aria-label={`Call ${office.phone}`} className="btn-light h-12 w-12 shrink-0 !px-0"><Icon name="call" size={19} className="text-accent" /></a>
        <a href={BOOK_URL} target="_blank" rel="noopener" data-book className="btn-dark h-12 flex-1 text-[15px]"><Icon name="calendar" size={17} />Book now</a>
        <span aria-hidden className="w-14 shrink-0" />
      </div>
    </div>
  );
}
