"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { waLink } from "@/content/contact";
import { isUaePath, localeFromPath, t, type Locale } from "@/i18n";
import { aiEnabled } from "@/lib/ai/config";
import { askAI, sessionId, type ChatTurn } from "@/lib/ai/client";
import type { KnowledgeDoc } from "@/lib/ai/knowledge";
import { grounding, related, type KnowledgeConcern } from "@/lib/ai/search";
import { systemPrompt } from "@/lib/ai/prompt";
import { sendHandoff } from "@/lib/ai/handoff";
import { cn } from "@/lib/utils";
import { AiMark } from "./AiMark";
import { ASK_EVENT, type AskDetail } from "./events";

interface Msg { id: number; role: "user" | "ai" | "site"; text: string; links?: KnowledgeDoc[]; done?: boolean; error?: boolean }

type Kb = { docs: KnowledgeDoc[]; concerns: KnowledgeConcern[] };
const kbCache: Partial<Record<Locale, Promise<Kb>>> = {};
const loadKb = (l: Locale) => (kbCache[l] ??= fetch(`/ai/knowledge-${l}.json`).then((r) => r.json() as Promise<Kb>).catch(() => ({ docs: [], concerns: [] })));

/**
 * Biongevity AI (Dubai pages): launcher, chat panel and highlight-to-ask.
 * With the AI configured, answers stream from the AI endpoint. Without it, or when it fails, the panel says so
 * plainly and shows matching pages from our own site plus WhatsApp. Nothing on this side pretends to be the AI.
 */
export function AiDock() {
  const path = usePathname() ?? "/";
  if (!isUaePath(path)) return null;
  return <Dock path={path} l={localeFromPath(path)} />;
}

