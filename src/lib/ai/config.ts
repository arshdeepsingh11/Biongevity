/**
 * AI assistant configuration (Dubai site). The AI itself is built and run by the AI team; the website only
 * provides the infrastructure: launcher, chat panel, highlight-to-ask, page context, knowledge index and hand-off.
 *
 *   NEXT_PUBLIC_AI_URL          Chat endpoint (OpenAI-style …/chat/completions, SSE stream or JSON). Falls back to NEXT_PUBLIC_XEVYO_URL.
 *   NEXT_PUBLIC_AI_MODEL        Optional model name sent with each request.
 *   NEXT_PUBLIC_AI_HANDOFF_URL  Optional: receives the conversation summary for the clinic team (EMR/ELR). See docs/AI_INTEGRATION.md.
 *
 * NEVER put a secret key in NEXT_PUBLIC_* values: they are visible in the browser. In production the endpoint
 * is a proxy (Cloudflare Worker) that holds the key as a server secret. Empty URL = AI off; the site keeps working
 * and the panel shows related pages and WhatsApp instead (clearly labelled, never pretending to be the AI).
 */
export const aiConfig = {
  url: process.env.NEXT_PUBLIC_AI_URL || process.env.NEXT_PUBLIC_XEVYO_URL || "",
  model: process.env.NEXT_PUBLIC_AI_MODEL || process.env.NEXT_PUBLIC_XEVYO_MODEL || "",
  /** Publishable key for local testing only. Must be empty in the live build. */
  publicKey: process.env.NEXT_PUBLIC_XEVYO_PUBLIC_KEY || "",
  handoffUrl: (process.env.NEXT_PUBLIC_AI_HANDOFF_URL || "").replace(/\/$/, ""),
};

export const aiEnabled = Boolean(aiConfig.url);
