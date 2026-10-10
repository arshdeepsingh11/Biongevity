import { DEPARTMENTS, PACKAGES } from "@/data/health";
import { LAB_AREAS, LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { BIOMARKERS } from "@/data/dashboard";
import { formatMoney } from "@/lib/utils";

/** Grounding facts sent to a live model (if NEXT_PUBLIC_AI_ENDPOINT is set). */
export const FACTS = `Longevity packages: ${PACKAGES.map((p) => `${p.name} USD ${p.price} (${p.cadence}; ${p.diagnostics.join(", ")})`).join("; ")}.
BioAro Labs (bioarolabs.com): at-home tests, clinician-reviewed, CLIA-registered labs. Tests: ${LAB_TESTS.map((t) => `${t.title} ${formatMoney(t.price)}`).join(", ")}.
BioAro Drugs (bioarodrugs.com): ${DRUG_PRODUCTS.map((p) => `${p.title} ${formatMoney(p.price)} (${p.summary})`).join(" ")} The builder uses stated goals and routine only, not biomarkers or genetics.
Precision departments: ${DEPARTMENTS.map((d) => d.name).join(", ")}. Offices: Calgary (head office, 403-250-2221), Dubai clinic (+971 4 379 6393), BioAro Europe (Almelo).`;

export function buildPrompt(q: string, context: string) {
  return `You are Biongevity AI, an educational assistant for Biongevity (precision health and longevity medicine, part of BioAro). Facts: ${FACTS}
The user is on the "${context}" page. Any dashboard data is illustrative demo data. Reply in under 100 words, plain text. Explain, list what is unknown, suggest questions for a clinician. Never diagnose, prescribe, or claim to have reviewed a real record. If unsure, say a coordinator can confirm.

User: ${q}`;
}

/** Prepared answers — used when no live AI endpoint is configured or it fails. */
export function preparedAnswer(q: string): string {
  const s = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => s.includes(x));

  const bm = BIOMARKERS.find((b) => s.includes(b.n.toLowerCase().split(" ")[0]));
  if (bm) return `${bm.n}: ${bm.what} What it doesn't tell you: ${bm.not} A question for your clinician: "${bm.q}" Dashboard values are illustrative demo data.`;

  const prod = DRUG_PRODUCTS.find((p) => s.includes(p.title.toLowerCase()) || s.includes(p.title.toLowerCase().split(" ").pop()!));
  if (prod) {
    const ing = prod.ingredients ? ` Per serving: ${prod.ingredients.map((i) => `${i.name} ${i.amount}`).join(", ")}.` : "";
    return `${prod.title} (${formatMoney(prod.price)}, ${prod.format}): ${prod.summary}${ing} Buy it on bioarodrugs.com, where every ingredient and amount is listed. Check with your clinician before starting it, especially if you take medication.`;
  }

  const test = LAB_TESTS.find((t) => s.includes(t.title.toLowerCase().split(" (")[0].toLowerCase()));
  if (test) return `${test.title} from BioAro Labs costs ${formatMoney(test.price)} on bioarolabs.com. Best suited for: ${test.bestFor ?? test.summary} Results are clinician-reviewed. A coordinator can confirm sample type and turnaround.`;

  const area = LAB_AREAS.find((a) => s.includes(a.name.toLowerCase()) || s.includes(a.k.toLowerCase()));
  if (area) return `${area.name}: ${area.explores} Sample: ${area.sample} It can show: ${area.shows} It doesn't establish: ${area.not} Tests start from ${formatMoney(area.from)}.`;

  if (has("difference", "compare", "core", "precision", "elite", "package", "price"))
    return "Biongevity has three longevity packages. Core (USD 369, baseline + annual): longevity genomics panel, gut microbiome snapshot, epigenetic ageing proxies and key hormones, plus the AI longevity coach and app. Precision (USD 699): adds WGS 30X, telomere length, pharmacogenomics and inflammation markers, with forecasting and quarterly expert review. Elite (USD 999, baseline + 3–6 months): WGS 100X, multi-omics, advanced epigenetic clocks and proteomics, with an assigned longevity physician. Checkout is on biongevity.com.";
  if (has("biological age", "bio age", "what does this mean", "measured"))
    return "Biological age estimates how your body is ageing compared with your calendar age. Biongevity assesses which ageing molecules your body produces to estimate biological age by organ system. Methods differ, so the most useful comparison is your own estimate over time. Dashboard numbers are illustrative.";
  if (has("bioelr", "elr"))
    return "BioELR is Biongevity's Electronic Longevity Record, available through the Biongevity App. It integrates genomic sequencing, epigenetic analysis, metabolic profiling and gut microbiome assessments with data from the Biongevity App and connected wearables, and provides continuous analysis with personal feedback.";
  if (has("pharmacogenomic", "cyp2c19", "medication"))
    return "Pharmacogenomics looks at genes that affect how you process some medicines (for example CYP2C19). BioAro Labs offers a Pharmacogenomics Test ($499). It can inform medication choices with your clinician; it doesn't decide which medicine you should take.";
  if (has("plan", "adjust", "protocol"))
    return "Questions to bring to your clinician about a draft plan: Which actions matter most given my results? What should we re-test, and when? Are any supplements unsuitable with my medications? Plans in this demo are not clinically approved.";
  if (has("drug", "supplement", "bioactive"))
    return "BioAro Drugs offers bioactive formulations such as LONgevity+ ($150), CellOmega+ ($99), Glutara ($50), SleepO ($25) and the Creagen series ($50). Its builder works from the goals and routine you describe; it does not read biomarkers or genetic data.";
  if (has("kit", "activate", "sample", "at home", "at-home"))
    return "BioAro Labs tests use an at-home kit or a sample collection option: choose your test, collect your sample, the lab analyses it with validated methods, then you access secure results with connected interpretation. Order on bioarolabs.com. Support: +1 (833) 246-2766 · support@bioarolabs.com.";
  if (has("book", "appointment", "visit", "consult", "contact", "clinic", "where"))
    return "Book from the Contact page and a coordinator follows up. The Biongevity clinic is in Dubai (AB Center, Al Barsha · +971 4 379 6393), head office in Calgary (403-250-2221, info@biongevity.com), BioAro Europe in Almelo — plus the Virtual Longevity Clinic wherever you are.";
  const d = DEPARTMENTS.find((x) => s.includes(x.short.toLowerCase().split(" ")[0].toLowerCase().replace("'s", "")));
  if (d) return `${d.name}: ${d.summary} A good first question: "${d.questions[0]}" Services may vary by location.`;
  return "Biongevity combines comprehensive clinical evaluations with genomic and epigenetic analysis, everyday data from the Biongevity App and continuous monitoring through BioELR. BioAro Labs provides at-home testing and BioAro Drugs provides bioactive formulations. A coordinator can confirm specifics I don't have verified.";
}

export async function liveComplete(prompt: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_AI_ENDPOINT;
  if (!url) return null;
  try {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 20000);
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }), signal: ctrl.signal });
    clearTimeout(to);
    if (!r.ok) return null;
    const j = (await r.json()) as { text?: string };
    return j.text?.trim() || null;
  } catch { return null; }
}

export const SUGGESTIONS: Record<string, string[]> = {
  packages: ["Compare Core, Precision and Elite", "What is pharmacogenomics?"],
  home: ["What is BioELR?", "Compare Core, Precision and Elite", "Which test should I start with?"],
  "precision-health": ["Which department fits fatigue?", "What does Precision Dermatology offer?"],
  clinic: ["Where is the Dubai clinic?", "How does the Virtual Clinic work?", "What is biological age?"],
  life: ["What is Biongevity Life?", "How does the Virtual Clinic work?"],
  app: ["What does the Biongevity App do?", "What is BioELR?"],
  insights: ["What is biological age?", "Explain whole genome sequencing"],
  dashboard: ["Explain my triglycerides", "What does CYP2C19 mean?", "Questions about my plan"],
};
