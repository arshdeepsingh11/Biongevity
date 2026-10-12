"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { Icon } from "@/components/ui/Icon";

/**
 * Highlight to ask — select any text on a page (e.g. "hs-CRP") and an
 * "Explain with Xevyo" chip appears under it. Ignored inside fields, the chat and dialogs.
 */
export function AskSelection() {
  const { ask } = useAI();
  const [pick, setPick] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const read = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const sel = getSelection();
        const text = (sel?.toString() ?? "").replace(/\s+/g, " ").trim();
        if (!sel || sel.isCollapsed || text.length < 3 || text.length > 160 || !sel.rangeCount) return setPick(null);
        const node = sel.anchorNode?.parentElement;
        if (!node || node.closest("input,textarea,[contenteditable],[role=dialog],header.fixed,nav,button,a")) return setPick(null);
        const r = sel.getRangeAt(0).getBoundingClientRect();
        if (!r.width) return setPick(null);
        setPick({ text, x: Math.min(Math.max(r.left + r.width / 2, 110), innerWidth - 110), y: r.bottom + 10 });
      }, 220);
    };
    const hide = () => setPick(null);
    document.addEventListener("selectionchange", read);
    addEventListener("scroll", hide, { passive: true });
    return () => { document.removeEventListener("selectionchange", read); removeEventListener("scroll", hide); clearTimeout(t); };
  }, []);

  const go = () => {
    if (!pick) return;
    ask(`Explain "${pick.text}" in simple words — what it means for my health and when it matters.`);
    getSelection()?.removeAllRanges(); setPick(null);
  };

  return (
    <AnimatePresence>
      {pick && (
        <motion.button key={pick.text} initial={{ opacity: 0, y: -4, scale: 0.95, x: "-50%" }} animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }} exit={{ opacity: 0, scale: 0.95 }}
          onMouseDown={(e) => e.preventDefault()} onClick={go}
          style={{ left: pick.x, top: pick.y }}
          className="fixed z-[110] flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink shadow-lift ring-1 ring-accent/30">
          <Icon name="sparkle" size={14} weight="duotone" className="text-accent" />Explain with Xevyo
          <kbd className="ml-1 hidden rounded bg-canvas px-1 text-muted font-mono text-[10px] sm:inline">Ctrl X</kbd>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
