"use client";
import { useState } from "react";
import { useAI } from "./AIProvider";
import { Icon } from "@/components/ui/Icon";
import { BorderBeam } from "@/components/fx/BorderBeam";

/** Inline AI panel — a Xevyo entry point placed beside content. Prompts open the chat with context. */
export function AIPanel({ title, prompts, context, className }: { title: string; prompts: string[]; context: string; className?: string }) {
  const { ask } = useAI();
  const [q, setQ] = useState("");
  const send = (text: string) => { if (text.trim()) { ask(`${text} (about: ${context})`); setQ(""); } };
  return (
    <div className={`relative overflow-hidden rounded-[24px] bg-white p-5 shadow-card ring-1 ring-accent/15 ${className ?? ""}`}>
      <BorderBeam duration={9} colorFrom="#C2A16A" colorTo="#7FA083" />
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold-soft blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-iri text-white">
            <Icon name="sparkle" size={20} weight="duotone" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulseDot rounded-full bg-teal ring-2 ring-white" />
          </span>
          <div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Xevyo AI</div><div className="text-[15px] font-semibold leading-tight">{title}</div></div>
        </div>
        <svg aria-hidden viewBox="0 0 200 24" className="mt-3 h-6 w-full" preserveAspectRatio="none">
          <path d="M0 12 Q 12 2 25 12 T 50 12 T 75 12 T 100 12 T 125 12 T 150 12 T 175 12 T 200 12" fill="none" stroke="url(#aiw)" strokeWidth="1.6" strokeDasharray="4 6" style={{ animation: "flow 1.8s linear infinite" }} />
          <defs><linearGradient id="aiw" x1="0" x2="1"><stop offset="0" stopColor="#C2A16A" /><stop offset="1" stopColor="#7FA083" /></linearGradient></defs>
        </svg>
        <div className="mt-2 space-y-1.5">
          {prompts.map((p) => (
            <button key={p} onClick={() => send(p)} className="flex w-full items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2.5 text-left text-[13.5px] transition-colors hover:bg-accent-light hover:text-accent">
              {p}<Icon name="arrow-up-right" size={14} className="shrink-0 text-accent" />
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(q)} placeholder="Ask anything…" aria-label={title}
            className="h-10 min-w-0 flex-1 rounded-full border border-ink/10 bg-white px-4 text-[14px] outline-none focus:border-accent" />
          <button onClick={() => send(q)} aria-label="Ask" className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white"><Icon name="arrow-up" size={16} weight="bold" /></button>
        </div>
        <p className="mt-2 text-[11px] text-faint">Education, not a diagnosis.</p>
      </div>
    </div>
  );
}
