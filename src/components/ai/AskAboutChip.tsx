"use client";
import { useAI } from "./AIProvider";
import { XevyoOrb } from "./XevyoOrb";

/** "✦ Ask about this" — shown on every section. Opens Biongevity SI with the section as context. */
export function AskAboutChip({ topic }: { topic: string }) {
  const { ask } = useAI();
  return (
    <button onClick={() => ask(`Explain the "${topic}" section of this page in simple words. What does it mean for me?`, { label: `✦ Ask about: ${topic}` })}
      className="group pointer-events-auto inline-flex h-8 items-center gap-1.5 rounded-full bg-white/85 pl-1 pr-3 text-[12px] font-semibold text-ai shadow-card ring-1 ring-ai/20 backdrop-blur transition hover:ring-ai/50"
      aria-label={`Ask Biongevity SI about ${topic}`}>
      <XevyoOrb size={22} />
      <span><span aria-hidden>✦ </span>Ask about this</span>
    </button>
  );
}
