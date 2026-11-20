#!/usr/bin/env node
/**
 * One-time admin setup for the forms Worker (docs/ADMIN_FORMS.md).
 *
 *   npm run admin:setup            → asks for a username and password, makes a Google Authenticator key,
 *                                     checks a code from the app, then prints the four Worker secrets
 *   npm run admin:setup -- --apply → same, then saves the secrets to the Worker with wrangler
 *
 * Nothing is written to disk. The password itself is never stored, only a slow salted hash.
 */
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { base32Encode, b64, checkTotp, hashPassword } from "../deploy/forms/auth.mjs";

const apply = process.argv.includes("--apply");
const workerDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "deploy", "forms");

const ask = (q) =>
  new Promise((res) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (a) => { rl.close(); res(a.trim()); });
  });

/** Reads a line without showing what is typed. */
function askHidden(q) {
  if (!process.stdin.isTTY) return ask(q);
  return new Promise((res) => {
    process.stdout.write(q);
    let v = "";
    const onData = (buf) => {
      for (const ch of buf.toString("utf8")) {
        if (ch === "\r" || ch === "\n") {
          process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.off("data", onData);
          process.stdout.write("\n"); return res(v);
        }
        if (ch === "\u0003") process.exit(1);
        if (ch === "\u007f" || ch === "\b") v = v.slice(0, -1);
        else v += ch;
      }
    };
    process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.on("data", onData);
  });
}

console.log("\nBiongevity admin setup\n");
const username = (await ask("Admin username: ")).toLowerCase();
if (!username) { console.error("A username is required."); process.exit(1); }
let password = "";
for (;;) {
  password = await askHidden("Admin password (12+ characters): ");
  if (password.length < 12) { console.log("  Too short — use at least 12 characters."); continue; }
  if ((await askHidden("Type it again: ")) !== password) { console.log("  They don't match — try again."); continue; }
  break;
}

const totpSecret = base32Encode(crypto.getRandomValues(new Uint8Array(20)));
const otpauth = `otpauth://totp/Biongevity%20Admin:${encodeURIComponent(username)}?secret=${totpSecret}&issuer=Biongevity%20Admin&algorithm=SHA1&digits=6&period=30`;
console.log(`
Add it to Google Authenticator:
  1. Open Google Authenticator → tap +  → "Enter a setup key"
  2. Account name: Biongevity Admin
  3. Key:          ${totpSecret.match(/.{1,4}/g).join(" ")}
  4. Type of key:  Time based

(Any QR generator can also turn this link into a QR code to scan: ${otpauth})
`);

for (;;) {
  const code = (await ask("Enter the 6-digit code the app shows now: ")).replace(/\s/g, "");
  if ((await checkTotp(totpSecret, code)) >= 0) { console.log("  ✓ The app is set up correctly.\n"); break; }
  console.log("  That code doesn't match. Check the key was typed exactly and the phone's time is set automatically.");
}

const secrets = {
  ADMIN_USERNAME: username,
  ADMIN_PASSWORD_HASH: await hashPassword(password),
  ADMIN_TOTP_SECRET: totpSecret,
  SESSION_SECRET: b64(crypto.getRandomValues(new Uint8Array(32))),
};

if (!apply) {
  console.log("Save these four secrets in the Worker (from deploy/forms/, run each command and paste the value):\n");
  for (const [k, v] of Object.entries(secrets)) console.log(`  npx wrangler secret put ${k}\n    value: ${v}\n`);
  console.log("Or run again with --apply to save them automatically. Keep the Google Authenticator key private.\n");
  process.exit(0);
}

for (const [k, v] of Object.entries(secrets)) {
  const r = spawnSync("npx", ["wrangler", "secret", "put", k], { cwd: workerDir, input: v, stdio: ["pipe", "inherit", "inherit"], shell: process.platform === "win32" });
  if (r.status !== 0) { console.error(`\nSaving ${k} failed. Are you signed in (npx wrangler login) and is the Worker deployed?`); process.exit(1); }
}
console.log("\n✓ All four secrets saved to the biongevity-forms Worker.\n");
