"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { askXevyo, sessionId, xevyoEnabled, type XevyoTurn } from "@/lib/xevyo";

export interface Msg { role: "user" | "ai" | "notice"; text: string; sources?: { title: string; url: string }[] }

interface AIState {
  open: boolean; busy: boolean; msgs: Msg[]; context: string; connected: boolean;
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  ask: (q: string) => void;
  reset: () => void;
}

const Ctx = createContext<AIState | null>(null);

/** Chat state for Xevyo. Every answer comes from Xevyo — nothing is generated locally. */
export function AIProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const context = path === "/" ? "home" : path.split("/").filter(Boolean)[0] ?? "home";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const busyRef = useRef(false);
  const abort = useRef<AbortController | null>(null);

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
      const r = await askXevyo({ message: q, history, context: { page: context }, sessionId: sessionId() },
        (partial) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "ai", text: partial }; return c; }), abort.current.signal);
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "ai", text: r.reply, sources: r.sources }; return c; });
    } catch {
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "notice", text: "Xevyo is unavailable right now. Please try again shortly, or contact the care team." }; return c; });
    } finally { busyRef.current = false; setBusy(false); }
  }, [context, msgs]);

  const reset = useCallback(() => { abort.current?.abort(); setMsgs([]); busyRef.current = false; setBusy(false); }, []);

  const value = useMemo(() => ({ open, busy, msgs, context, connected: xevyoEnabled, setOpen, ask, reset }), [open, busy, msgs, context, ask, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAI must be used inside <AIProvider>");
  return c;
}
