# Tracking & conversion events

Set `NEXT_PUBLIC_GTM_ID` (a Google Tag Manager container, `GTM-XXXXXXX`) and rebuild. GTM loads after the page is
interactive; GA4, Meta Pixel or any other tag is then configured inside GTM, not in the code.

Every event is pushed to `window.dataLayer` with `page_path` and `region` (`intl` or `uae`). Without a GTM id the
events still go to the dataLayer, so they can be checked in the browser console: `dataLayer`.

| Event | When | Extra fields |
|---|---|---|
| `page_view` | each route change (GTM records the first view itself) | `page_title` |
| `book_click` | any **Book now** button (`a[data-book]`) | `placement` (section name), `text` |
| `whatsapp_click` | any WhatsApp link, including the fixed button | `placement`, `text`, `channel` |
| `call_click` | any phone link | `placement`, `text` |
| `enquiry_submit` | contact form accepted (`via: sent`) or opened as an email draft (`via: mailed`) | `interest` |
| `ai_book_click` | Book now / WhatsApp pressed inside Biongevity SI's answer | `placement`, `text` |
| `region_change` | International / UAE switch used | `to` |

**Suggested GA4 conversions:** `book_click`, `whatsapp_click`, `enquiry_submit`, `ai_book_click`, `call_click`.

**GTM setup (5 minutes):** create a GA4 Configuration tag (All Pages), then one GA4 Event tag per row above with a
Custom Event trigger of the same name and the extra fields mapped as event parameters. Mark the five above as
conversions in GA4.

Tracking is wired in `src/components/layout/Analytics.tsx` (one delegated click listener, so new buttons are tracked
automatically) and `src/lib/track.ts`.
