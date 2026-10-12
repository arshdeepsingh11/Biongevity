"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { askXevyo, sessionId, xevyoEnabled, type XevyoTurn } from "@/lib/xevyo";
import { pageLabel, pagePrompts } from "@/lib/aiPrompts";

export interface Msg { role: "user" | "ai" | "notice"; text: string; sources?: { title: string; url: string }[] }

interface AIState {
  open: boolean; busy: boolean; msgs: Msg[]; context: string; connected: boolean;
  /** Heading of the section in view — sent to Xevyo as context. */
  section: string;
  /** Smart questions for the current page + section. */
  prompts: string[];
  /** Command bar (Ctrl/⌘ + X). `seed` pre-fills its search. */
  cmd: { open: boolean; seed: string };
  openCmd: (seed?: string) => void;
  closeCmd: () => void;
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  ask: (q: string) => void;
  reset: () => void;
}

const Ctx = createContext<AIState | null>(null);

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
  const busyRef = useRef(false);
  const abort = useRef<AbortController | null>(null);

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

  const ask = useCallback(async (raw: string) => {
    const q = raw.trim();
    if (!q || busyRef.current) return;
    setOpen(true);
    if (!xevyoEnabled) {
      setMsgs((m) => [...m, { role: "user", text: q }, { role: "notice", text: "Xevyo isn't connected yet. Our care team can answer this — book a consultation or call 403-250-2221." }]);
      return;
    }
    busyRef.current = true; setBusy(true);
    const history: XevyoTurn[] = msgs.filter((m) => m.role !== "notice").map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: "" }]);
    abort.current = new AbortController();
    try {
      const r = await askXevyo({ message: q, history, context: { page: context, ...(section ? { section } : {}) }, sessionId: sessionId() },
        (partial) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "ai", text: partial }; return c; }), abort.current.signal);
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "ai", text: r.reply, sources: r.sources }; return c; });
    } catch {
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "notice", text: "Xevyo is unavailable right now. Please try again shortly, or contact the care team." }; return c; });
    } finally { busyRef.current = false; setBusy(false); }
  }, [context, section, msgs]);

  const reset = useCallback(() => { abort.current?.abort(); setMsgs([]); busyRef.current = false; setBusy(false); }, []);

  const prompts = useMemo(() => pagePrompts(path, section), [path, section]);
  const value = useMemo(() => ({ open, busy, msgs, context, section, prompts, cmd, openCmd, closeCmd, connected: xevyoEnabled, setOpen, ask, reset }),
    [open, busy, msgs, context, section, prompts, cmd, openCmd, closeCmd, ask, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAI must be used inside <AIProvider>");
  return c;
}
