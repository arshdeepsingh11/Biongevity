> **v6 (Nov 2026):** the site has two faces: `/uae/…` (Dubai clinic) and `/` (International). `public/_redirects`
> sends old URLs (precision-health, clinic, shop…) to the new pages on Cloudflare Pages / Netlify; on nginx add the
> same rules as `return 301`. Optional: a Cloudflare rule to send UAE IPs from `/` to `/uae/`. See `docs/V6_UAE_RELEASE.md`.

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
- **Security + cache headers**: `public/_headers` (copied to `out/_headers`) is applied automatically by
  Cloudflare Pages and Netlify. On nginx, add the same headers:
  ```nginx
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header Permissions-Policy "camera=(self), microphone=(self), geolocation=(), payment=(), usb=()" always;
  add_header Content-Security-Policy "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'" always;
  location /_next/static/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  ```
- Contact form: set `NEXT_PUBLIC_CONTACT_ENDPOINT` to a webhook that accepts JSON and returns 2xx. Without it,
  "Send request" opens a pre-filled email to info@biongevity.com instead.

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

The Xevyo API key must stay server-side. `deploy/xevyo-worker.js` forwards chat requests to Xevyo, adds the key,
and applies `deploy/si-policy.mjs`: safety rules first, model fixed by the Worker, size limits, and a
per-visitor rate limit (10/minute). Details: `docs/XEVYO_PROXY.md`.

```bash
npm i -g wrangler && wrangler login
cd deploy
npx wrangler secret put XEVYO_API_KEY          # paste the key from the Xevyo console (Keys)
npx wrangler secret put XEVYO_UPSTREAM_URL     # https://chat.xevyo.com/xevyo/v1/chat/completions
# ALLOWED_ORIGINS, XEVYO_MODEL and the rate limit are set in deploy/wrangler.toml
# (website + www + the iOS/Android Capacitor apps)
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
