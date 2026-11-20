import { describe, expect, it } from "vitest";
// @ts-expect-error — the Cloudflare Worker is plain JS
import worker, { readEnquiry } from "../deploy/forms/forms-worker.js";
// @ts-expect-error — plain JS module shared by the Worker and the setup script
import { base32Encode, checkPassword, checkSession, checkTotp, hashPassword, makeSession, totp } from "../deploy/forms/auth.mjs";

const SITE = "https://biongevity.com";
const enc = new TextEncoder();

/** In-memory stand-in for the Cloudflare D1 binding: just the queries the Worker runs. */
function fakeDb() {
  const rows: Record<string, unknown>[] = [];
  const state = new Map<string, string>();
  const stmt = (sql: string, args: unknown[] = []) => ({
    bind: (...a: unknown[]) => stmt(sql, a),
    async run() {
      if (sql.startsWith("INSERT INTO enquiries")) {
        const [created_at, name, email, phone, interest, message, routed] = args;
        rows.push({ id: rows.length + 1, created_at, name, email, phone, interest, message, routed });
      } else if (sql.startsWith("INSERT INTO admin_state")) state.set("last_totp_step", String(args[0]));
      return { success: true };
    },
    async first() {
      return state.has("last_totp_step") ? { value: state.get("last_totp_step") } : null;
    },
    async all() {
      return { results: [...rows].reverse().slice(0, Number(args[0])) };
    },
  });
  return { prepare: (sql: string) => stmt(sql), rows };
}

const TOTP = base32Encode(enc.encode("12345678901234567890"));
async function makeEnv(over: Record<string, unknown> = {}) {
  return {
    ALLOWED_ORIGINS: SITE,
    DB: fakeDb(),
    ADMIN_USERNAME: "team",
    ADMIN_PASSWORD_HASH: await hashPassword("correct horse battery", undefined, 1000),
    ADMIN_TOTP_SECRET: TOTP,
    SESSION_SECRET: "session-secret",
    ...over,
  };
}
const post = (path: string, body: unknown, origin = SITE) =>
  new Request(`https://forms.example${path}`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4" }, body: JSON.stringify(body) });
const get = (path: string, token?: string) =>
  new Request(`https://forms.example${path}`, { headers: { Origin: SITE, ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
const currentCode = async () => totp(enc.encode("12345678901234567890"), Math.floor(Date.now() / 30_000));
const ENQUIRY = { name: "Asha", email: "asha@example.com", phone: "+1 403 555 0100", interest: "Cardiology", msg: "Line one\nLine two", routed: "Cardiology" };

describe("admin sign-in checks", () => {
  it("matches the RFC 6238 test vector", async () => {
    // RFC 6238, SHA-1, T = 59 s → 94287082 (8 digits); the 6-digit code is the last six.
    expect(await totp(enc.encode("12345678901234567890"), 1, 8)).toBe("94287082");
    expect(await checkTotp(TOTP, "287082", 59_000)).toBe(1);
    expect(await checkTotp(TOTP, "287082", 59_000 + 90_000)).toBe(-1);
    expect(await checkTotp(TOTP, "abc", 59_000)).toBe(-1);
  });

  it("verifies passwords against the salted hash", async () => {
    const h = await hashPassword("s3cret-pass-123", undefined, 1000);
    expect(await checkPassword("s3cret-pass-123", h)).toBe(true);
    expect(await checkPassword("s3cret-pass-124", h)).toBe(false);
    expect(await checkPassword("x", "garbage")).toBe(false);
  });

  it("accepts only signed, unexpired sessions", async () => {
    const { token } = await makeSession("k", 1000, 0);
    expect(await checkSession("k", token, 500)).toBe(true);
    expect(await checkSession("k", token, 1500)).toBe(false);
    expect(await checkSession("other", token, 500)).toBe(false);
    expect(await checkSession("k", token.replace(/.$/, (c: string) => (c === "A" ? "B" : "A")), 500)).toBe(false);
  });
});

describe("contact form", () => {
  it("saves a valid enquiry", async () => {
    const env = await makeEnv();
    const r = await worker.fetch(post("/contact", ENQUIRY), env);
    expect(r.status).toBe(201);
    expect(env.DB.rows).toHaveLength(1);
    expect(env.DB.rows[0]).toMatchObject({ name: "Asha", email: "asha@example.com", message: "Line one\nLine two" });
  });

  it("rejects other websites, bad input and floods", async () => {
    const env = await makeEnv();
    expect((await worker.fetch(post("/contact", ENQUIRY, "https://evil.example"), env)).status).toBe(403);
    expect((await worker.fetch(post("/contact", { ...ENQUIRY, email: "nope" }), env)).status).toBe(400);
    expect((await worker.fetch(post("/contact", { ...ENQUIRY, msg: "x".repeat(30_000) }), env)).status).toBe(413);
    const limited = await makeEnv({ CONTACT_RATE_LIMIT: { limit: async () => ({ success: false }) } });
    expect((await worker.fetch(post("/contact", ENQUIRY), limited)).status).toBe(429);
    expect(env.DB.rows).toHaveLength(0);
  });

  it("strips control characters and caps lengths", () => {
    const { enquiry } = readEnquiry({ ...ENQUIRY, name: " A\u0000sha ", msg: "hi\u0007\nthere", interest: "x".repeat(500) });
    expect(enquiry.name).toBe("Asha");
    expect(enquiry.msg).toBe("hi\nthere");
    expect(enquiry.interest).toHaveLength(160);
  });
});

describe("admin", () => {
  it("signs in with username + password + code, then lists enquiries", async () => {
    const env = await makeEnv();
    await worker.fetch(post("/contact", ENQUIRY), env);
    const login = await worker.fetch(post("/admin/login", { username: "Team", password: "correct horse battery", code: await currentCode() }), env);
    expect(login.status).toBe(200);
    const { token } = await login.json();
    const list = await worker.fetch(get("/admin/enquiries", token), env);
    expect(list.status).toBe(200);
    expect(list.headers.get("Cache-Control")).toBe("no-store");
    const { enquiries } = await list.json();
    expect(enquiries[0]).toMatchObject({ name: "Asha", phone: "+1 403 555 0100" });
  });

  it("refuses a wrong password, a wrong code, a reused code and a missing token", async () => {
    const env = await makeEnv();
    const code = await currentCode();
    expect((await worker.fetch(post("/admin/login", { username: "team", password: "wrong", code }), env)).status).toBe(401);
    expect((await worker.fetch(post("/admin/login", { username: "team", password: "correct horse battery", code: "000000" === code ? "111111" : "000000" }), env)).status).toBe(401);
    expect((await worker.fetch(post("/admin/login", { username: "team", password: "correct horse battery", code }), env)).status).toBe(200);
    expect((await worker.fetch(post("/admin/login", { username: "team", password: "correct horse battery", code }), env)).status).toBe(401);
    expect((await worker.fetch(get("/admin/enquiries"), env)).status).toBe(401);
    expect((await worker.fetch(get("/admin/enquiries", "forged.token"), env)).status).toBe(401);
  });

  it("has no way to change or delete enquiries", async () => {
    const env = await makeEnv();
    const del = new Request("https://forms.example/admin/enquiries", { method: "DELETE", headers: { Origin: SITE } });
    expect((await worker.fetch(del, env)).status).toBe(405);
  });

  it("reports when admin secrets are missing", async () => {
    const env = await makeEnv({ ADMIN_TOTP_SECRET: "" });
    expect((await worker.fetch(post("/admin/login", { username: "team", password: "x", code: "123456" }), env)).status).toBe(503);
  });
});
