# Biongevity v6 — UAE clinic site + International site (v6.1: Arabic + AI)

_20 Nov 2026 · branch `release/v6-uae` · built on the clinic team's version (first commit on the branch, unchanged)._

## What changed

| Area | Before | v6 |
|---|---|---|
| Structure | One site mixing Calgary, cardiology, BioAro Labs and Dubai | **Two sites in one build:** `/uae/…` = Dubai clinic, `/` = International |
| UAE departments | 14 Calgary departments (cardiology, heart failure, geriatrics…) | **The clinic's 8 departments**, each with an overview page |
| Service pages | — | **83 service pages**, one per treatment on the clinic's list (names word for word) |
| Prices | CAD/AED programmes and BioAro Labs prices | **No clinic prices.** Every page sends visitors to WhatsApp for prices and offers; 5% VAT note |
| Booking | Member-app booking link | **Book now = WhatsApp** pre-filled with the service name; call and enquiry form as backup |
| Calgary / BioAro | On many pages | Removed from all public pages (old components kept in the repo, not used) |
| Design | Dark green theme, many AI effects | Light warm ivory + deep navy + champagne gold; one accent colour per department; real clinic photos |
| International | Calgary head office | Technology, longevity, "US launch March 2027", "other countries coming soon"; no clinic details |

## v6.1 — Arabic, AI assistant, finder, International redesign

| Area | What was added |
|---|---|
| **Arabic** | Every Dubai page also in Arabic at `/ar/uae/…` (same slugs): 8 departments, 83 services, home, about, contact, supplements. Right-to-left layout, IBM Plex Sans Arabic font, `lang="ar" dir="rtl"` in the HTML (good for Google), hreflang EN↔AR, both languages in the sitemap. **EN / ع switch** in the header (same page, other language, remembered). Arabic WhatsApp messages also carry the English service name so the team can act fast. |
| **AI assistant (infrastructure)** | New "Biongevity AI" button and panel on all Dubai pages (EN + AR), new icon, suggestion chips, streaming answers, **highlight any text → "Ask AI about this"**, hero prompt bar, page context, knowledge files `/ai/knowledge-en.json` and `/ai/knowledge-ar.json`, hand-off hook for the EMR/ELR. Off until the AI team sets `NEXT_PUBLIC_AI_URL`; until then it shows related pages + WhatsApp, clearly marked "not an AI answer". Guide: `docs/AI_INTEGRATION.md`. |
| **Treatment finder** | "What would you like to improve?" — 12 concerns (dull skin, lines, acne, dark spots, hair thinning, unwanted hair, low energy, weight, full check, ageing well, smile, care at home) → 2–3 treatments → Book now / Ask our team. Picks are set by the clinic in `src/content/uae/index.ts` (`CONCERNS`). |
| **Details** | True-number counters (8 departments, 83 treatments, 3 ways to be seen, 2 languages), looping "Longevity for your skin / heart / gut…" headline, soft spotlight on cards, travelling light on key cards, shiny hero badge. All respect "reduce motion". |
| **International** | Own calmer palette (midnight indigo + aurora mint + cool pearl). Orbit visual of what we measure, availability strip (Dubai open · US March 2027 · others soon), 5-step loop (measure → analyse → plan → follow → re-test) and the rhythm of follow-up, technology + app illustration, planned programmes (no prices, USD at launch), dotted world map, US waitlist. |
| **Tracking** | GTM **GTM-PH9BZ2TR** built in. GA4 **G-GKPG2B7BWE** is added inside GTM (not in code) to avoid double counting. Events now include `language`. See `docs/TRACKING.md`. |
| **Quality** | 80 unit tests (Arabic mirrors English exactly, finder links, AI rules), 193 pages × 3 screen sizes checked in a real browser: no errors, no overflow, one H1, correct language and direction. No Calgary / CAD / Glutara / SleepO / cardiology on any page or in the page scripts. |

### Where things live (v6.1)

| What | File |
|---|---|
| Arabic text for departments and services | `src/content/uae/ar/*.ts` (same ids and slugs as English) |
| Arabic/English UI words, WhatsApp messages | `src/i18n/dict.ts` |
| Page layouts (shared by EN and AR) | `src/views/uae/*.tsx` |
| English / Arabic routes | `src/app/(site)/uae/…` and `src/app/(arabic)/ar/uae/…` |
| AI assistant | `src/components/ai/AiDock.tsx`, `AskBar.tsx`, `src/lib/ai/*` |
| International page | `src/app/(site)/page.tsx`, colours in `src/styles/themes.css` (`[data-region="intl"]`) |

