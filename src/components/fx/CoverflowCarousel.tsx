"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * 3D Cards Carousel (coverflow) — horizontal scroll-snap track; each card rotates
 * and scales from its distance to the centre. Works with wheel, trackpad and touch.
 */
export function CoverflowCarousel<T>({ items, render, cardWidth = 300 }: { items: T[]; render: (item: T, i: number) => ReactNode; cardWidth?: number }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current!;
    const cards = Array.from(el.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      for (const c of cards) {
        const cr = c.getBoundingClientRect(), d = (cr.left + cr.width / 2 - cx) / (cr.width * 1.1);
        const k = Math.max(-1.6, Math.min(1.6, d));
        c.style.transform = `perspective(1100px) translateZ(${-Math.abs(k) * 140}px) rotateY(${k * -38}deg) scale(${1 - Math.min(Math.abs(k), 1.2) * 0.12})`;
        c.style.opacity = String(1 - Math.min(Math.abs(k), 1.4) * 0.35);
        c.style.zIndex = String(100 - Math.round(Math.abs(k) * 10));
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    // vertical wheel → horizontal scroll while hovered
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0, atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault(); el.scrollLeft += e.deltaY;
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); el.removeEventListener("wheel", onWheel); window.removeEventListener("resize", onScroll); };
  }, [items.length]);
  return (
    <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto py-10 [perspective:1100px]"
      style={{ paddingInline: `calc(50% - ${cardWidth / 2}px)` }}>
      {items.map((it, i) => (
        <div key={i} className="shrink-0 snap-center will-change-transform" style={{ width: cardWidth }}>{render(it, i)}</div>
      ))}
    </div>
  );
}
