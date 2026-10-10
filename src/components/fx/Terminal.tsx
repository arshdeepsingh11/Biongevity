"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

/** Terminal — macOS-style window that types its lines in sequence. */
export function Terminal({ lines, title = "bioelr — demo session", height = 320 }: { lines: string[]; title?: string; height?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    if (!inView || li >= lines.length) return;
    const line = lines[li];
    const isCmd = line.startsWith("$");
    const t = setTimeout(() => {
      if (ci < line.length) setCi((c) => c + (isCmd ? 1 : line.length));
      else { setLi((l) => l + 1); setCi(0); }
    }, ci < line.length ? (isCmd ? 28 : 320) : 380);
    return () => clearTimeout(t);
  }, [inView, li, ci, lines]);
  const color = (l: string) => (l.startsWith("$") ? "text-ink" : l.startsWith("✓") ? "text-emerald-600" : "text-muted");
  return (
    <div ref={ref} className="overflow-hidden rounded-3xl bg-white/80 shadow-lift ring-1 ring-ink/[0.08] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-ink/[0.06] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" /><span className="h-3 w-3 rounded-full bg-[#FEBC2E]" /><span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[12px] text-faint">{title}</span>
      </div>
      <pre className="overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-[12.5px] leading-[1.75]" style={{ height }}>
        {lines.slice(0, li).map((l, i) => <div key={i} className={color(l)}>{l}</div>)}
        {li < lines.length && <div className={color(lines[li])}>{lines[li].slice(0, ci)}<span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulseDot bg-accent" /></div>}
      </pre>
    </div>
  );
}
