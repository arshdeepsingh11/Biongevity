"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { SUGGESTIONS } from "./knowledge";
import { Icon } from "@/components/ui/Icon";
import { ShineBorder } from "@/components/fx/ShineBorder";

/** Biongevity AI — slide-over assistant (bottom sheet on mobile). */
export function AIAssistant() {
  const { open, setOpen, msgs, busy, ask, context } = useAI();
  const [input, setInput] = useState("");
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => { list.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs]);
  const sugg = SUGGESTIONS[context] ?? SUGGESTIONS.home;
  const send = () => { ask(input); setInput(""); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[2px] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside aria-label="Biongevity AI" role="dialog"
            initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-2 bottom-2 z-[95] flex max-h-[82vh] flex-col overflow-hidden rounded-[26px] bg-white/95 shadow-lift ring-1 ring-black/[0.06] backdrop-blur-2xl
              lg:inset-x-auto lg:bottom-6 lg:right-6 lg:top-20 lg:max-h-none lg:w-[400px]">
            <ShineBorder radius={26} width={1} />
            <header className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-iri text-white"><Icon name="sparkle" size={17} /></span>
              <div className="flex-1"><div className="text-[15px] font-semibold">Biongevity AI</div>
                <div className="flex items-center gap-1.5 text-[12px] text-faint"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-500" />{busy ? "Thinking…" : `Context: ${context}`}</div></div>
              <button onClick={() => setOpen(false)} aria-label="Close assistant" className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-muted hover:text-ink"><Icon name="x" size={15} /></button>
            </header>
            <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
              {!msgs.length && (
                <div className="rounded-2xl bg-canvas p-4">
                  <div className="text-[15px] font-semibold">Ask about services, tests, biomarkers or your next step.</div>
                  <div className="mt-1.5 text-[13px] leading-relaxed text-muted">Explains and supports decisions. It doesn&apos;t diagnose or prescribe, and it hasn&apos;t seen any real medical record.</div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${m.role === "user" ? "bg-ink text-white" : "bg-canvas text-ink"}`}>
                    {m.text || <span className="inline-flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-violet" style={{ animationDelay: `${k * 0.2}s` }} />)}</span>}
                  </div>
                  {m.src && <div className="mt-1 px-1 text-[11px] text-faint">{m.src}</div>}
                </div>
              ))}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {sugg.map((q) => <button key={q} onClick={() => ask(q)} className="chip shrink-0 border-black/10 bg-white text-[13px] hover:border-violet/40">{q}</button>)}
            </div>
            <div className="flex items-center gap-2 border-t border-black/[0.06] p-3 pb-[calc(12px+var(--safe-bottom))] lg:pb-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message Biongevity AI"
                aria-label="Message Biongevity AI" className="h-11 flex-1 rounded-full border border-black/10 bg-canvas px-4 text-[15px] outline-none focus:border-violet focus:bg-white" />
              <button onClick={send} aria-label="Send" disabled={busy} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white disabled:opacity-40"><Icon name="arrow-up" size={18} /></button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
