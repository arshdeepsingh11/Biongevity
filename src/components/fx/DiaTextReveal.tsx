"use client";
import { useInView } from "@/hooks/useInView";

/**
 * Dia Text Reveal — a horizontal colour band sweeps across the text with a gradient
 * shine, then settles on the foreground colour.
 */
export function DiaTextReveal({ text, className, duration = 1.6 }: { text: string; className?: string; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.5 });
  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`} aria-label={text}>
      <span aria-hidden className="bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(100deg, var(--ink) 0%, var(--ink) 40%, #2563EB 47%, #06B6D4 50%, #F59E0B 53%, rgba(15,23,42,.18) 60%, rgba(15,23,42,.18) 100%)",
          backgroundSize: "300% 100%", WebkitBackgroundClip: "text",
          backgroundPosition: inView ? "0% 0" : "100% 0",
          transition: `background-position ${duration}s cubic-bezier(.65,0,.35,1)`,
        }}>
        {text}
      </span>
    </span>
  );
}
