"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { t, type Locale } from "@/i18n";
import { AiMark } from "./AiMark";
import { openAssistant } from "./events";

/** Hero prompt bar: type a question or tap a suggestion → the assistant opens and answers. */
export function AskBar({ l = "en" }: { l?: Locale }) {
  const x = t(l);
  const [q, setQ] = useState("");
  const go = (text: string) => { if (text.trim()) { openAssistant({ q: text.trim(), source: "hero" }); setQ(""); } };
  return (
    <div data-ai="Ask AI">
      <form onSubmit={(e) => { e.preventDefault(); go(q); }} className="ask6">
        <span className="ask6-mark"><AiMark size={20} /></span>
        <label className="sr-only" htmlFor="ask6-in">{x.aiAsk}</label>
        <input id="ask6-in" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={x.aiPlaceholder} autoComplete="off" enterKeyHint="send" className="ask6-in" />
        <button type="submit" aria-label={x.aiSend} className="ask6-go"><Icon name="send" size={17} className="flip-rtl" /></button>
      </form>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {x.aiSuggestions.slice(0, 3).map((s) => (
          <button key={s} type="button" onClick={() => go(s)} className="pill6 shrink-0 hover:border-ink/20"><AiMark size={13} className="text-gold-deep" />{s}</button>
        ))}
      </div>
    </div>
  );
}
