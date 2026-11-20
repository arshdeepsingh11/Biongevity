"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Decorative looping video that only downloads when it is about to scroll into view (the poster shows until then).
 * Saves ~0.85 MB on first load, mostly on phones. Respects "reduce motion" (poster only).
 */
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={on ? src : undefined} poster={poster} autoPlay={on} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />;
}
