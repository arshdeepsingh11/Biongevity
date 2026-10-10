"use client";

/**
 * Video Text — headline knocked out of a playing video (SVG data-URL mask).
 * Falls back to an animated iridescent fill until a video src is set in config/media.ts.
 */
export function VideoText({ text, src, poster, className }: { text: string; src?: string; poster?: string; className?: string }) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 300'><text x='20' y='54%' textLength='960' lengthAdjust='spacingAndGlyphs' dominant-baseline='middle' font-size='230' font-weight='700' font-family='DM Sans Variable, DM Sans, Helvetica, Arial, sans-serif'>${text}</text></svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}") center/contain no-repeat`;
  return (
    <div className={`relative aspect-[10/3] w-full ${className ?? ""}`} role="img" aria-label={text}>
      <div className="absolute inset-0" style={{ mask, WebkitMask: mask }}>
        {src ? (
          <video className="h-full w-full object-cover" src={src} poster={poster} autoPlay muted loop playsInline />
        ) : (
          <div className="h-full w-full animate-shine" style={{ background: "linear-gradient(110deg,#FF8A3D,#FF4D8D,#9B6BFF,#3D8BFF,#6A5CFF,#FF8A3D) 0 0/200% 100%" }} />
        )}
      </div>
    </div>
  );
}
