"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { WORLD_DOTS, WORLD_H, WORLD_PINS, WORLD_W } from "@/data/worldmap";
import { OFFICES } from "@/data/clinic";
import { Icon } from "@/components/ui/Icon";

type View = { x: number; y: number; w: number };
const FULL: View = { x: 0, y: 0, w: WORLD_W };
const ASPECT = WORLD_H / WORLD_W;
const MIN_W = WORLD_W / 6;
const PIN_KEY: Record<string, string> = { Calgary: "calgary", Dubai: "dubai", Almelo: "almelo" };
const TZ: Record<string, string> = { Calgary: "America/Edmonton", Dubai: "Asia/Dubai", Almelo: "Europe/Amsterdam" };
const ROUTES: [string, string][] = [["calgary", "almelo"], ["almelo", "dubai"], ["calgary", "dubai"]];

const clamp = (v: View): View => {
  const w = Math.min(WORLD_W, Math.max(MIN_W, v.w)), h = w * ASPECT;
  return { w, x: Math.min(WORLD_W - w, Math.max(0, v.x)), y: Math.min(WORLD_H - h, Math.max(0, v.y)) };
};
const arc = (a: [number, number], b: [number, number]) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.28;
  return `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`;
};

/**
 * Interactive dotted world map — drag to pan, pinch or scroll (after a click) to zoom, +/− buttons,
 * office pins with live local time, animated data routes between clinics. SVG only: no tiles, no API keys.
 */
