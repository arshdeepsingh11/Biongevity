import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Biongevity logo — vector rebuild of the brand mark: the "b" (stem + bowl) holds an
 * inner "a"-ring, forming the b·o·a monogram from the clinic signage.
 * Mark gradient: deep blue → blue → cyan, with a tiny amber spark (brand warm accent).
 */
export function LogoMark({ size = 28, className, mono }: { size?: number; className?: string; mono?: boolean }) {
  const id = useId().replace(/:/g, "");
  const fill = mono ? "currentColor" : `url(#g${id})`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} role="img" aria-label="Biongevity">
      {!mono && (
        <defs>
          <linearGradient id={`g${id}`} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1D4ED8" /><stop offset=".55" stopColor="#2563EB" /><stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      )}
      {/* stem */}
      <rect x="2.5" y="1.5" width="6" height="29" rx="3" fill={fill} />
      {/* bowl */}
      <circle cx="18.6" cy="19.6" r="9.4" stroke={fill} strokeWidth="5.6" />
      {/* inner a-ring with tail */}
      <circle cx="18.6" cy="19.6" r="3.1" stroke={fill} strokeWidth="2.2" />
      <path d="M21.7 19.6v3.6" stroke={fill} strokeWidth="2.2" strokeLinecap="round" />
      {!mono && <circle cx="27.6" cy="5.2" r="1.7" fill="#F59E0B" />}
    </svg>
  );
}

export function Logo({ size = 26, className, wordmark = true, mono }: { size?: number; className?: string; wordmark?: boolean; mono?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-[2px] text-ink", className)}>
      <LogoMark size={size} mono={mono} />
      {wordmark && <span className="font-semibold tracking-[-0.03em]" style={{ fontSize: size * 0.72, lineHeight: 1 }}>iongevity</span>}
    </span>
  );
}
