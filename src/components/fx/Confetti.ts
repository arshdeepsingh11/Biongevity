"use client";
import confetti from "canvas-confetti";

const COLORS = ["#7FA083", "#B8925C", "#97703F", "#97703F", "#97703F"];

/** Confetti — iridescent burst for moments that matter (add to cart, booking, form sent). */
export function fireConfetti(origin?: { x: number; y: number }) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const o = origin ?? { x: 0.5, y: 0.6 };
  confetti({ particleCount: 70, spread: 70, startVelocity: 38, origin: o, colors: COLORS, scalar: 0.9, ticks: 180 });
  setTimeout(() => confetti({ particleCount: 40, spread: 110, startVelocity: 26, origin: o, colors: COLORS, scalar: 0.75 }), 140);
}

export const originFromEvent = (e: { clientX: number; clientY: number }) => ({ x: e.clientX / innerWidth, y: e.clientY / innerHeight });
