"use client";
import { useRef, type ReactNode } from "react";

/** Magic Card (Magic UI pattern) — spotlight gradient follows the pointer, plus a lit border. */
export function MagicCard({ children, className, glow = "rgba(151,112,63,.14)" }: { children: ReactNode; className?: string; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`); el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`group relative overflow-hidden rounded-3xl bg-white ring-1 ring-ink/[0.07] ${className ?? ""}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(360px circle at var(--x) var(--y), ${glow}, transparent 65%)` }} />
      <div className="relative">{children}</div>
    </div>
  );
}
