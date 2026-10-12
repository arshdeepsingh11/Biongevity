import { cn } from "@/lib/utils";

/**
 * Biongevity logo — vector rebuild of the ORIGINAL brand mark (no image file).
 * The "b": slanted-top stem + heavy bowl, holding a solid "a" dot with its tail.
 * Single colour (currentColor) so it inherits text colour — ink by default, white on dark.
 * Geometry traced from the original artwork (viewBox units = source pixels).
 */
const MARK = (
  <>
    {/* stem with the original slanted top */}
    <path d="M8 12.2c0-.3.3-.4.6-.3 3.6 1 6 3.4 6 6.6V35H8Z" />
    {/* bowl with the "a" counter (circle + tail notch), cut with evenodd */}
    <path fillRule="evenodd" d="M8.4 34.8a15.6 15.6 0 1 0 31.2 0a15.6 15.6 0 1 0-31.2 0ZM33 34.8V42.9A1.5 1.5 0 0 1 30 42.9V41.5A9 9 0 1 1 33 34.8Z" />
    {/* "a" dot */}
    <circle cx="24" cy="34.6" r="4.9" />
  </>
);

export function LogoMark({ size = 28, className }: { size?: number; className?: string; mono?: boolean }) {
  return (
    <svg width={size * (33 / 39.5)} height={size} viewBox="7.5 11.5 33 39.5" fill="currentColor" className={className} role="img" aria-label="Biongevity">
      {MARK}
    </svg>
  );
}

/** Full logo: mark + "iongevity" wordmark in one SVG, proportions as the original. */
export function Logo({ size = 26, className, wordmark = true }: { size?: number; className?: string; wordmark?: boolean; mono?: boolean }) {
  if (!wordmark) return <LogoMark size={size} className={cn("text-ink", className)} />;
  const h = size * 1.3;
  return (
    <svg height={h} width={h * (134 / 39.5)} viewBox="7.5 11.5 134 39.5" fill="currentColor" className={cn("text-ink", className)} role="img" aria-label="Biongevity">
      {MARK}
      <text x="42.6" y="43.6" fontSize="21.5" fontWeight="700" letterSpacing="-0.4" textLength="97.5" lengthAdjust="spacingAndGlyphs" style={{ fontFamily: "inherit" }}>iongevity</text>
    </svg>
  );
}
