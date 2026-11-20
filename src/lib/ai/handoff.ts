import { aiConfig } from "./config";
import type { ChatTurn } from "./client";

/**
 * Hand-off to the clinic team: when a visitor taps Book now inside the assistant (or closes a conversation),
 * the transcript is sent to NEXT_PUBLIC_AI_HANDOFF_URL so the AI team can summarise it into the EMR/ELR for
 * the Dubai staff. Nothing is sent when the URL is empty. The receiving server must handle consent, storage and
 * retention under UAE health-data rules (see docs/AI_INTEGRATION.md).
 */
export interface Handoff {
  sessionId: string; locale: string; page: string;
  reason: "book" | "whatsapp" | "close";
  /** The English name of the service the visitor was looking at, if any. */
  item?: string;
  messages: ChatTurn[];
  at: string;
}

export function sendHandoff(h: Omit<Handoff, "at">) {
  if (!aiConfig.handoffUrl || h.messages.length === 0) return;
  const body = JSON.stringify({ ...h, at: new Date().toISOString() } satisfies Handoff);
  try {
    if (navigator.sendBeacon?.(aiConfig.handoffUrl, new Blob([body], { type: "application/json" }))) return;
  } catch { /* fall through */ }
  fetch(aiConfig.handoffUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}
