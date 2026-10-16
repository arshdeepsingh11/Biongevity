"use client";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** One tile that tilts toward the pointer with a moving glare — depth layers lift on hover. */
export function Tilt({ children, className, max = 12 }: { children: ReactNode; className?: string; max?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const set = (x: number, y: number, on: boolean) => {
    const e = el.current; if (!e) return;
    e.style.setProperty("--rx", `${on ? -y * max : 0}deg`); e.style.setProperty("--ry", `${on ? x * max : 0}deg`);
    e.style.setProperty("--gx", `${(x + 0.5) * 100}%`); e.style.setProperty("--gy", `${(y + 0.5) * 100}%`); e.style.setProperty("--go", on ? "1" : "0");
  };
  return (
    <div style={{ perspective: "900px" }} className={className}>
      <div ref={el} className="tilt-3d relative h-full transition-transform duration-300 ease-out will-change-transform"
        onPointerMove={(e) => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5, true); }}
        onPointerLeave={() => set(0, 0, false)}
        style={{ transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))", transformStyle: "preserve-3d" }}>
        {children}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] transition-opacity duration-300"
          style={{ opacity: "var(--go,0)", background: "radial-gradient(260px circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / .55), transparent 60%)", mixBlendMode: "soft-light" }} />
      </div>
    </div>
  );
}

/** 3D hover gallery — a responsive grid where every card tilts in 3D and the hovered one rises above the rest. */
export function HoverGallery3D<T>({ items, render, className }: { items: T[]; render: (item: T, i: number) => ReactNode; className?: string }) {
  return (
    <div className={cn("hover-gallery grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {items.map((it, i) => <Tilt key={i} className="hg-item transition-[opacity,filter,transform] duration-300">{render(it, i)}</Tilt>)}
    </div>
  );
}
