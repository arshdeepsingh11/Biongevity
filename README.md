# ◐ Biongevity

> Precision health & longevity — an AI-native interface for BioAro.

```
status   ▸ online
mode     ▸ neural-noir
stack    ▸ next 15 · react 19 · typescript · tailwind · three · webgl
targets  ▸ web · ios · android (capacitor)
backend  ▸ none — products resolve to bioarolabs.com / bioarodrugs.com
```

## ▸ Boot

```bash
npm install
npm run dev        # → localhost:3000
npm run build      # → ./out (static)
```

## ▸ Map

| Route | Signal |
|---|---|
| `/` | Hero · 360° signal · **AI product match** · 47 tests · 8 formulas · BioELR |
| `/precision-health` | 11 disciplines · AI triage |
| `/packages` | Programs: Core · Plus · Elite |
| `/care` | Journey · Anywhere · Clinics · ELR App |
| `/insights` | Articles with AI key points |
| `/about` · `/contact` · `/dashboard` | Company · enquiry · demo member |

Products never check out here. Every card opens its official page:
`bioarolabs.com/shop?test=<slug>` · `bioarodrugs.com/us/products/<handle>`

## ▸ Intelligence layer

- **⌘K assistant**, grounded on site data · optional live model via `NEXT_PUBLIC_AI_ENDPOINT`
- **Status HUD** — Scanning → Synthesizing → Ready, follows scroll
- **Ambient signal field** — particles stretch with scroll velocity
- **Neural pulse** on every tap · **edge light** follows the cursor on cards
- **Decode / scan / reveal** on every section · calm mode on Mental Health

## ▸ Palette — zero pink

`#05060A` deep · `#0A0C12` bg · `#11141C` surface · `#F2F4F8` text
`#3D8BFF` accent · `#00E5C0` AI signal · `#1A1F3A` indigo · `#FFB020` alert

## ▸ Media

Drop files in `public/media/`, wire them in `src/config/media.ts`.

## ▸ Mobile

```bash
npx cap add ios && npx cap add android
npm run cap:sync
```

---
`BioAro Inc. · Calgary` — educational information, not medical advice.
