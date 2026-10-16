"use client";
import { useState } from "react";
import { useAI } from "./AIProvider";
import { AISurface } from "./AISurface";
import { Icon } from "@/components/ui/Icon";

/** Inline AI panel — a Biongevity SI entry point placed beside content. Prompts open the chat with context. */
export function AIPanel({ title, prompts, context, className }: { title: string; prompts: string[]; context: string; className?: string }) {
  const { ask } = useAI();
  const [q, setQ] = useState("");
  const send = (text: string) => { if (text.trim()) { ask(`${text} (about: ${context})`, { label: text }); setQ(""); } };
  return (
    <AISurface kicker="Ask Biongevity SI" title={title} className={className} badge={false}>
      <div className="space-y-1.5">
        {prompts.map((p) => (
          <button key={p} onClick={() => send(p)} className="flex w-full items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2.5 text-left text-[13.5px] transition-colors hover:bg-ai-soft hover:text-ai">
            <span><span aria-hidden className="mr-1.5 text-ai">✦</span>{p}</span><Icon name="arrow-up-right" size={14} className="shrink-0 text-ai" />
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(q)} placeholder="Ask anything…" aria-label={title}
          className="h-10 min-w-0 flex-1 rounded-full border border-ink/10 bg-white px-4 text-[14px] outline-none focus:border-ai" />
        <button onClick={() => send(q)} aria-label="Ask" className="grid h-10 w-10 place-items-center rounded-full bg-ai text-on-ai"><Icon name="arrow-up" size={16} weight="bold" /></button>
      </div>
      <p className="mt-2 text-[11px] text-faint">Answers from Xevyo AI, with sources · education, not a diagnosis.</p>
    </AISurface>
  );
}
