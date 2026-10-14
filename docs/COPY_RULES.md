# Biongevity — copy rules (G0)

Short rules for every page, prompt and AI system message. When in doubt, choose the safer wording.

## Audience
- Main reader: **adults about 40–65** who want to act before disease appears.
- Second reader: **adult children** looking after an ageing parent ("my parent", "Mum/Dad").
- Clinics and institutions read `/bioelr/`.
- **Athletes are not our audience.** Performance and recovery for athletes belong to **The BioSport**. Use "stay strong and mobile", "muscle after 40", "recovery as you age" instead of "perform", "training load", "athlete".

## Words we use
| Use | Avoid |
|---|---|
| Extend **healthspan** (more good years) | "Extend life", "increase lifespan", "live forever" |
| "Helps you and your clinician notice changes earlier" | "Early disease detection", "prevents disease" |
| "AI drafts summaries and options for your clinician to review" | "AI medical advice", "AI diagnosis", "supports diagnoses" |
| "Built with privacy and security in mind" | "HIPAA-compliant" (until Legal confirms per country) |
| "A longevity-focused health record system" | "World's first …" (until verified) |
| Biological age **range** with confidence and drivers | One biological-age number |
| "Clinically governed — discuss with your clinician" | Supplements or drugs presented as advice |
| Wearables and home devices measure vitals | "Blood pressure from your face / camera" |

## Always
- Health pages: **"Educational information, not medical advice."**
- AI output: label **✦ Xevyo AI**; add "education, not a diagnosis".
- Example or demo data: label **Illustrative**.
- Urgent symptoms: point to **911** / emergency services.
- Prices in **CAD**. Do not link to the old `biongevity.com` site. The member app `app.biongevity.com` is fine.

## AI behaviour (also in `src/lib/xevyo.ts → systemPrompt`)
- Xevyo is called only on a click/send — never on page load.
- Health values are sent only after a consent tick, and never stored by the site.
- Answers prefer our pages (grounding) and cite them as [1]–[3].
- Reply language: English or Japanese (です・ます調).
