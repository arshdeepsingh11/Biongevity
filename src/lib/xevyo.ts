import { env, xevyoEnabled } from "./env";
import { langById, type SILanguage } from "./languages";

/**
 * Biongevity SI — Biongevity's in-house AI. This client holds NO answers of its own.
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
export type XevyoLanguage = SILanguage;

/** House rules sent with every request. Health-safety wording follows docs/COPY_RULES.md. */
export function systemPrompt(o: { page: string; section?: string; language?: XevyoLanguage; grounding?: string }) {
  return [
    "You are Biongevity SI, the intelligence guide of Biongevity (BioAro Inc.) — a longevity and precision-health company focused on healthspan for adults 40–65 and their families. The BioAro family: BioAro Labs (at-home DNA, microbiome, hormone and inflammation tests from CLIA-registered labs), BioAro Drugs (AI-guided bioactive protocols), BioELR (the longevity health record for clinics) and partner care at NEYU Health in Calgary.",
    `The visitor is on: ${o.page}${o.section ? ` — section "${o.section}"` : ""}.`,
    "Explain simply and warmly in short paragraphs or bullets. Educate; never diagnose, never prescribe, never promise outcomes. Suggest a clinician for decisions, and emergency services for urgent symptoms.",
    "Prefer the Biongevity information provided below. When you use a passage, cite it as [1], [2] or [3]. If the passages do not cover the question, say so briefly and answer from general knowledge.",
    "You understand English, French, Arabic and Persian. When asked to translate, translate faithfully and keep the meaning, numbers and formatting.",
    `Reply in ${langById(o.language ?? "en").label}.`,
    o.grounding ? `\n${o.grounding}` : "",
  ].filter(Boolean).join("\n");
}

export { xevyoEnabled };

/** Error with a readable reason (shown in development to speed up setup). */
export class XevyoError extends Error { constructor(public code: string, public reason: string) { super(code); } }

export async function askXevyo(
  input: {
    message: string; history: XevyoTurn[]; context: { page: string; section?: string }; sessionId: string;
    /** Reply language: English, French, Arabic or Persian. */
    language?: XevyoLanguage;
    /** Extra grounding: numbered passages from our own pages (see lib/retrieve.ts) and page text for summaries. */
    grounding?: string;
  },
  onToken?: (partial: string) => void,
  signal?: AbortSignal,
): Promise<XevyoReply> {
  if (!xevyoEnabled) throw new Error("XEVYO_NOT_CONFIGURED");
  // Also send OpenAI-style `messages` (+ optional model) so chat-completions style endpoints work too.
  const messages = [
    { role: "system", content: systemPrompt({ ...input.context, language: input.language, grounding: input.grounding }) },
    ...input.history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: input.message },
  ];
  // Xevyo's own API is OpenAI-style (POST …/xevyo/v1/chat/completions, streamed). Send exactly that shape there;
  // other endpoints (a proxy or a custom server) also get the Biongevity fields.
  const openai = /\/chat\/completions\/?$/.test(env.xevyoUrl);
  const body = openai
    ? { model: env.xevyoModel || "xevyo", messages, stream: true, assistant_name: "Biongevity SI", company_name: "Biongevity" }
    : { message: input.message, history: input.history, context: { ...input.context, language: input.language ?? "en" }, sessionId: input.sessionId, messages, stream: true, ...(env.xevyoModel ? { model: env.xevyoModel } : {}) };
  let res: Response;
  try {
    res = await fetch(env.xevyoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream, application/json", ...(env.xevyoKey ? { Authorization: `Bearer ${env.xevyoKey}` } : {}) },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new XevyoError("NETWORK", "Request blocked or unreachable — usually CORS (Biongevity SI must allow this site's origin) or a wrong URL.");
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
