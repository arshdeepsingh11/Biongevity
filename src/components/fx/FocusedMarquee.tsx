"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export interface MarqueeItem { icon: string; label: string; href: string }

/**
 * Focused 3D Marquee — physical 3D app icons scale across a central lens.
 * Hover (or touch) slows the belt; items nearest the centre zoom into focus.
 */
export function FocusedMarquee({ items, speed = 0.6 }: { items: MarqueeItem[]; speed?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const belt = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, v: speed, target: speed });

  useEffect(() => {
    const w = wrap.current!, b = belt.current!;
    const nodes = Array.from(b.children) as HTMLElement[];
    let raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(w);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const s = state.current;
      s.v += (s.target - s.v) * 0.06;
      if (!reduced) s.x -= s.v;
      const half = b.scrollWidth / 2;
      if (-s.x >= half) s.x += half;
      b.style.transform = `translate3d(${s.x}px,0,0)`;
      const r = w.getBoundingClientRect(), cx = r.left + r.width / 2, lens = Math.min(360, r.width * 0.45);
      for (const n of nodes) {
        const nr = n.getBoundingClientRect(), d = Math.abs(nr.left + nr.width / 2 - cx), k = Math.max(0, 1 - d / lens);
        const e = k * k * (3 - 2 * k);
        n.style.transform = `perspective(700px) translateZ(${e * 60}px) rotateY(${(nr.left + nr.width / 2 - cx) / -14}deg) scale(${0.78 + e * 0.5})`;
        n.style.filter = `blur(${(1 - e) * 1.6}px) saturate(${0.6 + e * 0.6})`;
        n.style.opacity = String(0.45 + e * 0.55);
        n.style.zIndex = String(Math.round(e * 100));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const slow = (v: boolean) => (state.current.target = v ? speed * 0.15 : speed);
  const row = [...items, ...items];
  return (
    <div ref={wrap} onMouseEnter={() => slow(true)} onMouseLeave={() => slow(false)} onTouchStart={() => slow(true)} onTouchEnd={() => slow(false)}
      className="relative overflow-hidden py-14 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div aria-hidden data-ai-fx className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-iri opacity-25 blur-3xl" />
      <div ref={belt} className="flex w-max gap-6 will-change-transform">
        {row.map((it, i) => (
          <Link key={i} href={it.href} className="flex w-[104px] flex-col items-center gap-3 will-change-transform" aria-label={it.label} tabIndex={i >= items.length ? -1 : 0}>
            <span className="relative grid h-[88px] w-[88px] place-items-center rounded-[24px] bg-gradient-to-b from-[#1E2433] to-[#11141C] text-ink shadow-[0_1px_0_rgba(255,255,255,.12)_inset,0_14px_30px_rgba(0,0,0,.5)] ring-1 ring-white/[0.06]">
              <span className="absolute inset-x-3 top-1.5 h-6 rounded-full bg-surface/70 blur-[2px]" />
              <Icon name={it.icon} size={34} strokeWidth={1.5} />
            </span>
            <span className="whitespace-nowrap text-[13px] font-medium text-ink/80">{it.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
