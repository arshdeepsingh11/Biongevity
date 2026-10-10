"use client";
import { useEffect, useRef } from "react";

/**
 * Ambient signal field — fixed, low-opacity particle network behind every page.
 * Particles drift; scroll velocity stretches them into signal streaks. Canvas 2D,
 * capped at 70 nodes, paused when the tab is hidden, static under reduced motion.
 */
export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(1.5, devicePixelRatio);
    let w = 0, h = 0, raf = 0, lastY = scrollY, vel = 0;
    const N = innerWidth < 768 ? 36 : 70;
    const pts = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00025, vy: (Math.random() - 0.5) * 0.00025, a: Math.random() }));
    const resize = () => { w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener("resize", resize);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      const dy = scrollY - lastY; lastY = scrollY;
      vel += (Math.max(-40, Math.min(40, dy)) - vel) * 0.12;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy - vel * 0.00004;
        if (p.x < 0) p.x += 1; if (p.x > 1) p.x -= 1; if (p.y < 0) p.y += 1; if (p.y > 1) p.y -= 1;
      }
      for (let i = 0; i < N; i++) {
        const a = pts[i], ax = a.x * w, ay = a.y * h;
        for (let j = i + 1; j < N; j++) {
          const b = pts[j], dx = ax - b.x * w, dy2 = ay - b.y * h, d = dx * dx + dy2 * dy2;
          if (d < 140 * 140) { ctx.strokeStyle = `rgba(61,139,255,${0.09 * (1 - Math.sqrt(d) / 140)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); }
        }
        const streak = Math.min(30, Math.abs(vel) * 0.8);
        ctx.strokeStyle = `rgba(0,229,192,${0.25 + a.a * 0.35})`; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + Math.sign(vel) * streak + 0.01); ctx.stroke();
        ctx.fillStyle = `rgba(0,229,192,${0.3 + a.a * 0.4})`; ctx.fillRect(ax - 0.8, ay - 0.8, 1.6, 1.6);
      }
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} aria-hidden data-ai-fx className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" />;
}
