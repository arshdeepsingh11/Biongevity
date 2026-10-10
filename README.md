# ◐ Biongevity

> Precision health. Shared longevity. — an AI-native interface for BioAro.

```
status   ▸ online
theme    ▸ aurora-glass · light · blue · zero pink
stack    ▸ next 15 · react 19 · typescript · tailwind · gsap · three · webgl
targets  ▸ web · ios · android (capacitor)
backend  ▸ none — store links resolve to bioarolabs.com · bioarodrugs.com · biongevity.com
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
| `/` | Hero · brand film · 360° signal · disciplines · **store + AI match** · stories · BioELR · global clinic · programs |
| `/precision-health/[9]` | Internal Medicine · Cardiology · Dermatology · Dental · Women's · Men's · Gut · Gastroenterology · Mental Health |
| `/clinic/[3]` | Longevity Journey · Virtual Clinic · UAE Precision Clinic |
| `/packages` | Core $369 · Precision $699 · Elite $999 |
| `/life` · `/app` · `/insights` · `/about` · `/contact` · `/dashboard` | Discover |

Navigation is a **Sparkle Navbar** fixed bottom-centre. Hovering Precision or Clinic opens a live preview of each page.

## ▸ Intelligence layer

- **⌘K assistant**, grounded on site data · live model via `NEXT_PUBLIC_AI_ENDPOINT`
- **Status HUD**: Scanning → Synthesizing → Ready, follows scroll
- **Ambient signal field** · **neural tap pulse** · **cursor edge light** on glass cards
- **Text**: Text Animate · Aurora · Dia Reveal · Morphing · 3D Flip · Decode
- **Data**: Number Ticker · Progress Ring · Animated List · Signal Convergence · Terminal

## ▸ Palette

`#FFFFFF` bg · `#F5F7FA` subtle · `#0F172A` text · `#64748B` secondary
`#2563EB` accent · `#3B82F6` soft · `#EFF6FF` tint · `#F59E0B` / `#FB923C` warm (tiny)

## ▸ Media

`public/media/` — brand film, clinic film, three stories (web-encoded H.264).
Slots wired in `src/config/media.ts` and `src/data/clinic.ts`.

## ▸ Mobile

```bash
npx cap add ios && npx cap add android
npm run cap:sync
```

---
`BioAro Inc. · Calgary · Dubai · Almelo` — educational information, not medical advice.
