"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

/** Number Ticker — counts to `value` when scrolled into view, then glides from the old value when it changes. */
export function NumberTicker({ value, decimals = 0, duration = 1400, from = 0, prefix = "", suffix = "", className }:
  { value: number; decimals?: number; duration?: number; from?: number; prefix?: string; suffix?: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [n, setN] = useState(from);
  const cur = useRef(from);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const t0 = performance.now(), start = cur.current;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - k, 4);
      cur.current = start + (value - start) * e; setN(cur.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, from, duration]);
  return <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>{prefix}{n.toFixed(decimals)}{suffix}</span>;
}
