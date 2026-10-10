"use client";
import { motion, type Variants } from "framer-motion";
import type { ElementType } from "react";

type Anim = "blurIn" | "slideUp" | "fadeIn" | "scaleUp";
const VARIANTS: Record<Anim, Variants> = {
  blurIn: { hidden: { opacity: 0, filter: "blur(10px)" }, show: { opacity: 1, filter: "blur(0px)" } },
  slideUp: { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scaleUp: { hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } },
};

const cache = new Map<ElementType, ReturnType<typeof motion.create>>();
const motionTag = (t: ElementType) => { if (!cache.has(t)) cache.set(t, motion.create(t as never)); return cache.get(t)!; };

/** Text Animate — animates text by word or character when it enters the viewport. */
export function TextAnimate({ children, by = "word", animation = "blurIn", as: Tag = "span", className, delay = 0, stagger }:
  { children: string; by?: "word" | "character"; animation?: Anim; as?: ElementType; className?: string; delay?: number; stagger?: number }) {
  const parts = by === "word" ? children.split(/(\s+)/) : Array.from(children);
  const MotionTag = motionTag(Tag) as ElementType;
  return (
    <MotionTag className={className} aria-label={children} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger ?? (by === "word" ? 0.06 : 0.02), delayChildren: delay }}>
      {parts.map((p, i) => /^\s+$/.test(p) ? p : (
        <motion.span key={i} aria-hidden className="inline-block whitespace-pre" variants={VARIANTS[animation]} transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}>{p}</motion.span>
      ))}
    </MotionTag>
  );
}