function Dock({ path, l }: { path: string; l: Locale }) {
  const x = t(l);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [chip, setChip] = useState<{ text: string; section?: string; top: number; left: number } | null>(null);
  const abort = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(1);
  const history = useRef<ChatTurn[]>([]);

  const pageItem = () => document.querySelector<HTMLElement>("[data-page-track]")?.dataset.pageTrack ?? document.querySelector<HTMLElement>("main [data-item]")?.dataset.item;
  const handoff = useCallback((reason: "book" | "whatsapp" | "close") => {
    sendHandoff({ sessionId: sessionId(), locale: l, page: location.pathname, reason, item: pageItem(), messages: history.current });
  }, [l]);

  // A new page → a fresh context (the conversation stays until the visitor starts a new chat).
  useEffect(() => { setChip(null); }, [path]);

  const ask = useCallback(async (q: string, extra?: { selection?: string; section?: string }) => {
    const question = q.trim();
    if (!question || busy) return;
    setOpen(true);
    setInput("");
    const uid = idRef.current++, aid = idRef.current++;
    setMsgs((m) => [...m, { id: uid, role: "user", text: extra?.selection ? `“${extra.selection.slice(0, 160)}${extra.selection.length > 160 ? "…" : ""}”` : question }]);
    const { docs, concerns } = await loadKb(l);
    const query = `${question} ${extra?.selection ?? ""}`;
    const g = grounding(query, docs, path);
    const links = related(query, docs, concerns, 3);
    const fallback = (error: boolean) => setMsgs((m) => [...m.filter((y) => y.id !== aid), { id: aid, role: "site", text: error ? x.aiError : x.aiOffline, links: links.length ? links : g.docs.slice(0, 3), done: true, error }]);
    if (!aiEnabled) { fallback(false); return; }

    setBusy(true);
    setMsgs((m) => [...m, { id: aid, role: "ai", text: "" }]);
    abort.current = new AbortController();
    try {
      const reply = await askAI({
        system: systemPrompt({ locale: l, page: `${document.title} (${location.pathname})`, section: extra?.section, selection: extra?.selection, grounding: g.text }),
        history: history.current, message: question, locale: l, page: location.pathname, sessionId: sessionId(),
      }, (text) => setMsgs((m) => m.map((y) => (y.id === aid ? { ...y, text } : y))), abort.current.signal);
      history.current = [...history.current, { role: "user" as const, content: question }, { role: "assistant" as const, content: reply }].slice(-12);
      setMsgs((m) => m.map((y) => (y.id === aid ? { ...y, text: reply, links: links.length ? links : g.docs.slice(0, 3), done: true } : y)));
    } catch (e) {
      if ((e as Error).name !== "AbortError") fallback(true);
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }, [busy, l, path, x]);

  // Open requests from anywhere (hero bar, page buttons, the selection chip).
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<AskDetail>).detail ?? {};
      setOpen(true);
      if (d.selection) ask(x.aiExplainPrompt(d.selection), { selection: d.selection, section: d.section });
      else if (d.q) ask(d.q, { section: d.section });
      else setTimeout(() => inputRef.current?.focus(), 60);
    };
    window.addEventListener(ASK_EVENT, on);
    return () => window.removeEventListener(ASK_EVENT, on);
  }, [ask, x]);

  // Highlight-to-ask: select text on the page → a small "Ask AI about this" chip appears above it.
  useEffect(() => {
    let tm = 0;
    const check = () => {
      clearTimeout(tm);
      tm = window.setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().replace(/\s+/g, " ").trim() ?? "";
        if (!sel || sel.rangeCount === 0 || text.length < 3 || text.length > 600) { setChip(null); return; }
        const node = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
        if (!node?.closest("main") || node.closest("input, textarea, [data-no-ask]")) { setChip(null); return; }
        const r = sel.getRangeAt(0).getBoundingClientRect();
        if (!r.width && !r.height) { setChip(null); return; }
        const section = node.closest<HTMLElement>("[data-ai]")?.dataset.ai;
        setChip({ text, section, top: Math.max(8, r.top - 50), left: Math.min(Math.max(12, r.left + r.width / 2), innerWidth - 12) });
      }, 180);
    };
    const hide = () => setChip(null);
    document.addEventListener("selectionchange", check);
    window.addEventListener("scroll", hide, { passive: true });
    return () => { document.removeEventListener("selectionchange", check); window.removeEventListener("scroll", hide); clearTimeout(tm); };
  }, []);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [msgs]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    setTimeout(() => inputRef.current?.focus(), 80);
    return () => document.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => { setOpen(false); if (history.current.length) handoff("close"); };
  const reset = () => { abort.current?.abort(); if (history.current.length) handoff("close"); history.current = []; setMsgs([]); setBusy(false); };
  const item = typeof document !== "undefined" ? pageItem() : undefined;

  return (
    <aside aria-label={x.aiName}>
      {/* Selection chip */}
      {chip && !open && (
        <button type="button" data-no-ask onMouseDown={(e) => e.preventDefault()} onClick={() => { const c = chip; setChip(null); window.getSelection()?.removeAllRanges(); ask(x.aiExplainPrompt(c.text), { selection: c.text, section: c.section }); }}
          className="aichip6" style={{ top: chip.top, left: chip.left }}>
          <AiMark size={16} />{x.aiExplain}
        </button>
      )}

      {/* Launcher */}
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="ailaunch6" aria-label={x.aiAsk} data-ai="AI launcher">
          <span className="ailaunch6-ring" aria-hidden />
          <AiMark size={24} />
          <span className="ailaunch6-label">{x.aiName}</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="aipanel6-wrap" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <section role="dialog" aria-modal="true" aria-label={x.aiName} className="aipanel6" data-ai="AI assistant" data-no-ask dir={l === "ar" ? "rtl" : "ltr"} lang={l}>
            <div className="flex items-center gap-3 border-b border-ink/[0.07] px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[rgb(var(--c-feature))] text-[rgb(var(--c-gold))]"><AiMark size={22} /></span>
              <div className="min-w-0 flex-1">
                <div className="whitespace-nowrap text-[16px] font-semibold leading-tight">{x.aiName}</div>
                <div className="mt-0.5 text-[12px] font-semibold uppercase tracking-[.08em] text-gold-deep">{x.aiPoweredSoon}</div>
              </div>
              {msgs.length > 0 && <button type="button" onClick={reset} aria-label={x.aiNew} title={x.aiNew} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"><Icon name="reset" size={17} /></button>}
              <button type="button" onClick={close} aria-label={x.aiClose} title={x.aiClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"><Icon name="x" size={18} /></button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-5" aria-live="polite">
              {msgs.length === 0 ? (
                <div>
                  <p className="text-[15px] leading-relaxed text-muted">{x.aiIntro}</p>
                  <div className="mt-5 grid gap-2">
                    {x.aiSuggestions.map((s) => (
                      <button key={s} type="button" onClick={() => ask(s)} className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] bg-white px-4 py-3 text-start text-[14.5px] font-medium transition hover:border-ink/20">
                        <AiMark size={15} className="shrink-0 text-gold-deep" />{s}
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 text-[13px] text-faint">{x.aiHighlightTip}</p>
                </div>
              ) : (
                <ol className="grid gap-4">
                  {msgs.map((m) => (
                    <li key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      {m.role === "user" ? (
                        <div className="max-w-[85%] rounded-[20px] rounded-ee-md bg-[rgb(var(--c-feature))] px-4 py-2.5 text-[15px] leading-relaxed text-white">{m.text}</div>
                      ) : (
                        <div className="w-full max-w-[94%]">
                          <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[.1em] text-faint">
                            {m.role === "ai" ? <><AiMark size={12} />{x.aiName}</> : <><Icon name="search" size={12} />{x.aiNotAi}</>}
                          </div>
                          <div className={cn("rounded-[20px] rounded-es-md px-4 py-3 text-[15px] leading-relaxed", m.role === "ai" ? "bg-white shadow-[0_1px_0_rgb(var(--c-ink)/.05)]" : "border border-dashed border-ink/15 bg-[rgb(var(--c-canvas))]")}>
                            {m.role === "ai" && !m.text ? <span className="inline-flex items-center gap-2 text-muted"><span className="dots6"><i /><i /><i /></span>{x.aiThinking}</span> : <Rich text={m.text} />}
                          </div>
                          {m.done && (
                            <div className="mt-3 grid gap-2">
                              {m.links && m.links.length > 0 && (
                                <div className="grid gap-1.5">
                                  <div className="text-[12px] font-semibold text-faint">{x.aiRelated}</div>
                                  {m.links.map((d) => (
                                    <Link key={d.id} href={d.url} onClick={() => setOpen(false)} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5 text-[14px] font-medium hover:bg-[rgb(var(--c-canvas))]">
                                      <span className="truncate">{d.title}</span><Icon name="arrow-right" size={14} className="shrink-0 text-faint flip-rtl" />
                                    </Link>
                                  ))}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2 pt-1" data-ai-cta>
                                <a href={waLink(item ? x.wa.book(item) : x.wa.general)} target="_blank" rel="noopener" data-book data-item={item ?? "AI assistant"} onClick={() => handoff("book")} className="btn6 btn6-primary btn6-sm"><Icon name="calendar" size={15} />{x.bookNow}</a>
                                <a href={waLink(x.wa.question)} target="_blank" rel="noopener" data-item={item ?? "AI assistant"} onClick={() => handoff("whatsapp")} className="btn6 btn6-ghost btn6-sm"><Icon name="whatsapp" size={16} weight="fill" className="text-[rgb(var(--c-wa-deep))]" />{x.whatsappUs}</a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="border-t border-ink/[0.07] p-3">
              <div className="flex items-end gap-2 rounded-[22px] border border-ink/10 bg-white p-1.5 ps-4 focus-within:border-ink/30">
                <label htmlFor="ai6-in" className="sr-only">{x.aiAsk}</label>
                <textarea id="ai6-in" ref={inputRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} maxLength={800}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); } }}
                  placeholder={x.aiPlaceholder} className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-faint" />
                {busy
                  ? <button type="button" onClick={() => abort.current?.abort()} aria-label={x.aiStop} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/10"><Icon name="stop" size={18} /></button>
                  : <button type="submit" disabled={!input.trim()} aria-label={x.aiSend} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[rgb(var(--c-feature))] text-white disabled:opacity-40"><Icon name="send" size={16} className="flip-rtl" /></button>}
              </div>
              <p className="mt-2 px-2 text-center text-[11.5px] text-faint">{x.aiNote}</p>
            </form>
          </section>
        </div>
      )}
    </aside>
  );
}

/** Minimal, safe formatting for AI text: paragraphs, "- " bullets, **bold** and [n] citations. No HTML injection. */
function Rich({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  const inline = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>));
  return (
    <div className="grid gap-2.5">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((ln) => /^\s*([-*•]|\d+\.)\s+/.test(ln))) {
          return <ul key={i} className="grid gap-1 ps-4">{lines.map((ln, j) => <li key={j} className="list-disc">{inline(ln.replace(/^\s*([-*•]|\d+\.)\s+/, ""))}</li>)}</ul>;
        }
        return <p key={i}>{lines.map((ln, j) => <span key={j}>{j > 0 && <br />}{inline(ln.replace(/^#+\s*/, ""))}</span>)}</p>;
      })}
    </div>
  );
}
