"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { BorderBeam } from "@/components/fx/BorderBeam";
import { useVoice } from "@/hooks/useVoice";

/** Xevyo — Biongevity's in-house AI. Launcher bottom-right; panel opens above it. */
export function AIAssistant() {
  const { open, setOpen, msgs, busy, ask, context, section, prompts, connected, reset } = useAI();
  const [input, setInput] = useState("");
  const voice = useVoice((t, final) => { if (final) { ask(t); setInput(""); } else setInput(t); });
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => { list.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs]);
  const send = () => { ask(input); setInput(""); };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside role="dialog" aria-label="Xevyo · Biongevity AI"
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-x-2 bottom-[calc(150px+var(--safe-bottom))] top-[calc(70px+var(--safe-top))] z-[95] flex flex-col overflow-hidden rounded-[26px] bg-white shadow-lift ring-1 ring-ink/[0.08] backdrop-blur-2xl
              sm:inset-x-auto sm:right-4 sm:top-auto sm:h-[min(620px,calc(100vh-200px))] sm:w-[400px] lg:bottom-24">
            <BorderBeam />
            <header className="flex items-center gap-3 border-b border-ink/[0.06] bg-navy px-4 py-3.5 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white"><LogoMark size={24} className="text-ink" /></span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold">Xevyo <span className="font-normal text-white/60">· Biongevity AI</span></div>
                <div className="flex items-center gap-1.5 text-[12px] text-white/70">
                  <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-teal-soft" : "bg-gold"}`} />{connected ? (busy ? "Thinking…" : "Online") : "Not connected yet"}
                </div>
              </div>
              {msgs.length > 0 && <button onClick={reset} className="rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-ink/70 hover:text-accent" aria-label="New chat">New</button>}
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Icon name="x" size={15} /></button>
            </header>
            <div className="flex items-center gap-1.5 border-b border-ink/[0.05] bg-canvas/70 px-4 py-1.5 text-[11px] text-muted">
              <Icon name="crosshair" size={12} className="shrink-0 text-accent" /><span className="truncate">Reading: <span className="font-semibold capitalize text-ink/80">{context.replace(/-/g, " ")}</span>{section && <> · {section}</>}</span>
            </div>
            <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
              {!msgs.length && (
                <div className="rounded-2xl bg-canvas p-4">
                  <div className="text-[15px] font-semibold">Hi, I&apos;m Xevyo.</div>
                  <div className="mt-1.5 text-[13px] leading-relaxed text-muted">Biongevity&apos;s in-house AI for services, tests, packages and your next step. I explain and guide — I don&apos;t diagnose or prescribe.</div>
                  {!connected && <div className="mt-3 rounded-xl bg-gold-soft/50 px-3 py-2 text-[12px] text-gold-deep">Xevyo isn&apos;t connected in this build yet. Set <code className="font-semibold">NEXT_PUBLIC_XEVYO_URL</code> to go live.</div>}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${m.role === "user" ? "bg-accent text-white" : m.role === "notice" ? "bg-gold-soft/50 text-gold-deep" : "bg-canvas text-ink"}`}>
                    {m.text || <span className="inline-flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-accent" style={{ animationDelay: `${k * 0.2}s` }} />)}</span>}
                  </div>
                  {m.sources?.length ? <div className="mt-1 flex flex-wrap gap-1 px-1">{m.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener" className="text-[11px] text-accent underline">{s.title}</a>)}</div> : null}
                </div>
              ))}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {prompts.map((q) => <button key={q} onClick={() => ask(q)} className="chip shrink-0 border-ink/10 bg-white text-[13px] hover:border-accent/40 hover:text-accent">{q}</button>)}
            </div>
            <div className="flex items-center gap-2 border-t border-ink/[0.06] p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={voice.listening ? "Listening…" : "Message Xevyo"}
                aria-label="Message Xevyo" className="h-11 flex-1 rounded-full border border-ink/10 bg-canvas px-4 text-[15px] outline-none focus:border-accent focus:bg-white" />
              {voice.supported && (
                <button onClick={voice.toggle} aria-label={voice.listening ? "Stop listening" : "Ask by voice"} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${voice.listening ? "animate-pulse bg-accent text-white" : "bg-canvas text-accent hover:bg-accent-light"}`}>
                  <Icon name={voice.listening ? "stop" : "mic"} size={18} weight="duotone" />
                </button>
              )}
              <button onClick={send} aria-label="Send" disabled={busy || !input.trim()} className="grid h-11 w-11 place-items-center rounded-full bg-accent text-white disabled:opacity-40"><Icon name="arrow-up" size={18} /></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close Biongevity AI" : "Open Biongevity AI"} aria-expanded={open}
        className="fixed bottom-[calc(84px+var(--safe-bottom))] right-3 z-[96] flex items-center gap-2.5 rounded-full bg-white/90 p-1.5 pr-1.5 shadow-lift ring-1 ring-ink/[0.08] backdrop-blur-xl transition-transform hover:-translate-y-0.5 sm:pr-4 xl:bottom-6 xl:right-6">
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-canvas ring-1 ring-accent/20">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/20 [animation-duration:2.6s]" />
          {open ? <Icon name="x" size={18} className="text-ink" /> : <LogoMark size={24} className="text-ink" />}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[14px] font-semibold">Biongevity</span>
          <span className="block text-[11px] text-muted">Ask Xevyo AI</span>
        </span>
      </button>
    </>
  );
}
