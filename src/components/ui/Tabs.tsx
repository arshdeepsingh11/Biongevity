"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export interface TabDef { id: string; label: string; icon: string }

/** Tab state synced to the URL hash (deep-linkable, no router needed for static export). */
export function useHashTab(tabs: readonly TabDef[]) {
  const [tab, setTab] = useState(tabs[0].id);
  useEffect(() => { const h = location.hash.slice(1); if (tabs.some((t) => t.id === h)) setTab(h); }, [tabs]);
  const go = (t: string) => { setTab(t); history.replaceState(null, "", `#${t}`); };
  return [tab, go] as const;
}

/** Sticky pill tab bar with a sliding active indicator. */
export function TabBar({ tabs, active, onChange, id }: { tabs: readonly TabDef[]; active: string; onChange: (t: string) => void; id: string }) {
  return (
    <div className="sticky top-[calc(64px+var(--safe-top))] z-20 -mx-4 bg-pearl/85 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
      <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card ring-1 ring-ink/[0.06] sm:inline-flex">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => onChange(t.id)} className="relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13.5px] font-semibold">
            {active === t.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className={`relative flex items-center gap-1.5 ${active === t.id ? "text-white" : "text-muted hover:text-ink"}`}><Icon name={t.icon} size={16} />{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
