"use client";
import { useInView } from "@/hooks/useInView";

/** Text 3D Flip — letters flip in 3D, staggered, on view and on hover. */
export function Text3DFlip({ text, className }: { text: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={`group inline-block [perspective:600px] ${className ?? ""}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(360deg)]"
          style={{ transform: inView ? "rotateX(0deg)" : "rotateX(-90deg)", opacity: inView ? 1 : 0, transitionDelay: `${i * 28}ms`, transitionProperty: "transform, opacity" }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
