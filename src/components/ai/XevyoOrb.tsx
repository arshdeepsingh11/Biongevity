import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Xevyo mark — the face of Biongevity's AI: a neural chip with a beating heart and a live ECG trace.
 * Drawn in SVG (no image). The chip outline follows the text colour (currentColor); the heart uses the
 * theme's AI colours and slowly shifts between them. `live` adds the heartbeat, ECG sweep, signal pins and a
 * tiny "thinking" vibration; `halo` adds a pulse ring. Exported as XevyoOrb for compatibility.
 */
export function XevyoOrb({ size = 28, live = false, halo = false, className }: { size?: number; live?: boolean; halo?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  const pins: [number, number, number, number, boolean][] = [
    // x1,y1 (chip edge) → x2,y2 (end), ring end?
    [17, 12, 17, 6, false], [24, 12, 24, 4, true], [31, 12, 31, 6, false],
    [17, 36, 17, 42, false], [24, 36, 24, 44, true], [31, 36, 31, 42, false],
    [12, 17, 6, 17, false], [12, 24, 4, 24, true], [12, 31, 6, 31, false],
    [36, 17, 42, 17, false], [36, 24, 44, 24, true], [36, 31, 42, 31, false],
  ];
  return (
    <span aria-hidden className={cn("xv relative inline-grid shrink-0 place-items-center", live && "xv-live", className)} style={{ width: size, height: size }}>
      {halo && <span className="xv-halo" />}
      <svg viewBox="0 0 48 48" width={size} height={size} className="xv-svg relative overflow-visible">
        <defs>
          <linearGradient id={`h${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="xv-s1" stopColor="rgb(var(--c-ai-hi))" />
            <stop offset=".55" className="xv-s2" stopColor="rgb(var(--c-ai-2))" />
            <stop offset="1" className="xv-s3" stopColor="rgb(var(--c-ai))" />
          </linearGradient>
          <radialGradient id={`g${id}`}><stop offset="0" stopColor="rgb(var(--c-ai-2))" stopOpacity=".35" /><stop offset="1" stopColor="rgb(var(--c-ai-2))" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill={`url(#g${id})`} className="xv-glow" />
        {pins.map(([x1, y1, x2, y2, ring], i) => (
          <g key={i} className="xv-pin" style={{ animationDelay: `${(i % 6) * 0.18}s` }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            {ring ? <circle cx={x2} cy={y2} r="2.3" fill="rgb(var(--c-surface))" stroke="currentColor" strokeWidth="1.8" /> : <circle cx={x2} cy={y2} r="1.2" fill="currentColor" />}
          </g>
        ))}
        <rect x="11.5" y="11.5" width="25" height="25" rx="6.5" fill="rgb(var(--c-surface))" stroke="currentColor" strokeWidth="2.4" />
        <g className="xv-heart" style={{ transformOrigin: "24px 25px" }}>
          <path d="M24 32.6c-.3 0-.6-.1-.8-.3-3.9-3.3-7.4-6.2-7.4-9.8 0-2.5 1.9-4.5 4.3-4.5 1.6 0 3 .8 3.9 2.1.9-1.3 2.3-2.1 3.9-2.1 2.4 0 4.3 2 4.3 4.5 0 3.6-3.5 6.5-7.4 9.8-.2.2-.5.3-.8.3Z" fill={`url(#h${id})`} />
          <polyline className="xv-ecg" points="16.6,24.6 20.4,24.6 21.8,22.2 23.6,27.4 25.6,20.8 27.2,24.6 31.4,24.6" fill="none" stroke="rgb(255 255 255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </span>
  );
}
