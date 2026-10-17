"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { BOOK_URL } from "@/lib/env";
import { cn } from "@/lib/utils";

/* Three ways to start, drawn as routes from you to your plan. Click a route to light it up. */
const ROUTES = [
  { id: "virtual", t: "Virtual consult", icon: "video", d: "Secure video from home — results reviews, follow-ups and first questions.", bars: [5, 3, 5], best: "Fastest start, from anywhere" },
  { id: "clinic", t: "Clinic visit", icon: "hospital", d: "In person in Calgary or Dubai — exam, imaging and a blood draw in one booking.", bars: [3, 5, 3], best: "Deepest first look" },
  { id: "home", t: "Home test first", icon: "test-tubes", d: "Start with a BioAro Labs kit; a clinician reviews the results with you.", bars: [4, 4, 4], best: "Data before the visit" },
] as const;
const AXES = ["Speed to start", "Depth of first look", "Convenience"];

/* node layout (viewBox 0 0 520 300) */
const N = { you: [50, 150], cat: [170, 150], v: [300, 60], c: [300, 150], h: [300, 240], team: [410, 150], plan: [480, 150] } as const;
const PATH: Record<string, [keyof typeof N, keyof typeof N][]> = {
  virtual: [["you", "cat"], ["cat", "v"], ["v", "team"], ["team", "plan"]],
  clinic: [["you", "cat"], ["cat", "c"], ["c", "team"], ["team", "plan"]],
  home: [["you", "cat"], ["cat", "h"], ["h", "team"], ["team", "plan"]],
};
const curve = (a: readonly number[], b: readonly number[], v: boolean) => {
  if (v) { const my = (a[1] + b[1]) / 2; return `M${a[0]},${a[1]} C${a[0]},${my} ${b[0]},${my} ${b[0]},${b[1]}`; }
  const mx = (a[0] + b[0]) / 2; return `M${a[0]},${a[1]} C${mx},${a[1]} ${mx},${b[1]} ${b[0]},${b[1]}`;
};
const ALL: [keyof typeof N, keyof typeof N][] = [["you", "cat"], ["cat", "v"], ["cat", "c"], ["cat", "h"], ["v", "team"], ["c", "team"], ["h", "team"], ["team", "plan"]];
const LABEL: Record<keyof typeof N, string> = { you: "You", cat: "Pick a category", v: "Virtual", c: "Clinic", h: "Home test", team: "Care team", plan: "Your plan" };

