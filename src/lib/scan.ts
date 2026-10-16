import { TEST_INTEL, goalMatch, type GoalId, type TestIntel } from "./testIntel";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import { DEPARTMENTS } from "@/data/departments";
import { LIFE_EXPECTANCY, STEPS_RISK } from "@/data/intelligence";
import type { CatalogProduct } from "@/data/types";

/**
 * AI Healthspan Scan — answers → an educational, on-device profile.
 * Transparent rules only (no AI call). Every number is either a published population figure (with source)
 * or a lifestyle estimate clearly labelled "Educational estimate". Biongevity SI explains the result on request.
 */
export type Opt = { v: string; label: string; sub?: string };
export interface Question { id: keyof Answers; q: string; help?: string; multi?: boolean; options: Opt[] }
export interface Answers {
  age: string; sex: string; goals: string[]; steps: string; sleep: string; bp: string; smoking: string;
  alcohol: string; diet: string; weight: string; family: string[]; lastTest: string;
}
export const EMPTY_ANSWERS: Answers = { age: "", sex: "", goals: [], steps: "", sleep: "", bp: "", smoking: "", alcohol: "", diet: "", weight: "", family: [], lastTest: "" };

export const QUESTIONS: Question[] = [
  { id: "age", q: "How old are you?", options: [{ v: "u40", label: "Under 40" }, { v: "40", label: "40–49" }, { v: "50", label: "50–59" }, { v: "60", label: "60–69" }, { v: "70", label: "70+" }] },
  { id: "sex", q: "Sex at birth", help: "Used only for reference ranges and population figures.", options: [{ v: "f", label: "Female" }, { v: "m", label: "Male" }, { v: "x", label: "Prefer not to say" }] },
  { id: "goals", q: "What do you want to protect or improve?", help: "Pick up to three.", multi: true, options: [
    { v: "heart", label: "Heart" }, { v: "metabolic", label: "Energy & weight" }, { v: "brain", label: "Brain & memory" }, { v: "ageing", label: "Ageing well" },
    { v: "gut", label: "Gut" }, { v: "hormones", label: "Hormones" }, { v: "sleep", label: "Sleep & stress" }, { v: "strength", label: "Strength & mobility" }, { v: "genes", label: "Genes & medicines" }] },
  { id: "steps", q: "On a typical day, how much do you walk?", options: [{ v: "3", label: "Under 3,500 steps" }, { v: "5", label: "3,500–7,000" }, { v: "8", label: "7,000–10,000" }, { v: "11", label: "10,000+" }] },
  { id: "sleep", q: "How many hours do you usually sleep?", options: [{ v: "5", label: "Under 6" }, { v: "6", label: "6–7" }, { v: "7", label: "7–8" }, { v: "9", label: "More than 9" }] },
  { id: "bp", q: "Your usual blood pressure (top number)?", options: [{ v: "115", label: "Under 120" }, { v: "125", label: "120–129" }, { v: "135", label: "130–139" }, { v: "145", label: "140 or more" }, { v: "?", label: "I don't know" }] },
  { id: "smoking", q: "Do you smoke?", options: [{ v: "never", label: "Never" }, { v: "former", label: "I quit" }, { v: "current", label: "Yes" }] },
  { id: "alcohol", q: "Alcohol in a typical week?", options: [{ v: "none", label: "None" }, { v: "moderate", label: "Up to 7 drinks" }, { v: "heavy", label: "More than 7" }] },
  { id: "diet", q: "How would you describe your eating?", options: [{ v: "good", label: "Mostly whole foods" }, { v: "mixed", label: "Mixed" }, { v: "poor", label: "Mostly processed" }] },
  { id: "weight", q: "Your weight for your height?", options: [{ v: "healthy", label: "Healthy range" }, { v: "over", label: "Above it" }, { v: "?", label: "Not sure" }] },
  { id: "family", q: "Any of these in close family?", multi: true, options: [{ v: "heart", label: "Heart disease" }, { v: "diabetes", label: "Diabetes" }, { v: "dementia", label: "Dementia" }, { v: "cancer", label: "Cancer" }, { v: "none", label: "None / not sure" }] },
  { id: "lastTest", q: "When were your last blood tests?", options: [{ v: "1", label: "This year" }, { v: "3", label: "1–3 years ago" }, { v: "9", label: "Longer / never" }] },
];

export const DOMAINS = ["Cardiometabolic", "Brain", "Metabolic", "Inflammation", "Physical function", "Sleep & recovery", "Nutrition", "Resilience", "Ageing pace"];

