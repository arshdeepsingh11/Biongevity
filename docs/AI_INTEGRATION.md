# AI assistant — integration guide (for the AI team)

The website ships the **infrastructure** for the Dubai AI assistant. The model, prompts on the server, memory,
EMR/ELR summaries and analytics are the AI team's work. Nothing here pretends to be the AI: when the AI is off or
fails, the panel says so and shows matching pages from the site plus WhatsApp.

## What the website already does

| Piece | Where | What it does |
|---|---|---|
| Launcher | `src/components/ai/AiDock.tsx` | "Biongevity AI" button above the WhatsApp button on every Dubai page (EN + AR). New mark: `AiMark.tsx`. |
| Chat panel | same | Side sheet (desktop) / bottom sheet (phone), RTL in Arabic, streaming answers, stop, new chat, suggestions. |
| Highlight-to-ask | same | Select any text on a page → "Ask AI about this" chip → the panel opens with the selection and the page section. |
| Hero prompt bar | `src/components/ai/AskBar.tsx` | Question box + suggestion chips on the Dubai home page. |
| Open from anywhere | `src/components/ai/events.ts` | `openAssistant({ q, selection, section })` dispatches `bio:ask`. |
| Client | `src/lib/ai/client.ts` | POST + SSE/JSON parsing. No key in the code. |
| House rules | `src/lib/ai/prompt.ts` | System message with the clinic's business rules (no prices, 5% VAT, UAE supplements only, emergencies). |
| Knowledge | `/ai/knowledge-en.json`, `/ai/knowledge-ar.json` | Every department, service (83 × 2 languages), supplement and clinic fact, built from `src/content` at build time. Also the treatment-finder concerns. |
| Grounding | `src/lib/ai/search.ts` | Up to 4 numbered passages from the knowledge files are sent with each question. |
| Hand-off | `src/lib/ai/handoff.ts` | Sends the conversation when the visitor taps Book/WhatsApp in the panel, or closes it. |
| Tracking | `docs/TRACKING.md` | Book/WhatsApp inside the panel → `ai_book_click` with `item`. |

## Switch it on

Set at build time (Cloudflare Pages → Settings → Environment variables), then redeploy:

```
NEXT_PUBLIC_AI_URL=https://ai.biongevity.com/v1/chat/completions   # your proxy, NOT the provider directly
NEXT_PUBLIC_AI_MODEL=xevyo                                          # optional
NEXT_PUBLIC_AI_HANDOFF_URL=https://ai.biongevity.com/v1/handoff     # optional
```

**Never put a secret key in a `NEXT_PUBLIC_*` value** (it is visible in the browser). The endpoint must be a proxy
(e.g. the Cloudflare Worker in `docs/XEVYO_PROXY.md`) that holds the key as a server secret, checks the `Origin`
(biongevity.com), rate-limits and adds/overrides the system prompt. `NEXT_PUBLIC_XEVYO_PUBLIC_KEY` must stay empty in
the live build.

## Request (browser → your endpoint)

```json
POST NEXT_PUBLIC_AI_URL
{
  "model": "xevyo",
  "stream": true,
  "messages": [
    { "role": "system", "content": "…house rules + page + highlighted text + numbered website passages…" },
    { "role": "user", "content": "…" }, { "role": "assistant", "content": "…" },
    { "role": "user", "content": "What happens during a HydraFacial?" }
  ],
  "biongevity": { "site": "uae", "locale": "en" | "ar", "page": "/uae/dermatology-aesthetics/hydrafacial/", "sessionId": "uuid" }
}
```

## Response (any of these)

- **SSE** `text/event-stream`: `data: {"choices":[{"delta":{"content":"…"}}]}` … `data: [DONE]` (OpenAI style), or `data: {"token":"…"}`.
- **JSON**: `{ "reply": "…" }` or `{ "choices": [{ "message": { "content": "…" } }] }`.
- Plain chunked text.

Formatting shown in the panel: paragraphs, `- ` bullets, `**bold**`, `[1]` citations. HTML is not rendered.

## Hand-off (browser → NEXT_PUBLIC_AI_HANDOFF_URL)

Sent with `navigator.sendBeacon` (JSON):

```json
{ "sessionId": "uuid", "locale": "ar", "page": "/ar/uae/dental-care/", "reason": "book" | "whatsapp" | "close",
  "item": "Scaling & Polishing", "messages": [{ "role": "user", "content": "…" }, { "role": "assistant", "content": "…" }],
  "at": "2026-11-20T10:15:00.000Z" }
```

Your server summarises it and writes it to the EMR/ELR so the Dubai team can see the conversation when the visitor
messages on WhatsApp. **You are responsible for consent, storage, retention and access** under UAE health-data rules
(e.g. Federal Law No. 2 of 2019 and DHA policies). Add a consent line in the panel before enabling this in production.

## Business rules the AI must follow (also in `prompt.ts`)

1. Dubai clinic services only (the 8 departments / 83 services). No other clinics, countries or prices.
2. **Never state a price.** Prices and offers are shared on WhatsApp; 5% VAT is added at booking and check-in.
3. UAE supplements: LONgevity+, CellOmega+ (fish oil), Creagen (5 formulas). **Never Glutara or SleepO**, never vegan CellOmega+.
4. Educate, do not diagnose or prescribe; a doctor confirms. Emergencies: 998 (ambulance) / 999.
5. Reply in the page language (Arabic on `/ar/…`). Brand names stay in Latin letters.
6. Skin and wellness first (about half of Dubai revenue); cross-sell only when genuinely useful.

## When the AI is off or fails

The panel shows "From our website · not an AI answer", 3 related pages (the clinic's own treatment-finder picks when
the question matches a concern, otherwise keyword matches) and Book now / WhatsApp. The booking funnel never depends
on the AI.

## Test locally

```
npm run si:proxy          # see docs/XEVYO_PROXY.md (key in .env.local, git-ignored)
NEXT_PUBLIC_AI_URL=http://127.0.0.1:8787 npm run dev
```
