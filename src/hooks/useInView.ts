"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(opts: IntersectionObserverInit & { once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (opts.once !== false) io.disconnect(); }
      else if (opts.once === false) setInView(false);
    }, { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [opts.once, opts.threshold, opts.rootMargin]);
  return [ref, inView] as const;
}
