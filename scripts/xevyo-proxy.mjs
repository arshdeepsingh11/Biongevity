#!/usr/bin/env node
/**
 * Biongevity SI — local secure proxy for development (no dependencies).
 *
 * Why: the browser cannot call the Xevyo server directly when Xevyo does not allow this site's origin (CORS),
 * and a secret key must never be shipped to the browser. This proxy runs on your computer, adds the key on the
 * server side, forwards the request to Xevyo and streams the answer back with the right CORS headers.
 * It applies the same request policy as the production Worker (deploy/si-policy.mjs).
 *
 * Setup (.env.local — git-ignored, never committed):
 *   XEVYO_UPSTREAM_URL=https://chat.xevyo.com/xevyo/v1/chat/completions
 *   XEVYO_API_KEY=<secret key>                             # optional; sent as "Authorization: Bearer …"
 *   NEXT_PUBLIC_XEVYO_URL=http://localhost:8787            # the site talks to this proxy
 * Run in a second terminal:  npm run si:proxy
 */
import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { buildUpstreamBody, parseOrigins } from "../deploy/si-policy.mjs";

for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const UPSTREAM = process.env.XEVYO_UPSTREAM_URL || "";
const KEY = process.env.XEVYO_API_KEY || "";
const PORT = Number(process.env.XEVYO_PROXY_PORT || 8787);
// Loopback only: other devices on your network cannot use your key.
const HOST = process.env.XEVYO_PROXY_HOST || "127.0.0.1";
const ALLOWED = parseOrigins(process.env.XEVYO_ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000");
const PER_MINUTE = Number(process.env.XEVYO_PROXY_RATE || 20);

if (!UPSTREAM) { console.error("✖ Set XEVYO_UPSTREAM_URL in .env.local (the real Xevyo endpoint)."); process.exit(1); }

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
  "Access-Control-Max-Age": "600",
  Vary: "Origin",
});

// Simple fixed-window limit, per client address.
const hits = new Map();
const limited = (ip) => {
  const now = Date.now(), w = hits.get(ip);
  if (!w || now - w.start > 60_000) { hits.set(ip, { start: now, n: 1 }); return false; }
  return ++w.n > PER_MINUTE;
};

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  const fail = (status, error) => { res.writeHead(status, { ...cors(origin), "Content-Type": "application/json" }); res.end(JSON.stringify({ error })); };
  if (req.method === "OPTIONS") { res.writeHead(204, cors(origin)); return res.end(); }
  if (req.method !== "POST") return fail(405, "POST only");
  if (!ALLOWED.includes(origin)) return fail(403, "Origin not allowed");
  if (limited(req.socket.remoteAddress || "?")) return fail(429, "Too many requests — please wait a minute");

  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > 64_000) return fail(413, "Request too large"); chunks.push(c); }
  const built = buildUpstreamBody(Buffer.concat(chunks).toString("utf8"), {
    upstream: UPSTREAM,
    model: process.env.XEVYO_MODEL,
    maxTokens: Number(process.env.XEVYO_MAX_TOKENS) || undefined,
  });
  if (!built.ok) return fail(built.status, built.error);

  try {
    const up = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: req.headers.accept || "application/json, text/event-stream", ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}) },
      body: built.body,
    });
    res.writeHead(up.status, { ...cors(origin), "Content-Type": up.headers.get("content-type") || "application/json", "Cache-Control": "no-store" });
    if (!up.body) return res.end();
    for await (const part of up.body) res.write(part);
    res.end();
    console.log(`→ ${up.status} ${new Date().toLocaleTimeString()}`);
  } catch (e) {
    console.error("✖ Upstream unreachable:", e.message);
    if (!res.headersSent) fail(502, "Upstream unreachable");
    else res.end();
  }
});

server.listen(PORT, HOST, () => console.log(`✓ Biongevity SI proxy on http://${HOST}:${PORT} → ${new URL(UPSTREAM).host}  (origins: ${ALLOWED.join(", ")})`));
