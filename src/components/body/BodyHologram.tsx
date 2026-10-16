"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ORGANS, buildBody, organById } from "@/lib/body";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/useCamera";

export type Tone = "good" | "attention" | "neutral" | "focus";
export interface Hotspot { id: string; label?: string; status?: string; tone?: Tone }

const TONE_TOKEN: Record<Tone, string> = { good: "teal", attention: "ai-2", neutral: "muted", focus: "ai" };

/**
 * Body hologram — a 360° interactive 3D human drawn on canvas (no 3D library, no model files).
 * Drag to rotate, use the buttons to turn or zoom, tap a glowing part to select it.
 * `intensity` (0–1 per organ) makes parts glow — used to show how a habit or a condition affects the body.
 */
export function BodyHologram({ hotspots = [], selected = null, onSelect, intensity, height = 560, autoRotate = true, className, labels = true, compact = false }: {
  hotspots?: Hotspot[]; selected?: string | null; onSelect?: (id: string) => void; intensity?: Record<string, number>;
  height?: number; autoRotate?: boolean; className?: string; labels?: boolean; compact?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tags = useRef<(HTMLButtonElement | null)[]>([]);
  const view = useRef({ yaw: 0.35, pitch: 0.08, zoom: 1, focusY: 0, tYaw: 0.35, tZoom: 1, tFocusY: 0, drag: false, lx: 0, ly: 0, idle: 0, moved: false });
  const props = useRef({ hotspots, selected, intensity, autoRotate });
  props.current = { hotspots, selected, intensity, autoRotate };
  const geo = useMemo(() => buildBody(compact ? 1 : 1.6), [compact]);
  const [hint, setHint] = useState(true);

  // focus camera on the selected part
  useEffect(() => {
    const v = view.current, o = selected ? organById(selected) : null;
    v.tZoom = o ? 1.55 : 1; v.tFocusY = o ? o.at[1] * 0.85 : 0;
  }, [selected]);

  useEffect(() => {
    const c = canvas.current!, ctx = c.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true, t0 = performance.now();
    let col = { ink: themeRgb("ink"), ai: themeRgb("ai"), ai2: themeRgb("ai-2"), hi: themeRgb("ai-hi"), teal: themeRgb("teal"), muted: themeRgb("muted"), dark: document.documentElement.dataset.theme === "midnight" };
    const offTheme = onThemeChange(() => { col = { ink: themeRgb("ink"), ai: themeRgb("ai"), ai2: themeRgb("ai-2"), hi: themeRgb("ai-hi"), teal: themeRgb("teal"), muted: themeRgb("muted"), dark: document.documentElement.dataset.theme === "midnight" }; });
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(c);

    const nB = geo.body.length / 3, nO = geo.organ.length / 3;
    const pB = new Float32Array(nB * 3), pO = new Float32Array(nO * 3);
    const rgba = (c3: number[], a: number) => `rgba(${c3[0]},${c3[1]},${c3[2]},${a})`;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const v = view.current, P = props.current, t = (now - t0) / 1000;
      if (!v.drag) { v.idle += 1; if (P.autoRotate && !reduced && v.idle > 90 && !P.selected) v.tYaw += 0.0045; }
      v.yaw += (v.tYaw - v.yaw) * 0.08; v.zoom += (v.tZoom - v.zoom) * 0.07; v.focusY += (v.tFocusY - v.focusY) * 0.07;
      const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
      const scale = (H * 0.41) * v.zoom, ox = W / 2, oy = H * 0.46;
      const proj = (x: number, y: number, z: number, out: Float32Array, i: number) => {
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const yy = y - v.focusY, y2 = yy * cp - z1 * sp, z2 = yy * sp + z1 * cp;
        const k = 2.6 / (2.6 - z2);
        out[i] = ox + x1 * scale * k; out[i + 1] = oy - y2 * scale * k; out[i + 2] = z2;
      };
      ctx.clearRect(0, 0, W, H);
      // floor ring
      ctx.save(); ctx.translate(ox, oy + (1 - v.focusY) * scale * 0.98); ctx.scale(1, 0.22);
      const fr = ctx.createRadialGradient(0, 0, 0, 0, 0, scale * 0.42); fr.addColorStop(0, rgba(col.ai2, 0.22)); fr.addColorStop(1, rgba(col.ai2, 0));
      ctx.fillStyle = fr; ctx.beginPath(); ctx.arc(0, 0, scale * 0.42, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = rgba(col.ai2, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, scale * 0.3, 0, Math.PI * 2); ctx.stroke(); ctx.restore();

      // soft aura behind the body
      const aura = ctx.createRadialGradient(ox, oy - (0.25 - v.focusY) * scale, 0, ox, oy, scale * 0.9);
      aura.addColorStop(0, rgba(col.ai2, col.dark ? 0.14 : 0.1)); aura.addColorStop(1, rgba(col.ai2, 0));
      ctx.fillStyle = aura; ctx.fillRect(0, 0, W, H);
      const scanY = Math.sin(t * 0.7) * 1.05;
      for (let i = 0; i < nB; i++) proj(geo.body[i * 3], geo.body[i * 3 + 1], geo.body[i * 3 + 2], pB, i * 3);
      // skin points
      for (let i = 0; i < nB; i++) {
        const z = pB[i * 3 + 2], depth = (z + 0.3) / 0.6, near = Math.max(0, Math.min(1, depth));
        const scan = Math.max(0, 1 - Math.abs(geo.body[i * 3 + 1] - scanY) * 9);
        const a = (col.dark ? 0.14 : 0.12) + near * (col.dark ? 0.38 : 0.34) + scan * 0.5;
        ctx.fillStyle = scan > 0.05 ? rgba(col.ai2, Math.min(0.95, a)) : rgba(col.dark ? col.hi : col.ink, a * (col.dark ? 0.85 : 0.8));
        const s = (0.9 + near * 1.1) * (W < 500 ? 0.85 : 1);
        ctx.fillRect(pB[i * 3] - s / 2, pB[i * 3 + 1] - s / 2, s, s);
      }
      // organs
      const sel = P.selected, inten = P.intensity;
      for (let i = 0; i < nO; i++) proj(geo.organ[i * 3], geo.organ[i * 3 + 1], geo.organ[i * 3 + 2], pO, i * 3);
      for (let i = 0; i < nO; i++) {
        const o = ORGANS[geo.organIdx[i]], on = sel === o.id, lvl = inten ? inten[o.id] ?? 0 : 0;
        const pulse = 0.75 + 0.25 * Math.sin(t * 3 + i);
        const a = on ? 0.95 * pulse : inten ? 0.14 + lvl * 0.82 * pulse : sel ? 0.2 : 0.6 * pulse;
        ctx.fillStyle = rgba(on || lvl > 0.5 ? col.ai2 : col.ai, a);
        const s = on ? 2.6 : 1.9 + lvl;
        ctx.fillRect(pO[i * 3] - s / 2, pO[i * 3 + 1] - s / 2, s, s);
      }
      // glow for selected / intense organs
      for (const o of ORGANS) {
        const lvl = sel === o.id ? 1 : inten ? inten[o.id] ?? 0 : 0;
        if (lvl < 0.15) continue;
        const tmp = new Float32Array(3); proj(o.at[0], o.at[1], o.at[2], tmp, 0);
        const rad = (0.09 + lvl * 0.06) * scale * (0.9 + 0.1 * Math.sin(t * 2.4));
        const g = ctx.createRadialGradient(tmp[0], tmp[1], 0, tmp[0], tmp[1], rad);
        g.addColorStop(0, rgba(col.ai2, 0.35 * lvl)); g.addColorStop(1, rgba(col.ai2, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tmp[0], tmp[1], rad, 0, Math.PI * 2); ctx.fill();
      }
      // hotspot tags (DOM, positioned each frame) with simple collision avoidance
      const hs = P.hotspots, placed: { x: number; y: number; w: number; h: number; k: number; front: boolean; sel: boolean }[] = [];
      for (let k = 0; k < hs.length; k++) {
        const el = tags.current[k], o = organById(hs[k].id); if (!el || !o) continue;
        const at = o.tag ?? o.at, tmp = new Float32Array(3); proj(at[0], at[1], at[2] + 0.02, tmp, 0);
        placed.push({ x: tmp[0], y: tmp[1], w: el.offsetWidth, h: el.offsetHeight, k, front: tmp[2] > -0.05, sel: sel === o.id });
      }
      placed.sort((a, b) => a.y - b.y);
      const top = 46, bottom = H - 58;
      for (let a = 0; a < placed.length; a++) {
        const p = placed[a];
        p.y = Math.max(top + p.h / 2, Math.min(bottom - p.h / 2, p.y));
        for (let b = 0; b < a; b++) {
          const q = placed[b];
          if (Math.abs(p.x - q.x) < (p.w + q.w) / 2 + 4 && Math.abs(p.y - q.y) < (p.h + q.h) / 2 + 3) p.y = q.y + (p.h + q.h) / 2 + 3;
        }
      }
      for (const p of placed) {
        const el = tags.current[p.k]!;
        el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        el.style.opacity = p.front || p.sel ? "1" : "0.35";
        el.style.zIndex = p.sel ? "4" : p.front ? "3" : "1";
      }
    };
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => { const v = view.current; v.drag = true; v.moved = false; v.lx = e.clientX; v.ly = e.clientY; v.idle = 0; c.setPointerCapture(e.pointerId); setHint(false); };
    const move = (e: PointerEvent) => {
      const v = view.current; if (!v.drag) return;
      const dx = e.clientX - v.lx, dy = e.clientY - v.ly; v.lx = e.clientX; v.ly = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 2) v.moved = true;
      v.tYaw += dx * 0.012; v.yaw = v.tYaw; v.pitch = Math.max(-0.5, Math.min(0.5, v.pitch + dy * 0.004));
    };
    const up = () => { view.current.drag = false; view.current.idle = 0; };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); offTheme(); c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); };
  }, [geo]);

  const turn = (a: number) => { const v = view.current; v.tYaw = Math.round(v.tYaw / (Math.PI / 2)) * (Math.PI / 2) + a; v.idle = 0; };
  const zoom = (d: number) => { const v = view.current; v.tZoom = Math.max(0.8, Math.min(2.6, v.tZoom + d)); };

  return (
    <div ref={wrap} className={cn("relative select-none overflow-hidden", className)} style={{ height }}>
      <div aria-hidden className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]" />
      <canvas ref={canvas} role="img" aria-label="Interactive 3D body. Drag to rotate." className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing" />
      {labels && hotspots.map((h, k) => {
        const o = organById(h.id); if (!o) return null;
        const on = selected === h.id, tone = h.tone ?? "neutral";
        return (
          <button key={h.id} ref={(el) => { tags.current[k] = el; }} onClick={() => onSelect?.(h.id)} aria-pressed={on}
            className={cn("absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-1 pr-2.5 text-[11.5px] font-semibold shadow-card ring-1 backdrop-blur-md transition-[background,box-shadow]",
              on ? "bg-ai text-on-ai ring-ai" : "bg-white/80 text-ink ring-ink/10 hover:ring-ai/50")} style={{ willChange: "transform" }}>
            <span className="relative grid h-4 w-4 place-items-center"><span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: `rgb(var(--c-${TONE_TOKEN[tone]}))`, animationDuration: "2.4s" }} /><span className="relative h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: `rgb(var(--c-${TONE_TOKEN[tone]}))` }} /></span>
            {h.label ?? o.label}{h.status && <span className={cn("font-medium", on ? "opacity-85" : "text-muted")}>· {h.status}</span>}
          </button>
        );
      })}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/80 p-1 shadow-card ring-1 ring-ink/[0.08] backdrop-blur-md">
        <button onClick={() => turn(0)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Front</button>
        <button onClick={() => turn(Math.PI / 2)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Side</button>
        <button onClick={() => turn(Math.PI)} className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold hover:bg-ink/[0.05]">Back</button>
        <span className="mx-0.5 h-4 w-px bg-ink/10" />
        <button onClick={() => zoom(0.3)} aria-label="Zoom in" className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="plus" size={14} /></button>
        <button onClick={() => zoom(-0.3)} aria-label="Zoom out" className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/[0.05]"><Icon name="minus" size={14} /></button>
      </div>
      {hint && <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-medium text-muted ring-1 ring-ink/[0.06] backdrop-blur"><Icon name="move" size={13} />Drag to rotate 360°</div>}
    </div>
  );
}
