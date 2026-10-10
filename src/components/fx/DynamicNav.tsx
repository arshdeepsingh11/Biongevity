"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Dynamic Navigation — a highlight pill glides and resizes between items using DOM measurements. */
export function DynamicNav({ items, active, className }: { items: { href: string; label: string }[]; active: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pill, setPill] = useState({ l: 0, w: 0, o: 0 });
  const target = hover ?? active;
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current?.querySelector<HTMLElement>(`[data-nav="${CSS.escape(target)}"]`);
      setPill(el ? { l: el.offsetLeft, w: el.offsetWidth, o: 1 } : (p) => ({ ...p, o: 0 }));
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [target]);
  return (
    <nav ref={ref} aria-label="Primary" onMouseLeave={() => setHover(null)} className={cn("relative flex items-center", className)}>
      <span aria-hidden className="absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-black/[0.06] transition-all duration-500 [transition-timing-function:cubic-bezier(.3,1.4,.4,1)]"
        style={{ left: pill.l, width: pill.w, opacity: pill.o }} />
      {items.map((it) => (
        <Link key={it.href} href={it.href} data-nav={it.href} onMouseEnter={() => setHover(it.href)} aria-current={active === it.href ? "page" : undefined}
          className={cn("relative z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors", target === it.href ? "text-ink" : "text-muted hover:text-ink")}>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
