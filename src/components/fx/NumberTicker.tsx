"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

/** Number Ticker — counts to `value` when scrolled into view. */
export function NumberTicker({ value, decimals = 0, duration = 1400, from = 0, prefix = "", suffix = "", className }:
  { value: number; decimals?: number; duration?: number; from?: number; prefix?: string; suffix?: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - k, 4);
      setN(from + (value - from) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, from, duration]);
  return <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>{prefix}{n.toFixed(decimals)}{suffix}</span>;
}
