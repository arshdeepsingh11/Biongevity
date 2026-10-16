"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Prop, Staff, Tone, Visit } from "@/data/visits";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";

/*
 * Visit3D — a walk-through of an in-person visit in real 3D (perspective camera, lit polygons, painter's sort).
 * A patient walks the route — entrance → reception → formalities → tests → consultation → plan — while staff
 * wait at their stations. Follow the patient or orbit the floor; tick the formalities to move on. Canvas only.
 */

type V = [number, number, number];
type Face = { pts: V[]; col: number[]; a: number; d: number; n: V };
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (v: V): V => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

/** 8 corners of a box in local space, mapped through `tf` to world space → 6 quads. */
function box(out: Face[], x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, col: number[], a = 1, tf?: (p: V) => V) {
  const c: V[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map((p) => (tf ? tf(p as V) : (p as V)));
  for (const f of [[0, 3, 2, 1], [4, 5, 6, 7], [0, 4, 7, 3], [1, 2, 6, 5], [3, 7, 6, 2], [0, 1, 5, 4]]) {
    const pts = f.map((i) => c[i]); out.push({ pts, col, a, d: 0, n: nrm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))) });
  }
}

/** A person built from boxes: legs and arms swing with `phase` while walking. */
function person(out: Face[], x: number, z: number, face: number, phase: number, walking: boolean, cloth: number[], skin: number[], hair: number[], pants: number[], wave = 0) {
  const cy = Math.cos(face), sy = Math.sin(face);
  const place = (p: V): V => [x + p[0] * cy + p[2] * sy, p[1], z - p[0] * sy + p[2] * cy];
  const limb = (px: number, py: number, ang: number) => (p: V): V => { const dy = p[1] - py, c = Math.cos(ang), s = Math.sin(ang); return place([p[0], py + dy * c - p[2] * s, dy * s + p[2] * c]); };
  const sw = walking ? Math.sin(phase) * 0.55 : 0;
  box(out, -0.17, 0, -0.08, -0.02, 0.82, 0.08, pants, 1, limb(0, 0.82, sw));
  box(out, 0.02, 0, -0.08, 0.17, 0.82, 0.08, pants, 1, limb(0, 0.82, -sw));
  box(out, -0.22, 0.8, -0.13, 0.22, 1.42, 0.13, cloth, 1, place);
  box(out, -0.32, 0.86, -0.07, -0.22, 1.4, 0.07, cloth, 1, limb(0, 1.38, -sw * 0.8 - wave));
  box(out, 0.22, 0.86, -0.07, 0.32, 1.4, 0.07, cloth, 1, limb(0, 1.38, sw * 0.8));
  box(out, -0.06, 1.42, -0.06, 0.06, 1.5, 0.06, skin, 1, place);
  box(out, -0.13, 1.5, -0.13, 0.13, 1.78, 0.13, skin, 1, place);
  box(out, -0.14, 1.7, -0.14, 0.14, 1.82, 0.14, hair, 1, place);
}

const TONES: Record<Tone, number[]> = { glass: [255, 255, 255], olive: [0, 0, 0], wood: [196, 164, 124], white: [246, 246, 242], ink: [40, 44, 40], teal: [0, 0, 0], gold: [0, 0, 0], soft: [236, 238, 230] };

