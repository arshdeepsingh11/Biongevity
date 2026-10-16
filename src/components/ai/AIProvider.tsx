"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { askXevyo, sessionId, xevyoEnabled, XevyoError, type XevyoLanguage, type XevyoTurn } from "@/lib/xevyo";
import { pageLabel, pagePrompts } from "@/lib/aiPrompts";
import { groundingText, retrieve } from "@/lib/retrieve";
import { recordVisit } from "@/lib/interest";
import { isLanguage, langById } from "@/lib/languages";

export interface Source { title: string; url: string }
export interface Msg { role: "user" | "ai" | "notice"; text: string; sources?: Source[] }

/** Options for one question. `label` = what the chat shows as your message; `grounding` = extra context (e.g. page text). */
export interface AskOptions { label?: string; grounding?: string; retrieve?: boolean; cacheKey?: string }

interface AIState {
  open: boolean; busy: boolean; msgs: Msg[]; context: string; connected: boolean;
  /** Heading of the section in view — sent to Biongevity SI as context. */
  section: string;
  /** Smart questions for the current page + section. */
  prompts: string[];
  /** Reply language for Biongevity SI: English, French, Arabic or Persian. */
  language: XevyoLanguage;
  setLanguage: (l: XevyoLanguage) => void;
  /** Command bar (Ctrl/⌘ + X). `seed` pre-fills its search. */
  cmd: { open: boolean; seed: string };
  openCmd: (seed?: string) => void;
  closeCmd: () => void;
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  ask: (q: string, o?: AskOptions) => void;
  /** "Xevyo reads this page": summarise the visible page text (cached for the session). */
  summarise: () => void;
  reset: () => void;
}

const Ctx = createContext<AIState | null>(null);
const LANG_KEY = "biongevity.ai.lang";

/** Visible text of <main> (without buttons and navigation), trimmed for a summary request. */
function pageText() {
  const main = document.querySelector("main");
  if (!main) return "";
  const clone = main.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button,nav,script,style,[aria-hidden=true],input,textarea,select").forEach((n) => n.remove());
  return (clone.innerText || clone.textContent || "").replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, 7000);
}

/** Chat state for Xevyo. Every answer comes from Xevyo — nothing is generated locally. */
export function AIProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const context = pageLabel(path);
  const [section, setSection] = useState("");
  const [cmd, setCmd] = useState({ open: false, seed: "" });
  const openCmd = useCallback((seed = "") => { setCmd({ open: true, seed }); }, []);
  const closeCmd = useCallback(() => setCmd((c) => ({ ...c, open: false })), []);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [language, setLang] = useState<XevyoLanguage>("en");
  const busyRef = useRef(false);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => { try { if (localStorage.getItem(LANG_KEY) === "ja") setLang("ja"); } catch { /* ignore */ } }, []);
  const setLanguage = useCallback((l: XevyoLanguage) => { setLang(l); try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ } }, []);

  useEffect(() => { recordVisit(path); }, [path]);

  // Section in view: last h2 above 40% of the viewport (throttled to one check per frame).
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      let cur = "";
      document.querySelectorAll("main h2").forEach((h) => { if (h.getBoundingClientRect().top < innerHeight * 0.4) cur = (h.textContent ?? "").trim(); });
      setSection(cur.length > 70 ? `${cur.slice(0, 67)}…` : cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read(); addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [path]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      // Ctrl/⌘ + X opens the command bar — never while typing, so Cut still works in fields.
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "x") {
        const t = e.target as HTMLElement | null;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        e.preventDefault();
        const sel = (getSelection()?.toString() ?? "").trim().slice(0, 120);
        setCmd((c) => (c.open ? { ...c, open: false } : { open: true, seed: sel }));
      }
      if (e.key === "Escape") { setOpen(false); setCmd((c) => ({ ...c, open: false })); }
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  const ask = useCallback(async (raw: string, o: AskOptions = {}) => {
    const q = raw.trim();
    if (!q || busyRef.current) return;
    const shown = o.label ?? q;
    setOpen(true);
    // Session cache (page summaries): show the saved answer without a new call.
    if (o.cacheKey) {
      try {
        const hit = sessionStorage.getItem(o.cacheKey);
        if (hit) { const m = JSON.parse(hit) as Msg; setMsgs((x) => [...x, { role: "user", text: shown }, m]); return; }
      } catch { /* ignore */ }
    }
    if (!xevyoEnabled) {
      setMsgs((m) => [...m, { role: "user", text: shown }, { role: "notice", text: "Xevyo isn't connected yet. Our care team can answer this — book a consultation or call 403-250-2221." }]);
      return;
    }
    busyRef.current = true; setBusy(true);
    const history: XevyoTurn[] = msgs.filter((m) => m.role !== "notice").slice(-8).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
    setMsgs((m) => [...m, { role: "user", text: shown }, { role: "ai", text: "" }]);
    abort.current = new AbortController();
    try {
      // Ground the answer in our own pages (on-device BM25 → top 3 passages).
      const passages = o.retrieve === false ? [] : await retrieve(q);
      const sources: Source[] = passages.map((p) => ({ title: p.title, url: p.url }));
      const grounding = [groundingText(passages), o.grounding].filter(Boolean).join("\n\n");
      const r = await askXevyo({ message: q, history, context: { page: context, ...(section ? { section } : {}) }, sessionId: sessionId(), language, grounding },
        (partial) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "ai", text: partial, sources }; return c; }), abort.current.signal);
      const final: Msg = { role: "ai", text: r.reply, sources: r.sources?.length ? r.sources : sources };
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = final; return c; });
      if (o.cacheKey && r.reply) { try { sessionStorage.setItem(o.cacheKey, JSON.stringify(final)); } catch { /* ignore */ } }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      const local = process.env.NODE_ENV !== "production" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
      const dev = local && e instanceof XevyoError ? `\n\n[Setup check] ${e.reason}` : "";
      if (e instanceof XevyoError) console.error("[Xevyo]", e.reason);
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "notice", text: `Xevyo is unavailable right now. Please try again shortly, or contact the care team.${dev}` }; return c; });
    } finally { busyRef.current = false; setBusy(false); }
  }, [context, section, msgs, language]);

  const summarise = useCallback(() => {
    const text = pageText();
    ask(`Summarise this page for me in 4–5 short bullet points, then suggest 3 follow-up questions I could ask. Page: ${context}.`, {
      label: `✦ Summarise this page (${context.replace(/-/g, " ")})`, grounding: `Page text:\n${text}`, retrieve: false, cacheKey: `xevyo.sum.${language}.${path}`,
    });
  }, [ask, context, language, path]);

  const reset = useCallback(() => { abort.current?.abort(); setMsgs([]); busyRef.current = false; setBusy(false); }, []);

  const prompts = useMemo(() => pagePrompts(path, section), [path, section]);
  const value = useMemo(() => ({ open, busy, msgs, context, section, prompts, language, setLanguage, cmd, openCmd, closeCmd, connected: xevyoEnabled, setOpen, ask, summarise, reset }),
    [open, busy, msgs, context, section, prompts, language, setLanguage, cmd, openCmd, closeCmd, ask, summarise, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAI must be used inside <AIProvider>");
  return c;
}
