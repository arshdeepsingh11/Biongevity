import { TEST_INTEL, goalMatch, type GoalId, type TestIntel } from "./testIntel";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import { DEPARTMENTS } from "@/data/departments";
import { LIFE_EXPECTANCY, STEPS_RISK } from "@/data/intelligence";
import type { CatalogProduct } from "@/data/types";

/**
 * AI Healthspan Scan — answers → an educational, on-device profile.
 * Transparent rules only (no AI call). Every number is either a published population figure (with source)
 * or a lifestyle estimate clearly labelled "Educational estimate". Xevyo explains the result on request.
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
