"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

type Site = { floors: number; floor: number; suite: string; building: string; note: string };

/** Illustrative clinic layout per city (rooms change by site). */
const ROOMS: Record<string, { id: string; t: string; d: string; x: number; y: number; w: number; h: number }[]> = {
  Calgary: [
    { id: "rec", t: "Reception", d: "Check in and update your details", x: 60, y: 40, w: 110, h: 70 },
    { id: "wait", t: "Lounge", d: "Quiet waiting area", x: 170, y: 40, w: 90, h: 70 },
    { id: "c1", t: "Consult 1", d: "Specialist consultations", x: 260, y: 40, w: 70, h: 70 },
    { id: "c2", t: "Consult 2", d: "Specialist consultations", x: 330, y: 40, w: 70, h: 70 },
    { id: "echo", t: "Echo & stress", d: "Echocardiography and exercise stress echo", x: 260, y: 150, w: 140, h: 80 },
    { id: "ecg", t: "ECG · Holter", d: "Heart rhythm tests and monitor fitting", x: 170, y: 150, w: 90, h: 80 },
    { id: "lab", t: "Lab draw", d: "Blood samples for BioAro Labs", x: 60, y: 150, w: 110, h: 80 },
  ],
  Dubai: [
    { id: "rec", t: "Reception", d: "Check in", x: 60, y: 40, w: 120, h: 70 },
    { id: "c1", t: "Longevity consult", d: "Precision internal medicine and endocrinology", x: 180, y: 40, w: 120, h: 70 },
    { id: "assess", t: "Assessment suite", d: "VO₂ max, spirometry, grip, body composition", x: 300, y: 40, w: 100, h: 190 },
    { id: "lab", t: "Lab & genomics", d: "Samples for genetic and microbiome tests", x: 60, y: 150, w: 120, h: 80 },
    { id: "aes", t: "Precision aesthetics", d: "Skin and aesthetic care", x: 180, y: 150, w: 120, h: 80 },
  ],
  Almelo: [
    { id: "rec", t: "Front desk", d: "Visitors and deliveries", x: 60, y: 40, w: 140, h: 70 },
    { id: "lab", t: "Lab operations", d: "BioAro Europe laboratory operations", x: 200, y: 40, w: 200, h: 190 },
    { id: "office", t: "Offices", d: "Science and operations team", x: 60, y: 150, w: 140, h: 80 },
  ],
};

