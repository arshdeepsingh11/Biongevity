import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Response whose body arrives in the given chunks (to test lines split across network packets). */
const streamed = (chunks: string[], type = "text/event-stream") =>
  new Response(new ReadableStream({ start(c) { for (const s of chunks) c.enqueue(new TextEncoder().encode(s)); c.close(); } }), { headers: { "Content-Type": type } });

const input = { message: "Hi", history: [], context: { page: "home" }, sessionId: "s1" };

// env.ts reads NEXT_PUBLIC_* when it is first imported, so set them first and import fresh each time.
async function client(url = "http://127.0.0.1:8787") {
  vi.stubEnv("NEXT_PUBLIC_XEVYO_URL", url);
  vi.resetModules();
  return import("@/lib/xevyo");
}

beforeEach(() => vi.unstubAllEnvs());
afterEach(() => vi.unstubAllGlobals());

describe("Biongevity SI client", () => {
  it("joins OpenAI-style streamed tokens, even when a line is split across chunks", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(streamed([
      'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\ndata: {"choi',
      'ces":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\n',
    ])));
    const { askXevyo } = await client();
    const seen: string[] = [];
    const r = await askXevyo(input, (p) => seen.push(p));
    expect(r.reply).toBe("Hello");
    expect(seen.at(-1)).toBe("Hello");
  });

  it("reads a plain JSON reply with sources", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ reply: "Hi there", sources: [{ title: "HRV", url: "/x/" }] }), { headers: { "Content-Type": "application/json" } })));
    const { askXevyo } = await client();
    expect(await askXevyo(input)).toEqual({ reply: "Hi there", sources: [{ title: "HRV", url: "/x/" }] });
  });

  it("explains a rate-limit response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 })));
    const { askXevyo, XevyoError } = await client();
    const err = await askXevyo(input).catch((e) => e);
    expect(err).toBeInstanceOf(XevyoError);
    expect(err.reason).toContain("rate or monthly token limit");
  });

  it("sends the page context as a system message and the question last", async () => {
    const f = vi.fn().mockResolvedValue(new Response("{}", { headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", f);
    const { askXevyo } = await client();
    await askXevyo({ ...input, context: { page: "shop", section: "Plan Studio" } });
    const body = JSON.parse(f.mock.calls[0][1].body);
    expect(body.messages[0].role).toBe("system");
    expect(body.messages[0].content).toContain('section "Plan Studio"');
    expect(body.messages.at(-1)).toEqual({ role: "user", content: "Hi" });
  });

  it("refuses to call anything when no endpoint is configured", async () => {
    const { askXevyo } = await client("");
    await expect(askXevyo(input)).rejects.toThrow("XEVYO_NOT_CONFIGURED");
  });
});
