/** Border Beam (Magic UI pattern) — a light beam travelling around a rounded border. Parent: relative + overflow-hidden + rounded. */
export function BorderBeam({ duration = 8, colorFrom = "rgb(var(--c-ai-hi))", colorTo = "rgb(var(--c-ai-2))", className }: { duration?: number; colorFrom?: string; colorTo?: string; className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 z-[2] rounded-[inherit] [mask-composite:intersect] [-webkit-mask-composite:source-in] ${className ?? ""}`}
      style={{ padding: 1.5, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)" }}>
      <span className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-spinSlow"
        style={{ animationDuration: `${duration}s`, background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${colorFrom} 320deg, ${colorTo} 350deg, transparent 360deg)` }} />
    </span>
  );
}
