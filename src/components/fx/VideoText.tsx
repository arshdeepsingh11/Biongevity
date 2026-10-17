"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Video Text — a film plays *inside* the letters. The words are real text in the site font: a page-coloured
 * layer with the text cut out (mix-blend "screen") sits over the film, so only the letters show it.
 * Source: a YouTube id (embedded, muted, looping) or an mp4 path. Nothing plays until it is on screen.
 */
export function VideoText({ children, youtube, mp4, className, start = 0 }: { children: ReactNode; youtube?: string; mp4?: string; className?: string; start?: number }) {
  const box = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { rootMargin: "200px" });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  // cover the text box with a 16:9 film, slightly over-scaled to crop the player chrome
  const fw = Math.max(size.w, (size.h * 16) / 9) * 1.18, fh = (fw * 9) / 16;
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
