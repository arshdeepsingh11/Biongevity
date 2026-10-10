"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@/components/ui/Icon";

export interface SphereCard { id: string; k: string; name: string; icon: string; sub: string }

/**
 * Scroll Rotate Gallery — GSAP scroll-driven 3D sphere. Cards sit on a sphere
 * surface (Fibonacci distribution) and the sphere rotates as the user scrolls.
 * Drag / swipe also spins it. Tap a card to select.
 */
export function ScrollSphereGallery({ cards, active, onSelect }: { cards: SphereCard[]; active?: string; onSelect?: (id: string) => void }) {
  const section = useRef<HTMLDivElement>(null);
  const sphere = useRef<HTMLDivElement>(null);
  const rot = useRef({ scroll: 0, drag: 0, tilt: -12 });
  const [radius, setRadius] = useState(300);

  useEffect(() => {
    const fit = () => setRadius(Math.max(170, Math.min(320, innerWidth * 0.36)));
    fit(); addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const apply = () => { const r = rot.current; if (sphere.current) sphere.current.style.transform = `rotateX(${r.tilt}deg) rotateY(${r.scroll + r.drag}deg)`; };
    const st = ScrollTrigger.create({
      trigger: section.current, start: "top bottom", end: "bottom top", scrub: 0.6,
      onUpdate: (s) => { rot.current.scroll = s.progress * 360; rot.current.tilt = -12 + Math.sin(s.progress * Math.PI) * 10; apply(); },
    });
    let down = false, sx = 0, base = 0;
    const el = section.current!;
    const pd = (e: PointerEvent) => { down = true; sx = e.clientX; base = rot.current.drag; };
    const pm = (e: PointerEvent) => { if (!down) return; rot.current.drag = base + (e.clientX - sx) * 0.4; apply(); };
    const pu = () => (down = false);
    el.addEventListener("pointerdown", pd); addEventListener("pointermove", pm); addEventListener("pointerup", pu);
    apply();
    return () => { st.kill(); el.removeEventListener("pointerdown", pd); removeEventListener("pointermove", pm); removeEventListener("pointerup", pu); };
  }, []);

  const N = cards.length, golden = Math.PI * (3 - Math.sqrt(5));
  return (
    <div ref={section} className="relative grid h-[640px] cursor-grab touch-pan-y place-items-center overflow-hidden active:cursor-grabbing sm:h-[760px]">
      <div aria-hidden data-ai-fx className="absolute h-[60%] w-[60%] rounded-full bg-iri opacity-[0.12] blur-[90px]" />
      <div className="[perspective:1400px]">
        <div ref={sphere} className="relative h-0 w-0 [transform-style:preserve-3d]" style={{ transition: "transform .15s linear" }}>
          {cards.map((c, i) => {
            const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = golden * i;
            const lat = Math.asin(y) * (180 / Math.PI), lon = Math.atan2(Math.sin(th) * rr, Math.cos(th) * rr) * (180 / Math.PI);
            const on = active === c.id;
            return (
              <button key={i} onClick={() => onSelect?.(c.id)}
                className={`absolute -ml-[78px] -mt-[52px] flex h-[104px] w-[156px] flex-col justify-between rounded-2xl p-3 text-left [backface-visibility:hidden] transition-shadow
                  ${on ? "bg-ink text-white shadow-glow" : "bg-white/95 text-ink shadow-card ring-1 ring-black/[0.06] hover:shadow-lift"}`}
                style={{ transform: `rotateY(${lon}deg) rotateX(${lat}deg) translateZ(${radius}px)` }}>
                <span className={`grid h-8 w-8 place-items-center rounded-lg ${on ? "bg-iri text-white" : "bg-canvas"}`}><Icon name={c.icon} size={16} /></span>
                <span><span className={`block text-[10px] font-semibold uppercase tracking-wider ${on ? "text-white/60" : "text-violet"}`}>{c.k}</span>
                  <span className="block truncate text-[13px] font-semibold">{c.name}</span></span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-6 text-[12px] text-faint">Scroll or drag to rotate · tap a test</p>
    </div>
  );
}
