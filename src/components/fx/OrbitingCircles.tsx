import type { ReactNode } from "react";
/** Orbiting Circles (Magic UI) — items orbit a centre on a visible path. CSS only. */
export function OrbitingCircles({ items, radius = 110, duration = 28, reverse, children }: { items: ReactNode[]; radius?: number; duration?: number; reverse?: boolean; children?: ReactNode }) {
  return (
    <div className="relative grid place-items-center" style={{ width: radius * 2 + 56, height: radius * 2 + 56 }}>
      <span aria-hidden className="absolute rounded-full border border-dashed border-ink/10" style={{ width: radius * 2, height: radius * 2 }} />
      {children}
      {items.map((it, i) => (
        <div key={i} className="absolute left-1/2 top-1/2" style={{ animation: `orbit ${duration}s linear infinite ${reverse ? "reverse" : ""}`, animationDelay: `${-(duration / items.length) * i}s`, ["--r" as string]: `${radius}px` }}>
          <div className="-translate-x-1/2 -translate-y-1/2">{it}</div>
        </div>
      ))}
    </div>
  );
}
