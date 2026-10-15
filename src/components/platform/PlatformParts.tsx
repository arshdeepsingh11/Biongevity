"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { PLATFORM_LAYERS, TWIN_STATES, WHY_EXAMPLE, ACTION_LABELS } from "@/data/platform";

/** Buttons that connect the website to the member app (the twin itself lives in the app). */
export function AppButtons({ center }: { center?: boolean }) {
  const { ask } = useAI();
  return (
    <div className={`flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      <a href={env.appUrl} className="btn-ai h-12 px-6"><Icon name="fingerprint" size={18} />Open my twin</a>
      <a href="/login/" className="btn-light h-12 px-6"><Icon name="user" size={16} />Sign in options</a>
      <button onClick={() => ask("What is the Biongevity digital twin, and what will I see in the app after my baseline tests?", { label: "✦ What is my digital twin?" })} className="btn-light h-12 px-6"><XevyoOrb size={22} />Ask about the twin</button>
    </div>
  );
}

/** Seven layers as a stack: hover or tap a layer to read it; each layer can be explained by Xevyo. */
export function LayerStack() {
  const [on, setOn] = useState(5);
  const { ask } = useAI();
  const l = PLATFORM_LAYERS[on];
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-2">
        {PLATFORM_LAYERS.map((x, i) => (
          <motion.button key={x.n} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} aria-pressed={on === i}
            style={{ marginLeft: `${i * 2}%`, marginRight: `${(6 - i) * 2}%` }}
            className={`flex w-[calc(100%-12%)] items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${on === i ? "bg-white shadow-lift ai-ring" : "bg-white/60 ring-1 ring-ink/[0.06] hover:bg-white"}`}>
            <span className="font-mono text-[11px] text-faint">{x.n}</span>
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${i === 5 ? "" : on === i ? "bg-ai-soft text-ai" : "bg-canvas text-accent"}`}>{i === 5 ? <XevyoOrb size={34} live /> : <Icon name={x.icon} size={18} weight="duotone" />}</span>
            <span className="flex-1 text-[15px] font-semibold">{x.t}</span>
            {on === i && <Icon name="arrow-right" size={15} className="text-ai" />}
          </motion.button>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-[28px] bg-white p-6 ai-ring lg:sticky lg:top-24 lg:self-start">
        <div aria-hidden className="ai-glow -right-12 -top-12 h-44 w-44" />
        <div className="relative">
          <div className="font-mono text-[12px] text-ai">Layer {l.n}</div>
          <div className="mt-1 text-[26px] font-semibold tracking-tight">{l.t}</div>
          <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{l.d}</p>
          <button onClick={() => ask(`Explain the "${l.t}" layer of the Biongevity healthspan platform in simple words, with an example for a 55-year-old.`, { label: `✦ Explain layer: ${l.t}` })}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ai-soft px-4 py-2 text-[13.5px] font-semibold text-ai ring-1 ring-ai/20 hover:ring-ai/40"><XevyoOrb size={18} />Explain with an example</button>
        </div>
      </div>
    </div>
  );
}

/** Six state vectors of the twin, orbiting the AI orb. */
export function TwinStates() {
  return (
    <div className="relative grid items-center gap-4 md:grid-cols-3">
      <div className="space-y-4">{TWIN_STATES.slice(0, 3).map((s) => <State key={s.t} {...s} />)}</div>
      <div className="relative mx-auto grid aspect-square w-[220px] place-items-center sm:w-[260px]">
        <div aria-hidden className="absolute inset-0 animate-spinSlow rounded-full border border-dashed border-ai/30" />
        <div aria-hidden className="absolute inset-6 rounded-full border border-ai/15" />
        <div aria-hidden className="ai-glow inset-10 !opacity-30" />
        <div className="relative text-center"><XevyoOrb size={112} live halo /><div className="mt-3 text-[13px] font-semibold">Your digital twin</div><div className="text-[11.5px] text-muted">learns your own baseline</div></div>
      </div>
      <div className="space-y-4">{TWIN_STATES.slice(3).map((s) => <State key={s.t} {...s} />)}</div>
    </div>
  );
}
function State({ t, d, icon }: { t: string; d: string; icon: string }) {
  return (
    <div className="card flex items-start gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-soft text-ai"><Icon name={icon} size={19} weight="duotone" /></span>
      <div><div className="text-[15px] font-semibold">{t} state</div><div className="text-[13px] leading-snug text-muted">{d}</div></div>
    </div>
  );
}

/** "Why this?" — the recommendation chain, shown with an ILLUSTRATIVE example. */
export function WhyThis() {
  const [n, setN] = useState(WHY_EXAMPLE.length);
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-5 ai-ring sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <XevyoOrb size={30} /><div className="flex-1 text-[17px] font-semibold">Why this recommendation?</div>
        <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-gold-deep">Illustrative example</span>
      </div>
      <ol className="mt-4 space-y-1.5">
        {WHY_EXAMPLE.slice(0, n).map((w, i) => (
          <motion.li key={w.k} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="grid grid-cols-[22px_120px_1fr] items-start gap-2 rounded-xl px-2 py-1.5 text-[13.5px] odd:bg-canvas">
            <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-ai text-[10px] font-semibold text-on-ai">{i + 1}</span>
            <span className="font-semibold">{w.k}</span><span className="text-muted">{w.v}</span>
          </motion.li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Every recommendation ends in one of</span>
        {ACTION_LABELS.map((a, i) => <span key={a} className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${i === 3 ? "bg-ai text-on-ai" : "bg-canvas text-muted"}`}>{a}</span>)}
      </div>
      <button onClick={() => setN((x) => (x === WHY_EXAMPLE.length ? 1 : WHY_EXAMPLE.length))} className="mt-3 text-[12px] font-semibold text-ai underline">{n === WHY_EXAMPLE.length ? "Replay the chain" : "Show all steps"}</button>
    </div>
  );
}
