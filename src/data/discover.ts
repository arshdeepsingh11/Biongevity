import type { IconName } from "@/components/ui/icons";
import { LAB_TESTS } from "./labs";
import { DRUG_PRODUCTS } from "./drugs";

/**
 * "Discover" — what Biongevity SI teaches on a new chat: the BioAro family, what's new on this site and
 * featured tests. Paraphrased from bioaro.com, bioarolabs.com, bioarodrugs.com, neyuhealth.com, the BioELR
 * and BioEMR portals, and this site's own catalogue. Prices in CAD as listed in our catalogue.
 */
export interface DiscoverItem { id: string; name: string; kicker: string; line: string; points: string[]; stat: { v: string; l: string }; icon: IconName; href: string; external?: boolean; ask: string }

export const FAMILY: DiscoverItem[] = [
  { id: "bioaro", name: "BioAro", kicker: "The parent company", line: "The intelligence layer for healthcare: multiomics, AI analysis and secure infrastructure in one ecosystem.",
    points: ["Turns complex biological data into insight clinicians can use", "Genome, microbiome and biomarkers under one roof", "Built for scale — clinics, communities and enterprises"],
    stat: { v: "Multiomics", l: "+ AI + secure data" }, icon: "atom", href: "https://bioaro.com/", external: true, ask: "What is BioAro and how do its companies fit together with Biongevity?" },
  { id: "labs", name: "BioAro Labs", kicker: "Testing", line: "At-home tests with clinician-reviewed results from CLIA-registered labs.",
    points: ["DNA, microbiome, hormone and inflammation testing", "Whole genome sequencing to biological-age panels", "Results flow into your record and your plan"],
    stat: { v: String(LAB_TESTS.length), l: "tests in our catalogue" }, icon: "test-tubes", href: "/precision-health/bioaro-labs/", ask: "Which BioAro Labs tests exist and how do I choose the right one for me?" },
  { id: "drugs", name: "BioAro Drugs", kicker: "Formulas", line: "AI-guided bioactive protocols: describe your goal and get matched formulas with every ingredient and dose listed.",
    points: ["Goal-first matching, not guesswork", "Clear ingredients and amounts on every formula", "Discuss with your clinician, especially with medication"],
    stat: { v: String(DRUG_PRODUCTS.length), l: "formulas" }, icon: "tablets", href: "/precision-health/bioaro-drugs/", ask: "How does BioAro Drugs match formulas to a goal, and what should I check with my clinician?" },
  { id: "neyu", name: "NEYU Health", kicker: "Partner clinics · Calgary", line: "Connected care in Calgary: doctors and specialists, diagnostics, prevention and longevity — testing fulfilled by BioAro.",
    points: ["Cardiology, internal medicine and endocrinology", "Alberta's first onsite exercise stress echo program", "Virtual care and a remote blood-pressure program"],
    stat: { v: "2", l: "Calgary clinics" }, icon: "hospital", href: "https://neyuhealth.com/", external: true, ask: "What does NEYU Health offer and how does it work with Biongevity and BioAro Labs?" },
  { id: "bioelr", name: "BioELR", kicker: "For clinics", line: "The longevity-focused health record: genomics, labs, wearables and AI insight in one place for care teams.",
    points: ["Built for clinics, groups, resorts and communities", "Standards-based exchange with labs and devices", "AI summaries with a clinician in charge"],
    stat: { v: "1", l: "connected record" }, icon: "layers", href: "/bioelr/", ask: "What is BioELR and how do clinics use it?" },
  { id: "cardio", name: "Advanced Cardiology", kicker: "Booking portal", line: "Online booking and patient access for advanced cardiology testing, run on the BioEMR platform.",
    points: ["Book cardiology tests online", "Secure patient sign-in", "Part of the BioAro clinical software family"],
    stat: { v: "Online", l: "booking" }, icon: "heart", href: "https://advanced.bioemr.com/", external: true, ask: "How do I book advanced cardiology testing?" },
  { id: "app", name: "Biongevity App", kicker: "Members", line: "Your digital twin, live wearable data, health scores, trends, simulations and an AI coach in your pocket.",
    points: ["3D twin with a status for every body system", "Recovery, HRV and sleep from your watch or ring", "What-if simulations and a heat map"],
    stat: { v: "3D", l: "digital twin" }, icon: "fingerprint", href: "/app/#twin", ask: "What can I do in the Biongevity app and the digital twin?" },
];

export interface NewItem { t: string; d: string; icon: IconName; href: string; tag: "New" | "Updated" }
export const WHATS_NEW: NewItem[] = [
  { t: "Heart & vessels in 3D", d: "Spin a beating heart and the main arteries and veins — hover any part to learn what it does.", icon: "heart", href: "/precision-health/cardiology/#cardio3d", tag: "New" },
  { t: "Twin heat map", d: "Move sleep, steps and blood pressure and watch organs glow and healthy years change.", icon: "radar", href: "/twin/#whatif", tag: "New" },
  { t: "12-month care plan", d: "Pick a goal; get tests, re-test dates, formulas, visits and a total in CAD — download or send it.", icon: "calendar", href: "/plan/", tag: "New" },
  { t: "Family health tree", d: "Add parents and grandparents; see which tests and departments matter for you and your siblings.", icon: "users", href: "/family/#tree", tag: "New" },
  { t: "Evidence engine", d: "Every number with its studies, people, effect size and evidence grade.", icon: "microscope", href: "/evidence/", tag: "New" },
  { t: "3D clinic map", d: "Fly to Calgary, Dubai or Almelo, then into the building and the floor.", icon: "globe", href: "/#clinics", tag: "Updated" },
  { t: "Talk in four languages", d: "English, Français, العربية and فارسی — type or speak, and translate any answer.", icon: "globe", href: "/ai/", tag: "New" },
];
