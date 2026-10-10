"use client";
import { useEffect, useRef, useState } from "react";
import { randomGlyphs } from "@/lib/utils";

/** Evervault Card — encrypted glyph field revealed under the cursor; centre text decodes on hover. */
export function EvervaultCard({ text, label, dark }: { text: string; label?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glyphs, setGlyphs] = useState("");
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);
  const [shown, setShown] = useState(text.replace(/./g, "#"));
  useEffect(() => { setGlyphs(randomGlyphs(1800)); }, []);
  useEffect(() => {
    if (!hover) { setShown(text.replace(/./g, "#")); return; }
    let i = 0;
    const t = setInterval(() => { i++; setShown(text.slice(0, i) + randomGlyphs(Math.max(0, text.length - i))); if (i >= text.length) clearInterval(t); }, 70);
    return () => clearInterval(t);
  }, [hover, text]);
  const move = (x: number, y: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({ x: ((x - r.left) / r.width) * 100, y: ((y - r.top) / r.height) * 100 });
    setGlyphs(randomGlyphs(1800));
  };
  const mask = `radial-gradient(220px circle at ${pos.x}% ${pos.y}%, #000 10%, transparent 75%)`;
  return (
    <div ref={ref} onMouseMove={(e) => move(e.clientX, e.clientY)} onTouchMove={(e) => move(e.touches[0].clientX, e.touches[0].clientY)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onTouchStart={() => setHover(true)} onTouchEnd={() => setHover(false)}
      className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-4xl ${dark ? "bg-night" : "bg-surface shadow-card ring-1 ring-white/[0.05]"}`}>
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: hover ? 1 : 0.35, WebkitMaskImage: mask, maskImage: mask }}>
        <div className="absolute inset-0 bg-iri opacity-90" />
        <p className="absolute inset-0 break-words p-2 font-mono text-[11px] font-bold leading-[1.15] text-white/80">{glyphs}</p>
      </div>
      <div className="relative z-10 grid h-40 w-40 place-items-center rounded-full bg-surface/80 shadow-lift ring-1 ring-white/5 backdrop-blur-xl">
        <span className="font-mono text-[32px] font-bold tracking-tight text-ink">{shown}</span>
      </div>
      {label && <div className={`absolute bottom-5 left-0 right-0 text-center text-[13px] font-medium ${dark ? "text-white/70" : "text-muted"}`}>🔒 {label}</div>}
    </div>
  );
}
