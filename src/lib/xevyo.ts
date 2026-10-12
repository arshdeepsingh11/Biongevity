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

/** Error with a readable reason (shown in development to speed up setup). */
export class XevyoError extends Error { constructor(public code: string, public reason: string) { super(code); } }

export async function askXevyo(
  input: { message: string; history: XevyoTurn[]; context: { page: string; section?: string }; sessionId: string },
  onToken?: (partial: string) => void,
  signal?: AbortSignal,
): Promise<XevyoReply> {
  if (!xevyoEnabled) throw new Error("XEVYO_NOT_CONFIGURED");
  // Also send OpenAI-style `messages` (+ optional model) so chat-completions style endpoints work too.
  const messages = [
    { role: "system", content: `You are Xevyo, Biongevity's health guide. The visitor is on: ${input.context.page}${input.context.section ? ` — ${input.context.section}` : ""}. Explain simply; do not diagnose.` },
    ...input.history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: input.message },
  ];
  let res: Response;
  try {
    res = await fetch(env.xevyoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...(env.xevyoKey ? { Authorization: `Bearer ${env.xevyoKey}` } : {}) },
      body: JSON.stringify({ ...input, messages, ...(env.xevyoModel ? { model: env.xevyoModel } : {}) }),
      signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new XevyoError("NETWORK", "Request blocked or unreachable — usually CORS (Xevyo must allow this site's origin) or a wrong URL.");
  }
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    const why = res.status === 401 || res.status === 403 ? "key rejected or not allowed for this origin" : res.status === 404 ? "endpoint URL not found" : res.status === 400 || res.status === 422 ? "request format not accepted" : "server error";
    throw new XevyoError(`HTTP_${res.status}`, `HTTP ${res.status} — ${why}${detail ? `: ${detail}` : ""}`);
  }
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const j = (await res.json()) as Partial<XevyoReply> & { text?: string; message?: string | { content?: string }; answer?: string; output?: string; choices?: { message?: { content?: string } }[] };
    const reply = j.reply ?? j.choices?.[0]?.message?.content ?? j.answer ?? j.output ?? j.text ?? (typeof j.message === "string" ? j.message : j.message?.content) ?? "";
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
        try { const j = JSON.parse(data) as { token?: string; delta?: string; text?: string; choices?: { delta?: { content?: string } }[] }; acc += j.token ?? j.delta ?? j.text ?? j.choices?.[0]?.delta?.content ?? ""; } catch { acc += data; }
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
