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
                <div className="text-[15px] font-semibold leading-tight">Biongevity <span className="text-ai">SI</span></div>
                <div className="flex items-center gap-1.5 truncate text-[12px] text-muted">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${connected ? "animate-pulseDot bg-teal" : "bg-gold"}`} /><span className="truncate">{connected ? (busy ? ui.thinking : ui.online) : "Not connected"}</span>
                </div>
              </div>
              <label className="relative flex items-center">
                <span className="sr-only">Language</span>
                <Icon name="globe" size={14} className="pointer-events-none absolute left-2.5 text-ai" />
                <select value={language} onChange={(e) => setLanguage(e.target.value as SILanguage)} aria-label="Language"
                  className="h-8 appearance-none rounded-full bg-canvas pl-7 pr-6 text-[12px] font-semibold text-ink outline-none ring-1 ring-ink/[0.06] focus:ring-ai/40">
                  {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.native}</option>)}
                </select>
                <Icon name="chevron-down" size={12} className="pointer-events-none absolute right-2 text-faint" />
              </label>
              <button onClick={() => { reset(); setTab("discover"); }} className="relative rounded-full bg-canvas px-2.5 py-1.5 text-[12px] font-semibold text-muted hover:text-ai" aria-label="New chat">New</button>
              <button onClick={go} aria-label="Close" className="relative grid h-8 w-8 place-items-center rounded-full bg-canvas hover:bg-ink/[0.06]"><Icon name="x" size={15} /></button>
            </header>
            <div className="flex items-center gap-1.5 border-b border-ink/[0.05] bg-ai-soft/60 px-4 py-1.5 text-[11px] text-muted">
              <Icon name="eye" size={12} className="shrink-0 text-ai" /><span className="min-w-0 flex-1 truncate">SI reads: <span className="font-semibold capitalize text-ink/80">{context.replace(/-/g, " ")}</span>{section && <> · {section}</>}</span>
              <button onClick={summarise} disabled={busy} className="shrink-0 font-semibold text-ai hover:underline disabled:opacity-50">✦ Summarise page</button>
            </div>

            <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
              {!msgs.length && (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-2xl bg-canvas p-4" dir={lang.dir}>
                    <div className="flex items-center gap-2.5"><XevyoOrb size={26} live /><div className="text-[15px] font-semibold">{ui.hi}</div></div>
                    <div className="mt-2 text-[13px] leading-relaxed text-muted">{ui.intro}</div>
                    {!connected && <div className="mt-3 rounded-xl bg-gold-soft/60 px-3 py-2 text-[12px] text-gold-deep" dir="ltr">Biongevity SI isn&apos;t connected in this build yet. Set <code className="font-semibold">NEXT_PUBLIC_XEVYO_URL</code> (see docs/XEVYO_PROXY.md).</div>}
                  </div>

                  <div role="tablist" aria-label="Explore" className="grid grid-cols-3 gap-1 rounded-full bg-canvas p-1 text-[12.5px] font-semibold">
                    {([["discover", "BioAro family"], ["new", "What's new"], ["tests", "Top tests"]] as const).map(([id, l]) => (
                      <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`rounded-full py-1.5 transition ${tab === id ? "bg-white text-ai shadow-card" : "text-muted hover:text-ink"}`}>{l}</button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                      {tab === "discover" && (
                        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
                          {FAMILY.map((f) => (
                            <article key={f.id} className="relative w-[80%] shrink-0 snap-center overflow-hidden rounded-[22px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
                              <div aria-hidden className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-ai-soft blur-2xl" />
                              <div className="relative flex items-start justify-between gap-2">
                                <span className="icon-tile h-11 w-11"><Icon name={f.icon} size={21} /></span>
                                <div className="text-right"><div className="text-[20px] font-semibold leading-none tracking-tight text-ai">{f.stat.v}</div><div className="mt-0.5 text-[10.5px] text-faint">{f.stat.l}</div></div>
                              </div>
                              <div className="relative mt-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{f.kicker}</div>
                              <div className="relative text-[17px] font-semibold">{f.name}</div>
                              <p className="relative mt-1 text-[12.5px] leading-snug text-muted">{f.line}</p>
                              <ul className="relative mt-2.5 space-y-1">
                                {f.points.map((p) => <li key={p} className="flex gap-1.5 text-[12px] leading-snug"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-ai" />{p}</li>)}
                              </ul>
                              <div className="relative mt-3 flex gap-2">
                                <button onClick={() => ask(f.ask)} className="btn-ai h-8 flex-1 px-3 text-[12px]"><XevyoOrb size={16} />Ask SI</button>
                                {f.external
                                  ? <a href={f.href} target="_blank" rel="noopener noreferrer" className="btn-light h-8 px-3 text-[12px]">Visit<Icon name="arrow-up-right" size={12} /></a>
                                  : <Link href={f.href} onClick={go} className="btn-light h-8 px-3 text-[12px]">Open<Icon name="arrow-right" size={12} /></Link>}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                      {tab === "new" && (
                        <div className="grid gap-2">
                          {WHATS_NEW.map((n) => (
                            <Link key={n.t} href={n.href} onClick={go} className="group flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/[0.06] transition hover:ring-ai/30">
                              <span className="icon-tile h-9 w-9"><Icon name={n.icon} size={17} /></span>
                              <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 text-[13.5px] font-semibold">{n.t}<span className="rounded-full bg-ai-soft px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wider text-ai">{n.tag}</span></span><span className="block text-[12px] leading-snug text-muted">{n.d}</span></span>
                              <Icon name="arrow-right" size={14} className="mt-1 text-faint transition group-hover:translate-x-0.5 group-hover:text-ai" />
                            </Link>
                          ))}
                        </div>
                      )}
                      {tab === "tests" && (
                        <div className="grid gap-2">
                          {FEATURED.map((t) => (
                            <div key={t.handle} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/[0.06]">
                              <span className="icon-tile h-9 w-9"><Icon name={t.icon} size={17} /></span>
                              <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-semibold">{t.title}</span><span className="block truncate text-[11.5px] text-muted">{t.bestFor ?? t.summary}</span></span>
                              <span className="text-right"><span className="block text-[13px] font-semibold">{formatMoney(t.price)}</span>
                                <button onClick={() => ask(`Explain the ${t.title} in plain words: what it measures, who it is for and what I would do with the result.`)} className="text-[11px] font-semibold text-ai">Ask SI</button></span>
                            </div>
                          ))}
                          <Link href="/precision-health/bioaro-labs/#catalog" onClick={go} className="btn-light h-9 text-[12.5px]">All {LAB_TESTS.length} BioAro tests<Icon name="arrow-right" size={13} /></Link>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  {m.role === "ai" && <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-ai"><XevyoOrb size={14} />Biongevity SI</div>}
                  <div dir="auto" className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${m.role === "user" ? "bg-accent text-on-accent" : m.role === "notice" ? "bg-gold-soft/60 text-gold-deep" : "bg-canvas text-ink"}`}>
                    {m.text ? (m.role === "ai" ? withCites(m.text) : m.text) : <span className="inline-flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ai" style={{ animationDelay: `${k * 0.2}s` }} />)}</span>}
                  </div>
                  {m.role === "ai" && m.text && !(busy && i === msgs.length - 1) && (
                    <div className="mt-1 flex flex-wrap items-center gap-1 px-1">
                      <Icon name="globe" size={11} className="text-faint" /><span className="text-[10.5px] text-faint">{ui.translate}:</span>
                      {LANGUAGES.map((l) => (
                        <button key={l.id} onClick={() => translate(m.text, l.id)} className="rounded-full px-1.5 py-0.5 text-[11px] font-medium text-muted hover:bg-ai-soft hover:text-ai">{l.native}</button>
                      ))}
                    </div>
                  )}
                  {m.role === "ai" && m.sources?.length ? (
                    <div className="mt-1.5 flex max-w-[90%] flex-wrap items-center gap-1 px-1">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-faint">From our pages</span>
                      {m.sources.map((s, k) => <Link key={s.url + k} href={s.url} onClick={go} className="rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-medium text-ai ring-1 ring-ai/15 hover:ring-ai/40">{k + 1} · {s.title}</Link>)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {prompts.map((q) => <button key={q} onClick={() => ask(q)} className="chip shrink-0 border-ai/20 bg-ai-soft/50 text-[13px] hover:border-ai/40 hover:text-ai"><span aria-hidden className="text-ai">✦</span>{q}</button>)}
            </div>
            <div className="flex items-center gap-2 border-t border-ink/[0.06] p-3">
              <input value={input} dir="auto" onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={voice.listening ? ui.listening : ui.placeholder}
                aria-label="Message Biongevity SI" className="h-11 min-w-0 flex-1 rounded-full border border-ink/10 bg-canvas px-4 text-[15px] outline-none focus:border-ai focus:bg-white" />
              {voice.supported && (
                <button onClick={voice.toggle} aria-label={voice.listening ? "Stop listening" : `Ask by voice (${lang.native})`} title={`Speak in ${lang.native}`} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${voice.listening ? "animate-pulse bg-ai text-on-ai" : "bg-canvas text-ai hover:bg-ai-soft"}`}>
                  <Icon name={voice.listening ? "stop" : "mic"} size={18} />
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
