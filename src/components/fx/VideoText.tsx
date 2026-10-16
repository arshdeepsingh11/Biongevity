"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MEDIA } from "@/config/media";

/**
 * Video Text — a film plays *inside* the letters (SVG text used as a mask).
 * The film comes from MEDIA.lifeFilm (src/config/media.ts) — a child is born and grows older. Swap the file there.
 * `onTime` reports playback progress 0–1 so captions can follow the film.
 */
export function VideoText({ text, sources = [MEDIA.lifeFilm.video!], poster = MEDIA.lifeFilm.poster, className, fontSize = 22, onTime }:
  { text: string; sources?: string[]; poster?: string; className?: string; fontSize?: number; onTime?: (p: number) => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const [ok, setOk] = useState(true);
  // One viewBox for the mask and the outline, so both scale identically at any width.
  const W = Math.round(text.length * fontSize * 5.6), H = fontSize * 10;
  const T = `x='50%' y='54%' font-size='${fontSize * 8}' font-weight='800' letter-spacing='-6' text-anchor='middle' dominant-baseline='middle' font-family='Inter, system-ui, sans-serif'`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='xMidYMid meet'><text ${T}>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  useEffect(() => {
    const el = v.current; if (!el || !onTime) return;
    const t = () => el.duration && onTime(el.currentTime / el.duration);
    el.addEventListener("timeupdate", t);
    return () => el.removeEventListener("timeupdate", t);
  }, [onTime]);

  // No playable film: keep the caption moving on a 20-second life loop
  useEffect(() => {
    if (ok || !onTime) return;
    const t0 = performance.now();
    const id = setInterval(() => onTime(((performance.now() - t0) / 20000) % 1), 120);
    return () => clearInterval(id);
  }, [ok, onTime]);

  // Pause off-screen to save battery
  useEffect(() => {
    const el = v.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={cn("relative w-full select-none", className)} aria-label={text} role="img">
      <div className="absolute inset-0" style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }}>
        {ok ? (
          <video ref={v} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={poster}>
            {sources.map((s, i) => <source key={s} src={s} type="video/mp4" onError={i === sources.length - 1 ? () => setOk(false) : undefined} />)}
          </video>
        ) : <div className="h-full w-full animate-[vtShift_8s_ease-in-out_infinite] bg-[length:300%_300%]" style={{ backgroundImage: "linear-gradient(120deg, rgb(var(--c-ai-hi)), rgb(var(--c-ai-2)), rgb(var(--c-accent)), rgb(var(--c-ai-hi)))" }} />}
      </div>
      {/* faint outline so the word reads before the film loads */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <text x="50%" y="54%" fontSize={fontSize * 8} fontWeight={800} letterSpacing={-6} textAnchor="middle" dominantBaseline="middle" fill="none" stroke="rgb(var(--c-ai) / .22)" strokeWidth={1.2} fontFamily="Inter, system-ui, sans-serif">{text}</text>
      </svg>
    </div>
  );
}
