/**
 * Biongevity SI — production proxy as a Cloudflare Worker (free tier is enough).
 * The secret key lives in the Worker (wrangler secret put XEVYO_API_KEY), never in the website.
 *
 * Deploy:
 *   npx wrangler init biongevity-si   (choose "Hello World" Worker), replace src/index.js with this file
 *   npx wrangler secret put XEVYO_API_KEY
 *   npx wrangler secret put XEVYO_UPSTREAM_URL
 *   Set ALLOWED_ORIGINS in wrangler.toml [vars], e.g. "https://biongevity.com,https://www.biongevity.com"
 *   npx wrangler deploy  → then set NEXT_PUBLIC_XEVYO_URL to the Worker URL and rebuild the site.
 */
/** Xevyo's API is OpenAI-style: forward only the fields it expects. */
const toXevyo = (raw, upstream) => {
  if (!/\/chat\/completions\/?$/.test(upstream)) return raw;
  try {
    const j = JSON.parse(raw);
    return JSON.stringify({ model: j.model || "xevyo", messages: j.messages, stream: j.stream !== false, assistant_name: j.assistant_name || "Biongevity SI", company_name: j.company_name || "Biongevity" });
  } catch { return raw; }
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": ok ? origin : allowed[0] || "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response("POST only", { status: 405, headers: cors });
    if (!ok) return new Response("Origin not allowed", { status: 403, headers: cors });
    const body = await request.text();
    if (body.length > 200000) return new Response("Too large", { status: 413, headers: cors });
    const up = await fetch(env.XEVYO_UPSTREAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: request.headers.get("Accept") || "application/json, text/event-stream", ...(env.XEVYO_API_KEY ? { Authorization: `Bearer ${env.XEVYO_API_KEY}` } : {}) },
      body: toXevyo(body, env.XEVYO_UPSTREAM_URL),
    });
    const headers = new Headers(cors);
    headers.set("Content-Type", up.headers.get("Content-Type") || "application/json");
    headers.set("Cache-Control", "no-store");
    return new Response(up.body, { status: up.status, headers });
  },
};