export function ContactFlow() {
  const { ask } = useAI();
  // phones get the same graph standing upright, so the labels stay readable
  const [vert, setVert] = useState(false);
  useEffect(() => { const m = matchMedia("(max-width: 520px)"); const on = () => setVert(m.matches); on(); m.addEventListener("change", on); return () => m.removeEventListener("change", on); }, []);
  const pos = (k: keyof typeof N): [number, number] => (vert ? [N[k][1] * 1.05 - 8, N[k][0] * 0.64 + 18] : [N[k][0], N[k][1]]);
  const [r, setR] = useState<(typeof ROUTES)[number]["id"]>("virtual");
  const route = ROUTES.find((x) => x.id === r)!;
  const lit = new Set(PATH[r].map(([a, b]) => `${a}-${b}`));
  const litNode = new Set(PATH[r].flat());

  return (
    <div className="rounded-[30px] bg-white/75 p-4 shadow-[0_30px_80px_-40px_rgb(var(--c-ink)/.35)] ring-1 ring-ink/[0.06] backdrop-blur-2xl sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ai"><XevyoOrb size={18} />How booking works</div>
        <span className="rounded-full bg-canvas px-2 py-0.5 text-[10.5px] font-semibold text-muted">Illustrative guide</span>
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar" role="tablist" aria-label="Ways to start">
        {ROUTES.map((x) => (
          <button key={x.id} role="tab" aria-selected={r === x.id} onClick={() => setR(x.id)}
            className={cn("flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold ring-1 transition", r === x.id ? "bg-ai text-on-ai ring-ai" : "bg-white/80 text-ink/80 ring-ink/[0.07] hover:ring-ai/40")}>
            <Icon name={x.icon} size={14} />{x.t}
          </button>
        ))}
      </div>

      {/* the route graph */}
      <svg viewBox={vert ? "0 0 300 340" : "0 0 520 300"} className="mx-auto mt-3 w-full max-w-[520px]" role="img" aria-label={`Route: you, pick a category, ${route.t}, care team, your plan`}>
        <defs>
          <linearGradient id="cf-g" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--c-ai-2))" /><stop offset="1" stopColor="rgb(var(--c-ai))" /></linearGradient>
        </defs>
        {ALL.map(([a, b]) => {
          const on = lit.has(`${a}-${b}`), d = curve(pos(a), pos(b), vert);
          return (
            <g key={`${a}-${b}`}>
              <path d={d} fill="none" stroke={on ? "url(#cf-g)" : "rgb(var(--c-ink) / .10)"} strokeWidth={on ? 3 : 1.5} style={{ transition: "stroke .3s, stroke-width .3s" }} />
              {on && <path d={d} fill="none" stroke="rgb(var(--c-ai-hi))" strokeWidth="3" strokeDasharray="4 18" strokeLinecap="round" style={{ animation: "beamRun 1s linear infinite" }} />}
            </g>
          );
        })}
        {(Object.keys(N) as (keyof typeof N)[]).map((k) => {
          const [x, y] = pos(k), on = litNode.has(k), big = k === "you" || k === "plan";
          return (
            <g key={k} style={{ transition: "opacity .3s" }} opacity={on ? 1 : 0.45}>
              {on && <circle cx={x} cy={y} r={big ? 22 : 18} fill="rgb(var(--c-ai) / .14)" style={{ transformOrigin: `${x}px ${y}px`, animation: "haloPulse 2.4s ease-out infinite" }} />}
              <circle cx={x} cy={y} r={big ? 15 : 11} fill={on ? "rgb(var(--c-ai))" : "rgb(var(--c-surface))"} stroke="rgb(var(--c-ai) / .5)" strokeWidth="1.5" />
              <text x={vert && k !== "h" && k !== "v" ? x + 22 : x} y={vert ? (k === "h" || k === "v" ? y + 28 : y + 4) : y + (k === "v" ? -22 : 30)} textAnchor={vert && k !== "h" && k !== "v" ? "start" : "middle"} className="fill-current text-ink" style={{ font: `600 ${vert ? 13 : 12}px var(--font-sans, system-ui)` }}>{LABEL[k]}</text>
            </g>
          );
        })}
      </svg>

      {/* what this route is good for */}
      <motion.div key={r} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-2 grid gap-4 sm:grid-cols-[1fr_1fr]">
        <div>
          <div className="text-[16px] font-semibold">{route.t}</div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{route.d}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-2.5 py-1 text-[11.5px] font-semibold text-ai"><Icon name="check" size={12} />{route.best}</div>
        </div>
        <div className="space-y-2">
          {AXES.map((a, k) => (
            <div key={a}>
              <div className="flex justify-between text-[11.5px] text-muted"><span>{a}</span><span className="font-semibold text-ink">{route.bars[k]}/5</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${route.bars[k] * 20}%`, background: "linear-gradient(90deg, rgb(var(--c-ai-2)), rgb(var(--c-ai)))" }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/[0.06] pt-4">
        <a href={BOOK_URL} target="_blank" rel="noopener" className="btn-dark h-11 px-5 text-[14px]"><Icon name="calendar" size={16} />Book a consultation<Icon name="arrow-up-right" size={13} /></a>
        <button onClick={() => ask(`I want to start with Biongevity. Compare a virtual consult, a clinic visit and a home test first for someone like me, and tell me which to book first and what to prepare.`, { label: "✦ Where do I start?" })} className="btn-ai h-11 px-4 text-[13.5px]"><XevyoOrb size={18} />Which should I pick?</button>
      </div>
    </div>
  );
}