export function WorldMap() {
  const [view, setView] = useState<View>(FULL);
  const [active, setActive] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const anim = useRef(0);

  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const toMap = useCallback((cx: number, cy: number, v: View) => {
    const r = svg.current!.getBoundingClientRect();
    return { x: v.x + ((cx - r.left) / r.width) * v.w, y: v.y + ((cy - r.top) / r.height) * v.w * ASPECT };
  }, []);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    setView((v) => {
      const r = svg.current!.getBoundingClientRect();
      const p = cx === undefined ? { x: v.x + v.w / 2, y: v.y + (v.w * ASPECT) / 2 } : toMap(cx, cy!, v);
      const w = Math.min(WORLD_W, Math.max(MIN_W, v.w * factor));
      const fx = cx === undefined ? 0.5 : (cx - r.left) / r.width, fy = cy === undefined ? 0.5 : (cy! - r.top) / r.height;
      return clamp({ w, x: p.x - fx * w, y: p.y - fy * w * ASPECT });
    });
  }, [toMap]);

  const flyTo = useCallback((target: View) => {
    cancelAnimationFrame(anim.current);
    const from = { ...view }, t0 = performance.now(), dur = 700;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      setView(clamp({ x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e }));
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, [view]);

  const focus = (city: string) => {
    const p = WORLD_PINS[PIN_KEY[city]]; setSel(city);
    const w = WORLD_W / 3.2; flyTo({ w, x: p[0] - w / 2, y: p[1] - (w * ASPECT) / 2 });
  };

  // Wheel zoom only once the map is activated (so page scroll is never hijacked).
  useEffect(() => {
    const el = svg.current; if (!el) return;
    const wheel = (e: WheelEvent) => { if (!active) return; e.preventDefault(); zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [active, zoomAt]);

  const down = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture?.(e.pointerId); pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); setActive(true); cancelAnimationFrame(anim.current); };
  const move = (e: React.PointerEvent) => {
    const m = pts.current; const prev = m.get(e.pointerId); if (!prev) return;
    const r = svg.current!.getBoundingClientRect();
    if (m.size === 1) {
      setView((v) => clamp({ ...v, x: v.x - ((e.clientX - prev.x) / r.width) * v.w, y: v.y - ((e.clientY - prev.y) / r.height) * v.w * ASPECT }));
    } else if (m.size === 2) {
      const [a, b] = [...m.entries()].map(([id, p]) => (id === e.pointerId ? { x: e.clientX, y: e.clientY } : p));
      const [pa, pb] = [...m.values()];
      const d0 = Math.hypot(pa.x - pb.x, pa.y - pb.y), d1 = Math.hypot(a.x - b.x, a.y - b.y);
      if (d0 > 0) zoomAt(d0 / d1, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
    m.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const up = (e: React.PointerEvent) => { pts.current.delete(e.pointerId); };

  const zoom = WORLD_W / view.w;
  const k = 1 / Math.sqrt(zoom); // keep pins/labels readable when zoomed
  const time = (city: string) => now ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: TZ[city] }).format(now) : "--:--:--";

  return (
    <div className="overflow-hidden rounded-[28px] bg-navy shadow-lift">
      <div className="relative" onMouseLeave={() => setActive(false)}>
        <svg ref={svg} viewBox={`${view.x} ${view.y} ${view.w} ${view.w * ASPECT}`} className={`block aspect-[135.5/64.22] w-full touch-none select-none ${active ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label="World map of Biongevity clinics in Calgary, Almelo and Dubai">
          <defs>
            <radialGradient id="wm-glow"><stop offset="0" stopColor="#B8925C" stopOpacity=".55" /><stop offset="1" stopColor="#B8925C" stopOpacity="0" /></radialGradient>
            <linearGradient id="wm-arc" x1="0" x2="1"><stop offset="0" stopColor="#B8925C" /><stop offset="1" stopColor="#7FA083" /></linearGradient>
          </defs>
          <path d={WORLD_DOTS} stroke="#B89A6A" strokeOpacity=".55" strokeWidth=".55" strokeLinecap="round" fill="none" />
          {ROUTES.map(([a, b], i) => {
            const d = arc(WORLD_PINS[a], WORLD_PINS[b]);
            return (
              <g key={a + b}>
                <path d={d} fill="none" stroke="url(#wm-arc)" strokeWidth={0.35 * k} strokeOpacity=".35" />
                <path d={d} fill="none" stroke="url(#wm-arc)" strokeWidth={0.45 * k} strokeDasharray="1.2 2.2" style={{ animation: `flow ${3 + i}s linear infinite` }} />
                <circle r={0.75 * k} fill="#97703F"><animateMotion dur={`${4 + i * 1.3}s`} repeatCount="indefinite" path={d} /></circle>
              </g>
            );
          })}
          {OFFICES.map((o) => {
            const [x, y] = WORLD_PINS[PIN_KEY[o.city]], on = sel === o.city;
            return (
              <g key={o.city} transform={`translate(${x} ${y})`} className="cursor-pointer" onClick={() => focus(o.city)} onPointerDown={(e) => e.stopPropagation()}>
                <circle r={6 * k} fill="url(#wm-glow)" />
                <circle r={1.4 * k} fill="none" stroke="#7FA083" strokeWidth={0.3 * k}><animate attributeName="r" values={`${1.2 * k};${4.5 * k}`} dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0" dur="2.4s" repeatCount="indefinite" /></circle>
                <circle r={(on ? 1.5 : 1.1) * k} fill={on ? "#7FA083" : "#97703F"} stroke="#fff" strokeWidth={0.35 * k} />
                <g transform={`translate(${2 * k} ${-1.6 * k}) scale(${k})`}>
                  <rect x="0" y="-2.6" width={o.city.length * 1.55 + 2.4} height="3.6" rx="1.8" fill="#FFFFFF" fillOpacity=".95" stroke="#97703F" strokeOpacity=".35" strokeWidth=".15" />
                  <text x="1.2" y="-.15" fontSize="2.3" fill="#221D16" fontWeight="600">{o.city}</text>
                </g>
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[12px] shadow-card backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-teal-soft" />3 clinics · 1 shared record
        </div>
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-xl bg-white/90 shadow-card backdrop-blur">
          <button onClick={() => zoomAt(1 / 1.5)} aria-label="Zoom in" className="grid h-9 w-9 place-items-center hover:bg-accent-light"><Icon name="plus" size={16} /></button>
          <button onClick={() => zoomAt(1.5)} aria-label="Zoom out" className="grid h-9 w-9 place-items-center border-y border-ink/[0.06] hover:bg-accent-light"><Icon name="minus" size={16} /></button>
          <button onClick={() => { setSel(null); flyTo(FULL); }} aria-label="Reset map" className="grid h-9 w-9 place-items-center hover:bg-accent-light"><Icon name="reset" size={15} /></button>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-4 hidden text-[11px] text-muted sm:block">{active ? "Scroll to zoom · drag to pan" : "Click the map to enable scroll-zoom · drag to pan"} · {zoom.toFixed(1)}×</div>
      </div>
      <div className="grid gap-px bg-accent/10 sm:grid-cols-3">
        {OFFICES.map((o) => (
          <button key={o.city} onClick={() => focus(o.city)} className={`p-5 text-left transition-colors hover:bg-white ${sel === o.city ? "bg-white" : "bg-pearl"}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{o.region}</span>
              <span className="font-mono text-[12px] tabular-nums text-muted" suppressHydrationWarning>{time(o.city)}</span>
            </div>
            <div className="mt-1 text-[20px] font-semibold">{o.city}</div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-muted">{o.address}</div>
            <a href={o.tel} onClick={(e) => e.stopPropagation()} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink hover:text-accent"><Icon name="call" size={13} />{o.phone}</a>
          </button>
        ))}
      </div>
    </div>
  );
}
