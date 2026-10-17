"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ANATOMY, sketchfabEmbed } from "@/data/anatomy";
import { DEPT_EXTRA } from "@/data/deptExtra";
import { ORGANS } from "@/data/organs";
import { CardioExplorer } from "./CardioExplorer";
import { Organ3D } from "./Organ3D";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn } from "@/lib/utils";

type View = { key: string; label: string; kind: "model" | "live" | "parts"; id?: string };

/**
 * 3D anatomy for a department: realistic models (rotate, zoom, tap the labels), plus — where it fits —
 * the live beating heart and the tap-a-part explorer. One view loads at a time to keep the page fast.
 */
export function AnatomyStudio({ dept, name }: { dept: string; name: string }) {
  const { ask } = useAI();
  const models = ANATOMY[dept] ?? [];
  const organ = DEPT_EXTRA[dept]?.organ;
  const heart = dept === "cardiology" || dept === "heart-failure";
  const views: View[] = [
    ...models.map((m) => ({ key: m.id, label: m.label, kind: "model" as const, id: m.id })),
    ...(heart ? [{ key: "live", label: "Live heart & vessels", kind: "live" as const }] : []),
    ...(organ ? [{ key: "parts", label: `Tap the parts · ${ORGANS[organ].name}`, kind: "parts" as const }] : []),
  ];
  const [cur, setCur] = useState(views[0]?.key);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  if (!views.length) return null;
  const v = views.find((x) => x.key === cur) ?? views[0];
  const m = models.find((x) => x.id === v.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Anatomy views" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card ring-1 ring-ink/[0.06]">
          {views.map((x) => (
            <button key={x.key} role="tab" aria-selected={cur === x.key} onClick={() => setCur(x.key)}
              className={cn("relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition", cur === x.key ? "text-white" : "text-muted hover:text-ink")}>
              {cur === x.key && <motion.span layoutId={`an-${dept}`} className="absolute inset-0 rounded-full bg-ai" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative flex items-center gap-1.5"><Icon name={x.kind === "model" ? "orbit" : x.kind === "live" ? "heart" : "target"} size={14} />{x.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => ask(`Using the 3D anatomy of ${v.label.toLowerCase()} as a guide, explain how it works, what changes with age, and how ${name} at Biongevity checks it.`, { label: `✦ ${v.label}` })} className="btn-ai ml-auto h-9 px-3.5 text-[12.5px]"><XevyoOrb size={16} />Ask SI to walk me through it</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={v.key} initial={{ opacity: 0, y: 10, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          {v.kind === "model" && m && (
            <div className="relative overflow-hidden rounded-[28px] ring-1 ring-ink/[0.07]" style={{ background: "radial-gradient(90% 80% at 50% 40%, #ffffff 0%, rgb(var(--c-pearl)) 60%, rgb(var(--c-ai-soft)) 100%)" }}>
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
                {!loaded[m.id] && (
                  <div className="absolute inset-0 grid place-items-center text-muted">
                    <div className="flex flex-col items-center gap-3"><span className="h-10 w-10 animate-spin rounded-full border-2 border-ai/15 border-t-ai" /><span className="text-[12.5px]">Loading 3D model…</span></div>
                  </div>
                )}
                <iframe title={`3D model: ${m.title}`} src={sketchfabEmbed(m.id)} onLoad={() => setLoaded((l) => ({ ...l, [m.id]: true }))}
                  allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" className="absolute inset-0 h-full w-full border-0" />
              </div>
              <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ai ring-1 ring-ink/[0.06] backdrop-blur-md">3D anatomy · {m.label}</div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.06] bg-white/70 px-4 py-2 text-[11.5px] text-muted backdrop-blur-md">
                <span>Drag to rotate · scroll or pinch to zoom · tap a number for its label</span>
                <span>Model: <a href={`https://sketchfab.com/models/${m.id}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-ai">{m.title}</a> by <a href={m.authorUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ai">{m.author}</a> · Sketchfab</span>
              </div>
            </div>
          )}
          {v.kind === "live" && <CardioExplorer />}
          {v.kind === "parts" && organ && <Organ3D organ={organ} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
