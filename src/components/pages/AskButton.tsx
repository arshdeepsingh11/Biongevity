"use client";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { cn } from "@/lib/utils";

/** "Ask Biongevity SI" button for server-rendered pages — opens the Biongevity SI chat with a question. */
export function AskButton({ q, children, className, variant = "shine" }: { q: string; children: React.ReactNode; className?: string; variant?: "shine" | "row" }) {
  const { ask } = useAI();
  if (variant === "row")
    return <button onClick={() => ask(q)} className={cn("group flex w-full items-center justify-between gap-4 rounded-2xl bg-canvas px-4 py-3.5 text-left ring-1 ring-transparent hover:ring-ai/25 text-[15px] font-medium transition-colors hover:bg-surface hover:shadow-card", className)}>{children}<XevyoOrb size={30} className="transition-transform group-hover:scale-110" /></button>;
  return (
    <button onClick={() => ask(q)} className={cn("btn relative overflow-hidden bg-surface shadow-card", className)}>
      <ShineBorder radius={999} /><XevyoOrb size={24} live />{children}
    </button>
  );
}
