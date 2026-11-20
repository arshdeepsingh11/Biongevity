"use client";

declare global {
  interface Window {
    /** Set once the first-visit curtain has lifted (or was skipped). */
    __bgReady?: boolean;
  }
}

/**
 * Runs `cb` when the page is ready to start its entrance: straight away if the preloader already
 * finished or was skipped, otherwise on the `bg:ready` event it fires as its curtain lifts.
 */
export function onReady(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__bgReady) { cb(); return () => {}; }
  const handler = () => cb();
  document.addEventListener("bg:ready", handler, { once: true });
  return () => document.removeEventListener("bg:ready", handler);
}

export function markReady() {
  window.__bgReady = true;
  document.dispatchEvent(new Event("bg:ready"));
}
