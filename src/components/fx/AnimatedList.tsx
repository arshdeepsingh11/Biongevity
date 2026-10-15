"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export interface ListItem { t: string; d: string; icon: string }

/** Animated List — notifications slide in one after another, looping. */
export function AnimatedList({ items, max = 3, dark, interval = 2200 }: { items: ListItem[]; max?: number; dark?: boolean; interval?: number }) {
  const [n, setN] = useState(1);
  useEffect(() => { const t = setInterval(() => setN((x) => x + 1), interval); return () => clearInterval(t); }, [interval]);
  const shown = Array.from({ length: Math.min(n, max) }, (_, k) => ({ ...items[(n - 1 - k) % items.length], key: n - k }));
  return (
    <div className="flex flex-col gap-2.5 overflow-hidden" style={{ minHeight: max * 70 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {shown.map((it) => (
          <motion.div key={it.key} layout initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 ${dark ? "bg-surface/[0.06] text-white ring-1 ring-ink/10" : "bg-surface text-ink shadow-card ring-1 ring-ink/[0.04]"}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center icon-tile"><Icon name={it.icon} size={17} /></span>
            <div className="min-w-0 flex-1"><div className="truncate text-[14px] font-semibold">{it.t}</div><div className={`truncate text-[12px] ${dark ? "text-white/55" : "text-faint"}`}>{it.d}</div></div>
            <span className={`text-[11px] ${dark ? "text-white/40" : "text-faint"}`}>now</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
