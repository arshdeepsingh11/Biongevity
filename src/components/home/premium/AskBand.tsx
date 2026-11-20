"use client";
import Link from "next/link";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";

/** A quiet band for Biongevity SI: ask a question, or open the interactive tools. */
export function AskBand() {
  const { setOpen } = useAI();
  return (
    <div className="container-x">
      <div className="flex flex-col items-start gap-5 rounded-[28px] bg-white/70 p-6 ring-1 ring-ink/[0.06] backdrop-blur-xl sm:flex-row sm:items-center sm:p-8">
        <XevyoOrb size={48} live />
        <div className="min-w-0 flex-1">
          <div className="text-[19px] font-semibold tracking-tight">Have a question first? Ask Biongevity SI.</div>
          <p className="mt-1 text-[14.5px] leading-relaxed text-muted">Plain-language answers about our services, tests and what to expect — then book when you&apos;re ready. Education, not a diagnosis.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setOpen(true)} className="btn-ai h-11 px-5">Ask a question</button>
          <Link href="/explore/" className="btn-light h-11 px-5"><Icon name="orbit" size={16} className="text-accent" />Explore the science</Link>
        </div>
      </div>
    </div>
  );
}