/** Zoom from the globe into the building: a 3D tower with the clinic floor lit, an illustrative floor plan, and a live map. */
export function BuildingView({ city, address, phone, tel, site, onBack }: { city: string; address: string; phone: string; tel: string; site: Site; onBack: () => void }) {
  const [tab, setTab] = useState<"tower" | "floor" | "map">("tower");
  const [rot, setRot] = useState(-38);
  const [room, setRoom] = useState<string | null>(null);
  const drag = useRef<{ x: number; r: number } | null>(null);
  const q = encodeURIComponent(address);
  const rooms = ROOMS[city] ?? ROOMS.Calgary;
  const rm = rooms.find((r) => r.id === room);
  const auto = useRef(true);
  useEffect(() => { setTab("tower"); setRoom(null); auto.current = true; }, [city]);
  // first visit: show the tower, then walk the visitor into the floor plan
  useEffect(() => { if (tab !== "tower" || !auto.current) return; const t = setTimeout(() => { auto.current = false; setTab("floor"); }, 5200); return () => clearTimeout(t); }, [tab, city]);

  const FH = Math.max(9, Math.min(16, 300 / site.floors));
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-white to-canvas">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/[0.06] p-3">
        <button onClick={onBack} className="inline-flex h-9 items-center gap-1 rounded-full bg-canvas px-3 text-[12.5px] font-semibold hover:bg-ink/[0.06]"><Icon name="globe" size={14} />Globe</button>
        <div className="min-w-0 flex-1 px-1"><div className="truncate text-[14.5px] font-semibold">{site.building} · {city}</div><div className="truncate text-[11.5px] text-muted">{address}</div></div>
        <div className="flex rounded-full bg-canvas p-0.5 text-[12px] font-semibold">
          {([["tower", "3D building"], ["floor", "Floor plan"], ["map", "Live map"]] as const).map(([k, l]) => <button key={k} onClick={() => { auto.current = false; setTab(k); }} className={`rounded-full px-3 py-1.5 ${tab === k ? "bg-white shadow-card" : "text-muted"}`}>{l}</button>)}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {tab === "tower" && (
          <div className="absolute inset-0 grid cursor-grab place-items-center touch-pan-y active:cursor-grabbing" style={{ perspective: 1400 }}
            onPointerDown={(e) => (drag.current = { x: e.clientX, r: rot })} onPointerMove={(e) => drag.current && setRot(drag.current.r + (e.clientX - drag.current.x) * 0.4)} onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)}>
            <div className="relative" style={{ transformStyle: "preserve-3d", transform: `rotateX(60deg) rotateZ(${rot}deg)`, transition: drag.current ? "none" : "transform .6s cubic-bezier(.2,.7,.2,1)" }}>
              {/* ground + street grid */}
              <div className="absolute -left-[210px] -top-[210px] h-[420px] w-[420px] rounded-[40px] bg-[radial-gradient(circle,rgb(var(--c-ai-2)/.14),transparent_65%)]" style={{ transform: "translateZ(-1px)" }} />
              <div className="absolute -left-[180px] -top-[180px] h-[360px] w-[360px] grid-bg opacity-70" style={{ transform: "translateZ(0)" }} />
              {Array.from({ length: site.floors }, (_, i) => {
                const lit = i + 1 === site.floor, z = i * FH;
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 }} className="absolute -left-[70px] -top-[70px] h-[140px] w-[140px]" style={{ transformStyle: "preserve-3d", transform: `translateZ(${z}px)` }}>
                    <div className="absolute inset-0 rounded-[6px]" style={{ transform: `translateZ(${FH - 1}px)`, background: lit ? "rgb(var(--c-ai-2) / .9)" : "rgb(var(--c-surface) / .82)", boxShadow: lit ? "0 0 40px rgb(var(--c-ai-2) / .7)" : "inset 0 0 0 1px rgb(var(--c-ink) / .12)" }} />
                    <div className="absolute left-0 top-full h-[1px] w-[140px] origin-top" style={{ height: FH - 1, transform: "rotateX(-90deg)", background: lit ? "rgb(var(--c-ai) / .95)" : "linear-gradient(90deg, rgb(var(--c-ink) / .16), rgb(var(--c-ink) / .08))" }}>
                      {!lit && <div className="h-full w-full opacity-60" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 10px, rgb(var(--c-surface) / .5) 10px 12px)" }} />}
                    </div>
                    <div className="absolute left-full top-0 w-[1px] origin-left" style={{ height: 140, width: FH - 1, transform: "rotateY(90deg)", background: lit ? "rgb(var(--c-ai) / .8)" : "rgb(var(--c-ink) / .11)" }} />
                  </motion.div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute right-5 top-5 max-w-[240px] rounded-2xl bg-white/85 p-3.5 shadow-lift ring-1 ring-ai/25 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Floor {site.floor} · {site.suite}</div>
              <div className="mt-0.5 text-[15px] font-semibold">Biongevity {city}</div>
              <div className="mt-1 text-[11.5px] text-muted">{site.note}. Building shape is illustrative.</div>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-muted ring-1 ring-ink/[0.06] backdrop-blur">Drag to turn the building</div>
          </div>
        )}

        {tab === "floor" && (
          <div className="absolute inset-0 grid grid-cols-1 gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <svg viewBox="0 0 460 270" className="h-full w-full" role="img" aria-label={`Illustrative floor plan, ${city}`}>
              <rect x="20" y="20" width="420" height="230" rx="18" fill="rgb(var(--c-surface))" stroke="rgb(var(--c-ink))" strokeOpacity=".15" />
              <rect x="20" y="110" width="420" height="40" fill="rgb(var(--c-ink))" fillOpacity=".03" />
              <rect x="410" y="115" width="26" height="30" rx="4" fill="rgb(var(--c-ink))" fillOpacity=".1" /><text x="423" y="134" textAnchor="middle" fontSize="7" fill="rgb(var(--c-muted))">Lift</text>
              {rooms.map((r) => (
                <g key={r.id} onMouseEnter={() => setRoom(r.id)} onClick={() => setRoom(r.id)} className="cursor-pointer">
                  <rect x={r.x} y={r.y} width={r.w - 6} height={r.h - 6} rx="10" fill={room === r.id ? "rgb(var(--c-ai-2) / .22)" : r.id === "rec" ? "rgb(var(--c-ai-2) / .12)" : "rgb(var(--c-ink) / .035)"} stroke={room === r.id ? "rgb(var(--c-ai))" : "rgb(var(--c-ink) / .14)"} />
                  <text x={r.x + (r.w - 6) / 2} y={r.y + (r.h - 6) / 2 + 3} textAnchor="middle" fontSize="9" fontWeight="600" fill="rgb(var(--c-ink))">{r.t}</text>
                </g>
              ))}
              <path id={`walk-${city}`} d="M423 130 L 120 130 L 115 105" fill="none" stroke="rgb(var(--c-ai-2))" strokeWidth="2.5" strokeDasharray="5 6" style={{ animation: "flow 1.4s linear infinite" }} />
              <circle r="5" fill="rgb(var(--c-ai))"><animateMotion dur="3.2s" repeatCount="indefinite" path="M423 130 L 120 130 L 115 105" /></circle>
              <text x="300" y="144" fontSize="8" fill="rgb(var(--c-ai))" fontWeight="600">You arrive here → reception</text>
            </svg>
            <div className="flex flex-col gap-2">
              <div className="rounded-2xl bg-white p-3.5 ring-1 ring-ink/[0.07]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Floor {site.floor} · {site.suite}</div>
                <div className="mt-1 text-[15px] font-semibold">{rm?.t ?? "Tap a room"}</div>
                <div className="text-[12.5px] text-muted">{rm?.d ?? "See what happens in each part of the clinic."}</div>
              </div>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener" className="btn-dark h-10 text-[13.5px]"><Icon name="route" size={15} />Directions</a>
              <a href={tel} className="btn-light h-10 text-[13.5px]"><Icon name="call" size={15} />{phone}</a>
              <p className="text-[10.5px] text-faint">Illustrative layout. Reception will guide you on the day.</p>
            </div>
          </div>
        )}

        {tab === "map" && (
          <div className="absolute inset-0">
            <iframe title={`Map of ${address}`} src={`https://maps.google.com/maps?q=${q}&t=k&z=18&ie=UTF8&iwloc=&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener" className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-lift">Open in Google Maps<Icon name="arrow-up-right" size={13} /></a>
          </div>
        )}
      </div>
    </div>
  );
}
