# Biongevity website — deploy guide (DevOps)

Repo: `arshdeepsingh11/Biogenvity`, branch **`ai/neural-noir`**.
The site is a **static export** (Next.js 15, `output: "export"`, `trailingSlash: true`). The build produces a plain
`out/` folder — no Node server is needed in production.

## 1. Build

```bash
# Node 20 LTS (or 22)
npm ci
cp .env.production.example .env.production   # then fill in the values (see section 3)
npm run build                                 # → out/
```

Smoke-test locally: `npx serve out` → http://localhost:3000.

## 2. Host `out/` on the live domain

Any static host works (Cloudflare Pages, Netlify, Vercel static, S3 + CloudFront, nginx).

- **Cloudflare Pages** (recommended — the SI Worker lives on Cloudflare too): build command `npm run build`, output
  directory `out`, Node 20, add the variables from section 3 under *Environment variables (Production)*.
- **nginx**: serve `out/` as the root; URLs end in `/` and map to `…/index.html`:
  ```nginx
  location / { try_files $uri $uri/ $uri/index.html =404; }
  error_page 404 /404.html;
  ```
- Point **biongevity.com** (and www → redirect to apex) at the host; HTTPS on.
- Cache: `/_next/static/*` can be cached for a year (immutable); HTML should be `no-cache`.

## 3. Environment variables (build time)

| Variable | Production value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://biongevity.com` | canonical URLs, sitemap |
| `NEXT_PUBLIC_APP_URL` | `https://app.biongevity.com` | Join / Sign in / Book consult / Digital Twin |
| `NEXT_PUBLIC_XEVYO_URL` | the Worker URL from section 4 | Biongevity SI chat |
| `NEXT_PUBLIC_XEVYO_MODEL` | `xevyo` | |
| `NEXT_PUBLIC_XEVYO_PUBLIC_KEY` | *(empty)* | never put the Xevyo key in the site |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | from the Shopify team | optional (cart permalinks) |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | webhook URL | optional (contact form) |

`NEXT_PUBLIC_*` values are compiled into public JavaScript — a rebuild is needed after changing them.

## 4. Biongevity SI (Xevyo) — Cloudflare Worker

The Xevyo API key must stay server-side. `deploy/xevyo-worker.js` forwards chat requests to Xevyo, adds the key, and
only allows the site's own domains.

```bash
npm i -g wrangler && wrangler login
cd deploy
npx wrangler secret put XEVYO_API_KEY          # paste the key from the Xevyo console (Keys)
npx wrangler secret put XEVYO_UPSTREAM_URL     # https://chat.xevyo.com/xevyo/v1/chat/completions
# ALLOWED_ORIGINS is already set in deploy/wrangler.toml (biongevity.com + www)
npx wrangler deploy                            # → note the Worker URL
```

Then set `NEXT_PUBLIC_XEVYO_URL` to the Worker URL and rebuild the site.
Check: open the live site → Ask Biongevity SI → "Hi". `HTTP 401` = key wrong; `HTTP 404/405` = upstream URL wrong.
Set a monthly token limit on the key in the Xevyo console.

## 5. After go-live

- Submit `https://biongevity.com/sitemap.xml` in Google Search Console.
- `robots.txt` and `llms.txt` are generated into `out/`.
- Booking links go to `https://app.biongevity.com/en/patient/cons-categories`; Join goes to
  `https://app.biongevity.com/en/auth/signup` — confirm both with the app team.
- Shopify: product handles → variant ids in `src/config/shopify.ts` (Shopify backend team).
