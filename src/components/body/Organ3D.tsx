"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORGANS, type Organ, type Shape, type V3 } from "@/data/organs";
import type { OrganId } from "@/data/deptExtra";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";

type Pt = { p: V3; n: V3; part: number };

/* deterministic sampling so server and client agree */
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

function sample(sh: Shape, part: number, out: Pt[], r: () => number) {
  if (sh.k === "ell") {
    const N = sh.n ?? 400, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * i;
      const u: V3 = [Math.cos(th) * rad, y, Math.sin(th) * rad];
      // optional surface folds (gyri), so a brain reads as a brain
      const f = sh.w ? 1 + sh.w * Math.sin(th * 3.1 + y * 17) * Math.sin(y * 23 + Math.cos(th) * 6) : 1;
      out.push({ p: [sh.c[0] + u[0] * sh.r[0] * f, sh.c[1] + u[1] * sh.r[1] * f, sh.c[2] + u[2] * sh.r[2] * f], n: norm([u[0] / sh.r[0], u[1] / sh.r[1], u[2] / sh.r[2]]), part });
    }
  } else if (sh.k === "tube") {
    const N = sh.n ?? 260, ring = 10, segs = Math.max(2, Math.round(N / ring));
    const L: number[] = [0]; for (let i = 1; i < sh.path.length; i++) L.push(L[i - 1] + Math.hypot(...(sh.path[i].map((v, k) => v - sh.path[i - 1][k]) as V3)));
    const total = L[L.length - 1] || 1;
    for (let s = 0; s <= segs; s++) {
      const d = (s / segs) * total; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
      const a = sh.path[i - 1], b = sh.path[i], f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
      const c: V3 = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
      const t = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
      const ref: V3 = Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const u = norm([t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]);
      const w: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]];
      for (let k = 0; k < ring; k++) {
        const ang = (k / ring) * Math.PI * 2 + s * 0.3, ca = Math.cos(ang), sa = Math.sin(ang);
        const nn: V3 = [u[0] * ca + w[0] * sa, u[1] * ca + w[1] * sa, u[2] * ca + w[2] * sa];
        out.push({ p: [c[0] + nn[0] * sh.r, c[1] + nn[1] * sh.r, c[2] + nn[2] * sh.r], n: nn, part });
      }
    }
  } else {
    const N = sh.n ?? 500, [sx, sy, sz] = sh.s;
    const faces: [V3, number][] = [[[0, 1, 0], sx * sz], [[0, -1, 0], sx * sz], [[1, 0, 0], sy * sz], [[-1, 0, 0], sy * sz], [[0, 0, 1], sx * sy], [[0, 0, -1], sx * sy]];
    const A = faces.reduce((a, f) => a + f[1], 0);
    for (const [n, area] of faces) {
      const m = Math.round((N * area) / A);
      for (let i = 0; i < m; i++) {
        const q: V3 = [(r() - 0.5) * sx, (r() - 0.5) * sy, (r() - 0.5) * sz];
        if (n[0]) q[0] = (n[0] * sx) / 2; if (n[1]) q[1] = (n[1] * sy) / 2; if (n[2]) q[2] = (n[2] * sz) / 2;
        out.push({ p: [sh.c[0] + q[0], sh.c[1] + q[1], sh.c[2] + q[2]], n, part });
      }
    }
  }
}

function build(o: Organ) {
  const pts: Pt[] = [], r = rng(o.id.length * 977 + 13);
  o.parts.forEach((pa, i) => pa.shapes.forEach((sh) => sample(sh, i, pts, r)));
  const cent = o.parts.map((_, i) => { const q = pts.filter((x) => x.part === i); const c: V3 = [0, 0, 0]; q.forEach((x) => { c[0] += x.p[0]; c[1] += x.p[1]; c[2] += x.p[2]; }); return c.map((v) => v / (q.length || 1)) as V3; });
  return { pts, cent };
}

/**
 * Organ3D — a procedural 3D organ you can turn, explode and x-ray. Tap a part (or pick it from the list)
 * to isolate it and read what it does and how it is usually checked. Canvas only, no model files.
 */
