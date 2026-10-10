import type { CatalogProduct, Collection } from "./types";
import type { IconName } from "@/components/ui/icons";

/* Content: bioarodrugs.com/us (home, shop, protocols). Prices USD as listed Oct 2026. */

export const DRUG_COLLECTIONS: Collection[] = [
  { handle: "longevity", title: "Longevity", description: "Cellular energy and healthy-aging formulas.", icon: "hourglass" },
  { handle: "daily-foundations", title: "Daily Foundations", description: "Everyday antioxidant support.", icon: "droplet" },
  { handle: "sleep-calm", title: "Sleep & Calm", description: "Rest and recovery overnight.", icon: "moon" },
  { handle: "focus", title: "Focus", description: "Clarity through long days.", icon: "brain" },
  { handle: "energy", title: "Energy", description: "Daily energy support.", icon: "bolt" },
  { handle: "performance", title: "Performance", description: "Strength, power and recovery.", icon: "dumbbell" },
];

export const GOALS: { id: string; label: string; icon: IconName }[] = [
  { id: "energy", label: "Energy", icon: "bolt" },
  { id: "longevity", label: "LONgevity+", icon: "hourglass" },
  { id: "focus", label: "Focus", icon: "brain" },
  { id: "recovery", label: "Recovery", icon: "activity" },
  { id: "sleep", label: "Sleep", icon: "moon" },
  { id: "performance", label: "Performance", icon: "dumbbell" },
  { id: "womens-health", label: "Women's Health", icon: "heart" },
];

export const DRUG_PRODUCTS: CatalogProduct[] = [
  {
    handle: "longevity-plus", title: "LONgevity+", tagline: "NAD+ Booster", vendor: "BioAro Drugs", kind: "supplement",
    price: 150, currency: "USD", category: "longevity", format: "Per 2 capsules", icon: "bolt", goals: ["longevity", "energy"],
    summary: "Cellular energy formula featuring NMN, Resveratrol, CoQ10, Curcumin, Vitamin D3, and Vitamin B12.",
    directions: "Take 2 capsules daily with food, or as directed on the product label.",
    ingredients: [
      { name: "NMN", why: "Supports NAD+ production and cellular energy.", amount: "500 mg" },
      { name: "Resveratrol", why: "Healthy aging and antioxidant positioning.", amount: "200 mg" },
      { name: "CoQ10", why: "Supports cellular energy and heart health.", amount: "100 mg" },
      { name: "Curcumin", why: "Supports antioxidant defense.", amount: "100 mg" },
      { name: "Vitamin B12", why: "Contributes to normal energy-yielding metabolism.", amount: "250 µg" },
      { name: "Vitamin D3", why: "Contributes to the normal function of the immune system.", amount: "25 µg / 1,000 IU" },
    ],
  },
  {
    handle: "glutara", title: "Glutara", tagline: "Advanced Liposomal Delivery", vendor: "BioAro Drugs", kind: "supplement",
    price: 50, currency: "USD", category: "daily-foundations", format: "Per 1 sachet", icon: "droplet", goals: ["recovery", "energy"],
    summary: "High-absorption antioxidant formula featuring Liposomal Glutathione, Vitamin C, Hyaluronic Acid, B vitamins, and Piperine.",
    directions: "Mix 1 sachet with water daily, or as directed on the product label.",
  },
  {
    handle: "sleepo", title: "SleepO", tagline: "Sleep Support", vendor: "BioAro Drugs", kind: "supplement",
    price: 25, currency: "USD", category: "sleep-calm", format: "1 spray", icon: "moon", goals: ["sleep", "recovery"],
    summary: "Helps reset the body's sleep-wake cycle, promoting deeper, more restorative rest.",
  },
  {
    handle: "creagen-brain-boost", title: "Creagen Brain Boost", tagline: "Creatine + Magnesium + B12", vendor: "BioAro Drugs", kind: "supplement",
    price: 50, currency: "USD", category: "focus", format: "Per 1 sachet", icon: "brain", goals: ["focus", "energy"],
    summary: "Performance support formula featuring Creatine Monohydrate, Magnesium Glycinate, and Vitamin B12.",
  },
  {
    handle: "creagen-femme-energy", title: "Creagen Femme Energy", tagline: "Women's Health · Energy Support", vendor: "BioAro Drugs", kind: "supplement",
    price: 50, currency: "USD", category: "energy", format: "Per 1 sachet", icon: "sparkle", goals: ["womens-health", "energy", "recovery"],
    summary: "Women-focused creatine support formula featuring Creatine Monohydrate, Ferrous Bisglycinate, and Vitamin B12.",
  },
  {
    handle: "creagen-raw-power", title: "Creagen Raw Power", tagline: "6g Creatine Monohydrate", vendor: "BioAro Drugs", kind: "supplement",
    price: 50, currency: "USD", category: "performance", format: "Per 1 sachet", icon: "dumbbell", goals: ["performance"],
    summary: "Creatine monohydrate formula designed to support strength, power, and athletic performance.",
  },
  {
    handle: "creagen-pro-power", title: "Creagen Pro Power", tagline: "Performance Blend", vendor: "BioAro Drugs", kind: "supplement",
    price: 50, currency: "USD", category: "performance", format: "Per 1 sachet", icon: "bolt", goals: ["performance", "recovery"],
    summary: "Advanced performance formula featuring Creatine Monohydrate, Beta-Alanine, and essential electrolytes.",
    directions: "Mix 1 sachet with water daily, during or after training, or as directed on the product label.",
  },
  {
    handle: "cellomega-plus", title: "CellOmega+", tagline: "Essential Omega Wellness", vendor: "BioAro Drugs", kind: "supplement",
    price: 99, currency: "USD", category: "longevity", format: "Per 2 capsules", icon: "heart", goals: ["longevity", "focus"],
    summary: "Targeted nutritional support for the heart, brain, and cellular function with omega-3s, antioxidants, and essential nutrients.",
    directions: "Take 2 capsules daily with meals, or as directed by a healthcare professional.",
  },
];

