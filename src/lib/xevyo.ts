import { env, xevyoEnabled } from "./env";

/**
 * Xevyo — Biongevity's in-house AI. This client holds NO answers of its own.
 *
 * Request  (POST NEXT_PUBLIC_XEVYO_URL, JSON):
 *   { message, history: [{ role: "user" | "assistant", content }], context: { page, section }, sessionId }
 * Response (either):
 *   • JSON      → { reply: string, sources?: { title: string; url: string }[] }
 *   • Streaming → text/event-stream (data: <token>) or chunked text/plain, appended as it arrives
 * Auth: optional `Authorization: Bearer NEXT_PUBLIC_XEVYO_PUBLIC_KEY` (publishable key only).
 */
export interface XevyoTurn { role: "user" | "assistant"; content: string }
export interface XevyoReply { reply: string; sources?: { title: string; url: string }[] }

export { xevyoEnabled };

export async function askXevyo(
  input: { message: string; history: XevyoTurn[]; context: { page: string; section?: string }; sessionId: string },
  onToken?: (partial: string) => void,
  signal?: AbortSignal,
): Promise<XevyoReply> {
  if (!xevyoEnabled) throw new Error("XEVYO_NOT_CONFIGURED");
  const res = await fetch(env.xevyoUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...(env.xevyoKey ? { Authorization: `Bearer ${env.xevyoKey}` } : {}) },
    body: JSON.stringify(input),
    signal,
  });
  if (!res.ok) throw new Error(`XEVYO_HTTP_${res.status}`);
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const j = (await res.json()) as Partial<XevyoReply> & { text?: string; message?: string };
    const reply = j.reply ?? j.text ?? j.message ?? "";
    onToken?.(reply);
    return { reply, sources: j.sources };
  }
  // Stream: SSE or plain chunks
  const reader = res.body!.getReader(), dec = new TextDecoder();
  let acc = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value, { stream: true });
    if (type.includes("event-stream")) {
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        try { const j = JSON.parse(data) as { token?: string; delta?: string }; acc += j.token ?? j.delta ?? ""; } catch { acc += data; }
      }
    } else acc += chunk;
    onToken?.(acc);
  }
  return { reply: acc };
}

export function sessionId() {
  try {
    const k = "xevyo.session", v = sessionStorage.getItem(k);
    if (v) return v;
    const id = crypto.randomUUID(); sessionStorage.setItem(k, id); return id;
  } catch { return "anonymous"; }
}
