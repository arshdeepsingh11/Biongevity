# Tracking & conversion events

**Google Tag Manager is built in:** container **GTM-PH9BZ2TR** loads on every page (after the page is interactive).
Override with `NEXT_PUBLIC_GTM_ID`, or set it to `off` for local tests.

**GA4 (Measurement ID G-GKPG2B7BWE) goes inside GTM, not in the code.** The Google tag note says: use the code OR the ID,
not both. The site loads GTM only, so in GTM add one **Google tag** with `G-GKPG2B7BWE` (trigger: Initialization – All Pages).
Do not also paste the gtag.js snippet anywhere, or page views are counted twice.

Every event is pushed to `window.dataLayer` with `page_path`, `region` (`uae` on Dubai pages in English or Arabic,
otherwise `intl`) and `language` (`en` or `ar`). Check them in the browser console: `dataLayer`.

| Event | When | Extra fields |
|---|---|---|
| `page_view` | each route change (GTM records the first view itself) | `page_title` |
| `book_click` | any **Book now** button (`a[data-book]`; on Dubai pages it opens WhatsApp) | `placement` (section), `text`, `item` (English service name, e.g. HydraFacial, also on Arabic pages), `channel` |
| `whatsapp_click` | any WhatsApp link, including the fixed button | `placement`, `text`, `item`, `channel` |
| `call_click` | any phone link | `placement`, `text`, `item` |
| `enquiry_submit` | contact form sent, or opened as WhatsApp / email | `interest`, `via` |
| `ai_book_click` | Book now / WhatsApp pressed inside the AI assistant | `placement`, `text`, `item` |
| `region_change` | International / Dubai switch used | `to` |

`item` is always the **English** service name, so English and Arabic pages report the same service in one row.
The treatment finder sends `item: "Finder: <concern>"` (e.g. `Finder: Dull or tired skin`).

**Suggested GA4 key events (conversions):** `book_click`, `whatsapp_click`, `enquiry_submit`, `ai_book_click`, `call_click`.

**GTM setup (10 minutes)**
1. Tags → New → **Google tag** → Tag ID `G-GKPG2B7BWE` → trigger *Initialization – All Pages*.
2. Variables → New → *Data Layer Variable* for `placement`, `item`, `channel`, `region`, `language`, `text`, `interest`.
3. Tags → New → **GA4 Event**, one per event above, trigger *Custom Event* with the same name; map the variables as event parameters.
4. In GA4 → Admin → Events, mark the five events above as key events. Publish the GTM container.
5. Test with GTM *Preview* on https://biongevity.com/uae/ (tap Book now on a service page and check `item`).

Tracking is wired in `src/components/layout/Analytics.tsx` (one delegated click listener, so new buttons are tracked
automatically) and `src/lib/track.ts`.
