"use client";
import { useAI } from "./AIProvider";
import { XevyoOrb } from "./XevyoOrb";
import { cn } from "@/lib/utils";

/** "Xevyo reads this page" — one tap for a plain-language summary (called only on click, cached for the session). */
export function PageSummary({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { summarise, busy } = useAI();
  return (
    <button onClick={summarise} disabled={busy} title="Xevyo summarises this page in plain words"
      className={cn("group inline-flex h-11 items-center gap-2.5 rounded-full bg-white/85 pl-1.5 pr-4 text-[14px] font-semibold shadow-card ring-1 ring-ai/25 backdrop-blur transition hover:-translate-y-0.5 hover:ring-ai/50 disabled:opacity-60", compact && "pl-2 pr-5 text-[15px]", className)}>
      <XevyoOrb size={compact ? 28 : 32} live />
      {compact ? <span className="text-ink">Summarise</span> : <span className="text-left leading-tight"><span className="block text-ink">Summarise this page</span><span className="block text-[11px] font-medium text-ai">✦ Xevyo reads it for you · 30 sec</span></span>}
    </button>
  );
}
