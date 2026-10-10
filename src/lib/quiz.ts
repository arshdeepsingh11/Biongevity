import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import type { CatalogProduct } from "@/data/types";

/**
 * Longevity match — deterministic, transparent scoring that runs on the device (nothing is sent anywhere).
 * Answers add points to seven health domains; the top domains choose tests, formulas, a program and a department.
 * Education only: it ranks what to explore, it does not diagnose.
 */

export const DOMAINS = ["Cardiometabolic", "Inflammation & ageing", "Genomic risk", "Gut", "Hormones", "Brain & sleep", "Skin"] as const;
export type Domain = (typeof DOMAINS)[number];
type Pts = Partial<Record<Domain, number>>;

export interface Option { id: string; label: string; icon: string; pts: Pts }
export interface Question { id: string; title: string; hint: string; multi?: boolean; max?: number; options: Option[] }

export const QUESTIONS: Question[] = [
  { id: "age", title: "Your age range", hint: "Risk for most chronic conditions rises with age.", options: [
    { id: "18", label: "18–29", icon: "sprout", pts: {} },
    { id: "30", label: "30–39", icon: "leaf", pts: { "Inflammation & ageing": 1 } },
    { id: "40", label: "40–49", icon: "sun", pts: { Cardiometabolic: 2, "Inflammation & ageing": 2, Hormones: 1 } },
    { id: "50", label: "50–59", icon: "hourglass", pts: { Cardiometabolic: 3, "Inflammation & ageing": 3, Hormones: 2, "Brain & sleep": 1 } },
    { id: "60", label: "60+", icon: "crown", pts: { Cardiometabolic: 4, "Inflammation & ageing": 4, "Brain & sleep": 2, Hormones: 1 } },
  ] },
  { id: "sex", title: "Sex at birth", hint: "Used only to pick relevant hormone and microbiome tests.", options: [
    { id: "f", label: "Female", icon: "flower", pts: {} },
    { id: "m", label: "Male", icon: "person", pts: {} },
    { id: "x", label: "Prefer not to say", icon: "users", pts: {} },
  ] },
  { id: "goals", title: "What do you most want to improve?", hint: "Choose up to three.", multi: true, max: 3, options: [
    { id: "energy", label: "Energy", icon: "bolt", pts: { Hormones: 2, "Inflammation & ageing": 1 } },
    { id: "longevity", label: "Healthy ageing", icon: "hourglass", pts: { "Inflammation & ageing": 3, "Genomic risk": 2 } },
    { id: "sleep", label: "Sleep & stress", icon: "moon", pts: { "Brain & sleep": 3, Hormones: 1 } },
    { id: "focus", label: "Focus & memory", icon: "brain", pts: { "Brain & sleep": 3 } },
    { id: "gut", label: "Digestion", icon: "gut", pts: { Gut: 4 } },
    { id: "hormones", label: "Hormone balance", icon: "test-tube", pts: { Hormones: 4 } },
    { id: "heart", label: "Heart & metabolism", icon: "heart", pts: { Cardiometabolic: 4 } },
    { id: "performance", label: "Fitness & recovery", icon: "dumbbell", pts: { Cardiometabolic: 1, "Inflammation & ageing": 1 } },
    { id: "skin", label: "Skin", icon: "face", pts: { Skin: 4 } },
  ] },
  { id: "signals", title: "Anything you've noticed lately?", hint: "Select all that apply. If something is severe or sudden, see a doctor.", multi: true, options: [
    { id: "fatigue", label: "Low energy most days", icon: "bed", pts: { Hormones: 2, "Inflammation & ageing": 1 } },
    { id: "bloat", label: "Bloating or irregular bowels", icon: "gut", pts: { Gut: 3 } },
    { id: "reflux", label: "Heartburn or reflux", icon: "flame", pts: { Gut: 2 } },
    { id: "fog", label: "Brain fog or poor focus", icon: "brain", pts: { "Brain & sleep": 2, Hormones: 1 } },
    { id: "skin", label: "Skin flare-ups or irritation", icon: "face", pts: { Skin: 3, Gut: 1 } },
    { id: "joints", label: "Aches or stiffness", icon: "bone", pts: { "Inflammation & ageing": 2 } },
    { id: "waist", label: "Weight gain around the waist", icon: "ruler", pts: { Cardiometabolic: 3 } },
    { id: "bp", label: "High blood-pressure readings", icon: "gauge", pts: { Cardiometabolic: 3 } },
    { id: "libido", label: "Low libido or cycle changes", icon: "flower", pts: { Hormones: 3 } },
    { id: "none", label: "None of these", icon: "check", pts: {} },
  ] },
  { id: "family", title: "Family history (parents or siblings)", hint: "Inherited risk is where genome sequencing adds the most.", multi: true, options: [
    { id: "heart", label: "Heart disease or stroke", icon: "heart", pts: { Cardiometabolic: 3, "Genomic risk": 3 } },
    { id: "diabetes", label: "Type 2 diabetes", icon: "droplet", pts: { Cardiometabolic: 3, "Genomic risk": 2 } },
    { id: "cancer", label: "Cancer", icon: "microscope", pts: { "Genomic risk": 4 } },
    { id: "dementia", label: "Dementia", icon: "brain", pts: { "Brain & sleep": 3, "Genomic risk": 3 } },
    { id: "bone", label: "Osteoporosis", icon: "bone", pts: { Hormones: 2, "Genomic risk": 1 } },
    { id: "none", label: "None / not sure", icon: "minus", pts: {} },
  ] },
  { id: "sleep", title: "Usual sleep per night", hint: "Adults are advised to get 7 or more hours.", options: [
    { id: "lt6", label: "Under 6 h", icon: "alarm", pts: { "Brain & sleep": 4, Cardiometabolic: 1 } },
    { id: "6", label: "6–7 h", icon: "moon", pts: { "Brain & sleep": 2 } },
    { id: "7", label: "7–9 h", icon: "bed", pts: {} },
    { id: "9", label: "9 h +", icon: "bed", pts: { "Brain & sleep": 1 } },
  ] },
  { id: "move", title: "Days a week you exercise", hint: "Guidelines suggest 150 minutes of moderate activity a week.", options: [
    { id: "0", label: "Rarely", icon: "minus", pts: { Cardiometabolic: 3, "Inflammation & ageing": 1 } },
    { id: "1", label: "1–2 days", icon: "steps", pts: { Cardiometabolic: 1 } },
    { id: "3", label: "3–4 days", icon: "activity", pts: {} },
    { id: "5", label: "5+ days", icon: "dumbbell", pts: {} },
  ] },
  { id: "smoke", title: "Smoking or vaping", hint: "", options: [
    { id: "never", label: "Never", icon: "no-smoking", pts: {} },
    { id: "former", label: "Former", icon: "clock", pts: { Cardiometabolic: 1, "Inflammation & ageing": 1 } },
    { id: "current", label: "Current", icon: "wind", pts: { Cardiometabolic: 3, "Inflammation & ageing": 3, Skin: 1 } },
  ] },
];