export function Visit3D({ visit, title }: { visit: Visit; title: string }) {
  const { ask } = useAI();
  const cv = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(true);
  const [mode, setMode] = useState<"follow" | "overview">("follow");
  const [ticks, setTicks] = useState<Record<string, boolean>>({});
  const [arrived, setArrived] = useState(false);
  const S = useRef({ px: visit.steps[0].at[0], pz: visit.steps[0].at[1] + 1.2, face: Math.PI, phase: 0, yaw: 0.6, pitch: 0.62, dist: 9, tx: 0, tz: 0, drag: false, lx: 0, ly: 0, mode: "follow" as "follow" | "overview", target: 0, path: [] as [number, number][], arrived: false });
  S.current.mode = mode;
  const cur = visit.steps[step];

  // Route between stops: out through the door, along the corridor (z = 1), in through the next door.
  useEffect(() => {
    const s = S.current, to = visit.steps[step].at;
    s.path = Math.abs(s.px - to[0]) < 0.25 ? [to] : [[s.px, 1], [to[0], 1], to];
    s.target = step; setArrived(false); s.arrived = false;
  }, [step, visit]);

  // Autoplay: wait at a stop, then move on (formalities wait for the ticks)
  useEffect(() => {
    if (!play || !arrived) return;
    const st = visit.steps[step];
    if (st.check && !st.check.every((c) => ticks[`${st.id}:${c}`])) {
      const id = setTimeout(() => setTicks((t) => { const n = { ...t }; const next = st.check!.find((c) => !n[`${st.id}:${c}`]); if (next) n[`${st.id}:${next}`] = true; return n; }), 900);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setStep((i) => (i < visit.steps.length - 1 ? i + 1 : i)), 2600);
    if (step === visit.steps.length - 1) setPlay(false);
    return () => clearTimeout(id);
  }, [play, arrived, step, ticks, visit]);

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    let W = 0, H = 0, raf = 0, vis = true, last = performance.now();
    const pal = () => ({ ai: themeRgb("ai"), ai2: themeRgb("ai-2"), hi: themeRgb("ai-hi"), teal: themeRgb("teal"), gold: themeRgb("gold"), ink: themeRgb("ink"), surface: themeRgb("surface"), canvas: themeRgb("canvas") });
    let col = pal(); const off = onThemeChange(() => (col = pal()));
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting)); io.observe(c);
    const tone = (t: Tone) => (t === "olive" ? col.ai2 : t === "teal" ? col.teal : t === "gold" ? col.gold : TONES[t]);
    const coat = (k: Staff["coat"]) => (k === "white" ? [248, 248, 246] : k === "olive" ? col.ai2 : col.teal);
    const L = nrm([-0.4, 0.85, 0.5]);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!vis || document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const s = S.current;
      // walk along the path
      let walking = false;
      if (s.path.length) {
        const [gx, gz] = s.path[0], dx = gx - s.px, dz = gz - s.pz, dd = Math.hypot(dx, dz), sp = 2.1 * dt;
        if (dd < 0.05) { s.path.shift(); if (!s.path.length && !s.arrived) { s.arrived = true; setArrived(true); } }
        else { walking = true; s.px += (dx / dd) * Math.min(sp, dd); s.pz += (dz / dd) * Math.min(sp, dd); const want = Math.atan2(dx, dz); let da = want - s.face; da = Math.atan2(Math.sin(da), Math.cos(da)); s.face += da * Math.min(1, dt * 10); s.phase += dt * 9; }
      } else { const want = visit.steps[s.target].face; let da = want - s.face; da = Math.atan2(Math.sin(da), Math.cos(da)); s.face += da * Math.min(1, dt * 4); }
      // camera
      const follow = s.mode === "follow";
      const tx = follow ? s.px : 0, tz = follow ? s.pz : 0;
      s.tx += (tx - s.tx) * Math.min(1, dt * 3); s.tz += (tz - s.tz) * Math.min(1, dt * 3);
      const dist = follow ? 9 : 22; s.dist += (dist - s.dist) * Math.min(1, dt * 2.5);
      if (!s.drag && !follow) s.yaw += dt * 0.05;
      const cp = Math.cos(s.pitch), spp = Math.sin(s.pitch), cyw = Math.cos(s.yaw), syw = Math.sin(s.yaw);
      const C: V = [s.tx + s.dist * cp * syw, 0.9 + s.dist * spp, s.tz + s.dist * cp * cyw];
      const F = Math.min(W, H) * 1.25;
      const project = (p: V) => {
        const x = p[0] - C[0], y = p[1] - C[1], z = p[2] - C[2];
        const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw;
        const y2 = y * cp - z1 * spp, z2 = y * spp + z1 * cp;
        const d = -z2; return [W / 2 + (x1 * F) / d, H / 2 - (y2 * F) / d, d] as const;
      };

      // build the scene
      const faces: Face[] = [];
      const [FW, FD] = visit.size;
      box(faces, -FW / 2, -0.12, -FD / 2, FW / 2, 0, FD / 2, col.surface);
      visit.rooms.forEach((r) => {
        const on = visit.steps[s.target].room === r.id;
        const x0 = r.x - r.w / 2, x1 = r.x + r.w / 2, z0 = r.z - r.d / 2, z1 = r.z + r.d / 2, h = 1.15, t = 0.06;
        box(faces, x0, 0.001, z0, x1, 0.012, z1, on ? col.hi : col.canvas, on ? 0.55 : 0.9);
        const wall = on ? col.ai : col.ai2, a = on ? 0.32 : 0.16;
        const door = Math.min(1.5, r.w * 0.36);
        const wallX = (z: number, open: boolean) => { if (open) { const dx = r.dx ?? r.x; box(faces, x0, 0, z - t / 2, dx - door / 2, h, z + t / 2, wall, a); box(faces, dx + door / 2, 0, z - t / 2, x1, h, z + t / 2, wall, a); } else box(faces, x0, 0, z - t / 2, x1, h, z + t / 2, wall, a); };
        if (r.door !== "open") { wallX(z0, r.door === "back" || r.door === "both"); wallX(z1, r.door === "front" || r.door === "both"); }
        box(faces, x0, 0, z0, x0 + t, h, z1, wall, a); // left
        box(faces, x1 - t, 0, z0, x1, h, z1, wall, a); // right
      });
      visit.props.forEach((p: Prop) => {
        const y = p.y ?? 0, cl = tone(p.tone);
        if (p.kind === "plant") { box(faces, p.x - 0.2, 0, p.z - 0.2, p.x + 0.2, 0.45, p.z + 0.2, [226, 222, 214]); box(faces, p.x - p.w / 2, 0.45, p.z - p.d / 2, p.x + p.w / 2, p.h, p.z + p.d / 2, col.teal, 0.9); return; }
        if (p.kind === "bed") { box(faces, p.x - p.w / 2, 0, p.z - p.d / 2, p.x + p.w / 2, p.h, p.z + p.d / 2, cl); box(faces, p.x - p.w / 2, p.h, p.z - p.d / 2, p.x - p.w / 2 + 0.45, p.h + 0.12, p.z + p.d / 2, [255, 255, 255]); return; }
        if (p.kind === "screen") { const glow = (Math.sin(now / 600 + p.x) + 1) / 2; box(faces, p.x - p.w / 2, y, p.z - p.d / 2, p.x + p.w / 2, y + p.h, p.z + p.d / 2, [cl[0] + glow * 30, cl[1] + glow * 60, cl[2] + glow * 40]); return; }
        box(faces, p.x - p.w / 2, y, p.z - p.d / 2, p.x + p.w / 2, y + p.h, p.z + p.d / 2, cl);
      });
      visit.staff.forEach((st, i) => person(faces, st.x, st.z, st.face, 0, false, coat(st.coat), [214, 170, 136], [52, 40, 32], [70, 74, 86], Math.max(0, Math.sin(now / 900 + i) * 0.25)));
      person(faces, s.px, s.pz, s.face, s.phase, walking, col.ai, [196, 150, 118], [36, 30, 26], [58, 64, 80]);

      // sort & draw
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, `rgb(${col.surface.join(",")})`); bg.addColorStop(1, `rgb(${col.canvas.join(",")})`); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      const drawn: { f: Face; p: (readonly [number, number, number])[] }[] = [];
      for (const f of faces) {
        const cx = (f.pts[0][0] + f.pts[2][0]) / 2, cy = (f.pts[0][1] + f.pts[2][1]) / 2, cz = (f.pts[0][2] + f.pts[2][2]) / 2;
        const toCam = sub(C, [cx, cy, cz]);
        if (f.a >= 1 && f.n[0] * toCam[0] + f.n[1] * toCam[1] + f.n[2] * toCam[2] <= 0) continue;
        const p = f.pts.map(project); if (p.some((q) => q[2] < 0.2)) continue;
        f.d = Math.hypot(toCam[0], toCam[1], toCam[2]); drawn.push({ f, p });
      }
      drawn.sort((a, b) => b.f.d - a.f.d);
      for (const { f, p } of drawn) {
        const lit = 0.62 + 0.38 * Math.max(0, f.n[0] * L[0] + f.n[1] * L[1] + f.n[2] * L[2]);
        ctx.fillStyle = `rgba(${Math.round(f.col[0] * lit)},${Math.round(f.col[1] * lit)},${Math.round(f.col[2] * lit)},${f.a})`;
        ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(p[i][0], p[i][1]); ctx.closePath(); ctx.fill();
        if (f.a < 1) { ctx.strokeStyle = `rgba(255,255,255,${0.5 * f.a + 0.1})`; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      // room labels
      ctx.font = "600 11.5px 'DM Sans Variable', system-ui, sans-serif"; ctx.textAlign = "center";
      visit.rooms.forEach((r) => {
        const [x, y, d] = project([r.x, 1.6, r.z - r.d / 2 + 0.2]); if (d < 0.5) return;
        const on = visit.steps[s.target].room === r.id, w = ctx.measureText(r.label).width + 16;
        ctx.fillStyle = on ? `rgb(${col.ai.join(",")})` : "rgba(255,255,255,0.88)"; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 11, w, 20, 10); ctx.fill();
        ctx.fillStyle = on ? "#fff" : `rgb(${col.ink.join(",")})`; ctx.fillText(r.label, x, y + 3);
      });
      // patient marker
      const [mx, my] = project([s.px, 2.15, s.pz]);
      ctx.fillStyle = `rgb(${col.ai.join(",")})`; ctx.beginPath(); ctx.moveTo(mx, my + 8); ctx.lineTo(mx - 6, my); ctx.lineTo(mx + 6, my); ctx.fill();
      ctx.fillText("You", mx, my - 6);
      ctx.textAlign = "start";
    };
    raf = requestAnimationFrame(frame);
    const down = (e: PointerEvent) => { const s = S.current; s.drag = true; s.lx = e.clientX; s.ly = e.clientY; c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { const s = S.current; if (!s.drag) return; s.yaw -= (e.clientX - s.lx) * 0.008; s.pitch = Math.max(0.25, Math.min(1.35, s.pitch + (e.clientY - s.ly) * 0.006)); s.lx = e.clientX; s.ly = e.clientY; };
    const up = () => { S.current.drag = false; };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); off(); c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); };
  }, [visit]);

  const total = visit.steps.reduce((a, s) => a + s.mins, 0), done = visit.steps.slice(0, step).reduce((a, s) => a + s.mins, 0);
  const go = (i: number) => { setStep(Math.max(0, Math.min(visit.steps.length - 1, i))); };
  const staffHere = visit.staff.filter((s) => { const r = visit.rooms.find((x) => x.id === cur.room); return r && Math.abs(s.x - r.x) <= r.w / 2 && Math.abs(s.z - r.z) <= r.d / 2; });

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative h-[460px] overflow-hidden rounded-[28px] ring-1 ring-ink/[0.07] sm:h-[560px]">
        <canvas ref={cv} aria-label={`${title}: 3D walkthrough of a visit. Drag to look around.`} className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ai ring-1 ring-ink/[0.06] backdrop-blur">3D visit · {visit.floor}</span>
          <span className="hidden rounded-full bg-white/80 px-3 py-1 text-[11.5px] text-muted ring-1 ring-ink/[0.06] backdrop-blur sm:inline">{visit.place}</span>
        </div>
        <div role="radiogroup" aria-label="Camera" className="absolute right-3 top-3 flex gap-0.5 rounded-full bg-white/90 p-1 text-[12px] font-semibold ring-1 ring-ink/[0.06] backdrop-blur">
          {(["follow", "overview"] as const).map((m) => <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={`rounded-full px-3 py-1 capitalize ${mode === m ? "bg-ai text-on-ai" : "text-muted"}`}>{m === "follow" ? "Follow me" : "Whole floor"}</button>)}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full bg-white/92 p-1.5 ring-1 ring-ink/[0.06] backdrop-blur">
          <button onClick={() => go(step - 1)} aria-label="Previous stop" className="grid h-9 w-9 place-items-center rounded-full hover:bg-canvas"><Icon name="chevron-left" size={16} /></button>
          <button onClick={() => { if (step === visit.steps.length - 1 && !play) { setTicks({}); go(0); } setPlay((p) => !p); }} className="btn-ai h-9 px-4 text-[12.5px]"><Icon name={play ? "stop" : "play"} size={14} />{play ? "Pause" : step === visit.steps.length - 1 ? "Replay" : "Play"}</button>
          <button onClick={() => go(step + 1)} aria-label="Next stop" className="grid h-9 w-9 place-items-center rounded-full hover:bg-canvas"><Icon name="chevron-right" size={16} /></button>
          <div className="relative mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"><motion.div className="absolute inset-y-0 left-0 rounded-full bg-ai" animate={{ width: `${(step / (visit.steps.length - 1)) * 100}%` }} /></div>
          <span className="hidden pr-2 text-[11.5px] tabular-nums text-muted sm:block">~{done}/{total} min</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ol className="no-scrollbar flex gap-1.5 overflow-x-auto xl:grid xl:grid-cols-3 xl:overflow-visible">
          {visit.steps.map((s, i) => (
            <li key={s.id} className="shrink-0"><button onClick={() => { setPlay(false); go(i); }} aria-current={i === step ? "step" : undefined}
              className={`flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-[11.5px] font-semibold ring-1 transition ${i === step ? "bg-ai text-on-ai ring-ai" : i < step ? "bg-ai-soft text-ai ring-ai/15" : "bg-white text-muted ring-ink/[0.07]"}`}>
              <span className="tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span><span className="truncate">{s.t.replace(/ \(.*\)/, "")}</span></button></li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
            <div className="flex items-center gap-3">
              <span className="icon-tile h-11 w-11"><Icon name={cur.icon} size={20} /></span>
              <div className="min-w-0 flex-1"><div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai">Stop {step + 1} of {visit.steps.length}{cur.mins ? ` · ~${cur.mins} min` : ""}</div><div className="text-[18px] font-semibold leading-tight">{cur.t}</div></div>
              {!arrived && <span className="flex items-center gap-1 text-[11px] font-semibold text-ai"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ai" />walking</span>}
            </div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{cur.d}</p>
            {staffHere.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{staffHere.map((s) => <span key={s.role + s.x} className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium"><Icon name="user" size={11} />{s.role}</span>)}</div>}
            {cur.bring && <div className="mt-3"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Bring</div><ul className="mt-1 space-y-1">{cur.bring.map((b) => <li key={b} className="flex gap-1.5 text-[12.5px]"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-ai" />{b}</li>)}</ul></div>}
            {cur.check && (
              <div className="mt-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{cur.id === "forms" ? "Formalities — tick as you go" : "Done here"}</div>
                <div className="mt-1 space-y-1">
                  {cur.check.map((c) => { const k = `${cur.id}:${c}`, on = !!ticks[k]; return (
                    <label key={c} className={`flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-[12.5px] ring-1 transition ${on ? "bg-ai-soft ring-ai/20" : "bg-white ring-ink/[0.06]"}`}>
                      <input type="checkbox" checked={on} onChange={() => setTicks((t) => ({ ...t, [k]: !on }))} className="h-4 w-4 accent-[rgb(var(--c-ai))]" />
                      <span className={on ? "text-ink" : "text-muted"}>{c}</span>
                    </label>); })}
                </div>
              </div>
            )}
            <button onClick={() => ask(cur.ask, { label: `✦ ${cur.t}` })} className="btn-ai mt-4 h-9 px-3.5 text-[12.5px]"><XevyoOrb size={16} />Ask SI about this step</button>
          </motion.div>
        </AnimatePresence>
        <p className="text-[10.5px] text-faint">Illustrative floor plan and walkthrough. Times are typical; your coordinator confirms your schedule.</p>
      </div>
    </div>
  );
}
