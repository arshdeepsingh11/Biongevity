import { aiConfig, aiEnabled } from "./config";

export interface ChatTurn { role: "user" | "assistant"; content: string }

export class AIError extends Error { constructor(public code: string) { super(code); } }

/**
 * Sends one question to the AI endpoint and streams the answer through `onToken` (full text so far).
 * Accepts the common response shapes: OpenAI-style SSE (`data: {choices:[{delta:{content}}]}`), plain SSE tokens,
 * chunked text, or JSON ({ reply } / { choices:[{ message }] } / { answer }). The request also carries Biongevity
 * fields (locale, page, sessionId) so a custom server can use them. No key is stored in this code.
 */
export async function askAI(
  input: { system: string; history: ChatTurn[]; message: string; locale: string; page: string; sessionId: string },
  onToken: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  if (!aiEnabled) throw new AIError("NOT_CONFIGURED");
  const messages = [{ role: "system", content: input.system }, ...input.history.slice(-10), { role: "user", content: input.message }];
  let res: Response;
  try {
    res = await fetch(aiConfig.url, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Accept: "text/event-stream, application/json", ...(aiConfig.publicKey ? { Authorization: `Bearer ${aiConfig.publicKey}` } : {}) },
      body: JSON.stringify({
        ...(aiConfig.model ? { model: aiConfig.model } : {}),
        messages, stream: true,
        biongevity: { site: "uae", locale: input.locale, page: input.page, sessionId: input.sessionId },
      }),
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new AIError("NETWORK");
  }
  if (!res.ok) throw new AIError(`HTTP_${res.status}`);

  const type = res.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const j = await res.json() as { reply?: string; answer?: string; text?: string; choices?: { message?: { content?: string } }[] };
    const text = j.reply ?? j.choices?.[0]?.message?.content ?? j.answer ?? j.text ?? "";
    onToken(text);
    return text;
  }
  if (!res.body) throw new AIError("EMPTY");
  const reader = res.body.getReader(), dec = new TextDecoder();
  const sse = type.includes("event-stream") || /chat\/completions\/?$/.test(aiConfig.url);
  let out = "", buf = "";
  const line = (raw: string) => {
    const l = raw.trim();
    if (!l.startsWith("data:")) return;
    const data = l.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const j = JSON.parse(data) as { token?: string; delta?: string; content?: string; text?: string; choices?: { delta?: { content?: string } }[] };
      out += j.choices?.[0]?.delta?.content ?? j.token ?? j.delta ?? j.content ?? j.text ?? "";
    } catch { out += data; }
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value, { stream: true });
    if (sse) { buf += chunk; const parts = buf.split("\n"); buf = parts.pop() ?? ""; parts.forEach(line); } else out += chunk;
    onToken(out);
  }
  if (sse && buf) { line(buf); onToken(out); }
  if (!out.trim()) throw new AIError("EMPTY");
  return out;
}

export function sessionId() {
  try {
    const k = "bio.ai.session";
    let v = sessionStorage.getItem(k);
    if (!v) { v = crypto.randomUUID(); sessionStorage.setItem(k, v); }
    return v;
  } catch { return "anon"; }
}
