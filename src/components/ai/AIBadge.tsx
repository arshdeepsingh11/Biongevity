import { cn } from "@/lib/utils";
import { XevyoOrb } from "./XevyoOrb";

/** "✦ Xevyo AI" chip — marks anything powered by Xevyo. Same look in every theme, so AI is easy to spot. */
export function AIBadge({ label = "Xevyo AI", className, tone = "soft" }: { label?: string; className?: string; tone?: "soft" | "solid" }) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full pl-1 pr-2.5 text-[11px] font-semibold tracking-[0.02em]",
      tone === "solid" ? "bg-ai text-on-ai shadow-ai" : "bg-ai-soft text-ai ring-1 ring-ai/20", className)}>
      <XevyoOrb size={16} />
      <span aria-hidden>✦</span>{label}
    </span>
  );
}

/** Small uppercase "✦ AI · on your device" style label for honest scope notes. */
export function AIScope({ device, className }: { device?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium text-faint", className)}>
      <span aria-hidden className="text-ai">✦</span>{device ? "Matched on your device · nothing sent" : "Answer from Xevyo AI · education, not a diagnosis"}
    </span>
  );
}
