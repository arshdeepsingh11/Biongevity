"use client";
import { useEffect, type RefObject } from "react";

/**
 * Makes a muted background video actually start on phones.
 * Mobile browsers only autoplay a video that is muted *before* it loads, and iOS Low Power Mode and
 * Android Data Saver refuse autoplay altogether until the person touches the page. So: set `muted`
 * as a property (not just an attribute) at mount, ask for play right away and again once data arrives,
 * and retry on the first touch, scroll or tab return. Every attempt is silent if the browser says no.
 */
export function useAutoplay(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const v = ref.current;
    if (!v || !enabled) return;
    v.muted = true; v.defaultMuted = true; v.setAttribute("muted", "");
    v.playsInline = true;
    const tryPlay = () => { if (v.paused && !v.ended) v.play().catch(() => undefined); };
    tryPlay();
    const gestures: (keyof DocumentEventMap)[] = ["touchstart", "pointerdown", "scroll", "keydown"];
    const onVisible = () => { if (document.visibilityState === "visible") tryPlay(); };
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    gestures.forEach((e) => document.addEventListener(e, tryPlay, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      gestures.forEach((e) => document.removeEventListener(e, tryPlay));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [ref, enabled]);
}
