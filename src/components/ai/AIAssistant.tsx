"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { XevyoOrb } from "./XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { BorderBeam } from "@/components/fx/BorderBeam";
import { useVoice } from "@/hooks/useVoice";
import { LANGUAGES, UI, langById, type SILanguage } from "@/lib/languages";
import { FAMILY, WHATS_NEW } from "@/data/discover";
import { LAB_TESTS } from "@/data/labs";
import { formatMoney } from "@/lib/utils";

/** Render [1] [2] [3] citations as small superscript chips. */
function withCites(text: string) {
  return text.split(/(\[\d\])/g).map((p, i) => (/^\[\d\]$/.test(p) ? <sup key={i} className="mx-0.5 rounded bg-ai-soft px-1 text-[10px] font-semibold text-ai">{p.slice(1, -1)}</sup> : p));
}

const FEATURED = ["Whole Genome Sequencing 30X", "Pharmacogenomics", "Biological Age", "Microbiome", "CRP"]
  .map((k) => LAB_TESTS.find((t) => t.title.toLowerCase().includes(k.toLowerCase()))).filter(Boolean) as typeof LAB_TESTS;

/** Biongevity SI — orb launcher bottom-right; panel opens above it. Reads, writes and translates EN · FR · AR · FA. */
export function AIAssistant() {
  const { open, setOpen, msgs, busy, ask, summarise, translate, context, section, prompts, connected, reset, language, setLanguage } = useAI();
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"discover" | "new" | "tests">("discover");
  const ui = UI[language], lang = langById(language);
  const voice = useVoice((t, final) => { if (final) { ask(t); setInput(""); } else setInput(t); }, lang.speech);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => { list.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs]);
  const send = () => { ask(input); setInput(""); };
  const go = () => setOpen(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside role="dialog" aria-label="Biongevity SI"
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="si-panel fixed inset-x-2 bottom-[calc(150px+var(--safe-bottom))] top-[calc(70px+var(--safe-top))] z-[95] flex flex-col overflow-hidden rounded-[26px] bg-white shadow-lift ring-1 ring-ai/20 backdrop-blur-2xl
              sm:inset-x-auto sm:right-4 sm:top-auto sm:h-[min(680px,calc(100vh-190px))] sm:w-[430px] lg:bottom-24">
            <BorderBeam colorFrom="rgb(var(--c-ai-hi))" colorTo="rgb(var(--c-ai-2))" />
            <header className="relative flex items-center gap-2.5 overflow-hidden border-b border-ink/[0.06] px-4 py-3.5">
              <div aria-hidden className="ai-glow -left-10 -top-16 h-32 w-48 !opacity-[0.18]" />
              <XevyoOrb size={40} live halo={busy} />
              <div className="relative min-w-0 flex-1">
                <div className="text-[15px] font-semibold leading-tight">Xevyo <span className="font-normal text-muted">AI</span></div>
                <div className="flex items-center gap-1.5 truncate text-[12px] text-muted">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${connected ? "animate-pulseDot bg-teal" : "bg-gold"}`} /><span className="truncate">{connected ? (busy ? "Thinking…" : "Online · cites our pages") : "Not connected"}</span>
                </div>
              </div>
              <div role="group" aria-label="Reply language" className="relative flex rounded-full bg-canvas p-0.5 text-[11.5px] font-semibold ring-1 ring-ink/[0.06]">
                {(["en", "ja"] as const).map((l) => (
                  <button key={l} onClick={() => setLanguage(l)} aria-pressed={language === l} className={`rounded-full px-2 py-1 ${language === l ? "bg-white text-ai shadow-card" : "text-muted"}`}>{l === "en" ? "EN" : <><span className="sm:hidden">JA</span><span className="hidden sm:inline">日本語</span></>}</button>
                ))}
              </div>
              {msgs.length > 0 && <button onClick={reset} className="relative rounded-full bg-canvas px-2.5 py-1 text-[12px] font-semibold text-muted hover:text-ai" aria-label="New chat">New</button>}
              <button onClick={() => setOpen(false)} aria-label="Close" className="relative grid h-8 w-8 place-items-center rounded-full bg-canvas hover:bg-ink/[0.06]"><Icon name="x" size={15} /></button>
            </header>
            <div className="flex items-center gap-1.5 border-b border-ink/[0.05] bg-ai-soft/60 px-4 py-1.5 text-[11px] text-muted">
              <Icon name="eye" size={12} className="shrink-0 text-ai" /><span className="min-w-0 flex-1 truncate">Xevyo reads: <span className="font-semibold capitalize text-ink/80">{context.replace(/-/g, " ")}</span>{section && <> · {section}</>}</span>
              <button onClick={summarise} disabled={busy} className="shrink-0 font-semibold text-ai hover:underline disabled:opacity-50">✦ Summarise page</button>
            </div>
            <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
              {!msgs.length && (
                <div className="relative overflow-hidden rounded-2xl bg-canvas p-4">
                  <div className="flex items-center gap-2.5"><XevyoOrb size={26} /><div className="text-[15px] font-semibold">{language === "ja" ? "こんにちは、Xevyoです。" : "Hi, I'm Xevyo."}</div></div>
                  <div className="mt-2 text-[13px] leading-relaxed text-muted">Biongevity&apos;s AI for tests, programs, results and your next step. I explain and guide — your clinician decides. Answers are grounded in our pages and show their sources.</div>
                  {!connected && <div className="mt-3 rounded-xl bg-gold-soft/60 px-3 py-2 text-[12px] text-gold-deep">Xevyo isn&apos;t connected in this build yet. Set <code className="font-semibold">NEXT_PUBLIC_XEVYO_URL</code> to go live.</div>}
                  <div className="mt-3 grid gap-1.5">
                    <button onClick={summarise} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-left text-[13px] font-medium ring-1 ring-ink/[0.06] hover:text-ai hover:ring-ai/30"><Icon name="file" size={15} className="text-ai" />Summarise this page in 30 seconds</button>
                    <Link href="/tools/" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-left text-[13px] font-medium ring-1 ring-ink/[0.06] hover:text-ai hover:ring-ai/30"><Icon name="flask" size={15} className="text-ai" />Explain my lab results</Link>
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  {m.role === "ai" && <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-ai"><XevyoOrb size={14} />Xevyo</div>}
                  <div className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${m.role === "user" ? "bg-accent text-on-accent" : m.role === "notice" ? "bg-gold-soft/60 text-gold-deep" : "bg-canvas text-ink"}`}>
                    {m.text ? (m.role === "ai" ? withCites(m.text) : m.text) : <span className="inline-flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ai" style={{ animationDelay: `${k * 0.2}s` }} />)}</span>}
                  </div>
                  {m.role === "ai" && m.sources?.length ? (
                    <div className="mt-1.5 flex max-w-[90%] flex-wrap items-center gap-1 px-1">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-faint">From our pages</span>
                      {m.sources.map((s, k) => <Link key={s.url + k} href={s.url} onClick={() => setOpen(false)} className="rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-medium text-ai ring-1 ring-ai/15 hover:ring-ai/40">{k + 1} · {s.title}</Link>)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {prompts.map((q) => <button key={q} onClick={() => ask(q)} className="chip shrink-0 border-ai/20 bg-ai-soft/50 text-[13px] hover:border-ai/40 hover:text-ai"><span aria-hidden className="text-ai">✦</span>{q}</button>)}
            </div>
            <div className="flex items-center gap-2 border-t border-ink/[0.06] p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={voice.listening ? "Listening…" : language === "ja" ? "Xevyoに質問する" : "Message Xevyo"}
                aria-label="Message Xevyo" className="h-11 min-w-0 flex-1 rounded-full border border-ink/10 bg-canvas px-4 text-[15px] outline-none focus:border-ai focus:bg-white" />
              {voice.supported && (
                <button onClick={voice.toggle} aria-label={voice.listening ? "Stop listening" : "Ask by voice"} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${voice.listening ? "animate-pulse bg-ai text-on-ai" : "bg-canvas text-ai hover:bg-ai-soft"}`}>
                  <Icon name={voice.listening ? "stop" : "mic"} size={18} weight="duotone" />
                </button>
              )}
              <button onClick={send} aria-label="Send" disabled={busy || !input.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ai text-on-ai disabled:opacity-40"><Icon name="arrow-up" size={18} /></button>
            </div>
            <p className="px-4 pb-2.5 text-center text-[10.5px] text-faint">Education, not a diagnosis · nothing you type is stored by this site · <Link href="/ai/" onClick={() => setOpen(false)} className="underline hover:text-ai">How our AI works</Link></p>
          </motion.aside>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close Xevyo AI" : "Ask Xevyo AI"} aria-expanded={open}
        className="fixed bottom-[calc(84px+var(--safe-bottom))] right-3 z-[96] flex items-center gap-2.5 rounded-full bg-white/90 p-1.5 pr-1.5 shadow-lift ring-1 ring-ai/25 backdrop-blur-xl transition-transform hover:-translate-y-0.5 sm:pr-4 xl:bottom-6 xl:right-6">
        <span className="relative grid h-11 w-11 place-items-center">
          {open ? <span className="grid h-11 w-11 place-items-center rounded-full bg-canvas"><Icon name="x" size={18} className="text-ink" /></span> : <XevyoOrb size={44} live halo />}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[14px] font-semibold">Ask Xevyo</span>
          <span className="block text-[11px] text-ai">✦ Biongevity AI</span>
        </span>
      </button>
    </>
  );
}
