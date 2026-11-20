"use client";
import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, reducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

/**
 * Headline reveal: each line rises out of a mask, one after the other. Runs the first time it
 * scrolls into view (`when="view"`), or for heroes once the page is ready (`when="ready"`). The
 * text stays real text — SplitText only wraps it — so it is selectable and read normally.
 */
export function SplitReveal({ children, as: Tag = "div", className = "", id, when = "view", delay = 0, by = "lines", stagger, duration = 1.1 }:
  { children: ReactNode; as?: ElementType; className?: string; id?: string; when?: "ready" | "view"; delay?: number; by?: "lines" | "words" | "chars"; stagger?: number; duration?: number }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let split: SplitText | undefined;
    let ctx: gsap.Context | undefined;
    let offReady = () => {};
    let cancelled = false;
    el.style.visibility = "hidden";

    const run = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        split = SplitText.create(el, {
          type: by === "lines" ? "lines" : by === "words" ? "lines,words" : "lines,chars",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            el.style.visibility = "";
            const targets = by === "lines" ? self.lines : by === "words" ? self.words : self.chars;
            const vars: gsap.TweenVars = {
              yPercent: 110, rotate: by === "lines" ? 1.5 : 0, opacity: by === "lines" ? 1 : 0, duration, delay,
              stagger: stagger ?? (by === "lines" ? 0.09 : by === "words" ? 0.035 : 0.014), ease: "power4.out",
            };
            if (when === "view") {
              vars.scrollTrigger = { trigger: el, start: "top 88%", once: true };
              return gsap.from(targets, vars);
            }
            const tween = gsap.from(targets, { ...vars, paused: true });
            offReady = onReady(() => tween.play());
            return tween;
          },
        });
      }, el);
    };

    if (document.fonts?.status === "loaded") run();
    else document.fonts?.ready.then(run);

    return () => {
      cancelled = true;
      offReady();
      ctx?.revert();
      split?.revert();
      el.style.visibility = "";
      ScrollTrigger.refresh();
    };
  }, [when, delay, by, stagger, duration]);

  return <Tag ref={ref} id={id} className={className}>{children}</Tag>;
}
