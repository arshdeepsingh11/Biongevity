import { afterEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error — the Cloudflare Worker is plain JS
import worker from "../deploy/xevyo-worker.js";

const SITE = "https://biongevity.com";
const env = (over: Record<string, unknown> = {}) => ({
  ALLOWED_ORIGINS: `${SITE},capacitor://localhost`,
  XEVYO_UPSTREAM_URL: "https://chat.xevyo.com/xevyo/v1/chat/completions",
  XEVYO_API_KEY: "secret-key",
  XEVYO_MODEL: "xevyo",
  ...over,
});
const req = (origin: string, body: unknown = { messages: [{ role: "user", content: "hi" }] }, method = "POST") =>
  new Request("https://worker.example/", { method, headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4" }, body: method === "POST" ? JSON.stringify(body) : undefined });

afterEach(() => vi.unstubAllGlobals());

describe("Cloudflare Worker", () => {
  it("rejects a disallowed origin without calling upstream", async () => {
    const upstream = vi.fn();
    vi.stubGlobal("fetch", upstream);
    const r = await worker.fetch(req("https://evil.example"), env());
    expect(r.status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("returns 429 when the per-visitor rate limit is exceeded", async () => {
    const upstream = vi.fn();
    vi.stubGlobal("fetch", upstream);
    const limit = vi.fn().mockResolvedValue({ success: false });
    const r = await worker.fetch(req(SITE), env({ SI_RATE_LIMIT: { limit } }));
    expect(r.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: "1.2.3.4" });
    expect(upstream).not.toHaveBeenCalled();
  });

  it("forwards a valid request with the secret key, safety rules and fixed model", async () => {
    const upstream = vi.fn().mockResolvedValue(new Response("data: {}\n\n", { headers: { "Content-Type": "text/event-stream" } }));
    vi.stubGlobal("fetch", upstream);
    const r = await worker.fetch(req("capacitor://localhost", { model: "other", messages: [{ role: "user", content: "hi" }] }), env({ SI_RATE_LIMIT: { limit: async () => ({ success: true }) } }));
    expect(r.status).toBe(200);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe("capacitor://localhost");
    const [, init] = upstream.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer secret-key");
    const sent = JSON.parse(init.body);
    expect(sent.model).toBe("xevyo");
    expect(sent.messages[0].content).toContain("never diagnose");
  });

  it("returns 400 for a malformed body without calling upstream", async () => {
    const upstream = vi.fn();
    vi.stubGlobal("fetch", upstream);
    const r = await worker.fetch(req(SITE, { nope: true }), env());
    expect(r.status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("returns 502 with CORS headers when upstream is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    const r = await worker.fetch(req(SITE), env());
    expect(r.status).toBe(502);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
  });

  it("answers CORS preflight and refuses GET", async () => {
    expect((await worker.fetch(req(SITE, undefined, "OPTIONS"), env())).status).toBe(204);
    expect((await worker.fetch(req(SITE, undefined, "GET"), env())).status).toBe(405);
  });
});
