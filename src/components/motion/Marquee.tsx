import type { ReactNode } from "react";

/** An endless band of items sliding across the screen; laid out twice so the loop has no seam. */
export function Marquee({ children, className = "", duration = 38, reverse = false, gap = "gap-10" }: { children: ReactNode; className?: string; duration?: number; reverse?: boolean; gap?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`animate-marquee flex w-max ${gap} motion-reduce:animate-none`} style={{ "--dur": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as React.CSSProperties}>
        <div className={`flex shrink-0 items-center ${gap}`}>{children}</div>
        <div aria-hidden className={`flex shrink-0 items-center ${gap} motion-reduce:hidden`}>{children}</div>
      </div>
    </div>
  );
}
