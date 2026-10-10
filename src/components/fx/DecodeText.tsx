"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { GLYPHS } from "@/lib/utils";

/** Matrix-style decode on first view (and on hover). Used for AI eyebrows. */
export function DecodeText({ text, className, duration = 700 }: { text: string; className?: string; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now(), L = text.length;
    const f = (t: number) => {
      const k = Math.min(1, (t - t0) / duration), n = Math.floor(k * L);
      setOut(text.slice(0, n) + Array.from(text.slice(n), (c) => (c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (k < 1) raf.current = requestAnimationFrame(f);
    };
    raf.current = requestAnimationFrame(f);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (inView) run(); return () => cancelAnimationFrame(raf.current); }, [inView]);
  return <span ref={ref} onMouseEnter={run} className={className} aria-label={text}><span aria-hidden>{out}</span></span>;
}
