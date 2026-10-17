#!/usr/bin/env node
/**
 * Biongevity SI — local secure proxy for development (no dependencies).
 *
 * Why: the browser cannot call the Xevyo server directly when Xevyo does not allow this site's origin (CORS),
 * and a secret key must never be shipped to the browser. This proxy runs on your computer, adds the key on the
 * server side, forwards the request to Xevyo and streams the answer back with the right CORS headers.
 *
 * Setup (.env.local — git-ignored, never committed):
 *   XEVYO_UPSTREAM_URL=https://chat.xevyo.com/xevyo/v1/chat/completions
 *   XEVYO_API_KEY=<secret key>                             # optional; sent as "Authorization: Bearer …"
 *   NEXT_PUBLIC_XEVYO_URL=http://localhost:8787            # the site talks to this proxy
 * Run in a second terminal:  npm run si:proxy
 */
import http from "node:http";
import { readFileSync, existsSync } from "node:fs";

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
const ALLOWED = (process.env.XEVYO_ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000").split(",").map((s) => s.trim());

if (!UPSTREAM) { console.error("✖ Set XEVYO_UPSTREAM_URL in .env.local (the real Xevyo endpoint)."); process.exit(1); }

/** Xevyo's API is OpenAI-style: forward only the fields it expects. */
const toXevyo = (raw, upstream) => {
  if (!/\/chat\/completions\/?$/.test(upstream)) return raw;
  try {
    const j = JSON.parse(raw);
    return JSON.stringify({ model: j.model || "xevyo", messages: j.messages, stream: j.stream !== false, assistant_name: j.assistant_name || "Biongevity SI", company_name: j.company_name || "Biongevity" });
  } catch { return raw; }
};

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
  "Access-Control-Max-Age": "600",
  Vary: "Origin",
});

http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  if (req.method === "OPTIONS") { res.writeHead(204, cors(origin)); return res.end(); }
  if (req.method !== "POST") { res.writeHead(405, cors(origin)); return res.end("POST only"); }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);
  if (body.length > 200_000) { res.writeHead(413, cors(origin)); return res.end("Too large"); }
  try {
    const up = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: req.headers.accept || "application/json, text/event-stream", ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}) },
      body: toXevyo(body.toString("utf8"), UPSTREAM),
    });
    res.writeHead(up.status, { ...cors(origin), "Content-Type": up.headers.get("content-type") || "application/json", "Cache-Control": "no-store" });
    if (!up.body) return res.end();
    for await (const part of up.body) res.write(part);
    res.end();
    console.log(`→ ${up.status} ${new Date().toLocaleTimeString()}`);
  } catch (e) {
    console.error("✖ Upstream unreachable:", e.message);
    res.writeHead(502, { ...cors(origin), "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Upstream unreachable", detail: e.message }));
  }
}).listen(PORT, () => console.log(`✓ Biongevity SI proxy on http://localhost:${PORT} → ${new URL(UPSTREAM).host}  (origins: ${ALLOWED.join(", ")})`));
