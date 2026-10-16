"use client";
import { useCallback, useRef, useState } from "react";
import { askXevyo, sessionId, xevyoEnabled, XevyoError } from "@/lib/xevyo";
import { useAI } from "@/components/ai/AIProvider";

/**
 * One-off Biongevity SI request rendered inside a tool (not the chat panel). Streams into `text`.
 * Only runs when `run()` is called from a click — never on page load. Nothing is stored.
 */
export function useXevyoTask(page: string) {
  const { language } = useAI();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ctrl = useRef<AbortController | null>(null);

  const run = useCallback(async (message: string, grounding?: string) => {
    ctrl.current?.abort();
    setText(""); setError("");
    if (!xevyoEnabled) { setError("Biongevity SI isn't connected in this build yet. Your on-device results above still work."); return; }
    setBusy(true);
    ctrl.current = new AbortController();
    try {
      const r = await askXevyo({ message, history: [], context: { page }, sessionId: sessionId(), language, grounding }, setText, ctrl.current.signal);
      setText(r.reply);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
      setError(`Xevyo is unavailable right now. Please try again shortly.${local && e instanceof XevyoError ? ` [Setup check] ${e.reason}` : ""}`);
    } finally { setBusy(false); }
  }, [page, language]);

  const clear = useCallback(() => { ctrl.current?.abort(); setText(""); setError(""); setBusy(false); }, []);
  return { text, busy, error, run, clear };
}
