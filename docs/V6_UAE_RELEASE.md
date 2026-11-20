# Biongevity v6 — UAE clinic site + International site

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
| Pages | `src/app/page.tsx` (International), `src/app/contact/`, `src/app/uae/**` |
| Content rules test (official list word for word, no Glutara/SleepO in UAE, no prices) | `tests/uae-content.test.ts` |

To add or rename a service: edit the department file in `src/content/uae/`, update the list in `tests/uae-content.test.ts`, run `npm test`.

## Supplements rule (UAE)

- Listed: **LONgevity+**, **CellOmega+ (fish-oil version only)**, **Creagen**.
- Never listed in the UAE: **Glutara**, **SleepO** (not approved). The test fails if they appear.
- No product photos on UAE pages, because UAE packaging differs from the US store photos.

## Tracking (Google Ads / GA4)

Set `NEXT_PUBLIC_GTM_ID`. Every Book now, WhatsApp and Call click sends `book_click` / `whatsapp_click` / `call_click` with `item` (the service, e.g. "HydraFacial"), `placement` (the page section) and `region` (`uae` or `intl`). See `docs/TRACKING.md`.

## Still needed from the clinic

1. **Doctors:** name, title, qualifications, DHA licence number, languages, short bio, approved photo → `src/content/team.ts`.
2. **Credentials:** licences and accreditations they want shown.
3. **Photos:** real clinic and team photos and happy, multi-ethnic families (stock photos are used until then).
4. **Creagen:** the names of all 5 Creagen formulas sold in the UAE.
5. **CellOmega+ (fish):** label details if they want ingredients shown.
6. **International phone number** (International pages show email only).
7. **Opening hours** for the Dubai clinic.
8. **GTM ID** and (optional) `NEXT_PUBLIC_CONTACT_ENDPOINT` for the enquiry form (without it the form opens WhatsApp).

## Not in this release

- **AI agent** (Biongevity SI): handled separately. Its code is still in the repo but not shown on the site. Booking works without AI.