export const PRINCIPLES = [
  { n: "01", t: "AI-guided personalization", d: "BioAro Drugs AI turns what you want to improve into a starting protocol, so you are not choosing from a shelf on instinct." },
  { n: "02", t: "Evidence-informed formulation", d: "Ingredients earn their place on the evidence behind them and the dose that evidence supports — not on how well they market." },
  { n: "03", t: "Transparent by design", d: "Every ingredient, every amount, every reason it is in the formula. No proprietary blends hiding the numbers." },
  { n: "04", t: "Built as protocols", d: "The formulas are designed to make sense together across a day, not only to stand alone on a product page." },
  { n: "05", t: "Built to be revisited", d: "A protocol is not a one-time answer. Tell BioAro Drugs AI what has changed and it rebuilds around your new goals and routine." },
];

export const PERSONAS = [
  { t: "The Executive", d: "Long days, heavy cognitive load, and energy that has to hold to the end of them.", goals: ["focus", "energy"], tags: ["Mental clarity", "Cognitive focus", "Cellular energy", "Metabolic support"] },
  { t: "The Athlete", d: "Training hard enough that what happens between sessions decides the next one.", goals: ["performance", "recovery"], tags: ["Strength", "Power output", "Muscle recovery", "Hydration"] },
  { t: "The LONgevity Protocol", d: "Playing a long game — cellular health and everyday vitality over decades, not weeks.", goals: ["longevity", "energy"], tags: ["Healthy aging", "Cellular resilience", "Cellular energy", "Metabolic support"] },
  { t: "Women's Performance", d: "Energy, cognition and recovery, in a formula built around women's needs.", goals: ["womens-health", "recovery"], tags: ["Daily energy", "Iron and B12 support", "Muscle recovery", "Hydration"] },
];

/** Example protocol from bioarodrugs.com (illustration, not a recommendation). */
export const EXAMPLE_PROTOCOL = [
  { slot: "Morning", hint: "With food", handles: ["longevity-plus", "cellomega-plus"] },
  { slot: "Around training", hint: "During or after", handles: ["creagen-pro-power"] },
  { slot: "Evening", hint: "Any time of day — most people anchor it to the end of theirs", handles: ["glutara"] },
];

export const SACHET_POINTS = ["Tears open in seconds", "Fits pockets, handbags and carry-ons", "No scoops. Nothing to measure.", "Built for travel", "One simple daily routine"];

/** Rule-based protocol builder (mirrors bioarodrugs.com: goals + routine only, no biomarkers). */
export function buildProtocol(goals: string[], routine: { train: string; sleep: string }) {
  const g = new Set(goals);
  if (routine.train === "4+ days") g.add("performance");
  if (routine.sleep === "Poor") g.add("sleep");
  const scored = DRUG_PRODUCTS.map((p) => ({ p, s: (p.goals ?? []).filter((x) => g.has(x)).length }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, 4).map((x) => x.p);
}
