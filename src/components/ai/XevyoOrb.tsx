import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Xevyo orb — the visual identity of Biongevity's AI. A glass sphere painted from the theme's AI tokens
 * (--c-ai, --c-ai-2, --c-ai-hi), with a slow inner swirl. Wherever you see the orb, Xevyo is involved.
 */
export function XevyoOrb({ size = 28, live = false, halo = false, className }: { size?: number; live?: boolean; halo?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }}>
      {halo && <span className="orb-halo" />}
      <span className={cn("orb h-full w-full", live && "orb-live")} />
    </span>
  );
}
