"use client";
import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, reducedMotion } from "@/lib/gsap";

/** A paragraph read by scrolling: every word starts faint and comes up to full strength as it passes the middle of the screen. */
export function ScrollWords({ children, as: Tag = "p", className = "", id, from = 0.14, start = "top 80%", end = "bottom 45%" }:
  { children: ReactNode; as?: ElementType; className?: string; id?: string; from?: number; start?: string; end?: string }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "words", wordsClass: "scroll-word", autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(self.words, { opacity: from }, { opacity: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: el, start, end, scrub: 0.6 } });
        },
      });
    }, el);
    return () => { ctx.revert(); split?.revert(); };
  }, [from, start, end]);

  return <Tag ref={ref} id={id} className={className}>{children}</Tag>;
}