export type Answers = Record<string, string[]>;

const T = (title: string) => LAB_TESTS.find((t) => t.title === title);
const D = (handle: string) => DRUG_PRODUCTS.find((d) => d.handle === handle);

/** What each domain recommends (tests by real BioAro Labs title; formulas by BioAro Drugs handle). */
const PLAYBOOK: Record<Domain, { tests: string[]; formulas: string[]; dept: string; why: string }> = {
  Cardiometabolic: { tests: ["hs-CRP (High-Sensitivity C-Reactive Protein)", "PAI-1 Total (Plasminogen Activator Inhibitor-1)", "Cystatin C"], formulas: ["cellomega-plus"], dept: "cardiology", why: "Vascular inflammation, clotting and kidney markers that track heart and metabolic risk." },
  "Inflammation & ageing": { tests: ["Core Inflammation Aging", "Telomere Length Testing", "GDF-15 (Growth Differentiation Factor 15)"], formulas: ["longevity-plus"], dept: "internal-medicine", why: "Low-grade inflammation and cellular-stress markers behind biological ageing." },
  "Genomic risk": { tests: ["Whole Genome Sequencing 30X", "Pharmacogenomics Test"], formulas: [], dept: "internal-medicine", why: "Inherited risk and medication response — measured once, useful for life." },
  Gut: { tests: ["BioGut"], formulas: ["glutara"], dept: "gut-health", why: "Microbiome diversity and balance behind digestion and immunity." },
  Hormones: { tests: ["Hormone Health", "Cortisol", "Vitamin D, 25-Hydroxy (D2 + D3)"], formulas: ["creagen-femme-energy"], dept: "womens-health", why: "Hormone, stress-hormone and vitamin D status that drive energy and mood." },
  "Brain & sleep": { tests: ["Cortisol", "Essential Vitamin Health", "Brain Health"], formulas: ["sleepo", "creagen-brain-boost"], dept: "mental-health", why: "Stress physiology, nutrients and (when indicated) brain-ageing markers." },
  Skin: { tests: ["BioSkin"], formulas: ["glutara"], dept: "dermatology", why: "Skin microbiome and antioxidant status." },
};

