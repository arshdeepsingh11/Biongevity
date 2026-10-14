"use client";
import { XevyoOrb } from "@/components/ai/XevyoOrb";

/** Streams a Xevyo answer inside a tool, with the standard AI label and safety line. */
export function AIOutput({ text, busy, error }: { text: string; busy: boolean; error: string }) {
  if (!text && !busy && !error) return null;
  return (
    <div aria-live="polite" className="mt-4 rounded-2xl bg-ai-soft/70 p-4 ring-1 ring-ai/15">
      <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-ai"><XevyoOrb size={18} live={busy} />✦ Xevyo AI{busy && <span className="font-normal text-muted"> · writing…</span>}</div>
      {error ? <p className="text-[13.5px] text-gold-deep">{error}</p> : <div className="whitespace-pre-wrap text-[14.5px] leading-relaxed">{text || "…"}</div>}
      <p className="mt-3 text-[11px] text-faint">AI-generated education, not a diagnosis. Discuss decisions with your clinician.</p>
    </div>
  );
}
