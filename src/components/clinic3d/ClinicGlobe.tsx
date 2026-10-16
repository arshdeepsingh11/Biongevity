"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WORLD_DOTS } from "@/data/worldmap";
import { OFFICES } from "@/data/clinic";
import { onThemeChange, themeRgb } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { BuildingView } from "./BuildingView";

/** Building facts per office. Floor comes from the address; the building shape is illustrative. */
export const SITES: Record<string, { floors: number; floor: number; suite: string; building: string; note: string; tz: string }> = {
  Calgary: { floors: 26, floor: 10, suite: "Suite 1020", building: "Calgary Place Tower 1", note: "Floor 10 from the suite number #1020", tz: "America/Edmonton" },
  Dubai: { floors: 9, floor: 3, suite: "Office 302", building: "AB Center", note: "3rd floor, office 302", tz: "Asia/Dubai" },
  Almelo: { floors: 3, floor: 1, suite: "Windmolen 22", building: "BioAro Europe", note: "Floor to be confirmed", tz: "Europe/Amsterdam" },
};

/** World dots (x,y on a 135.5 × 64.2 grid) → longitude / latitude. */
function landPoints() {
  const out: [number, number][] = [];
  for (const m of WORLD_DOTS.matchAll(/M([\d.]+) ([\d.]+)h0/g)) {
    const x = +m[1], y = +m[2];
    out.push([(x - 24) / 0.378 - 114.07, (40.41 - y) / 0.4694]);
  }
  return out;
}
const rad = (d: number) => (d * Math.PI) / 180;

type View = "light" | "satellite" | "dark";
/** BioAro constellation — illustrative orbits (names are ours, the orbits are drawn for the story). */
const SATS = [
  { id: "genome", name: "BioAro Genome-1", role: "Relays sequencing runs between Calgary and Almelo labs", inc: 52, alt: 0.24, speed: 0.11, phase: 0 },
  { id: "labs", name: "BioAro Labs-2", role: "Carries lab results into each patient's one record", inc: -28, alt: 0.32, speed: 0.08, phase: 2.1 },
  { id: "care", name: "BioAro Care-3", role: "Links Virtual Clinic visits across Calgary, Dubai and Almelo", inc: 74, alt: 0.4, speed: 0.06, phase: 4.2 },
  { id: "si", name: "BioAro SI-4", role: "Biongevity SI relay — answers in EN · FR · AR · FA", inc: 12, alt: 0.18, speed: 0.14, phase: 1.1 },
] as const;

/**
 * Global clinic — a 3D globe you can spin. Pick a clinic and the globe flies there,
 * then zooms into the building and the clinic's floor (see BuildingView).
 */