## How the two sites work

- **URL decides the site.** Everything under `/uae/` uses the Dubai header, footer, WhatsApp button and mobile Book bar. Everything else is International.
- **Default for UAE visitors.** A first visit to `/` from a Gulf time zone or a UAE/Gulf language setting goes to `/uae/` before the page shows. A saved choice wins (the "International" and "Dubai clinic" links save it). Search engines are not redirected.
  - For true IP-based routing, add a Cloudflare rule: `ip.geoip.country eq "AE"` and path `/` → redirect to `/uae/` (302).
- **Old URLs** redirect to the nearest new page: `public/_redirects` (Cloudflare Pages / Netlify). On nginx, copy the same rules.

## Where things live

| What | File |
|---|---|
| 8 departments and 83 services (all text) | `src/content/uae/*.ts` |
| Order of departments, popular treatments, "longevity for…" tiles | `src/content/uae/index.ts` |
| Clinic phone, WhatsApp, email, address, WhatsApp messages | `src/content/contact.ts` |
| UAE supplements (approved only) and US store links | `src/content/supplements.ts` |
| Doctors (empty until the clinic sends details) | `src/content/team.ts` |
| Photos (stock + real clinic frames) | `src/content/photos.ts`, `/public/photos` |
| Colours (theme + department accents) | `src/styles/themes.css` (`data-theme="clinic"`, `[data-dept=…]`) |
| Layout styles | `src/styles/site.css` |
| Pages | `src/app/(site)/page.tsx` (International), `src/app/(site)/contact/`, Dubai routes in `src/app/(site)/uae/**` and `src/app/(arabic)/ar/uae/**` → layouts in `src/views/uae/` |
| Content rules test (official list word for word, no Glutara/SleepO in UAE, no prices) | `tests/uae-content.test.ts` |

To add or rename a service: edit the department file in `src/content/uae/`, update the list in `tests/uae-content.test.ts`, run `npm test`.

## Supplements rule (UAE)

- Listed: **LONgevity+**, **CellOmega+ (fish-oil version only)**, **Creagen**.
- Never listed in the UAE: **Glutara**, **SleepO** (not approved). The test fails if they appear.
- No product photos on UAE pages, because UAE packaging differs from the US store photos.

## Tracking (Google Ads / GA4)

GTM-PH9BZ2TR is built in; add GA4 (G-GKPG2B7BWE) inside GTM. Every Book now, WhatsApp and Call click sends `book_click` / `whatsapp_click` / `call_click` with `item` (the service, e.g. "HydraFacial"), `placement` (the page section) and `region` (`uae` or `intl`) and `language` (`en` or `ar`). See `docs/TRACKING.md`.

## Still needed from the clinic

1. **Doctors:** name, title, qualifications, DHA licence number, languages, short bio, approved photo → `src/content/team.ts`.
2. **Credentials:** licences and accreditations they want shown.
3. **Photos:** real clinic and team photos and happy, multi-ethnic families (stock photos are used until then).
4. **Creagen:** the names of all 5 Creagen formulas sold in the UAE.
5. **CellOmega+ (fish):** label details if they want ingredients shown.
6. **International phone number** (International pages show email only).
7. **Opening hours** for the Dubai clinic.
8. **GA4 inside GTM** (see `docs/TRACKING.md`) and (optional) `NEXT_PUBLIC_CONTACT_ENDPOINT` for the enquiry form (without it the form opens WhatsApp).
9. **Arabic proofreading:** a native Arabic speaker at the clinic should read the Arabic pages once (medical wording, tone) before ads point to them. Text lives in `src/content/uae/ar/` and `src/i18n/dict.ts`.
10. **AI team:** connect the assistant with `NEXT_PUBLIC_AI_URL` (through a proxy that holds the key) — see `docs/AI_INTEGRATION.md`.

## Not in this release

- **The AI model itself**: the AI team connects it (`docs/AI_INTEGRATION.md`). The website part (panel, highlight-to-ask, knowledge, hand-off) is ready, and booking works with or without AI. The old Biongevity SI code is still in the repo but not used.
