# Biongevity SI — getting answers working

The chat showed *"Request blocked or unreachable — usually CORS"*. The Xevyo server does not allow requests
from this site's address, so the browser blocks them. The fix is a small proxy that sits between the site and
Xevyo: it adds the key on the server side (so no secret is ever in the website) and returns the answer with the
right CORS headers.

## Local development (Windows PowerShell)

1. Create or edit `.env.local` in the project folder (it is git-ignored):
   ```
   XEVYO_UPSTREAM_URL=https://chat.xevyo.com/xevyo/v1/chat/completions
   XEVYO_API_KEY=<the key, if Xevyo needs one>
   NEXT_PUBLIC_XEVYO_URL=http://localhost:8787
   ```
   Remove any old `NEXT_PUBLIC_XEVYO_PUBLIC_KEY` line — the proxy now sends the key.
2. Terminal 1: `npm run si:proxy` → you should see `✓ Biongevity SI proxy on http://localhost:8787`.
3. Terminal 2: `npm run dev` → open http://localhost:3000 and ask a question.

If the proxy prints `→ 401` or `→ 403`, the key is wrong; `→ 404`, the upstream URL is wrong.

## Live site

Deploy `deploy/xevyo-worker.js` as a Cloudflare Worker (steps at the top of the file), store the key and
upstream URL as Worker secrets, set `ALLOWED_ORIGINS` to the live domain(s), then build the site with
`NEXT_PUBLIC_XEVYO_URL=<worker URL>`.

Never put the key in code, zips, docs or chat.
