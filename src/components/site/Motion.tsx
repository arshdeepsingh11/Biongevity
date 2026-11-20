"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Count-up number: animates from 0 when it scrolls into view. Shows the final value without JavaScript or with reduced motion. */
export function CountUp({ to, className, duration = 1400 }: { to: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The real number shows until the counter scrolls into view; only then it counts up from 0.
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setV(0);
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} className={cn("tabular-nums", className)}>{v}</span>;
}

/** Looping words: one word at a time, gently sliding in. Screen readers get the full list once. */
export function LoopingWords({ words, className, interval = 2200 }: { words: string[]; className?: string; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className={cn("loop6", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden key={i} className="loop6-word">{words[i]}</span>
    </span>
  );
}
