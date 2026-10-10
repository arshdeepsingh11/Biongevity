# ◐ Biongevity

> Precision health. Shared longevity. An AI-native interface for BioAro.

```
theme    ▸ aurora-glass · rich · navy / blue / teal / gold · light only
stack    ▸ next 15 (static export) · react 19 · typescript · tailwind · framer-motion · gsap · lucide
targets  ▸ web · ios · android (capacitor)
backend  ▸ none. shopify hosts checkout · xevyo hosts AI · everything else is static
```

## ▸ Boot

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # → localhost:3000
npm run build                # → ./out (static)
```

## ▸ Map

| Route | What's there |
|---|---|
| `/` | Hero · data-stream explorer · discipline explorer · shop + quiz · stories · BioELR · interactive world map · programs |
| `/precision-health/[9]` | Tabs: Overview · Care & tests · Evidence · Lab tests · Self-check · Specialist & FAQ |
| `/clinic/journey` | The journey · Biological age · What you get · Programs |
| `/clinic/virtual` | How it works · Virtual or in person · Remote BP program (7-day tracker) · Join |
| `/clinic/uae` | Overview · Assessments (radar) · Departments · Visit |
| `/shop` | Programs · Lab tests · Formulas · Find my match (`?tab=`) |
| `/life` `/app` `/insights` `/about` `/contact` `/dashboard` | Discover |

## ▸ Xevyo (in-house AI)

No answers live in the frontend. The chat sits bottom-right and shows **not connected** until `NEXT_PUBLIC_XEVYO_URL` is set.

```http
POST $NEXT_PUBLIC_XEVYO_URL
Authorization: Bearer $NEXT_PUBLIC_XEVYO_PUBLIC_KEY   # optional, publishable
Content-Type: application/json

{ "message": "…", "history": [{ "role": "user|assistant", "content": "…" }],
  "context": { "page": "shop" }, "sessionId": "…" }
```

Reply with JSON `{ "reply": "…", "sources": [{ "title", "url" }] }`, or stream `text/event-stream` (`data: token` … `data: [DONE]`) / chunked `text/plain`. Client: `src/lib/xevyo.ts`.

## ▸ Shopify

Buy buttons call `buyUrl()` in `src/lib/commerce.ts`:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` set **and** a variant id in `src/config/shopify.ts` → Shopify cart permalink (`/cart/{variant}:1`). Shopify hosts checkout.
- Otherwise → the official product page on bioarolabs.com, bioarodrugs.com or biongevity.com.

Quiz results can open a multi-item cart with `bundleUrl()`. No server, no secrets.

## ▸ Data

| File | Holds |
|---|---|
| `data/health.ts` | 9 departments · packages · pillars |
| `data/care.ts` | When to see us · care & tests · FAQ · self-check per department |
| `data/stats.ts` | Cited figures (WHO, GLOBOCAN, Hypertension Canada…) behind every chart |
| `data/labs.ts` · `data/drugs.ts` | BioAro Labs tests · BioAro Drugs formulas |
| `lib/quiz.ts` | Deterministic, on-device match scoring |

Figures carry their source. Anything marked *illustrative* is a teaching example, not member data.

## ▸ Env

Static export: every variable is public. **Never put secrets in `.env`.** See `.env.example`.

## ▸ Mobile

```bash
npx cap add ios && npx cap add android
npm run cap:sync
```

---
`BioAro Inc. · Calgary · Dubai · Almelo`. Educational information, not medical advice.
