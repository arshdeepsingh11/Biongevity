"use client";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { cn } from "@/lib/utils";

/** Any "Ask AI about this" button on server-rendered pages. */
export function AskButton({ q, children, className, variant = "shine" }: { q: string; children: React.ReactNode; className?: string; variant?: "shine" | "row" }) {
  const { ask } = useAI();
  if (variant === "row")
    return <button onClick={() => ask(q)} className={cn("group flex w-full items-center justify-between gap-4 rounded-2xl bg-canvas px-4 py-3.5 text-left text-[15px] font-medium transition-colors hover:bg-surface hover:shadow-card", className)}>{children}<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-violet group-hover:bg-iri group-hover:text-white"><Icon name="sparkle" size={15} /></span></button>;
  return (
    <button onClick={() => ask(q)} className={cn("btn relative overflow-hidden bg-surface shadow-card", className)}>
      <ShineBorder radius={999} /><Icon name="sparkle" size={16} className="text-violet" />{children}
    </button>
  );
}
