# Biongevity SI — getting answers working

The browser cannot call Xevyo directly: Xevyo does not allow this site's address (CORS), and the key must never
ship to the browser. A small proxy sits between the site and Xevyo: it adds the key on the server side and
returns the answer with the right CORS headers.

## What the proxy enforces

Both proxies (local and production) share `deploy/si-policy.mjs`. The website is treated as untrusted —
anyone can call the proxy with a forged `Origin` header, so the proxy itself decides:

- **Safety rules first** — the proxy prepends Biongevity SI's rules (educate, never diagnose or prescribe,
  911 for emergencies). The site's own page context is kept but ranked below them.
- **Model** — set by the proxy (`XEVYO_MODEL`); a model name sent by the browser is ignored.
- **Size** — body ≤ 64 KB, ≤ 12 turns, ≤ 9,000 characters per message, ≤ 48,000 in total.
- **Rate** — production: 10 questions per minute per visitor (Cloudflare rate-limit binding);
  local: 20 per minute.
- **Answer length** — optional `XEVYO_MAX_TOKENS`.
- Also set a **monthly token limit on the key** in the Xevyo console as the final backstop.

## Local development (Windows PowerShell)

1. Create or edit `.env.local` in the project folder (it is git-ignored):
   ```
   XEVYO_UPSTREAM_URL=https://chat.xevyo.com/xevyo/v1/chat/completions
   XEVYO_API_KEY=<the key, if Xevyo needs one>
   NEXT_PUBLIC_XEVYO_URL=http://127.0.0.1:8787
   ```
   Remove any old `NEXT_PUBLIC_XEVYO_PUBLIC_KEY` line — the proxy sends the key.
2. Terminal 1: `npm run si:proxy` → `✓ Biongevity SI proxy on http://127.0.0.1:8787`.
   It listens on this computer only, so other devices on your network cannot use your key.
3. Terminal 2: `npm run dev` → open http://localhost:3000 and ask a question.

If the proxy prints `→ 401` or `→ 403`, the key is wrong; `→ 404`, the upstream URL is wrong.

## Live site and mobile apps

Deploy `deploy/xevyo-worker.js` as a Cloudflare Worker (see `docs/DEPLOY.md` §4). `ALLOWED_ORIGINS` in
`deploy/wrangler.toml` includes the live domain and the Capacitor app origins (`capacitor://localhost` for iOS,
`https://localhost` for Android), so the chat works inside the apps too.

Never put the key in code, zips, docs or chat.
