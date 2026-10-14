"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { MEDIA } from "@/config/media";

/** Cinematic film card: silent loop until pressed, then plays the full film with sound. */
export function FilmPlayer({ film, loop, label, className }: { film: keyof typeof MEDIA; loop?: keyof typeof MEDIA; label?: string; className?: string }) {
  const f = MEDIA[film], l = loop ? MEDIA[loop] : undefined;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const v = ref.current; if (!v) return;
    v.src = f.video!; v.loop = false; v.muted = false; v.controls = true; v.currentTime = 0;
    v.play().catch(() => undefined); setPlaying(true);
  };
  return (
    <div className={`group relative overflow-hidden rounded-5xl bg-canvas shadow-lift ring-1 ring-ink/[0.06] ${className ?? ""}`}>
      <video ref={ref} className="h-full w-full object-cover" src={(l ?? f).video} poster={f.poster} autoPlay muted loop playsInline preload="metadata" />
      {!playing && (
        <button onClick={play} className="absolute inset-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 via-black/5 to-transparent p-5 text-left text-snow sm:p-8" aria-label={`Play ${label ?? f.label}`}>
          <span><span className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-snow/80">Film</span><span className="mt-1 block text-[22px] font-semibold tracking-tight sm:text-[28px]">{label ?? f.label}</span></span>
          <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/90 text-accent shadow-lift backdrop-blur transition-transform duration-500 group-hover:scale-110">
            <ShineBorder radius={999} width={1.5} /><Icon name="play" size={22} />
          </span>
        </button>
      )}
    </div>
  );
}
