"use client";
import { useEffect, useRef, useState } from "react";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

/** City character for the stylised map (heights in metres-ish, water side). */
const PROFILE: Record<string, { tall: [number, number]; water: "north" | "east" | "canal"; seed: number; label: string }> = {
  Calgary: { tall: [40, 190], water: "north", seed: 5, label: "Downtown Calgary · Bow River to the north" },
  Dubai: { tall: [30, 260], water: "east", seed: 9, label: "Dubai · Business Bay" },
  Almelo: { tall: [8, 26], water: "canal", seed: 13, label: "Almelo · town centre" },
};

interface B { x: number; y: number; w: number; d: number; h: number; clinic?: boolean; park?: boolean }

/**
 * Stylised 3D city around the clinic — drawn in code (no map service, no key). Drag to rotate, drag up/down
 * to tilt, scroll or pinch to zoom. The clinic tower glows with its floor lit; tap it to go inside.
 * Streets and blocks are illustrative, not a survey map.
 */
export function City3D({ city, floors, floor, building, onEnter }: { city: string; floors: number; floor: number; building: string; onEnter: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [hint, setHint] = useState(true);
  const cam = useRef({ bear: 0.6, tBear: 0.6, tilt: 0.95, tTilt: 0.95, zoom: 1, tZoom: 1, drag: false, lx: 0, ly: 0, moved: false, idle: 0 });
  const enter = useRef(onEnter); enter.current = onEnter;

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    const P = PROFILE[city] ?? PROFILE.Calgary;
    let s = P.seed * 9973; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    // ── build the city ──
    const G = 7, BL = 70, RD = 16, half = (G * (BL + RD)) / 2;
    const blds: B[] = [];
    for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
      const bx = -half + i * (BL + RD) + RD / 2, by = -half + j * (BL + RD) + RD / 2;
      const water = (P.water === "north" && j === 0) || (P.water === "east" && i === G - 1) || (P.water === "canal" && j === 1);
      if (water) continue;
      const centre = i === (G >> 1) && j === (G >> 1);
      if (centre) { blds.push({ x: bx + 14, y: by + 14, w: BL - 28, d: BL - 28, h: Math.max(14, floors * (P.tall[1] > 100 ? 4.2 : 4)), clinic: true }); continue; }
      if (r() < 0.12) { blds.push({ x: bx, y: by, w: BL, d: BL, h: 0, park: true }); continue; }
      const dist = Math.hypot(i - G / 2 + 0.5, j - G / 2 + 0.5) / (G / 2);
      const parts = r() < 0.5 ? 1 : r() < 0.6 ? 2 : 4;
      const cells = parts === 1 ? [[0, 0, 1, 1]] : parts === 2 ? [[0, 0, 0.5, 1], [0.5, 0, 0.5, 1]] : [[0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]];
      for (const [u, v, uw, vh] of cells) {
        const m = 5, h = P.tall[0] + (P.tall[1] - P.tall[0]) * Math.pow(r(), 1.6) * (1.15 - dist * 0.8);
        blds.push({ x: bx + u * BL + m, y: by + v * BL + m, w: uw * BL - m * 2, d: vh * BL - m * 2, h: Math.max(P.tall[0] * 0.6, h) });
      }
    }
    const water = P.water === "north" ? [-half - 40, -half - 40, half * 2 + 80, BL + RD + 40] : P.water === "east" ? [half - BL - RD, -half - 40, BL + RD + 60, half * 2 + 80] : [-half - 40, -half + (BL + RD), half * 2 + 80, BL];
    const cars = Array.from({ length: 70 }, () => ({ axis: r() < 0.5 ? 0 : 1, lane: Math.floor(r() * (G + 1)), t: r(), v: (0.02 + r() * 0.04) * (r() < 0.5 ? 1 : -1) }));

    let W = 0, H = 0, dpr = 1, raf = 0, last = performance.now(), visible = true;
    const read = () => ({ ink: themeRgb("ink"), ai: themeRgb("ai"), ai2: themeRgb("ai-2"), hi: themeRgb("ai-hi"), pearl: themeRgb("pearl"), canvas: themeRgb("canvas"), vein: themeRgb("vein"), teal: themeRgb("teal") });
    let col = read(); const off = onThemeChange(() => { col = read(); });
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgba = (a: number[], o: number) => `rgba(${a[0]},${a[1]},${a[2]},${o})`;
    const shade = (a: number[], f: number) => a.map((x) => Math.round(Math.min(255, x * f)));
    let clinicBox = { x0: 0, y0: 0, x1: 0, y1: 0 };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const k = cam.current;
      if (!k.drag) { k.idle += dt; if (!reduced && k.idle > 2) k.tBear += dt * 0.08; }
      k.bear += (k.tBear - k.bear) * 0.08; k.tilt += (k.tTilt - k.tilt) * 0.08; k.zoom += (k.tZoom - k.zoom) * 0.08;
      const cb = Math.cos(k.bear), sb = Math.sin(k.bear), st = Math.sin(k.tilt), ct = Math.cos(k.tilt);
      const S = (Math.min(W, H * 1.4) / (half * 2.2)) * k.zoom, cx = W / 2, cy = H * 0.56;
      const P2 = (x: number, y: number, h = 0) => { const xr = x * cb - y * sb, yr = x * sb + y * cb; return [cx + xr * S, cy + yr * S * ct - h * S * st * 0.9, yr] as const; };

      ctx.clearRect(0, 0, W, H);
      // ground
      const g0 = P2(-half - 60, -half - 60), g1 = P2(half + 60, -half - 60), g2 = P2(half + 60, half + 60), g3 = P2(-half - 60, half + 60);
      ctx.fillStyle = rgba(col.canvas, 1); ctx.beginPath(); ctx.moveTo(g0[0], g0[1]); ctx.lineTo(g1[0], g1[1]); ctx.lineTo(g2[0], g2[1]); ctx.lineTo(g3[0], g3[1]); ctx.closePath(); ctx.fill();
      // water
      { const [wx, wy, ww, wd] = water, a = P2(wx, wy), b = P2(wx + ww, wy), cc = P2(wx + ww, wy + wd), d = P2(wx, wy + wd);
        const wg = ctx.createLinearGradient(a[0], a[1], cc[0], cc[1]); wg.addColorStop(0, rgba(col.vein, 0.22)); wg.addColorStop(1, rgba(col.vein, 0.1));
        ctx.fillStyle = wg; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(cc[0], cc[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fill(); }
      // roads
      ctx.strokeStyle = rgba(col.ink, 0.07); ctx.lineWidth = Math.max(1, RD * S * 0.8); ctx.lineCap = "round";
      for (let i = 0; i <= G; i++) {
        const v = -half + i * (BL + RD);
        let a = P2(v, -half), b = P2(v, half); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        a = P2(-half, v); b = P2(half, v); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      // traffic
      for (const car of cars) {
        car.t = (car.t + car.v * dt + 1) % 1;
        const along = -half + car.t * half * 2, lane = -half + car.lane * (BL + RD) + (car.v > 0 ? -3 : 3);
        const p = car.axis ? P2(along, lane) : P2(lane, along);
        ctx.fillStyle = rgba(car.v > 0 ? col.ai2 : col.ink, 0.55); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1.2, 1.8 * k.zoom), 0, Math.PI * 2); ctx.fill();
      }
      // buildings (far → near)
      const order = blds.map((b) => ({ b, d: P2(b.x + b.w / 2, b.y + b.d / 2)[2] })).sort((a, z) => a.d - z.d);
      for (const { b } of order) {
        const base = b.clinic ? col.ai2 : col.pearl;
        const pts = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
        if (b.park) {
          const q = pts.map(([x, y]) => P2(x, y)); ctx.fillStyle = rgba(col.teal, 0.16); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
          for (let t = 0; t < 6; t++) { const p = P2(b.x + 10 + ((t * 23) % (b.w - 20)), b.y + 12 + ((t * 37) % (b.d - 24)), 6); ctx.fillStyle = rgba(col.teal, 0.45); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(2, 5 * S), 0, Math.PI * 2); ctx.fill(); }
          continue;
        }
        // side faces: draw the two facing the camera
        const lo = pts.map(([x, y]) => P2(x, y)), hi = pts.map(([x, y]) => P2(x, y, b.h));
        for (let e = 0; e < 4; e++) {
          const a = e, z = (e + 1) % 4;
          const face = [lo[a], lo[z], hi[z], hi[a]];
          const nd = (lo[a][2] + lo[z][2]) / 2 - (lo[(e + 2) % 4][2] + lo[(e + 3) % 4][2]) / 2;
          if (nd <= 0) continue;
          ctx.fillStyle = rgba(shade(base, e % 2 ? 0.86 : 0.93), b.clinic ? 0.95 : 0.96);
          ctx.beginPath(); face.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = rgba(col.ink, 0.06); ctx.lineWidth = 0.6; ctx.stroke();
          if (b.clinic) {
            // floor bands + the lit clinic floor
            const fh = b.h / floors;
            for (let f = 1; f < floors; f++) { const t = f * fh, p1 = P2(pts[a][0], pts[a][1], t), p2 = P2(pts[z][0], pts[z][1], t); ctx.strokeStyle = rgba([255, 255, 255], 0.35); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
            const f0 = (floor - 1) * fh, f1 = floor * fh, q = [P2(pts[a][0], pts[a][1], f0), P2(pts[z][0], pts[z][1], f0), P2(pts[z][0], pts[z][1], f1), P2(pts[a][0], pts[a][1], f1)];
            ctx.fillStyle = rgba(col.hi, 0.95); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
          }
        }
        ctx.fillStyle = rgba(shade(base, 1.04), 1); ctx.beginPath(); hi.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = rgba(col.ink, b.clinic ? 0.2 : 0.07); ctx.lineWidth = 0.8; ctx.stroke();
        if (b.clinic) {
          const xs = [...lo, ...hi].map((p) => p[0]), ys = [...lo, ...hi].map((p) => p[1]);
          clinicBox = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
          // pin
          const top = P2(b.x + b.w / 2, b.y + b.d / 2, b.h), bob = Math.sin(now / 420) * 4, py = top[1] - 34 + bob;
          const pr = 13 + Math.sin(now / 300) * 1.5;
          ctx.fillStyle = rgba(col.ai, 0.18); ctx.beginPath(); ctx.arc(top[0], top[1], pr + 10, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = rgba(col.ai, 0.6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(top[0], py + 10); ctx.stroke();
          ctx.fillStyle = rgba(col.ai, 1); ctx.beginPath(); ctx.arc(top[0], py, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(top[0], py, 4, 0, Math.PI * 2); ctx.fill();
        }
      }
    };
    raf = requestAnimationFrame(frame);

    const inClinic = (x: number, y: number) => x > clinicBox.x0 - 6 && x < clinicBox.x1 + 6 && y > clinicBox.y0 - 50 && y < clinicBox.y1;
    const down = (e: PointerEvent) => { const k = cam.current; k.drag = true; k.moved = false; k.lx = e.clientX; k.ly = e.clientY; k.idle = 0; c.setPointerCapture(e.pointerId); setHint(false); };
    const move = (e: PointerEvent) => {
      const k = cam.current, rc = c.getBoundingClientRect();
      if (!k.drag) { c.style.cursor = inClinic(e.clientX - rc.left, e.clientY - rc.top) ? "pointer" : "grab"; return; }
      const dx = e.clientX - k.lx, dy = e.clientY - k.ly; k.lx = e.clientX; k.ly = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 2) k.moved = true;
      k.tBear += dx * 0.008; k.bear = k.tBear; k.tTilt = Math.max(0.35, Math.min(1.2, k.tTilt - dy * 0.004));
    };
    const up = (e: PointerEvent) => { const k = cam.current; k.drag = false; if (!k.moved) { const rc = c.getBoundingClientRect(); if (inClinic(e.clientX - rc.left, e.clientY - rc.top)) enter.current(); } };
    const wheel = (e: WheelEvent) => { e.preventDefault(); const k = cam.current; k.tZoom = Math.max(0.7, Math.min(3, k.tZoom * (e.deltaY > 0 ? 0.92 : 1.08))); };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up); c.addEventListener("wheel", wheel, { passive: false });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); off(); c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); c.removeEventListener("wheel", wheel); };
  }, [city, floors, floor]);

  const k = cam.current;
  return (
    <div className="absolute inset-0">
      <canvas ref={cv} role="img" aria-label={`Stylised 3D map around ${building}, ${city}. Drag to rotate and tilt; tap the highlighted tower to go inside.`} className="h-full w-full cursor-grab touch-none" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-2xl bg-white/85 px-3 py-2 shadow-card ring-1 ring-ink/[0.06] backdrop-blur">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">3D city · Illustrative</div>
        <div className="text-[12.5px] font-semibold">{PROFILE[city]?.label ?? city}</div>
      </div>
      {hint && <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[11.5px] text-muted ring-1 ring-ink/[0.06] backdrop-blur"><Icon name="move" size={12} className="mr-1 inline" />Drag to turn · up/down to tilt · tap the lit tower</div>}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/85 p-1 shadow-card ring-1 ring-ink/[0.08] backdrop-blur-md">
        <button onClick={() => { k.tBear -= Math.PI / 4; k.idle = 0; }} aria-label="Rotate left" className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="chevron-left" size={15} /></button>
        <button onClick={() => { k.tTilt = k.tTilt > 0.8 ? 0.45 : 1.05; }} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Tilt</button>
        <button onClick={() => { k.tZoom = Math.min(3, k.tZoom * 1.25); }} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="plus" size={14} /></button>
        <button onClick={() => { k.tZoom = Math.max(0.7, k.tZoom / 1.25); }} aria-label="Zoom out" className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="minus" size={14} /></button>
        <button onClick={() => { k.tBear += Math.PI / 4; k.idle = 0; }} aria-label="Rotate right" className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="chevron-right" size={15} /></button>
        <span className="mx-0.5 h-4 w-px bg-ink/10" />
        <button onClick={onEnter} className="btn-ai h-8 px-3 text-[12px]">Enter building<Icon name="arrow-right" size={13} /></button>
      </div>
    </div>
  );
}
