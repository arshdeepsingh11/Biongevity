/**
 * Biongevity SI — production proxy as a Cloudflare Worker (free tier is enough).
 * The secret key lives in the Worker (wrangler secret put XEVYO_API_KEY), never in the website.
 *
 * Deploy (from deploy/):
 *   npx wrangler secret put XEVYO_API_KEY
 *   npx wrangler secret put XEVYO_UPSTREAM_URL
 *   npx wrangler deploy   → then set NEXT_PUBLIC_XEVYO_URL to the Worker URL and rebuild the site.
 *
 * Protection (the Origin header alone is NOT protection — any script can forge it):
 *   • per-visitor rate limit (SI_RATE_LIMIT binding in wrangler.toml)
 *   • the Worker sets the model and prepends the safety rules (si-policy.mjs)
 *   • size limits on every request, and an optional max_tokens cap (XEVYO_MAX_TOKENS)
 *   • set a monthly token limit on the key in the Xevyo console as the final backstop
 */
import { buildUpstreamBody, parseOrigins } from "./si-policy.mjs";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = parseOrigins(env.ALLOWED_ORIGINS);
    const ok = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": ok ? origin : allowed[0] || "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      // Authorization is accepted (the site may send a publishable key) but never forwarded.
      "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    };
    const reply = (status, error) =>
      new Response(JSON.stringify({ error }), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, "POST only");
    if (!ok) return reply(403, "Origin not allowed");

    if (env.SI_RATE_LIMIT) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.SI_RATE_LIMIT.limit({ key: ip });
      if (!success) return reply(429, "Too many requests — please wait a minute");
    }

    const built = buildUpstreamBody(await request.text(), {
      upstream: env.XEVYO_UPSTREAM_URL,
      model: env.XEVYO_MODEL,
      maxTokens: Number(env.XEVYO_MAX_TOKENS) || undefined,
    });
    if (!built.ok) return reply(built.status, built.error);

    let up;
    try {
      up = await fetch(env.XEVYO_UPSTREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: request.headers.get("Accept") || "application/json, text/event-stream",
          ...(env.XEVYO_API_KEY ? { Authorization: `Bearer ${env.XEVYO_API_KEY}` } : {}),
        },
        body: built.body,
      });
    } catch {
      return reply(502, "Upstream unreachable");
    }
    const headers = new Headers(cors);
    headers.set("Content-Type", up.headers.get("Content-Type") || "application/json");
    headers.set("Cache-Control", "no-store");
    return new Response(up.body, { status: up.status, headers });
  },
};
