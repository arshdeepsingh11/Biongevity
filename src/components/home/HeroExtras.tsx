"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { VideoText } from "@/components/fx/VideoText";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { MARKERS } from "@/data/intelligence";
import { formatMoney } from "@/lib/utils";

/** Suggested question with a hover/focus popover saying what Biongevity SI will cover. */
export function PromptCard({ q, d, icon, covers }: { q: string; d: string; icon: string; covers: string[] }) {
  const { ask } = useAI();
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button onClick={() => ask(q)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} aria-describedby={show ? `pc-${icon}` : undefined}
        className="group flex w-full items-center gap-3 rounded-2xl bg-white/80 p-3 text-left ring-1 ring-ink/[0.07] backdrop-blur transition hover:-translate-y-0.5 hover:ring-ai/35 sm:p-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center icon-tile ring-1 ring-ai/15"><Icon name={icon} size={19} weight="duotone" /></span>
        <span className="min-w-0 flex-1 text-[14.5px] font-medium leading-snug">{q}</span>
        <Icon name="arrow-right" size={15} className="shrink-0 text-ai transition-transform group-hover:translate-x-0.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div id={`pc-${icon}`} role="tooltip" initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="glass pointer-events-none absolute bottom-[calc(100%+8px)] left-0 right-0 z-20 rounded-2xl bg-white/95 p-3.5 text-left shadow-lift ring-1 ring-ai/15 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai"><XevyoOrb size={14} />What SI will cover</div>
            <p className="mt-1 text-[13px] leading-snug text-ink/80">{d}</p>
            <div className="mt-2 flex flex-wrap gap-1">{covers.map((c) => <span key={c} className="rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-medium text-ai">{c}</span>)}</div>
            <span aria-hidden className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 bg-white ring-1 ring-ai/10 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Stat cards: ticking number + a live mini-visual + hover detail ── */
