"use client";
import { REGIONS, type Region } from "@/lib/region";
import { useRegion } from "./RegionProvider";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/** Region mark: a drawn UAE flag (emoji flags do not render on Windows) or a globe for International. */
export function RegionFlag({ region, size = 14, className }: { region: Region; size?: number; className?: string }) {
  if (region === "intl") return <Icon name="globe" size={size} className={className} />;
  const w = Math.round(size * 1.45);
  return (
    <svg width={w} height={size} viewBox="0 0 29 20" className={cn("shrink-0 rounded-[2px]", className)} aria-hidden>
      <rect width="29" height="20" fill="#00732F" /><rect y="6.67" width="29" height="6.66" fill="#fff" /><rect y="13.33" width="29" height="6.67" fill="#000" /><rect width="8" height="20" fill="#FF0000" />
    </svg>
  );
}

/** International / UAE toggle. Changes contact details, currency and WhatsApp wording across the site. */
export function RegionSwitch({ className, size = "sm", compact }: { className?: string; size?: "sm" | "md"; /** flags only below 1280px (the desktop bar is tight there) */ compact?: boolean }) {
  const { region, setRegion } = useRegion();
  const h = size === "sm" ? "h-8 text-[12px]" : "h-10 text-[13.5px]";
  return (
    <div role="radiogroup" aria-label="Region" className={cn("inline-flex shrink-0 items-center rounded-full bg-canvas p-0.5 ring-1 ring-ink/[0.08]", className)}>
      {(Object.keys(REGIONS) as Region[]).map((id) => {
        const r = REGIONS[id], on = region === id;
        return (
          <button key={id} type="button" role="radio" aria-checked={on} onClick={() => setRegion(id)} title={`${r.label} · ${r.currency}`}
            className={cn("flex items-center gap-1.5 rounded-full font-semibold transition-colors", h, compact ? "px-2 xl:px-2.5" : "px-2.5", on ? "bg-accent text-on-accent shadow-card" : "text-muted hover:text-ink")}>
            <RegionFlag region={id} size={12} /><span className={compact ? "hidden xl:inline" : undefined}>{r.short}</span>
          </button>
        );
      })}
    </div>
  );
}

/** The region's phone number as a link (head office for International, the Dubai clinic for UAE). */
export function RegionPhone({ className, icon }: { className?: string; icon?: React.ReactNode }) {
  const { office } = useRegion();
  return <a href={office.tel} className={className}>{icon}{office.phone}</a>;
}
