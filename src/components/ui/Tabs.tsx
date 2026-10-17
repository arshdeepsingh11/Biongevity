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

/**
 * Section tab bar — a solid glass bar that sticks under the site header (and slides up with it when the header hides),
 * so content never shows through it. Every tab is reachable: the track scrolls with fades and arrow buttons,
 * and the active tab always scrolls into view.
 */
export function TabBar({ tabs, active, onChange, id, className }: { tabs: readonly TabDef[]; active: string; onChange: (t: string) => void; id: string; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ l: false, r: false });

  const measure = () => {
    const el = track.current; if (!el) return;
    setEdge({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };
  useEffect(() => {
    measure();
    const el = track.current; if (!el) return;
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, [tabs.length]);
  useEffect(() => {
    const el = track.current, b = el?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (el && b) el.scrollTo({ left: b.offsetLeft - (el.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);
  const nudge = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.6, behavior: "smooth" });

  return (
    <div className={cn("sub-nav sticky z-30 -mx-4 px-4 py-2 sm:mx-0 sm:px-0", className)}>
      <div className="relative flex items-center rounded-full bg-white/90 p-1 shadow-card ring-1 ring-ink/[0.07] backdrop-blur-xl" style={{ WebkitBackdropFilter: "blur(24px) saturate(1.8)" }}>
        {edge.l && <button type="button" onClick={() => nudge(-1)} aria-label="Previous tabs" className="relative z-[2] grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink"><Icon name="chevron-left" size={16} /></button>}
        <div ref={track} onScroll={measure} role="tablist" className="no-scrollbar relative flex min-w-0 flex-1 gap-1 overflow-x-auto scroll-smooth"
          style={{ maskImage: `linear-gradient(90deg, ${edge.l ? "transparent, #000 28px" : "#000, #000"}, ${edge.r ? "#000 calc(100% - 28px), transparent" : "#000, #000"})`, WebkitMaskImage: `linear-gradient(90deg, ${edge.l ? "transparent, #000 28px" : "#000, #000"}, ${edge.r ? "#000 calc(100% - 28px), transparent" : "#000, #000"})` }}>
          {tabs.map((t) => (
            <button key={t.id} data-tab={t.id} role="tab" aria-selected={active === t.id} onClick={() => onChange(t.id)} className="relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13.5px] font-semibold">
              {active === t.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-full bg-ai" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={`relative flex items-center gap-1.5 whitespace-nowrap ${active === t.id ? "text-on-ai" : "text-muted hover:text-ink"}`}><Icon name={t.icon} size={16} />{t.label}</span>
            </button>
          ))}
        </div>
        {edge.r && <button type="button" onClick={() => nudge(1)} aria-label="More tabs" className="relative z-[2] grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink"><Icon name="chevron-right" size={16} /></button>}
      </div>
    </div>
  );
}