export function Organ3D({ organ }: { organ: OrganId }) {
  const o = ORGANS[organ];
  const { ask } = useAI();
  const { pts, cent } = useMemo(() => build(o), [o]);
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({ yaw: 0.5, pitch: -0.15, vy: 0.004, zoom: 1, tZoom: 1, explode: 0, tExplode: 0, drag: false, lx: 0, ly: 0, sx: 0, sy: 0, hover: -1, sel: -1, xray: false });
  const proj = useRef<{ x: number; y: number; part: number }[]>([]);
  const [sel, setSel] = useState(-1);
  const [hover, setHover] = useState(-1);
  const [xray, setXray] = useState(false);
  const [explode, setExplode] = useState(false);
  st.current.sel = sel; st.current.xray = xray; st.current.tExplode = explode ? 1 : 0;

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    let W = 0, H = 0, raf = 0, vis = true;
    const tones = () => Object.fromEntries(["ai", "ai-hi", "ai-2", "artery", "vein", "warn", "teal", "gold", "muted", "ink"].map((k) => [k, themeRgb(k)])) as Record<string, number[]>;
    let col = tones(); const off = onThemeChange(() => (col = tones()));
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting)); io.observe(c);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const order = new Int32Array(pts.length), zs = new Float32Array(pts.length), xs = new Float32Array(pts.length), ys = new Float32Array(pts.length), sh = new Float32Array(pts.length);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!vis || document.hidden) return;
      const v = st.current;
      if (!v.drag && !reduced && v.sel < 0) v.yaw += v.vy;
      v.zoom += (v.tZoom - v.zoom) * 0.1; v.explode += (v.tExplode - v.explode) * 0.08;
      const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
      const S = Math.min(W, H) * 0.42 * v.zoom, ox = W / 2, oy = H / 2;
      const L = norm([-0.45, 0.6, 0.75]);
      for (let i = 0; i < pts.length; i++) {
        const q = pts[i], ce = cent[q.part], e = v.explode * 0.45;
        let x = q.p[0] + ce[0] * e, y = q.p[1] + ce[1] * e, z = q.p[2] + ce[2] * e;
        let t = x * cy + z * sy; z = -x * sy + z * cy; x = t;
        t = y * cp - z * sp; z = y * sp + z * cp; y = t;
        let nx = q.n[0] * cy + q.n[2] * sy, nz = -q.n[0] * sy + q.n[2] * cy; const ny = q.n[1] * cp - nz * sp; nz = q.n[1] * sp + nz * cp;
        const persp = 1 / (1 - z * 0.25);
        xs[i] = ox + x * S * persp; ys[i] = oy - y * S * persp; zs[i] = z; order[i] = i;
        sh[i] = nz < 0 ? 0.25 : 0.35 + 0.65 * Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
      }
      order.sort((a, b) => zs[a] - zs[b]);
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(ox, oy, 10, ox, oy, Math.min(W, H) * 0.6); g.addColorStop(0, `rgba(${col["ai-hi"].join(",")},0.10)`); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const P: typeof proj.current = [];
      for (let k = 0; k < order.length; k++) {
        const i = order[k], q = pts[i], pa = o.parts[q.part], tone = col[pa.tone] ?? col.ai;
        const focus = v.sel < 0 ? (v.hover < 0 || v.hover === q.part) : v.sel === q.part;
        let a = (v.xray ? 0.3 : 0.92) * sh[i] + (v.xray ? 0.06 : 0.16);
        if (!focus) a *= v.sel < 0 ? 0.55 : 0.12;
        const s = (1.6 + (zs[i] + 1) * 1.05) * (focus && (v.sel === q.part || v.hover === q.part) ? 1.25 : 1);
        ctx.fillStyle = `rgba(${tone[0]},${tone[1]},${tone[2]},${a.toFixed(3)})`;
        ctx.fillRect(xs[i] - s / 2, ys[i] - s / 2, s, s);
        if ((k & 3) === 0) P.push({ x: xs[i], y: ys[i], part: q.part });
      }
      proj.current = P;
      // label for selected part
      const lab = v.sel >= 0 ? v.sel : v.hover;
      if (lab >= 0) {
        const ce = cent[lab], e = v.explode * 0.45; let x = ce[0] * (1 + e), y = ce[1] * (1 + e), z = ce[2] * (1 + e);
        let t = x * cy + z * sy; z = -x * sy + z * cy; x = t; t = y * cp - z * sp; z = y * sp + z * cp; y = t;
        const px = ox + x * S, py = oy - y * S, tx = px + (px > ox ? 60 : -60), ty = py - 40;
        ctx.strokeStyle = `rgba(${col.ink.join(",")},0.45)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.fillStyle = `rgb(${col.ai.join(",")})`; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 12px 'DM Sans Variable', system-ui, sans-serif"; const label = o.parts[lab].label, w = ctx.measureText(label).width;
        const bx = px > ox ? tx : tx - w - 16; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.roundRect(bx, ty - 12, w + 16, 22, 11); ctx.fill();
        ctx.fillStyle = `rgb(${col.ink.join(",")})`; ctx.fillText(label, bx + 8, ty + 3);
      }
    };
    raf = requestAnimationFrame(frame);

    const pick = (e: PointerEvent) => { const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = -1, bd = 14 * 14; for (const p of proj.current) { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = p.part; } } return best; };
    const down = (e: PointerEvent) => { const v = st.current; v.drag = true; v.lx = v.sx = e.clientX; v.ly = v.sy = e.clientY; c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { const v = st.current; if (v.drag) { v.yaw += (e.clientX - v.lx) * 0.01; v.pitch = Math.max(-1.2, Math.min(1.2, v.pitch + (e.clientY - v.ly) * 0.01)); v.lx = e.clientX; v.ly = e.clientY; } else if (e.pointerType === "mouse") { const h = pick(e); if (h !== v.hover) { v.hover = h; setHover(h); c.style.cursor = h >= 0 ? "pointer" : "grab"; } } };
    const up = (e: PointerEvent) => { const v = st.current; v.drag = false; if (Math.hypot(e.clientX - v.sx, e.clientY - v.sy) < 5) { const h = pick(e); setSel((s) => (h === s ? -1 : h)); } };
    const leave = () => { st.current.hover = -1; setHover(-1); };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); off(); c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointerleave", leave); };
  }, [pts, cent, o]);

  const part = sel >= 0 ? o.parts[sel] : hover >= 0 ? o.parts[hover] : null;
  const zoom = (d: number) => { st.current.tZoom = Math.max(0.6, Math.min(2.2, st.current.tZoom + d)); };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="relative h-[440px] overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/[0.07] sm:h-[500px]">
        <canvas ref={cv} aria-label={`3D model: ${o.name}. Drag to turn, tap a part.`} className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing" />
        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ai ring-1 ring-ink/[0.06] backdrop-blur">3D · {o.name}</div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/90 p-1 ring-1 ring-ink/[0.06] backdrop-blur">
          <button onClick={() => zoom(-0.2)} aria-label="Zoom out" className="grid h-8 w-8 place-items-center rounded-full hover:bg-canvas"><Icon name="zoom-out" size={15} /></button>
          <button onClick={() => zoom(0.2)} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-full hover:bg-canvas"><Icon name="zoom-in" size={15} /></button>
          <button onClick={() => setExplode((x) => !x)} aria-pressed={explode} className={`h-8 rounded-full px-3 text-[12px] font-semibold ${explode ? "bg-ai text-on-ai" : "hover:bg-canvas"}`}>Explode</button>
          <button onClick={() => setXray((x) => !x)} aria-pressed={xray} className={`h-8 rounded-full px-3 text-[12px] font-semibold ${xray ? "bg-ai text-on-ai" : "hover:bg-canvas"}`}>X-ray</button>
          <button onClick={() => { setSel(-1); setExplode(false); setXray(false); st.current.tZoom = 1; st.current.pitch = -0.15; }} aria-label="Reset view" className="grid h-8 w-8 place-items-center rounded-full hover:bg-canvas"><Icon name="reset" size={15} /></button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[13px] leading-relaxed text-muted">{o.blurb}</p>
        <div className="flex flex-wrap gap-1.5">
          {o.parts.map((p, i) => (
            <button key={p.id} onClick={() => setSel((s) => (s === i ? -1 : i))} onMouseEnter={() => { st.current.hover = i; setHover(i); }} onMouseLeave={() => { st.current.hover = -1; setHover(-1); }} aria-pressed={sel === i}
              className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 transition ${sel === i ? "bg-ai text-on-ai ring-ai" : "bg-white text-ink ring-ink/[0.08] hover:ring-ai/40"}`}>
              <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: `rgb(var(--c-${p.tone}))` }} />{p.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {part ? (
            <motion.div key={part.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[22px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
              <div className="text-[16px] font-semibold">{part.label}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{part.note}</p>
              {part.check && part.check !== "—" && <div className="mt-2 flex gap-1.5 text-[12.5px]"><Icon name="microscope" size={14} className="mt-0.5 shrink-0 text-ai" /><span><b>How it is checked:</b> {part.check}</span></div>}
              <button onClick={() => ask(`Explain the ${part.label} (${o.name}) in plain words: what it does, what can go wrong as we age, and how it is checked — ${part.check ?? ""}.`, { label: `✦ ${part.label}` })} className="btn-ai mt-3 h-9 px-3.5 text-[12.5px]"><XevyoOrb size={16} />Ask SI about this part</button>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[22px] bg-ai-soft/60 p-4 text-[12.5px] text-ai">Tap a part on the model or in the list. Drag to turn it; Explode pulls the parts apart and X-ray lets you see inside.</motion.p>
          )}
        </AnimatePresence>
        <p className="text-[10.5px] text-faint">Simplified educational model drawn by Biongevity — not to scale.</p>
      </div>
    </div>
  );
}
