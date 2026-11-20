/**
 * Biongevity forms — Cloudflare Worker + D1 database (free tier is enough).
 * Setup, deploy and DNS: docs/ADMIN_FORMS.md.
 *
 *   POST /contact          the website's contact form → saved in D1
 *   POST /admin/login      username + password + 6-digit Google Authenticator code → 8-hour session token
 *   GET  /admin/enquiries  saved enquiries, newest first (needs the session token) — view only, nothing can be changed
 *
 * Secrets (wrangler secret put …, never in the website): ADMIN_USERNAME, ADMIN_PASSWORD_HASH,
 * ADMIN_TOTP_SECRET, SESSION_SECRET. Protection: allowed origins only, per-visitor rate limits,
 * size limits, one-time 6-digit codes, signed expiring sessions.
 */
import { checkPassword, checkSession, checkTotp, makeSession, sameText } from "./auth.mjs";
import { parseOrigins } from "../si-policy.mjs";

const SESSION_MS = 8 * 60 * 60 * 1000;
const MAX_BODY = 20_000;
const MAX_ROWS = 5000;
/** Longest value kept for each contact field. */
const LIMITS = { name: 120, email: 200, phone: 40, interest: 160, msg: 5000, routed: 200 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL = /[\u0000-\u001F\u007F]/g;
const CONTROL_KEEP_LINES = /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trims, drops control characters (keeps line breaks in the message) and caps the length. */
const clean = (v, max, multiline = false) => String(v ?? "").replace(multiline ? CONTROL_KEEP_LINES : CONTROL, "").trim().slice(0, max);

/** Checks and tidies one contact form submission. */
export function readEnquiry(raw) {
  if (!raw || typeof raw !== "object") return { error: "Invalid form" };
  const e = {
    name: clean(raw.name, LIMITS.name),
    email: clean(raw.email, LIMITS.email),
    phone: clean(raw.phone, LIMITS.phone),
    interest: clean(raw.interest, LIMITS.interest),
    msg: clean(raw.msg, LIMITS.msg, true),
    routed: clean(raw.routed, LIMITS.routed),
  };
  if (!e.name) return { error: "Name is required" };
  if (!EMAIL.test(e.email)) return { error: "A valid email is required" };
  if (!e.msg) return { error: "Message is required" };
  return { enquiry: e };
}

async function limited(binding, request) {
  if (!binding) return false;
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const { success } = await binding.limit({ key: ip });
  return !success;
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return { tooBig: true };
  try {
    return { body: JSON.parse(text) };
  } catch {
    return { body: null };
  }
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
    const origin = request.headers.get("Origin") || "";
    const allowed = parseOrigins(env.ALLOWED_ORIGINS);
    const ok = allowed.includes(origin);
    const headers = {
      "Access-Control-Allow-Origin": ok ? origin : allowed[0] || "null",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "600",
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
      Vary: "Origin",
    };
    const json = (status, data) => new Response(JSON.stringify(data), { status, headers });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (!ok) return json(403, { error: "Origin not allowed" });

    // ── Contact form ──
    if (path === "/contact") {
      if (request.method !== "POST") return json(405, { error: "POST only" });
      if (await limited(env.CONTACT_RATE_LIMIT, request)) return json(429, { error: "Too many messages — please wait a minute" });
      const { body, tooBig } = await readJson(request);
      if (tooBig) return json(413, { error: "Message too long" });
      const { enquiry: e, error } = readEnquiry(body);
      if (error) return json(400, { error });
      await env.DB.prepare("INSERT INTO enquiries (created_at, name, email, phone, interest, message, routed) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(new Date().toISOString(), e.name, e.email, e.phone, e.interest, e.msg, e.routed)
        .run();
      return json(201, { ok: true });
    }

    // ── Admin sign-in ──
    if (path === "/admin/login") {
      if (request.method !== "POST") return json(405, { error: "POST only" });
      if (await limited(env.LOGIN_RATE_LIMIT, request)) return json(429, { error: "Too many attempts — wait a minute and try again" });
      if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD_HASH || !env.ADMIN_TOTP_SECRET || !env.SESSION_SECRET) return json(503, { error: "Admin is not set up" });
      const { body } = await readJson(request);
      const wrong = () => json(401, { error: "Wrong username, password or code" });
      if (!body || typeof body !== "object") return wrong();
      // Every check runs, so the reply does not reveal which part was wrong.
      const userOk = sameText(String(body.username ?? "").trim().toLowerCase(), String(env.ADMIN_USERNAME).trim().toLowerCase());
      const passOk = await checkPassword(String(body.password ?? ""), env.ADMIN_PASSWORD_HASH);
      const step = await checkTotp(env.ADMIN_TOTP_SECRET, String(body.code ?? "").replace(/\s/g, ""));
      if (!userOk || !passOk || step < 0) return wrong();
      // A code works once: remember the last step used.
      const last = await env.DB.prepare("SELECT value FROM admin_state WHERE key = 'last_totp_step'").first();
      if (last && Number(last.value) >= step) return json(401, { error: "That code was already used — wait for the next one" });
      await env.DB.prepare("INSERT INTO admin_state (key, value) VALUES ('last_totp_step', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
        .bind(String(step))
        .run();
      return json(200, await makeSession(env.SESSION_SECRET, SESSION_MS));
    }

    // ── Admin: read enquiries (view only) ──
    if (path === "/admin/enquiries") {
      if (request.method !== "GET") return json(405, { error: "GET only" });
      const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      if (!(await checkSession(env.SESSION_SECRET, token))) return json(401, { error: "Please sign in again" });
      const { results } = await env.DB.prepare("SELECT id, created_at, name, email, phone, interest, message, routed FROM enquiries ORDER BY id DESC LIMIT ?")
        .bind(MAX_ROWS)
        .all();
      return json(200, { enquiries: results ?? [] });
    }

    return json(404, { error: "Not found" });
  },
};
