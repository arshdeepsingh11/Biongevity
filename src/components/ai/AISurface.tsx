import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/fx/BorderBeam";
import { XevyoOrb } from "./XevyoOrb";
import { AIBadge } from "./AIBadge";

/**
 * AI surface — the wrapper for every Biongevity SI-powered block: AI ring + travelling beam + orb header.
 * Content inside is the AI feature; `kicker` says what kind (e.g. "Explains your results").
 */
export function AISurface({ title, kicker, children, className, badge = "Biongevity SI", padded = true }:
  { title?: ReactNode; kicker?: string; children: ReactNode; className?: string; badge?: string | false; padded?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[26px] bg-white ai-ring", padded && "p-5 sm:p-6", className)}>
      <BorderBeam duration={10} colorFrom="rgb(var(--c-ai-hi))" colorTo="rgb(var(--c-ai-2))" />
      <div aria-hidden className="ai-glow -right-16 -top-16 h-48 w-48" />
      {(title || kicker || badge) && (
        <div className="relative mb-4 flex items-start gap-3">
          <XevyoOrb size={38} live />
          <div className="min-w-0 flex-1">
            {kicker && <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">{kicker}</div>}
            {title && <div className="text-[17px] font-semibold leading-tight tracking-tight">{title}</div>}
          </div>
          {badge && <AIBadge label={badge} className="hidden sm:inline-flex" />}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
