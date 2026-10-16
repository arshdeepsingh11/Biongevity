"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { buildBody, type V3 } from "@/lib/body";
import { CORONARY, VESSELS, VESSEL_INFO, lungBranches, vesselInfo, type Vessel, type VesselKind } from "@/data/vessels";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/useCamera";

const HEART: V3 = [0.028, 0.395, 0.045];
type Layer = "arteries" | "veins" | "lungs" | "body";
const KIND_LAYER: Record<VesselKind, Layer> = { artery: "arteries", coronary: "arteries", vein: "veins", portal: "veins", "pulmonary-artery": "lungs", "pulmonary-vein": "lungs" };
/** Flow direction along the traced path: +1 = from first point to last. */
const FLOW: Record<VesselKind, number> = { artery: 1, coronary: 1, vein: -1, portal: 1, "pulmonary-artery": 1, "pulmonary-vein": -1 };

/** Catmull-Rom sampling so every vessel is a smooth tube. */
function smooth(p: V3[], per = 6): V3[] {
  if (p.length < 3) return p;
  const out: V3[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)) as V3);
    }
  }
  out.push(p[p.length - 1]);
  return out;
}

/** Heart as a dense, shaded point volume: tapered ventricles (apex down-left) + two atria. */
function buildHeart() {
  let s = 3; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: number[] = [], side: number[] = [];
  const rot = (x: number, y: number, z: number): V3 => { const a = -0.55, c = Math.cos(a), sn = Math.sin(a); return [x * c - y * sn, x * sn + y * c, z]; };
  const HS = 1.35;
  for (let i = 0; i < 2200; i++) {
    const u = r() * 2 - 1, t = r() * Math.PI * 2, k = Math.cbrt(r()) * 0.55 + 0.45, q = Math.sqrt(1 - u * u);
    const y = u * 0.052 * HS, taper = 0.62 + 0.38 * ((u + 1) / 2);
    const x = Math.cos(t) * q * 0.043 * HS * taper * k, z = Math.sin(t) * q * 0.038 * HS * taper * k;
    const p = rot(x, y * k, z); pts.push(p[0], p[1], p[2]); side.push(p[0] > -0.004 ? 1 : 0);
  }
  for (const [cx, cy, cz, rr, sd] of [[-0.03, 0.054, -0.016, 0.032, 0], [0.022, 0.062, -0.03, 0.028, 1]] as const) {
    for (let i = 0; i < 380; i++) { const u = r() * 2 - 1, t = r() * Math.PI * 2, q = Math.sqrt(1 - u * u), k = Math.cbrt(r()) * 0.5 + 0.5; pts.push(cx + Math.cos(t) * q * rr * k, cy + u * rr * 0.85 * k, cz + Math.sin(t) * q * rr * k); side.push(sd); }
  }
  return { pts: new Float32Array(pts), side: new Uint8Array(side) };
}

interface Seg { x1: number; y1: number; x2: number; y2: number; w: number; z: number; id: string }

/**
 * Interactive 3D cardiovascular system — beating heart, arteries, veins and lungs, with blood flowing in time
 * with the heart rate you set. Drag to rotate, scroll or pinch to zoom, hover or tap any vessel to learn what it
 * does. Simplified illustrative anatomy (not to scale), drawn in code — no images or model files.
 */
