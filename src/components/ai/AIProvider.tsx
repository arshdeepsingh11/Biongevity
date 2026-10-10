"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { buildPrompt, liveComplete, preparedAnswer } from "./knowledge";

export interface Msg { role: "user" | "ai"; text: string; src?: string }

interface AIState {
  open: boolean; busy: boolean; msgs: Msg[]; context: string; section: string;
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  ask: (q: string) => void;
  explain: (prompt: string, fallback: string) => Promise<{ text: string; live: boolean }>;
  setSection: (s: string) => void;
}

const Ctx = createContext<AIState | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const context = path === "/" ? "home" : path.split("/").filter(Boolean)[0] ?? "home";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [section, setSection] = useState("Overview");
  const busyRef = useRef(false);

  // ⌘K / Ctrl+K opens the assistant; Esc closes it.
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  const ask = useCallback(async (raw: string) => {
    const q = raw.trim();
    if (!q || busyRef.current) return;
    busyRef.current = true; setBusy(true); setOpen(true);
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: "" }]);
    const live = await liveComplete(buildPrompt(q, context));
    const text = live ?? preparedAnswer(q);
    const src = live ? "Live AI response · educational" : "Prepared answer · educational";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    const step = () => {
      i = reduced ? text.length : Math.min(text.length, i + 4);
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "ai", text: text.slice(0, i), src }; return c; });
      if (i < text.length) setTimeout(step, 14); else { busyRef.current = false; setBusy(false); }
    };
    step();
  }, [context]);

  const explain = useCallback(async (prompt: string, fallback: string) => {
    const live = await liveComplete(prompt);
    return { text: live ?? fallback, live: Boolean(live) };
  }, []);

  const value = useMemo(() => ({ open, busy, msgs, context, section, setOpen, ask, explain, setSection }), [open, busy, msgs, context, section, ask, explain]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAI must be used inside <AIProvider>");
  return c;
}