export function ClinicGlobe() {
  const { ask } = useAI();
  const canvas = useRef<HTMLCanvasElement>(null);
  const land = useMemo(landPoints, []);
  const cam = useRef({ lon: -40, lat: 25, tLon: -40, tLat: 25, zoom: 1, tZoom: 1, drag: false, lx: 0, ly: 0, idle: 0 });
  const [sel, setSel] = useState<string | null>(null);
  const [stage, setStage] = useState<"globe" | "building">("globe");
  const [now, setNow] = useState<Date | null>(null);
  const [view, setView] = useState<View>("light");
  const viewRef = useRef<View>("light"); viewRef.current = view;
  const hits = useRef<{ id: string; kind: "city" | "sat"; x: number; y: number }[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [sat, setSat] = useState<string | null>(null);
  const flyRef = useRef<(c: string) => void>(() => {});
  const selSat = useRef<string | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const c = canvas.current!, ctx = c.getContext("2d")!;
    let W = 0, H = 0, raf = 0, visible = true, t0 = performance.now();
    let col = { ink: themeRgb("ink"), ai: themeRgb("ai"), ai2: themeRgb("ai-2"), hi: themeRgb("ai-hi"), surface: themeRgb("surface") };
    const off = onThemeChange(() => (col = { ink: themeRgb("ink"), ai: themeRgb("ai"), ai2: themeRgb("ai-2"), hi: themeRgb("ai-hi"), surface: themeRgb("surface") }));
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "200px" }); io.observe(c);
    const rgba = (k: number[], a: number) => `rgba(${k[0]},${k[1]},${k[2]},${a})`;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const v = cam.current, t = (now - t0) / 1000;
      if (!v.drag && !reduced) { v.idle++; if (v.idle > 120 && v.tZoom <= 1.01) v.tLon += 0.08; }
      v.lon += (v.tLon - v.lon) * 0.06; v.lat += (v.tLat - v.lat) * 0.06; v.zoom += (v.tZoom - v.zoom) * 0.06;
      const R = Math.min(W, H) * 0.42 * v.zoom, cx = W / 2, cy = H / 2;
      const l0 = rad(v.lon), p0 = rad(v.lat), cp0 = Math.cos(p0), sp0 = Math.sin(p0);
      const project = (lon: number, lat: number, h = 0) => {
        const l = rad(lon) - l0, p = rad(lat), cl = Math.cos(l), cp = Math.cos(p), sp = Math.sin(p);
        const z = sp0 * sp + cp0 * cp * cl; // >0 = front
        const x = cp * Math.sin(l), y = cp0 * sp - sp0 * cp * cl, k = R * (1 + h);
        return [cx + x * k, cy - y * k, z] as const;
      };
      const mode = viewRef.current, dark = mode === "dark", sat = mode === "satellite";
      const hit: typeof hits.current = [];
      ctx.clearRect(0, 0, W, H);
      // space backdrop + stars for the satellite and dark views
      if (dark || sat) {
        ctx.fillStyle = dark ? "#04060c" : "#020814"; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 140; i++) { const sx = (i * 9301 + 49297) % 233280 / 233280 * W, sy = (i * 4253 + 1931) % 104729 / 104729 * H, tw = 0.35 + 0.35 * Math.sin(t * 1.5 + i); ctx.fillStyle = `rgba(255,255,255,${tw * 0.6})`; ctx.fillRect(sx, sy, 1.2, 1.2); }
      }
      // atmosphere
      const g = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.25);
      g.addColorStop(0, dark ? "rgba(90,140,255,0.22)" : sat ? "rgba(120,180,255,0.35)" : rgba(col.ai2, 0.18)); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();
      const sea = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      if (sat) { sea.addColorStop(0, "#1d5fa8"); sea.addColorStop(0.7, "#0b3a74"); sea.addColorStop(1, "#05214a"); }
      else if (dark) { sea.addColorStop(0, "#111a2e"); sea.addColorStop(1, "#060a14"); }
      else { sea.addColorStop(0, rgba(col.surface, 0.95)); sea.addColorStop(1, rgba(col.hi, 0.18)); }
      ctx.fillStyle = sea; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = dark || sat ? "rgba(140,190,255,0.35)" : rgba(col.ai2, 0.25); ctx.lineWidth = 1; ctx.stroke();
      // graticule
      ctx.strokeStyle = dark || sat ? "rgba(160,200,255,0.07)" : rgba(col.ink, 0.05);
      for (let lat = -60; lat <= 60; lat += 30) { ctx.beginPath(); let first = true; for (let lon = -180; lon <= 180; lon += 6) { const [x, y, z] = project(lon, lat); if (z < 0) { first = true; continue; } if (first) ctx.moveTo(x, y); else ctx.lineTo(x, y); first = false; } ctx.stroke(); }
      // land
      const ds = Math.max(1.1, R / 170);
      for (const [lon, lat] of land) {
        const [x, y, z] = project(lon, lat); if (z < 0.02) continue;
        if (sat) { const a = Math.abs(lat); ctx.fillStyle = a > 62 ? `rgba(235,240,245,${0.5 + z * 0.5})` : a > 14 && a < 34 ? `rgba(196,164,104,${0.45 + z * 0.55})` : `rgba(74,128,62,${0.45 + z * 0.55})`; ctx.fillRect(x - ds * 0.7, y - ds * 0.7, ds * 1.4, ds * 1.4); }
        else if (dark) { const lit = (Math.sin(lon * 3.1 + lat * 1.7) + 1) / 2; ctx.fillStyle = lit > 0.62 ? `rgba(255,205,120,${0.45 + z * 0.55})` : `rgba(130,160,215,${0.18 + z * 0.32})`; ctx.fillRect(x - ds / 2, y - ds / 2, ds, ds); }
        else { ctx.fillStyle = rgba(col.ink, 0.12 + z * 0.4); ctx.fillRect(x - ds / 2, y - ds / 2, ds, ds); }
      }
      // drifting clouds (satellite view)
      if (sat) for (let k = 0; k < 9; k++) {
        const [x, y, z] = project(-170 + k * 41 + t * 2.2, -40 + ((k * 37) % 90), 0.02); if (z < 0.05) continue;
        const cg = ctx.createRadialGradient(x, y, 0, x, y, R * 0.16); cg.addColorStop(0, `rgba(255,255,255,${0.32 * z})`); cg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(x, y, R * 0.2, R * 0.08, 0.3, 0, Math.PI * 2); ctx.fill();
      }
      // routes
      const pts = OFFICES.map((o) => o.loc);
      [[0, 2], [2, 1], [0, 1]].forEach(([a, b], ri) => {
        const A = pts[a], B = pts[b]; ctx.beginPath(); let first = true;
        for (let s = 0; s <= 1.0001; s += 0.02) {
          const lat = A[0] + (B[0] - A[0]) * s, lon = A[1] + (B[1] - A[1]) * s, h = Math.sin(Math.PI * s) * 0.18;
          const [x, y, z] = project(lon, lat, h); if (z < -0.1) { first = true; continue; } if (first) ctx.moveTo(x, y); else ctx.lineTo(x, y); first = false;
        }
        ctx.strokeStyle = rgba(col.ai2, 0.55); ctx.lineWidth = 1.6; ctx.setLineDash([4, 6]); ctx.lineDashOffset = -t * 20 - ri * 8; ctx.stroke(); ctx.setLineDash([]);
      });
      // pins
      OFFICES.forEach((o, i) => {
        const [x, y, z] = project(o.loc[1], o.loc[0]); if (z < 0) return;
        const pulse = (t * 0.8 + i * 0.3) % 1;
        ctx.strokeStyle = rgba(col.ai2, 0.8 * (1 - pulse)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 6 + pulse * 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = rgba(col.ai, 1); ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(col.surface, 1); ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 12px 'DM Sans Variable', system-ui, sans-serif";
        const lw = ctx.measureText(o.city).width;
        ctx.fillStyle = dark || sat ? "rgba(10,16,30,0.72)" : "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.roundRect(x + 9, y - 21, lw + 14, 20, 10); ctx.fill();
        ctx.fillStyle = dark || sat ? "#fff" : rgba(col.ink, 0.9); ctx.fillText(o.city, x + 16, y - 7);
        hit.push({ id: o.city, kind: "city", x, y });
      });
      // BioAro satellites on inclined orbits; beam down to a clinic when one is in view
      SATS.forEach((S) => {
        const orbit = (a: number) => { const ci = Math.cos(rad(S.inc)), si = Math.sin(rad(S.inc)); const lat = Math.asin(si * Math.sin(a)) * 180 / Math.PI, lon = Math.atan2(ci * Math.sin(a), Math.cos(a)) * 180 / Math.PI + 20; return project(lon, lat, S.alt); };
        ctx.beginPath(); let first = true;
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.06) { const [x, y, z] = orbit(a); if (z < -0.25) { first = true; continue; } if (first) ctx.moveTo(x, y); else ctx.lineTo(x, y); first = false; }
        ctx.strokeStyle = dark || sat ? "rgba(170,210,255,0.22)" : rgba(col.ai2, 0.22); ctx.lineWidth = 1; ctx.setLineDash([2, 5]); ctx.stroke(); ctx.setLineDash([]);
        const [x, y, z] = orbit(t * S.speed + S.phase); if (z < -0.25) return;
        const near = OFFICES.map((o) => project(o.loc[1], o.loc[0])).filter((q) => q[2] > 0.2).sort((a, b) => Math.hypot(a[0] - x, a[1] - y) - Math.hypot(b[0] - x, b[1] - y))[0];
        if (near && Math.hypot(near[0] - x, near[1] - y) < R * 0.75) { const bg = ctx.createLinearGradient(x, y, near[0], near[1]); bg.addColorStop(0, "rgba(255,255,255,0.0)"); bg.addColorStop(1, dark || sat ? "rgba(140,220,255,0.55)" : rgba(col.ai, 0.45)); ctx.strokeStyle = bg; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(near[0], near[1]); ctx.stroke(); }
        const sc = 0.7 + z * 0.3, on = selSat.current === S.id;
        ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.3 + S.phase); ctx.scale(sc, sc);
        ctx.fillStyle = dark || sat ? "rgba(120,190,255,0.85)" : rgba(col.ai2, 0.85); ctx.fillRect(-15, -3, 9, 6); ctx.fillRect(6, -3, 9, 6);
        ctx.fillStyle = dark || sat ? "#e9eef7" : rgba(col.ink, 0.85); ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
        if (on) { ctx.strokeStyle = dark || sat ? "#9fe0ff" : rgba(col.ai, 0.9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke(); }
        ctx.font = "600 10.5px 'DM Sans Variable', system-ui, sans-serif"; ctx.fillStyle = dark || sat ? `rgba(220,235,255,${0.5 + z * 0.4})` : rgba(col.ink, 0.45 + z * 0.4); ctx.fillText(S.name, x + 14, y + 14);
        hit.push({ id: S.id, kind: "sat", x, y });
      });
      hits.current = hit;
    };
    raf = requestAnimationFrame(frame);
    let sx = 0, sy = 0;
    const pick = (e: PointerEvent) => { const r = c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; return hits.current.filter((h) => Math.hypot(h.x - px, h.y - py) < (h.kind === "city" ? 20 : 16)).sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py))[0]; };
    const down = (e: PointerEvent) => { const v = cam.current; v.drag = true; v.lx = sx = e.clientX; v.ly = sy = e.clientY; v.idle = 0; c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { const v = cam.current; if (!v.drag) { const h = pick(e); c.style.cursor = h ? "pointer" : "grab"; setHover(h ? h.id : null); return; } v.tLon -= (e.clientX - v.lx) * 0.35 / v.zoom; v.tLat = Math.max(-60, Math.min(70, v.tLat + (e.clientY - v.ly) * 0.3 / v.zoom)); v.lon = v.tLon; v.lat = v.tLat; v.lx = e.clientX; v.ly = e.clientY; };
    const up = (e: PointerEvent) => {
      cam.current.drag = false;
      if (Math.hypot(e.clientX - sx, e.clientY - sy) < 6) { const h = pick(e); if (h?.kind === "city") flyRef.current(h.id); else if (h?.kind === "sat") { selSat.current = selSat.current === h.id ? null : h.id; setSat(selSat.current); } }
    };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); off(); c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); };
  }, [land]);

  const fly = (city: string) => {
    const o = OFFICES.find((x) => x.city === city)!, v = cam.current;
    let d = o.loc[1] - v.lon; d = ((d + 540) % 360) - 180; // shortest way round
    v.tLon = v.lon + d; v.tLat = Math.min(60, o.loc[0]); v.tZoom = 2.2; v.idle = 0; setSel(city); setStage("globe");
    setTimeout(() => setStage("building"), 1500);
  };
  const back = () => { const v = cam.current; v.tZoom = 1; setStage("globe"); setSel(null); };
  const o = OFFICES.find((x) => x.city === sel), site = sel ? SITES[sel] : null;
  const time = (tz: string) => (now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }) : "--:--");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        {OFFICES.map((x) => (
          <button key={x.city} onClick={() => fly(x.city)} aria-pressed={sel === x.city}
            className={`flex items-start gap-3 rounded-[22px] p-4 text-left ring-1 transition ${sel === x.city ? "bg-ink text-pearl ring-ink" : "bg-white ring-ink/[0.07] hover:ring-ai/40"}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${sel === x.city ? "bg-ai text-on-ai" : "icon-tile"}`}><Icon name="pin" size={18} /></span>
            <span className="min-w-0 flex-1"><span className="flex items-baseline justify-between gap-2"><span className="text-[16px] font-semibold">{x.city}</span><span className={`text-[12px] tabular-nums ${sel === x.city ? "opacity-70" : "text-muted"}`}>{time(SITES[x.city].tz)}</span></span>
              <span className={`block text-[12.5px] ${sel === x.city ? "opacity-75" : "text-muted"}`}>{x.region}</span>
              <span className={`mt-1 block text-[11.5px] ${sel === x.city ? "opacity-60" : "text-faint"}`}>{SITES[x.city].building} · {SITES[x.city].suite}</span></span>
          </button>
        ))}
        <button onClick={() => ask("Which Biongevity location should I choose, and can I start with a virtual visit?", { label: "✦ Which location suits me?" })} className="mt-1 flex items-center gap-2 rounded-[22px] bg-ai-soft/70 p-3.5 text-left text-[13px] font-semibold text-ai ring-1 ring-ai/15"><XevyoOrb size={26} live />Which location suits me?</button>
      </div>

      <div className="relative h-[560px] overflow-hidden rounded-[32px] bg-white ring-1 ring-ink/[0.07]">
        <canvas ref={canvas} aria-label="3D globe with Biongevity clinics. Drag to spin." className={`absolute inset-0 h-full w-full cursor-grab touch-pan-y transition-opacity duration-500 active:cursor-grabbing ${stage === "building" ? "opacity-0" : "opacity-100"}`} />
        {stage === "globe" && !sel && <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-medium text-muted ring-1 ring-ink/[0.06] backdrop-blur">Drag to spin · pick a clinic to fly in</div>}
        <AnimatePresence>
          {stage === "building" && o && site && (
            <motion.div key={o.city} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0">
              <BuildingView city={o.city} address={o.address} phone={o.phone} tel={o.tel} site={site} onBack={back} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