export interface ScanResult {
  domains: { label: string; score: number; lo: number; hi: number }[];
  habits: { count: number; list: { t: string; ok: boolean | null }[] };
  lifeExp: { n: number; years: number }[];
  stepsRR: number; bpRR: number | null; sleepNote: string;
  tests: (TestIntel & { match: number; why: string })[];
  formulas: CatalogProduct[];
  program: (typeof PACKAGES)[number];
  depts: (typeof DEPARTMENTS)[number][];
  retest: { label: string; marks: number[]; sub: string }[];
  total: number;
  priorities: string[];
}

const clamp = (v: number) => Math.round(Math.max(5, Math.min(97, v)));

export function runScan(a: Answers): ScanResult {
  const age = a.age === "u40" ? 35 : Number(a.age) + 5 || 50;
  const unknown = [a.bp === "?", a.weight === "?", a.lastTest === "9"].filter(Boolean).length;
  const steps = Number(a.steps) || 5, sleep = Number(a.sleep) || 7, sys = a.bp === "?" ? null : Number(a.bp) || null;
  const smoke = a.smoking === "current" ? 1 : a.smoking === "former" ? 0.35 : 0;
  const drink = a.alcohol === "heavy" ? 1 : 0, diet = a.diet === "poor" ? 1 : a.diet === "mixed" ? 0.45 : 0, over = a.weight === "over" ? 1 : 0;
  const fam = (k: string) => a.family.includes(k);
  const agePen = Math.max(0, (age - 40) / 40);
  const sleepPen = sleep < 6 ? 0.8 : sleep === 6 ? 0.35 : sleep > 8 ? 0.6 : 0;
  const movePen = steps <= 3 ? 1 : steps === 5 ? 0.5 : steps === 8 ? 0.2 : 0;
  const bpPen = sys === null ? 0.35 : sys >= 145 ? 1 : sys >= 135 ? 0.6 : sys >= 125 ? 0.25 : 0;

  const raw = [
    100 - 30 * bpPen - 18 * smoke - 14 * over - 10 * movePen - (fam("heart") ? 8 : 0) - 10 * agePen,
    100 - 22 * sleepPen - 12 * bpPen - 12 * movePen - (fam("dementia") ? 10 : 0) - 10 * drink - 12 * agePen,
    100 - 26 * over - 18 * diet - 14 * movePen - (fam("diabetes") ? 10 : 0) - 8 * agePen,
    100 - 20 * smoke - 16 * diet - 14 * over - 12 * sleepPen - 10 * agePen,
    100 - 36 * movePen - 12 * over - 16 * agePen,
    100 - 40 * sleepPen - 12 * drink - 8 * movePen,
    100 - 34 * diet - 12 * drink - 8 * agePen,
    100 - 18 * sleepPen - 18 * movePen - 14 * smoke - 10 * drink,
    100 - 20 * smoke - 14 * movePen - 12 * sleepPen - 12 * diet - 10 * over - 12 * agePen,
  ];
  const band = 8 + unknown * 4;
  const domains = DOMAINS.map((label, i) => { const s = clamp(raw[i]); return { label, score: s, lo: clamp(s - band), hi: clamp(s + band) }; });

  // Five low-risk habits (Li et al., Circulation 2018) — null = we don't know from your answers.
  const habitList = [
    { t: "Never smoked", ok: a.smoking ? a.smoking === "never" : null },
    { t: "Healthy weight", ok: a.weight === "?" || !a.weight ? null : a.weight === "healthy" },
    { t: "Active most days", ok: a.steps ? steps >= 8 : null },
    { t: "Moderate or no alcohol", ok: a.alcohol ? a.alcohol !== "heavy" : null },
    { t: "Healthy diet", ok: a.diet ? a.diet === "good" : null },
  ];
  const count = habitList.filter((h) => h.ok).length;
  const L = a.sex === "m" ? LIFE_EXPECTANCY.men : LIFE_EXPECTANCY.women;
  const lifeExp = [0, 1, 2, 3, 4, 5].map((n) => ({ n, years: Math.round((L.zero + ((L.five - L.zero) * n) / 5) * 10) / 10 }));

  const bandRR = STEPS_RISK.bands.find((b) => (steps <= 3 ? b.steps === 3500 : steps === 5 ? b.steps === 5800 : steps === 8 ? b.steps === 7800 : b.steps === 10900))!;
  const bpRR = sys === null ? null : Math.pow(2, (sys - 115) / 20);
  const sleepNote = sleep < 6 ? "Short sleep is linked with about 12% higher mortality in large studies." : sleep > 8 ? "Long sleep is linked with about 30% higher mortality — often a sign worth checking." : "Your sleep is in the range linked with the lowest risk.";

  // Goals: picked + implied by answers
  const goals = new Set<GoalId>(a.goals as GoalId[]);
  if (fam("heart") || (sys ?? 0) >= 135) goals.add("heart");
  if (fam("diabetes") || over) goals.add("metabolic");
  if (fam("dementia")) goals.add("brain");
  if (sleep < 6) goals.add("sleep");
  if (!goals.size) goals.add("ageing");
  const G = [...goals];

  const why = (x: TestIntel) => {
    const g = x.goals.filter((k) => goals.has(k));
    const parts = [g.length ? `matches ${g.map((k) => k.replace("metabolic", "energy & weight")).join(", ")}` : "", fam("heart") && x.goals.includes("heart") ? "family history of heart disease" : "", fam("dementia") && x.goals.includes("brain") ? "family history of dementia" : "", a.lastTest === "9" && x.evidence === "Clinically validated" ? "no recent blood tests" : ""];
    return parts.filter(Boolean).join(" · ");
  };
  const tests = TEST_INTEL
    .map((x) => {
      let m = goalMatch(x, G) * 0.55 + x.utility * 0.45;
      if (/brain|p-tau|amyloid/i.test(x.t.title) && !fam("dementia") && !a.goals.includes("brain")) m -= 30;
      if (/cell-free/i.test(x.t.title)) m -= 40; // oncology use — not a screening test
      if (a.lastTest === "9" && x.evidence === "Clinically validated") m += 8;
      if (age >= 50 && /vitamin d|cystatin|hs-crp/i.test(x.t.title)) m += 6;
      return { ...x, match: Math.round(Math.max(0, Math.min(99, m))), why: why(x) };
    })
    .filter((x) => x.match > 30)
    .sort((p, q) => q.match - p.match)
    // variety: one test per category
    .filter((x, i, arr) => arr.findIndex((y) => y.t.category === x.t.category) === i)
    .slice(0, 6);

  const formulaFor: Record<string, string> = { heart: "cellomega-plus", ageing: "longevity-plus", metabolic: "glutara", brain: "creagen-brain-boost", sleep: "sleepo", strength: "creagen-pro-power", hormones: a.sex === "f" ? "creagen-femme-energy" : "creagen-brain-boost", gut: "glutara", genes: "longevity-plus" };
  const formulas = [...new Set(G.map((g) => formulaFor[g]))].map((h) => DRUG_PRODUCTS.find((p) => p.handle === h)!).filter(Boolean).slice(0, 3);

  const total = tests.reduce((s, x) => s + x.t.price, 0);
  const program = PACKAGES[G.length >= 3 || total > 1500 ? (G.length >= 4 ? 2 : 1) : 0];

  const deptFor: Record<string, string> = { heart: "cardiology", metabolic: "endocrinology", brain: "geriatric-medicine", ageing: "internal-medicine", gut: "gut-health", hormones: a.sex === "f" ? "womens-health" : "mens-health", sleep: "respiratory-medicine", strength: "internal-medicine", genes: "internal-medicine" };
  const depts = [...new Set(G.map((g) => deptFor[g]))].map((id) => DEPARTMENTS.find((d) => d.id === id)!).filter(Boolean).slice(0, 3);

  const retest = tests.map((x) => ({ label: x.t.title.replace(/\s*\(.*\)/, ""), sub: x.retest ? `every ${x.retest} mo` : "once", marks: x.retest ? Array.from({ length: Math.floor(12 / x.retest) + 1 }, (_, k) => k * x.retest).filter((m) => m <= 12) : [0] }));

  const priorities = [
    sys === null ? "Measure your blood pressure at home for 7 days — it is the most useful number you don't have yet." : (sys >= 135 ? "Your blood pressure is above the home target of 135/85 — worth a conversation with a clinician." : ""),
    steps <= 5 ? "Walking more is the biggest lever in your answers: going from under 3,500 to about 7,800 steps a day is linked with roughly 45% lower mortality." : "",
    sleep < 6 ? "Protect 7–8 hours of sleep before adding supplements." : "",
    a.smoking === "current" ? "Stopping smoking outweighs every test and supplement on this page." : "",
    a.lastTest === "9" ? "Start with a baseline: a few validated blood tests you can re-test against." : "",
  ].filter(Boolean).slice(0, 3);

  return { domains, habits: { count, list: habitList }, lifeExp, stepsRR: bandRR.rr, bpRR, sleepNote, tests, formulas, program, depts, retest, total, priorities };
}

export const answered = (a: Answers, q: Question) => (q.multi ? (a[q.id] as string[]).length > 0 : Boolean(a[q.id]));
