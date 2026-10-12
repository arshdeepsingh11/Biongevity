<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:D9BE8E,50:B08A55,100:7FA083&height=200&section=header&text=Biongevity&fontColor=FFFDF9&fontSize=60&fontAlignY=36&animation=fadeIn&desc=Precision%20Health%20%C2%B7%20Shared%20Longevity&descSize=18&descAlignY=58" width="100%" alt="Biongevity" />

<img src="https://readme-typing-svg.demolab.com?font=DM+Sans&weight=500&size=20&duration=2600&pause=900&color=97703F&center=true&vCenter=true&width=680&lines=Genomics%2C+biomarkers+and+microbiome+%E2%80%94+connected+by+AI;14+departments+%C2%B7+47+lab+tests+%C2%B7+8+bioactive+formulas;Static%2C+fast%2C+Shopify-ready+and+mobile-native" alt="Biongevity highlights" />

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-221D16?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-97703F?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-5E7F62?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-B8925C?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Shopify](https://img.shields.io/badge/Shopify-ready-7FA083?style=for-the-badge&logo=shopify&logoColor=white)
![Capacitor](https://img.shields.io/badge/iOS%20%26%20Android-Capacitor-8A6A3A?style=for-the-badge&logo=capacitor&logoColor=white)

</div>

---

## ◆ At a glance

| | | | |
|:--:|:--:|:--:|:--:|
| **14**<br/><sub>departments</sub> | **47**<br/><sub>BioAro lab tests</sub> | **8**<br/><sub>bioactive formulas</sub> | **30**<br/><sub>static pages</sub> |
| **17**<br/><sub>connected biomarkers</sub> | **3**<br/><sub>global clinics</sub> | **0**<br/><sub>backend servers</sub> | **100%**<br/><sub>JSON-LD coverage</sub> |

## ◆ Architecture

```mermaid
flowchart LR
  A[Static Next.js export] --> B[CDN / any host]
  A --> C[iOS · Android via Capacitor]
  B --> D[(Shopify checkout)]
  B --> E[(AI assistant endpoint)]
  B --> F[(Contact webhook)]
```

No custom backend. Checkout runs on Shopify, chat on a hosted AI endpoint, everything else ships as static HTML.

## ◆ Quick start

```bash
npm install
cp .env.example .env.local
npm run dev        # localhost:3000
npm run build      # static site → ./out
```

## ◆ What's inside

| Area | Highlights |
|---|---|
| **Home** | Live AI intent engine · data fusion graph · 17-biomarker constellation · research-based longevity simulator · department intelligence · goal → plan pipeline |
| **Precision Health** | 14 departments · overview, conditions, tests & prep, care path, cited evidence, FAQ |
| **BioAro Labs** | AI intelligence flow · 10 Bio families · full catalogue · packages · test matcher |
| **BioAro Drugs** | AI protocol builder · transparent dosing charts · science & quality |
| **Global Clinic** | Journey · Virtual Clinic with 7-day BP tracker · UAE assessments · interactive world map |
| **Shop** | Plan Studio live plan builder · Test / Package / Program ladder · one search across 63 items · site-wide bag with 3/6/12-month terms · prices in CAD |
| **Xevyo AI** | Ctrl X command bar · highlight any text to ask · page-aware smart questions · voice ask · AI plan review in the bag |
| **Design** | Champagne theme · Phosphor icons · SVG charts · floating 3D particle field · Magic UI–style motion |

## ◆ Search & AI discoverability

- `sitemap.xml` and `robots.txt` generated at build — open to Google, Bing, GPTBot, ClaudeBot, PerplexityBot and Applebot
- `llms.txt` summary for AI answer engines
- schema.org JSON-LD: `MedicalOrganization`, `MedicalClinic`, `MedicalWebPage`, `FAQPage`, `BreadcrumbList`
- Per-page titles, descriptions, keywords, canonical URLs and Open Graph

## ◆ Configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_XEVYO_URL` | AI assistant endpoint |
| `NEXT_PUBLIC_XEVYO_PUBLIC_KEY` | Publishable `xk-` key — browser-safe, domain-locked |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Enables Shopify cart permalinks |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Contact form webhook |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain |

Store settings (currency, program term prices, refund and shipping text) live in `src/config/store.ts`.

> All values are public in a static build — never store secrets in `.env`.

## ◆ Project structure

```
src/
├─ app/          routes · sitemap · robots
├─ components/   ai · charts · fx · dept · bioaro · shop · clinic · layout · ui
├─ data/         departments · labs · drugs · stats · clinic
└─ lib/          seo · commerce · catalog · intent · env
```

<div align="center">

<sub>© BioAro Inc. · Calgary · Dubai · Almelo — educational information, not medical advice.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7FA083,50:B08A55,100:D9BE8E&height=100&section=footer" width="100%" alt="" />

</div>