export function CardioExplorer({ height = 640, className }: { height?: number; className?: string }) {
  const { ask } = useAI();
  const cam = useCamera();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<string>("heart");
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ arteries: true, veins: true, lungs: true, body: true });
  const [bpm, setBpm] = useState(68);
  const [flow, setFlow] = useState(true);
  const [focusHeart, setFocusHeart] = useState(false);
  const P = useRef({ layers, bpm, flow, hover, sel, focusHeart });
  P.current = { layers, bpm, flow, hover, sel, focusHeart };
  const view = useRef({ yaw: 0.35, tYaw: 0.35, pitch: -0.05, zoom: 1, tZoom: 1, tx: 0, ty: 0.06, ttx: 0, tty: 0.06, drag: false, lx: 0, ly: 0, idle: 0, moved: false });

  const geo = useMemo(() => {
    const vessels = [...VESSELS, ...lungBranches()].map((v: Vessel) => {
      const info = vesselInfo(v.info)!, pts = smooth(v.pts);
      const len: number[] = [0];
      for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
      return { id: v.info, kind: info.kind, r: v.r, pts, len, total: len[len.length - 1] };
    });
    const coronary = CORONARY.map((v) => ({ id: v.info, r: v.r, pts: smooth(v.pts, 5) }));
    const particles = vessels.flatMap((v, vi) => (v.r < 0.004 ? [] : Array.from({ length: Math.max(2, Math.round(v.total * 60)) }, (_, k) => ({ vi, u: k / Math.max(2, Math.round(v.total * 60)) }))));
    const body = buildBody(0.42).body;
    return { vessels, coronary, particles, body, heart: buildHeart() };
  }, []);

  useEffect(() => {
    const c = canvas.current!, w = wrap.current!, ctx = c.getContext("2d")!;
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true, last = performance.now(), beat = 0;
    const read = () => ({ ink: themeRgb("ink"), art: themeRgb("artery"), vein: themeRgb("vein"), ai: themeRgb("ai-2"), hi: themeRgb("ai-hi"), surface: themeRgb("surface") });
    let col = read();
    const offTheme = onThemeChange(() => { col = read(); });
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const ro = new ResizeObserver(size); ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 }); io.observe(w);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgba = (a: number[], o: number) => `rgba(${a[0]},${a[1]},${a[2]},${o})`;
    const mix = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t].map(Math.round);
    const kindCol = (k: VesselKind) => (k === "artery" || k === "coronary" || k === "pulmonary-vein" ? col.art : k === "pulmonary-artery" ? mix(col.art, col.vein, 0.55) : k === "portal" ? mix(col.vein, col.art, 0.3) : col.vein);
    let segs: Seg[] = [];
    let heartScreen = { x: 0, y: 0, r: 0 };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const S = P.current, v = view.current;
      // heartbeat: "lub" then "dub" each cycle
      beat = (beat + dt * (S.bpm / 60)) % 1;
      const g = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s));
      const pulse = g(beat, 0.08, 0.035) + 0.6 * g(beat, 0.3, 0.035);
      // camera
      if (!v.drag) { v.idle += dt; if (!reduced && v.idle > 2.5 && !S.hover) v.tYaw += dt * 0.12; }
      v.yaw += (v.tYaw - v.yaw) * 0.08; v.zoom += (v.tZoom - v.zoom) * 0.08;
      const fz = S.focusHeart; v.ttx = fz ? HEART[0] : 0; v.tty = fz ? HEART[1] : 0.06; if (fz && v.tZoom < 2.4) v.tZoom = 2.6; if (!fz && v.tZoom > 2.4) v.tZoom = 1;
      v.tx += (v.ttx - v.tx) * 0.08; v.ty += (v.tty - v.ty) * 0.08;
      const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
      const Sc = H * 0.41 * v.zoom, F = 3.2;
      const out = new Float32Array(3);
      const proj = (x: number, y: number, z: number) => {
        x -= v.tx; y -= v.ty;
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const k = F / (F - z2 * v.zoom * 0.6); out[0] = W / 2 + x1 * Sc * k; out[1] = H / 2 - y1 * Sc * k; out[2] = z2; return k;
      };

      ctx.clearRect(0, 0, W, H);
      // floor glow
      const fg = ctx.createRadialGradient(W / 2, H * 0.94, 0, W / 2, H * 0.94, W * 0.4); fg.addColorStop(0, rgba(col.ai, 0.12)); fg.addColorStop(1, rgba(col.ai, 0)); ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);

      // body silhouette
      if (S.layers.body) {
        ctx.fillStyle = rgba(col.ink, 0.28);
        const b = geo.body;
        for (let i = 0; i < b.length; i += 3) { proj(b[i], b[i + 1], b[i + 2]); const a = 0.35 + out[2] * 2.2; if (a <= 0) continue; ctx.globalAlpha = Math.min(1, a); ctx.fillRect(out[0], out[1], 1.4, 1.4); }
        ctx.globalAlpha = 1;
      }

      // vessels → segments
      type Item = { z: number; draw: () => void };
      const items: Item[] = []; const nextSegs: Seg[] = [];
      for (const ves of geo.vessels) {
        const L = KIND_LAYER[ves.kind]; if (!S.layers[L]) continue;
        const base = kindCol(ves.kind), on = S.hover === ves.id || S.sel === ves.id;
        const swell = ves.kind === "artery" || ves.kind === "pulmonary-artery" ? 1 + pulse * 0.12 : 1;
        // project, then draw in short runs (smooth joins, still depth-sorted against the heart)
        const pp = ves.pts.map((p) => { const k = proj(p[0], p[1], p[2]); return [out[0], out[1], out[2], k] as const; });
        for (let i = 1; i < pp.length; i++) nextSegs.push({ x1: pp[i - 1][0], y1: pp[i - 1][1], x2: pp[i][0], y2: pp[i][1], w: Math.max(0.8, ves.r * 2 * Sc * pp[i][3] * swell), z: (pp[i][2] + pp[i - 1][2]) / 2, id: ves.id });
        const RUN = 4;
        for (let s0 = 0; s0 < pp.length - 1; s0 += RUN) {
          const run = pp.slice(s0, Math.min(pp.length, s0 + RUN + 1));
          const zz = run.reduce((a2, q) => a2 + q[2], 0) / run.length, kk = run.reduce((a2, q) => a2 + q[3], 0) / run.length;
          const w = Math.max(0.8, ves.r * 2 * Sc * kk * swell), shade = Math.max(0, Math.min(1, 0.55 + zz * 2.2));
          items.push({ z: zz, draw: () => {
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.strokeStyle = rgba(mix(base, [20, 20, 30], 0.35 - shade * 0.3), on ? 1 : 0.94); ctx.lineWidth = w + (on ? 2 : 0);
            ctx.beginPath(); run.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
            if (w > 2.2) {
              const o = w * 0.18; ctx.lineCap = "butt";
              ctx.strokeStyle = rgba(mix(base, [255, 255, 255], 0.6), 0.32 * shade + (on ? 0.25 : 0)); ctx.lineWidth = w * 0.3;
              ctx.beginPath(); run.forEach((q, j) => (j ? ctx.lineTo(q[0] - o, q[1] - o) : ctx.moveTo(q[0] - o, q[1] - o))); ctx.stroke();
            }
          } });
        }
      }
      // heart volume (beats: ventricles squeeze, atria counter-pulse)
      if (S.layers.arteries || S.layers.veins) {
        const hp = geo.heart.pts, hs = geo.heart.side, onH = S.hover === "heart" || S.sel === "heart";
        const sq = 1 - pulse * 0.075;
        let minX = 1e9, maxX = -1e9, sumY = 0, n = 0;
        for (let i = 0, j = 0; i < hp.length; i += 3, j++) {
          proj(HEART[0] + hp[i] * sq, HEART[1] + hp[i + 1] * sq, HEART[2] + hp[i + 2] * sq);
          const x = out[0], y = out[1], z = out[2], c0 = hs[j] ? col.art : mix(col.art, col.vein, 0.5);
          const lit = Math.max(0, Math.min(1, 0.5 + (z - HEART[2]) * 14));
          minX = Math.min(minX, x); maxX = Math.max(maxX, x); sumY += y; n++;
          const sz = Math.max(1.6, 2.2 * Math.pow(v.zoom, 0.8));
          items.push({ z, draw: () => { ctx.fillStyle = rgba(mix(c0, [255, 232, 232], lit * 0.5), onH ? 1 : 0.9); ctx.beginPath(); ctx.arc(x, y, sz / 2, 0, Math.PI * 2); ctx.fill(); } });
        }
        heartScreen = { x: (minX + maxX) / 2, y: sumY / n, r: (maxX - minX) / 2 };
        // coronary arteries on the surface
        for (const cv of geo.coronary) {
          let px = 0, py = 0;
          cv.pts.forEach((p, i) => {
            const k = proj(HEART[0] + p[0] * sq * 1.42, HEART[1] + p[1] * sq * 1.42, HEART[2] + p[2] * sq * 1.42); const x = out[0], y = out[1], z = out[2];
            if (i > 0) { const x0 = px, y0 = py, w = Math.max(1, cv.r * 2 * Sc * k), on = S.hover === "coronary" || S.sel === "coronary";
              nextSegs.push({ x1: x0, y1: y0, x2: x, y2: y, w: w + 2, z: z + 0.01, id: "coronary" });
              items.push({ z: z + 0.002, draw: () => { ctx.strokeStyle = on ? rgba(col.hi, 1) : rgba(mix(col.art, [255, 255, 255], 0.35), 0.95); ctx.lineWidth = w + (on ? 1.5 : 0); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); } }); }
            px = x; py = y;
          });
        }
      }
      items.sort((a, b) => a.z - b.z);
      for (const it of items) it.draw();
      segs = nextSegs;

      // heart glow on each beat
      if (S.layers.arteries || S.layers.veins) {
        const gr = ctx.createRadialGradient(heartScreen.x, heartScreen.y, 0, heartScreen.x, heartScreen.y, heartScreen.r * 2.4);
        gr.addColorStop(0, rgba(col.art, 0.18 * pulse)); gr.addColorStop(1, rgba(col.art, 0)); ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(heartScreen.x, heartScreen.y, heartScreen.r * 2.4, 0, Math.PI * 2); ctx.fill();
      }

      // blood flow particles — speed follows the heart rate and surges with each beat
      if (S.flow) {
        const sp = (S.bpm / 70) * (0.35 + pulse * 0.9) * dt;
        for (const pt of geo.particles) {
          const ves = geo.vessels[pt.vi]; if (!S.layers[KIND_LAYER[ves.kind]]) continue;
          pt.u = (pt.u + (sp * 0.05) / Math.max(0.05, ves.total) * 6) % 1;
          const u = FLOW[ves.kind] > 0 ? pt.u : 1 - pt.u, d = u * ves.total;
          let i = 1; while (i < ves.len.length - 1 && ves.len[i] < d) i++;
          const a = ves.pts[i - 1], b = ves.pts[i], t = (d - ves.len[i - 1]) / Math.max(1e-6, ves.len[i] - ves.len[i - 1]);
          proj(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
          const front = out[2] > -0.02;
          ctx.fillStyle = rgba(mix(kindCol(ves.kind), [255, 255, 255], 0.6), front ? 0.95 : 0.35);
          ctx.beginPath(); ctx.arc(out[0], out[1], front ? 1.6 : 1.1, 0, Math.PI * 2); ctx.fill();
        }
      }
    };
    raf = requestAnimationFrame(frame);

    // interaction
    const pick = (mx: number, my: number): string | null => {
      if ((P.current.layers.arteries || P.current.layers.veins) && Math.hypot(mx - heartScreen.x, my - heartScreen.y) < heartScreen.r * 1.05) {
        const cor = segs.filter((s) => s.id === "coronary").some((s) => distSeg(mx, my, s) < s.w / 2 + 2);
        return cor ? "coronary" : "heart";
      }
      let best: Seg | null = null;
      for (const s of segs) { if (distSeg(mx, my, s) < s.w / 2 + 5 && (!best || s.z > best.z)) best = s; }
      return best?.id ?? null;
    };
    const rect = () => c.getBoundingClientRect();
    const down = (e: PointerEvent) => { const v = view.current; v.drag = true; v.moved = false; v.lx = e.clientX; v.ly = e.clientY; v.idle = 0; c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      const v = view.current, r = rect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      if (v.drag) {
        const dx = e.clientX - v.lx, dy = e.clientY - v.ly; v.lx = e.clientX; v.ly = e.clientY;
        if (Math.abs(dx) + Math.abs(dy) > 2) v.moved = true;
        v.tYaw += dx * 0.011; v.yaw = v.tYaw; v.pitch = Math.max(-0.6, Math.min(0.6, v.pitch + dy * 0.004)); return;
      }
      const id = e.pointerType === "mouse" ? pick(mx, my) : null;
      setHover(id); c.style.cursor = id ? "pointer" : "grab";
      if (tip.current) { tip.current.style.transform = `translate(${Math.min(mx + 16, r.width - 250)}px, ${Math.max(8, my - 20)}px)`; }
    };
    const up = (e: PointerEvent) => {
      const v = view.current; v.drag = false; v.idle = 0;
      if (!v.moved) { const r = rect(), id = pick(e.clientX - r.left, e.clientY - r.top); if (id) setSel(id); }
    };
    const leave = () => setHover(null);
    const wheel = (e: WheelEvent) => { if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 4) return; e.preventDefault(); const v = view.current; v.tZoom = Math.max(0.8, Math.min(3.6, v.tZoom * (e.deltaY > 0 ? 0.92 : 1.08))); };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up); c.addEventListener("pointerleave", leave); c.addEventListener("wheel", wheel, { passive: false });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); offTheme(); c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); c.removeEventListener("pointerleave", leave); c.removeEventListener("wheel", wheel); };
  }, [geo]);

  const turn = (a: number) => { const v = view.current; v.tYaw = Math.round(v.tYaw / (Math.PI / 2)) * (Math.PI / 2) + a; v.idle = 0; };
  const zoom = (f: number) => { const v = view.current; v.tZoom = Math.max(0.8, Math.min(3.6, v.tZoom * f)); };
  const info = vesselInfo(sel) ?? vesselInfo("heart")!;
  const hov = hover ? vesselInfo(hover) : null;
  const groups: [string, string[]][] = [["Heart", ["heart", "coronary"]], ["Arteries", ["aorta", "carotid", "arm-artery", "renal-artery", "gut-artery", "leg-artery"]], ["Veins", ["svc", "ivc", "jugular", "arm-vein", "renal-vein", "leg-vein", "portal"]], ["Lungs", ["pulm-artery", "pulm-vein"]]];
  const dot = (id: string) => { const k = vesselInfo(id)!.kind; return k === "vein" ? "rgb(var(--c-vein))" : k === "pulmonary-artery" ? "rgb(150 80 160)" : k === "portal" ? "rgb(var(--c-vein) / .7)" : "rgb(var(--c-artery))"; };

  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]", className)}>
      <div ref={wrap} className={cn("relative min-w-0 overflow-hidden rounded-[30px] shadow-card ring-1 ring-ink/[0.06]", cam.on ? "bg-ink" : "bg-white")} style={{ height }}>
        {cam.on && <video ref={cam.video} muted playsInline aria-hidden className="absolute inset-0 h-full w-full object-cover" />}
        <canvas ref={canvas} role="img" aria-label="Interactive 3D heart and blood vessels. Drag to rotate; select parts from the list." className="absolute inset-0 h-full w-full cursor-grab touch-pan-y" />
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/80 py-1 pl-1 pr-3 text-[12px] font-semibold shadow-card ring-1 ring-ink/[0.06] backdrop-blur">
          <span className="relative grid h-6 w-6 animate-pulse place-items-center rounded-full" style={{ background: "rgb(var(--c-artery) / .12)", color: "rgb(var(--c-artery))", animationDuration: `${60 / bpm}s` }}><Icon name="heart" size={14} /></span>
          {bpm} bpm · {(bpm * 0.07).toFixed(1)} L/min <span className="font-normal text-faint">Illustrative</span>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {(["arteries", "veins", "lungs", "body"] as Layer[]).map((l) => (
            <button key={l} onClick={() => setLayers((x) => ({ ...x, [l]: !x[l] }))} aria-pressed={layers[l]}
              className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize shadow-card ring-1 backdrop-blur transition", layers[l] ? "bg-white/90 text-ink ring-ink/[0.08]" : "bg-white/50 text-faint ring-transparent")}>
              <span className="h-2 w-2 rounded-full" style={{ background: l === "arteries" ? "rgb(var(--c-artery))" : l === "veins" ? "rgb(var(--c-vein))" : l === "lungs" ? "rgb(150 80 160)" : "rgb(var(--c-ink) / .4)", opacity: layers[l] ? 1 : 0.35 }} />{l}
            </button>
          ))}
        </div>
        {cam.error && <div className="absolute inset-x-3 top-14 rounded-xl bg-white/90 px-3 py-2 text-[12px] text-muted shadow-card">{cam.error}</div>}
        {cam.on && <div className="pointer-events-none absolute inset-x-0 top-14 text-center text-[11.5px] font-semibold text-white drop-shadow">AR preview · the camera stays on your device</div>}
        <AnimatePresence>
          {hov && (
            <motion.div ref={tip} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
              className="pointer-events-none absolute left-0 top-0 z-10 w-[240px] rounded-2xl bg-white/95 p-3 shadow-lift ring-1 ring-ink/[0.08] backdrop-blur">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: dot(hov.id) }} />{hov.name}</div>
              <p className="mt-1 text-[12px] leading-snug text-muted">{hov.what}</p>
              <div className="mt-1.5 text-[10.5px] font-semibold text-ai">Click for more ✦</div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-full bg-white/85 p-1 shadow-card ring-1 ring-ink/[0.08] backdrop-blur-md">
          <button onClick={() => turn(0)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Front</button>
          <button onClick={() => turn(Math.PI / 2)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Side</button>
          <button onClick={() => turn(Math.PI)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Back</button>
          <button onClick={() => setFocusHeart((f) => !f)} aria-pressed={focusHeart} className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold", focusHeart ? "bg-ai-soft text-ai" : "hover:bg-ink/[0.05]")}>{focusHeart ? "Whole body" : "Zoom to heart"}</button>
          <span className="mx-0.5 h-4 w-px bg-ink/10" />
          <button onClick={() => zoom(1.2)} aria-label="Zoom in" className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="plus" size={14} /></button>
          <button onClick={() => zoom(1 / 1.2)} aria-label="Zoom out" className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="minus" size={14} /></button>
          {cam.supported && <button onClick={cam.toggle} aria-pressed={cam.on} className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold", cam.on ? "bg-ai-soft text-ai" : "hover:bg-ink/[0.05]")}>{cam.on ? "Exit AR" : "AR view"}</button>}
          <button onClick={() => setFlow((f) => !f)} aria-label={flow ? "Pause blood flow" : "Play blood flow"} className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name={flow ? "stop" : "play"} size={13} /></button>
        </div>
      </div>

      <aside className="flex min-w-0 flex-col gap-3">
        <div className="rounded-[24px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
          <div className="flex items-center justify-between text-[12px] font-semibold"><span>Heart rate</span><span className="text-ai">{bpm} bpm</span></div>
          <input type="range" min={45} max={160} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Heart rate" className="mt-2 w-full accent-[rgb(var(--c-ai))]" />
          <div className="mt-1 flex justify-between text-[10.5px] text-faint"><span>Rest 45</span><span>Walk 100</span><span>Run 160</span></div>
          <p className="mt-2 text-[11.5px] text-muted">Blood flow speeds up with every beat. Output ≈ heart rate × 70 mL per beat (a typical resting stroke volume).</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={info.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="rounded-[24px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: dot(info.id) }} /><span className="text-[17px] font-semibold">{info.name}</span></div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed">{info.what}</p>
            <p className="mt-2 rounded-xl bg-canvas px-3 py-2 text-[12.5px] text-muted"><span className="font-semibold text-ink">Did you know? </span>{info.fact}</p>
            {info.check && <p className="mt-2 text-[12.5px]"><span className="font-semibold">How it&apos;s checked: </span><span className="text-muted">{info.check}</span></p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => ask(`Explain the ${info.name} in plain words: what it does, what can go wrong, and which tests check it.`, { label: `✦ Explain the ${info.name}` })} className="btn-ai h-9 px-3.5 text-[12.5px]"><XevyoOrb size={18} />Ask SI</button>
              {info.dept && <Link href={`/precision-health/${info.dept}/`} className="btn-light h-9 px-3.5 text-[12.5px]">Care team<Icon name="arrow-right" size={13} /></Link>}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="rounded-[24px] bg-white p-3 shadow-card ring-1 ring-ink/[0.06]">
          {groups.map(([g, ids]) => (
            <div key={g} className="mb-1.5 last:mb-0">
              <div className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{g}</div>
              <div className="flex flex-wrap gap-1">
                {ids.map((id) => (
                  <button key={id} onClick={() => setSel(id)} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} aria-pressed={sel === id}
                    className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 transition", sel === id ? "bg-ai-soft text-ai ring-ai/30" : "bg-canvas text-ink ring-transparent hover:ring-ink/10")}>
                    <span className="h-2 w-2 rounded-full" style={{ background: dot(id) }} />{vesselInfo(id)!.name.replace(/ arteries| veins/, "")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="px-1 text-[11px] text-faint">Simplified, illustrative anatomy — not to scale. Education, not a diagnosis. {VESSEL_INFO.length} parts.</p>
      </aside>
    </div>
  );
}

function distSeg(px: number, py: number, s: Seg) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, l = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - s.x1) * dx + (py - s.y1) * dy) / l));
  return Math.hypot(px - (s.x1 + t * dx), py - (s.y1 + t * dy));
}
