import { useId } from "react";
/** Dot Pattern (Magic UI) — subtle background dots with a radial fade. */
export function DotPattern({ className, gap = 18, fade = true }: { className?: string; gap?: number; fade?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
      style={fade ? { maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)" } : undefined}>
      <defs><pattern id={`d${id}`} width={gap} height={gap} patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="#221D16" fillOpacity=".14" /></pattern></defs>
      <rect width="100%" height="100%" fill={`url(#d${id})`} />
    </svg>
  );
}
