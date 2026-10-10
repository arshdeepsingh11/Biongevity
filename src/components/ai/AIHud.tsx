"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { Icon } from "@/components/ui/Icon";

/**
 * AI HUD — a floating intelligence pill that follows the scroll: it reads the
 * `data-ai` label of the section in view and shows what BioELR AI is "analysing".
 * Tapping it opens the assistant with that section as context.
 */
export function AIHud() {
  const path = usePathname();
  const { section, setSection, open, setOpen, ask } = useAI();
  useEffect(() => {
    const seen = new Map<Element, number>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
      let best: Element | null = null, max = 0;
      seen.forEach((r, el) => { if (r > max) { max = r; best = el; } });
      if (best) setSection((best as HTMLElement).dataset.ai || "Overview");
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    const t = setTimeout(() => document.querySelectorAll("[data-ai]").forEach((s) => io.observe(s)), 120);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path, setSection]);

  if (open) return null;
  return (
    <button data-ai-fx onClick={() => { setOpen(true); }} onDoubleClick={() => ask(`Explain the "${section}" section simply`)}
      className="glass fixed bottom-[calc(96px+var(--safe-bottom))] right-3 z-[70] flex items-center gap-2 rounded-full p-1.5 shadow-lift sm:pr-3.5 lg:bottom-6 lg:right-6"
      aria-label={`Ask Biongevity AI about ${section}`}>
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-iri text-white">
        <span className="absolute inset-0 animate-ping rounded-full bg-violet/30" /><Icon name="sparkle" size={15} />
      </span>
      <span className="hidden text-left leading-tight sm:block">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-violet">AI analysing</span>
        <AnimatePresence mode="wait"><motion.span key={section} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="block max-w-[150px] truncate text-[13px] font-semibold">{section}</motion.span></AnimatePresence>
      </span>
    </button>
  );
}
