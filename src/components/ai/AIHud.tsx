"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { Icon } from "@/components/ui/Icon";

type Status = "Scanning" | "Synthesizing" | "Ready";

/**
 * AI attention HUD. Reads the `data-ai` section in view and reacts to scroll:
 * fast scroll → Scanning…, settling → Synthesizing…, idle → Ready.
 * Tap opens the assistant with that section as context.
 */
export function AIHud() {
  const path = usePathname();
  const { section, setSection, open, setOpen } = useAI();
  const [status, setStatus] = useState<Status>("Ready");
  const t1 = useRef<ReturnType<typeof setTimeout>>(undefined), t2 = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const seen = new Map<Element, number>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
      let best: Element | null = null, max = 0;
      seen.forEach((r, el) => { if (r > max) { max = r; best = el; } });
      if (best) setSection((best as HTMLElement).dataset.ai || "Overview");
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    const t = setTimeout(() => document.querySelectorAll("[data-ai]").forEach((s) => io.observe(s)), 120);
    const onScroll = () => {
      setStatus("Scanning");
      clearTimeout(t1.current); clearTimeout(t2.current);
      t1.current = setTimeout(() => setStatus("Synthesizing"), 260);
      t2.current = setTimeout(() => setStatus("Ready"), 1100);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); io.disconnect(); removeEventListener("scroll", onScroll); };
  }, [path, setSection]);

  if (open) return null;
  const dot = status === "Ready" ? "bg-aqua" : status === "Scanning" ? "bg-sky animate-pulseDot" : "bg-warn animate-pulseDot";
  return (
    <button data-ai-fx onClick={() => setOpen(true)} aria-label={`Ask Biongevity AI about ${section}`}
      className="glass fixed bottom-[calc(96px+var(--safe-bottom))] right-3 z-[70] flex items-center gap-2.5 rounded-full p-1.5 shadow-lift sm:pr-4 lg:bottom-6 lg:right-6">
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-iri text-white">
        {status !== "Ready" && <span className="absolute inset-0 animate-ping rounded-full bg-aqua/30" />}<Icon name="sparkle" size={15} />
      </span>
      <span className="hidden text-left leading-tight sm:block">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}{status !== "Ready" && "…"}</span>
        <AnimatePresence mode="wait"><motion.span key={section} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="block max-w-[160px] truncate text-[13px] font-semibold">{section}</motion.span></AnimatePresence>
      </span>
    </button>
  );
}
