"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface DockItem { icon: string; label: string; active?: boolean; onClick?: () => void; badge?: number }

/** Apple Dock — icons magnify by cursor proximity (macOS behaviour). */
export function AppleDock({ items, base = 50, magnify = 1.7, className }: { items: DockItem[]; base?: number; magnify?: number; className?: string }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("glass mx-auto flex h-[74px] items-end gap-3 rounded-[26px] px-3 pb-3 shadow-lift", className)}>
      {items.map((it) => <DockIcon key={it.label} item={it} mouseX={mouseX} base={base} magnify={magnify} />)}
    </motion.div>
  );
}

function DockIcon({ item, mouseX, base, magnify }: { item: DockItem; mouseX: MotionValue<number>; base: number; magnify: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const dist = useTransform(mouseX, (x) => { const r = ref.current?.getBoundingClientRect(); return r ? x - r.left - r.width / 2 : Infinity; });
  const size = useSpring(useTransform(dist, [-150, 0, 150], [base, base * magnify, base]), { stiffness: 260, damping: 20, mass: 0.2 });
  return (
    <motion.button ref={ref} style={{ width: size, height: size }} onClick={item.onClick} aria-label={item.label} aria-pressed={item.active}
      className={cn("group relative grid shrink-0 place-items-center rounded-[16px] shadow-[0_8px_20px_rgba(0,0,0,.12)] ring-1 ring-white/[0.06]",
        item.active ? "bg-iri text-white" : "bg-gradient-to-b from-[#1E2433] to-[#11141C] text-ink")}>
      <Icon name={item.icon} size={22} />
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] text-night opacity-0 transition-opacity group-hover:opacity-100">{item.label}</span>
      {item.active && <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-ink" />}
    </motion.button>
  );
}
