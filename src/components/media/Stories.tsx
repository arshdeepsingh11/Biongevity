"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { STORIES } from "@/data/clinic";

/**
 * Stories — vertical testimonial videos as tilted 3D cards.
 * Hover (or touch) plays a silent preview; press to watch full-screen with sound.
 */
export function Stories() {
  const [open, setOpen] = useState<(typeof STORIES)[number] | null>(null);
  return (
    <>
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-2 [perspective:1200px] no-scrollbar sm:justify-center">
        {STORIES.map((s, i) => <StoryCard key={s.id} s={s} i={i} onOpen={() => setOpen(s)} />)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="relative aspect-[9/16] h-[min(82vh,760px)] overflow-hidden rounded-[28px] bg-black shadow-lift">
              <video className="h-full w-full object-cover" src={open.video} poster={open.poster} autoPlay controls playsInline />
              <button onClick={() => setOpen(null)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink" aria-label="Close video"><Icon name="x" size={16} /></button>
              <Link href={open.href} className="absolute bottom-16 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-accent">{open.tag} →</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StoryCard({ s, i, onOpen }: { s: (typeof STORIES)[number]; i: number; onOpen: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const tilt = [-6, 0, 6][i % 3];
  const on = () => { v.current?.play().catch(() => undefined); };
  const off = () => { const x = v.current; if (x) { x.pause(); x.currentTime = 0; } };
  return (
    <button onClick={onOpen} onMouseEnter={on} onMouseLeave={off} onTouchStart={on} data-scan
      className="group relative aspect-[9/16] w-[220px] shrink-0 snap-center overflow-hidden rounded-[26px] bg-canvas text-left shadow-lift ring-1 ring-ink/[0.06] transition-transform duration-700 [transform-style:preserve-3d] hover:![transform:rotateY(0deg)_translateY(-8px)] sm:w-[250px]"
      style={{ transform: `rotateY(${tilt}deg)` }} aria-label={`Play story: ${s.t}`}>
      <video ref={v} className="absolute inset-0 h-full w-full object-cover" src={s.video} poster={s.poster} muted playsInline loop preload="none" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-accent backdrop-blur">{s.tag}</span>
      <span className="absolute inset-x-4 bottom-4 text-snow">
        <span className="block text-[17px] font-semibold leading-tight">{s.t}</span>
        <span className="mt-1 block text-[12px] text-snow/80">{s.d}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-snow/20 px-3 py-1.5 text-[12px] font-semibold backdrop-blur"><Icon name="play" size={12} />Watch story</span>
      </span>
    </button>
  );
}
