# Biongevity — Web + Mobile Frontend

Futuristic, AI-first frontend for **Biongevity** (precision health & longevity medicine), unifying **BioAro Labs** (tests) and **BioAro Drugs** (bioactive formulas). Light premium palette, **DM Sans only**, Apple design principles.

**No backend.** Commerce runs on the **Shopify Storefront API** from the client. The same static build ships to the web and, through **Capacitor**, to iOS and Android.

## Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, `output: "export"`) + React 19 + TypeScript |
| Styling | Tailwind CSS 3 (design tokens in `tailwind.config.ts`) |
| Motion / 3D | Framer Motion, GSAP ScrollTrigger, three.js, raw WebGL shaders, cobe |
| Commerce | Shopify Storefront GraphQL API (cart + checkout) |
| Mobile | Capacitor 6 (wraps `/out`) |

## Run
```bash
npm install
cp .env.example .env.local   # optional: add Shopify Storefront credentials
npm run dev                  # http://localhost:3000
npm run build                # static export → ./out
```

## Shopify (for the store developer)
1. In Shopify Admin → *Apps → Develop apps*, create a Storefront API token with product, collection, and cart scopes.
2. Set `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` in `.env.local`.
3. **Product handles must match** the handles in `src/data/labs.ts` and `src/data/drugs.ts` (e.g. `longevity-plus`, `whole-genome-sequencing-30x`). Use the Shopify vendor `BioAro Labs` or `BioAro Drugs`.
4. Without credentials the app runs in **demo mode**: local catalog, local cart, and checkout disabled.

When Shopify is live, its price, image, stock, and variant ID override the local data. Rich local fields such as ingredients stay in place (`mergeProduct()` in `src/lib/shopify/index.ts`).

## Mobile app (Capacitor)
```bash
npm i -D @capacitor/ios @capacitor/android
npx cap add ios && npx cap add android
npm run cap:sync          # build + copy ./out into native projects
npm run cap:ios           # open Xcode   |   npm run cap:android → Android Studio
```
On phones the layout uses the Apple Dock as a bottom tab bar, safe-area insets, and touch-first effects.

## Videos & images — drop-in slots
Edit **`src/config/media.ts`** and put files in `/public/media`. Every slot shows a labelled placeholder until a `video` or `image` path is set:
`heroVideo, videoText, labsVideo, drugsVideo, clinicHero, appVideo, homeLabs, homeDrugs, lifeHome, lifeOffice, lifeTravel, founder` (plus `journal-<slug>` per article).

## AI layer (no backend required)
- **Biongevity AI** assistant (⌘K / Ask AI): grounded on the site's own data, with prepared answers. Set `NEXT_PUBLIC_AI_ENDPOINT` to a POST `{prompt} → {text}` endpoint for live answers.
- **AI HUD**: follows the scroll and names the section being "analysed" (`data-ai` attributes).
- **Every touch**: neural tap ripple; **every scroll**: reveal + AI scan sweep and an iridescent progress bar; cursor aura on desktop.
- **Calm mode**: effects are muted on Clinic and Mental Health pages.

## Component map (requested list → file in `src/components/fx/`)
| Component | File | Used on |
|---|---|---|
| Focused 3D Marquee | `FocusedMarquee.tsx` | Home (departments) |
| Scroll Rotate Gallery | `ScrollSphereGallery.tsx` | Labs (test sphere) |
| Planet System | `PlanetSystem.tsx` | Life |
| Signal Convergence | `SignalConvergence.tsx` | Home (360° view) |
| 3D Cards Carousel | `CoverflowCarousel.tsx` | Drugs (product range) |
| Beam Flow | `BeamFlow.tsx` | Home hero, Drugs hero |
| Evervault Card | `EvervaultCard.tsx` | Labs, Dashboard (genome) |
| Apple Dock | `AppleDock.tsx` | Mobile tab bar, App page |
| Dynamic Navigation | `DynamicNav.tsx` | Header; Dashboard tabs |
| Bento Grid | `BentoGrid.tsx` | Home (ecosystem) |
| Animated List | `AnimatedList.tsx` | Home (BioELR feed), Dashboard |
| Globe | `Globe.tsx` | Home, Clinic, About |
| Confetti | `Confetti.ts` | Add to bag, bookings, forms, plan complete |
| Video Text | `VideoText.tsx` | Home ("LONGEVITY") |
| Terminal | `Terminal.tsx` | Home (BioELR demo) |
| Shine Border | `ShineBorder.tsx` | AI cards, featured package |
| Number Ticker | `NumberTicker.tsx` | Hero stats, bio-age |
| Morphing Text | `MorphingText.tsx` | Home hero |
| Text 3D Flip | `Text3DFlip.tsx` | Section titles |
| Animated Circular Progress | `ProgressRing.tsx` | Journey, Dashboard |

## Routes (83 static pages)
`/` · `/precision-health` + 11 departments · `/packages` · `/labs` · `/labs/tests` + 47 test pages · `/drugs` · `/drugs/shop` + 8 product pages · `/journey` · `/life` · `/clinic` · `/app` · `/journal` · `/about` · `/contact` · `/dashboard` (demo) · `/cart`

## Content sources
- biongevity.com: mission, services, care model, departments, packages
- bioarolabs.com: 47 tests with prices, 9 categories, how-it-works, BioAro Intelligence, support contacts
- bioarodrugs.com: 8 products with prices, LONgevity+ full formulation, principles, personas, example protocol, founder

Content was de-duplicated: each fact lives in one data file under `src/data/`.

### Open content items (marked `TODO(content)` or "to confirm" in the UI)
- Biongevity enquiry phone and email; clinic street addresses (Calgary, Dubai)
- Founder bio wording; sample collection type for some lab tests
- Package pricing (published in AED for the UAE program)
- Journal articles marked "Sample editorial"

## Folder layout
```
src/
  app/            routes (App Router)
  components/
    fx/           20 effect components
    ai/           assistant, HUD, interaction layer, knowledge
    commerce/     cart, product card/detail, catalog browser
    layout/       header, mobile dock, footer
    pages/        page-specific client components
    ui/           Icon, MediaSlot, Section helpers
  config/media.ts video/image slots
  data/           all content (single source of truth)
  hooks/          useInView, useReducedMotion, useShopifyCatalog
  lib/shopify/    Storefront API client, queries, types, adapters
```
