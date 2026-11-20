/**
 * Admin sign-in checks for the forms Worker. Plain Web Crypto, so it runs in Cloudflare Workers and Node 20+.
 *   • password  — PBKDF2-SHA256 hash ("pbkdf2-sha256$<iterations>$<salt b64>$<hash b64>"), made by scripts/admin-setup.mjs
 *   • 6-digit code — TOTP (RFC 6238: SHA-1, 30-second steps), the same codes Google Authenticator shows
 *   • session  — "<payload>.<signature>" signed with HMAC-SHA256; the payload holds only the expiry time
 */
const enc = new TextEncoder();

export const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
export const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64url = (bytes) => b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s) => unb64(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));

/** Compares two byte arrays in time that does not depend on where they differ. */
export function sameBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
export const sameText = (a, b) => sameBytes(enc.encode(String(a)), enc.encode(String(b)));

/* ───── Password ───── */
export async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16)), iterations = 100_000) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2-sha256$${iterations}$${b64(salt)}$${b64(bits)}`;
}

export async function checkPassword(password, stored) {
  const [kind, iter, salt, hash] = String(stored || "").split("$");
  if (kind !== "pbkdf2-sha256" || !iter || !salt || !hash) return false;
  const again = await hashPassword(password, unb64(salt), Number(iter));
  return sameText(again.split("$")[3], hash);
}

/* ───── Google Authenticator (TOTP) ───── */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(s) {
  const clean = String(s).toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0, value = 0;
  const out = [];
  for (const ch of clean) {
    const i = B32.indexOf(ch);
    if (i < 0) throw new Error("Bad base32 character");
    value = (value << 5) | i; bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return new Uint8Array(out);
}

export function base32Encode(bytes) {
  let bits = 0, value = 0, out = "";
  for (const b of bytes) {
    value = (value << 8) | b; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

/** The code for one 30-second step. */
export async function totp(secretBytes, counter, digits = 6) {
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const o = h[h.length - 1] & 15;
  const n = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 10 ** digits).padStart(digits, "0");
}

/**
 * Checks a 6-digit code against the current step and one step either side (phone clocks drift).
 * Returns the matching step number, or -1. The caller stores it so the same code cannot be used twice.
 */
export async function checkTotp(secretB32, code, nowMs = Date.now()) {
  if (!/^\d{6}$/.test(String(code))) return -1;
  const secret = base32Decode(secretB32);
  const step = Math.floor(nowMs / 30_000);
  for (const c of [step, step - 1, step + 1]) {
    if (sameText(await totp(secret, c), code)) return c;
  }
  return -1;
}

/* ───── Session token ───── */
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function makeSession(secret, ttlMs, nowMs = Date.now()) {
  const exp = nowMs + ttlMs;
  const payload = b64url(enc.encode(JSON.stringify({ exp })));
  return { token: `${payload}.${b64url(await hmac(secret, payload))}`, exp };
}

/** True when the token was signed with `secret` and has not expired. */
export async function checkSession(secret, token, nowMs = Date.now()) {
  const [payload, sig] = String(token || "").split(".");
  if (!payload || !sig || !secret) return false;
  let given;
  try { given = unb64url(sig); } catch { return false; }
  if (!sameBytes(await hmac(secret, payload), given)) return false;
  try {
    const { exp } = JSON.parse(new TextDecoder().decode(unb64url(payload)));
    return typeof exp === "number" && exp > nowMs;
  } catch {
    return false;
  }
}
