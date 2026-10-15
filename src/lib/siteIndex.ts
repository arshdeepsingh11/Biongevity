import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { CLINICS } from "@/data/clinic";
import { PACKAGES } from "@/data/health";
import { MARKERS } from "@/data/intelligence";
import { PLATFORM_LAYERS, TWIN_STATES, DOMAIN_SCORES, PLATFORM_QUESTIONS, ROADMAP } from "@/data/platform";
import { BIOELR_AI, BIOELR_MODULES, BIOELR_INTEROP, BIOELR_SCALE } from "@/data/bioelr";
import { AI_PRINCIPLES, AI_FAQ } from "@/data/governance";

/** One searchable passage of the site. Built at build time into /site-index.json and searched on-device (lib/retrieve.ts). */
export interface Passage { id: string; title: string; url: string; text: string }

const join = (xs: (string | undefined)[]) => xs.filter(Boolean).join(" ");

export function buildSiteIndex(): Passage[] {
  const out: Passage[] = [];
  const add = (id: string, title: string, url: string, text: string) => out.push({ id, title, url, text: text.replace(/\s+/g, " ").trim().slice(0, 900) });

  add("about", "About Biongevity", "/about/", "Biongevity is the longevity brand of BioAro Inc. in Calgary, with clinics in Calgary, Dubai and Almelo. Focus: healthspan — more good years — for adults about 40 to 65 and the families who support ageing parents. Protocol: baseline, personalised care plan, longitudinal monitoring, holistic care.");
  for (const d of DEPARTMENTS) {
    const url = `/precision-health/${d.id}/`;
    add(`d:${d.id}`, d.name, url, join([d.tag, d.summary, ...d.approach, "When to come:", ...d.when]));
    add(`d:${d.id}:services`, `${d.short} — services`, url, d.services.map((s) => `${s.t}: ${s.d}`).join(" "));
    d.faq.forEach((f, i) => add(`d:${d.id}:faq${i}`, `${d.short} — ${f.q}`, url, `${f.q} ${f.a}`));
  }
  for (const c of CLINICS) add(`c:${c.id}`, c.name, `/clinic/${c.id}/`, join([c.tag, c.summary, ...c.points.map((p) => `${p.t}: ${p.d}`)]));
  for (const p of PACKAGES) add(`p:${p.handle}`, `${p.name} program`, "/shop/#depth", join([`${p.name} longevity program, from ${p.price} ${p.currency} (${p.cadence}).`, ...p.diagnostics, ...p.ai, ...p.app, `Bioactives: ${p.bioactives}`]));
  for (const t of LAB_TESTS) add(`t:${t.handle}`, `${t.title} (BioAro Labs)`, "/precision-health/bioaro-labs/#catalog", join([t.summary, t.bestFor, `Price ${t.price} ${t.currency}.`]));
  for (const f of DRUG_PRODUCTS) add(`f:${f.handle}`, `${f.title} (BioAro Drugs)`, "/precision-health/bioaro-drugs/", join([f.tagline, f.summary, f.bestFor, ...(f.ingredients ?? []).map((i) => `${i.name} ${i.amount}`)]));
  for (const m of MARKERS) add(`m:${m.id}`, `${m.label} — biomarker`, "/#constellation", join([`${m.label} (${m.short}). Measured by: ${m.how}. Range: ${m.range}.`, m.fact, `Source: ${m.src}`]));

  add("platform", "Healthspan platform & digital twin", "/platform/", join([...PLATFORM_QUESTIONS.map((q) => `${q.q} ${q.d}`), "The digital twin lives in the Biongevity member app at app.biongevity.com."]));
  add("platform:layers", "Platform — seven layers", "/platform/", PLATFORM_LAYERS.map((l) => `${l.t}: ${l.d}`).join(" "));
  add("platform:twin", "Digital twin — six states", "/platform/", TWIN_STATES.map((s) => `${s.t}: ${s.d}`).join(" "));
  add("platform:scores", "Domain scores & Healthspan Index", "/platform/", "Not one opaque score: domain scores plus a transparent Healthspan Index with uncertainty. " + DOMAIN_SCORES.map((s) => `${s.t}: ${s.d}`).join(" "));
  add("platform:roadmap", "Platform roadmap", "/platform/", ROADMAP.map((r) => `${r.k}: ${r.d}`).join(" "));
  add("login", "Sign in to the Biongevity app", "/login/", "Members, clinicians and family members sign in to the Biongevity app at app.biongevity.com to see the digital twin, results, plan and coach.");

  add("bioelr", "BioELR — longevity health record for clinics", "/bioelr/", "BioELR is a longevity-focused health record system for clinics, resorts and communities. " + BIOELR_AI.map((a) => `${a.t}: ${a.d}`).join(" "));
  add("bioelr:modules", "BioELR modules", "/bioelr/", BIOELR_MODULES.map((m) => `${m.t}: ${m.d}`).join(" "));
  add("bioelr:interop", "BioELR interoperability & security", "/bioelr/", BIOELR_INTEROP.map((m) => `${m.t}: ${m.d}`).join(" "));
  add("bioelr:scale", "BioELR for communities, resorts and cities", "/bioelr/", BIOELR_SCALE.map((m) => `${m.t}: ${m.d}`).join(" "));

  add("ai", "How Biongevity's AI works", "/ai/", AI_PRINCIPLES.map((p) => `${p.t}: ${p.d}`).join(" "));
  AI_FAQ.forEach((f, i) => add(`ai:faq${i}`, `AI — ${f.q}`, "/ai/", `${f.q} ${f.a}`));
  add("twin", "Digital Twin tour", "/twin/", "The Biongevity Digital Twin in the app shows a Health Score (0-100 overall picture), a Recovery Score (readiness today from sleep, HRV and resting heart rate), HRV status in milliseconds, a Live Health Monitor (heart rate, HRV, steps, sleep), a 3D body with system statuses (Excellent, Good, Needs attention) compared with your own baseline, Health Trends for HRV, sleep, resting HR and steps (daily, weekly, monthly, yearly), Simulations and a Heat Map Simulator for what-if habits, AI Insight and an AI Coach. Sidebar: Overview, My Twin, Health Systems, Simulations, Heat Map Simulator, Trends, Reports, Coach. Open it at app.biongevity.com/en/patient/digital-twin.");
  add("scan", "AI Healthspan Scan", "/scan/", "A free 2-minute scan: 12 one-tap questions about age, goals, steps, sleep, blood pressure, smoking, alcohol, diet, weight, family history and last tests. Shows a radar of 9 health domains with uncertainty ranges, published population charts (steps, blood pressure, five healthy habits), the BioAro Labs tests that fit (buy on bioarolabs.com), matched BioAro Drugs formulas and a 12-month re-test timeline. Runs on your device; educational estimate, not a diagnosis.");
  add("family", "Family care for an ageing parent", "/family/", "For adult children caring for a parent: pick concerns such as memory, falls, heart, kidneys and medicines, mood or tiredness. Get a checklist, the right specialist (geriatric medicine, cardiology, internal medicine), relevant BioAro Labs tests, virtual visits, and a family view in the Biongevity app where the parent chooses what is shared.");
  add("navigator", "AI Test Navigator (BioAro Labs)", "/precision-health/bioaro-labs/#navigator", "Every BioAro Labs test scored on your device: utility = 40% evidence, 30% actionability, 20% cost, 10% breadth, plus a goal match. Value map chart of price vs utility, evidence mix, compare up to three tests, and buy on bioarolabs.com.");
  add("studio", "AI Protocol Studio (BioAro Drugs)", "/precision-health/bioaro-drugs/#studio", "Pick BioAro Drugs formulas and see a daily dose clock, an ingredient-overlap heatmap (for example creatine or vitamin B12 in several products), cost per order and buy links to bioarodrugs.com.");
  add("tools", "AI health tools", "/tools/", "Free AI tools: lab-result explainer (paste results, see flags, explain with Xevyo), visit-prep brief (print a one-page summary for your appointment), and specialist router (describe a problem, see the right department and test).");
  return out;
}