export interface QuizResult {
  scores: { d: Domain; v: number; pct: number }[];
  top: Domain[];
  tests: { p: CatalogProduct; why: string }[];
  formulas: { p: CatalogProduct; why: string }[];
  pkg: (typeof PACKAGES)[number];
  dept: string;
  confidence: number;
}

export function scoreQuiz(a: Answers): QuizResult {
  const raw = Object.fromEntries(DOMAINS.map((d) => [d, 0])) as Record<Domain, number>;
  for (const q of QUESTIONS) for (const id of a[q.id] ?? []) {
    const o = q.options.find((x) => x.id === id);
    for (const [d, v] of Object.entries(o?.pts ?? {})) raw[d as Domain] += v as number;
  }
  const sex = a.sex?.[0];
  const maxV = Math.max(1, ...Object.values(raw));
  const scores = DOMAINS.map((d) => ({ d, v: raw[d], pct: Math.round((raw[d] / maxV) * 100) })).sort((x, y) => y.v - x.v);
  const top = scores.filter((s) => s.v > 0).slice(0, 3).map((s) => s.d);
  if (!top.length) top.push("Inflammation & ageing");

  const tests = new Map<string, { p: CatalogProduct; why: string }>(), formulas = new Map<string, { p: CatalogProduct; why: string }>();
  for (const d of top) {
    let list = PLAYBOOK[d].tests;
    if (d === "Hormones" && sex === "m") list = ["Total Testosterone", "SHBG (Sex Hormone-Binding Globulin)", "Cortisol"];
    if (d === "Gut" && sex === "f" && (a.signals ?? []).includes("libido")) list = [...list, "BioFemme"];
    for (const t of list) { const p = T(t); if (p && !tests.has(p.handle)) tests.set(p.handle, { p, why: PLAYBOOK[d].why }); }
    let fl = PLAYBOOK[d].formulas;
    if (d === "Hormones" && sex === "m") fl = ["creagen-pro-power"];
    for (const h of fl) { const p = D(h); if (p && !formulas.has(h)) formulas.set(h, { p, why: `Supports your ${d.toLowerCase()} goal` }); }
  }
  if (!formulas.size) { const p = D("longevity-plus")!; formulas.set(p.handle, { p, why: "Daily foundation for healthy ageing" }); }

  const age = a.age?.[0] ?? "30";
  const load = scores.filter((s) => s.v >= 6).length + ((a.family ?? []).filter((x) => x !== "none").length >= 2 ? 1 : 0);
  const pkg = load >= 4 || (age === "60" && load >= 3) ? PACKAGES[2] : load >= 2 || ["50", "60"].includes(age) ? PACKAGES[1] : PACKAGES[0];

  let dept = PLAYBOOK[top[0]].dept;
  if (dept === "womens-health" && sex === "m") dept = "mens-health";
  if (top[0] === "Gut" && (a.signals ?? []).includes("reflux")) dept = "gastroenterology";

  // Confidence = how much signal the answers gave (answered questions + how clearly one domain leads). Not a medical probability.
  const answered = QUESTIONS.filter((q) => (a[q.id] ?? []).length).length;
  const lead = scores[0].v ? (scores[0].v - (scores[1]?.v ?? 0)) / scores[0].v : 0;
  const confidence = Math.min(95, Math.round(40 + answered * 4 + lead * 15 + Math.min(6, scores[0].v / 3)));

  return { scores, top, tests: [...tests.values()].slice(0, 5), formulas: [...formulas.values()].slice(0, 3), pkg, dept, confidence };
}
