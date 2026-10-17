"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Video Text — the film plays only inside the letters; everything around them stays the page (no box, no background).
 * The letters are cut with an SVG clip-path drawn in the site font, measured from the real text, so it stays sharp at
 * any size. Source: a YouTube id (embedded, muted, looping, starting mid-film) or an mp4 path.
 */
export function VideoText({ text, youtube, mp4, className, start = 0 }: { text: string; youtube?: string; mp4?: string; className?: string; start?: number }) {
  const box = useRef<HTMLSpanElement>(null);
  const raw = useId().replace(/:/g, "");
  const clip = `vt-${raw}`;
  const [m, setM] = useState<{ w: number; h: number; base: number; font: string; ls: string } | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = box.current; if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const c = document.createElement("canvas").getContext("2d")!; c.font = font;
      const tm = c.measureText(text);
      const asc = tm.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.92, desc = tm.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.24;
      const base = (r.height - (asc + desc)) / 2 + asc;
      setM({ w: r.width, h: r.height, base, font, ls: cs.letterSpacing });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { rootMargin: "200px" });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [text]);

  // cover the text box with a 16:9 film, over-scaled to crop the player chrome
  const fw = m ? Math.max(m.w, (m.h * 16) / 9) * 1.25 : 0, fh = (fw * 9) / 16;
  const src = youtube
    ? `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&mute=1&loop=1&playlist=${youtube}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&fs=0&start=${start}`
    : undefined;

  return (
    <span ref={box} className={cn("video-text relative inline-block isolate overflow-hidden align-bottom", className)}>
      <span aria-hidden className="absolute inset-[0.05em] overflow-hidden" style={{ background: "#0b0d0a" }}>
        {on && size.w > 0 && (youtube
          ? <iframe title="" src={src} allow="autoplay; encrypted-media; picture-in-picture" tabIndex={-1} loading="lazy"
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none border-0" style={{ width: fw, height: fh, transform: "translate(-50%, -50%)" }} />
          : mp4 ? <video src={mp4} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> : null)}
      </span>
      <span className="relative block bg-[rgb(var(--c-pearl))] px-[0.08em] pb-[0.08em] text-black mix-blend-screen">{children}</span>
    </span>
  );
}
