"use client";
import { useEffect, useRef, useState } from "react";

/** True once the element has entered the viewport (charts animate in once). */
export function useInView<T extends Element>(margin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { set(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    const t = setTimeout(() => { if (el.getBoundingClientRect().top < innerHeight) set(true); }, 1200);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [margin]);
  return [ref, inView] as const;
}
