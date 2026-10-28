"use client";
import { useEffect, useRef } from "react";
import { onThemeChange, themeRgb } from "@/lib/theme";

/**
 * Floating 3D Particles — tiny twinkling dots in a slow pseudo-3D field behind every page.
 * Perspective projection · continuous rotation · buoyant drift · depth-aware size, alpha and softness.
 * Calm by design: tiny dots, slow twinkle, slow drift; painter's sort, ≤ 1.5 DPR, paused when hidden,
 * fewer particles on small screens, a single still frame for reduced motion.
 */
/** Particle colours come from the active theme (gold · accent · sage · AI highlight) and update when it changes. */
const TOKENS = ["gold", "accent", "teal-soft", "ai-hi"];

type P = { x: number; y: number; z: number; s: number; c: number; ph: number; sp: number };

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = innerWidth < 768;
    const N = small ? 70 : 160;
    const R = 1; // world radius (unit cube −1..1)
    const FOV = 1.8;

    let COLORS = TOKENS.map((t) => themeRgb(t).join(","));
    const offTheme = onThemeChange(() => { COLORS = TOKENS.map((t) => themeRgb(t).join(",")); if (reduced) draw(0.016, 0); else if (!raf && !document.hidden) raf = requestAnimationFrame(frame); });
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const ps: P[] = Array.from({ length: N }, () => ({ x: rand(-R, R), y: rand(-R, R), z: rand(-R, R), s: rand(0.6, 1.6), c: (Math.random() * TOKENS.length) | 0, ph: rand(0, Math.PI * 2), sp: rand(0.6, 1.4) }));

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(1.5, devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener("resize", resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / W - 0.5; mouse.ty = e.clientY / H - 0.5; };
    addEventListener("pointermove", onMove, { passive: true });

    const proj: { x: number; y: number; z: number; k: number; p: P }[] = ps.map((p) => ({ x: 0, y: 0, z: 0, k: 0, p }));
    let raf = 0, last = 0, angle = 0;

    // Sand is solid and calm: no page-wide particles, and no animation loop at all while it is active.
    const quiet = () => document.documentElement.dataset.theme === "sand";
    const frame = (now: number) => {
      if (quiet()) { ctx.clearRect(0, 0, W, H); raf = 0; return; }
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / 40) return; // ~40 fps cap
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      draw(dt, now / 1000);
    };

    const draw = (dt: number, t: number) => {
      if (quiet()) { ctx.clearRect(0, 0, W, H); return; }
      angle += dt * 0.02;                               // continuous rotation
      mouse.x += (mouse.tx - mouse.x) * 0.02; mouse.y += (mouse.ty - mouse.y) * 0.02;
      const ay = angle + mouse.x * 0.15, ax = 0.25 + mouse.y * 0.1;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const calm = document.documentElement.classList.contains("fx-calm");
      const unit = Math.min(W, H) * 0.62, ox = W / 2, oy = H / 2;

      for (let i = 0; i < N; i++) {
        const p = ps[i];
        // buoyant drift: slow rise + gentle sway; wrap at the top
        p.y -= dt * 0.012 * p.sp;
        p.x += Math.sin(t * 0.3 + p.ph) * dt * 0.004;
        if (p.y < -R) { p.y = R; p.x = rand(-R, R); p.z = rand(-R, R); }
        // rotate (Y then X)
        const x1 = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
        const k = FOV / (FOV + z2 + R);                // perspective
        const q = proj[i]; q.x = ox + x1 * unit * k * (W / Math.min(W, H)); q.y = oy + y2 * unit * k; q.z = z2; q.k = k;
      }
      proj.sort((a, b) => b.z - a.z);                  // far → near (painter's)

      ctx.clearRect(0, 0, W, H);
      for (const q of proj) {
        const near = 1 - (q.z + R) / (2 * R);           // 1 near … 0 far
        const r = (0.5 + q.p.s * 0.55) * (0.6 + near * 0.6); // tiny: ~0.4–1.6 px
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.9 * q.p.sp + q.p.ph); // slow, soft flicker
        ctx.globalAlpha = (0.12 + near * 0.33) * (0.35 + 0.65 * twinkle) * (calm ? 0.5 : 1);
        ctx.fillStyle = `rgb(${COLORS[q.p.c]})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden && !reduced) { last = 0; raf = requestAnimationFrame(frame); } };
    document.addEventListener("visibilitychange", onVis);
    if (reduced) draw(0.016, 0); else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); offTheme();
      removeEventListener("resize", resize); removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden data-ai-fx className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
