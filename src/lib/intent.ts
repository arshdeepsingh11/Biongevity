import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { MARKERS, GOAL_PATHS } from "@/data/intelligence";

/**
 * On-device intent matcher — ranks departments, tests, formulas and biomarkers against free text.
 * Transparent keyword scoring over the site's own data; nothing leaves the browser.
 */
const STOP = new Set(["the", "and", "for", "with", "my", "i", "a", "an", "to", "of", "in", "is", "am", "want", "have", "get", "how", "what", "can", "do", "be", "about", "more", "better", "feel"]);
const SYN: Record<string, string[]> = {
  tired: ["fatigue", "energy"], energy: ["fatigue"], sleep: ["sleep", "apnea", "snoring"], heart: ["cardio", "chest", "palpitation"],
  bp: ["blood pressure", "hypertension"], pressure: ["hypertension"], sugar: ["diabetes", "a1c", "glucose"], weight: ["obesity", "metabolic", "bmi"],
  stomach: ["gut", "digest", "bloat"], bloating: ["gut", "microbiome"], memory: ["brain", "cognitive", "dementia"], stress: ["cortisol", "anxiety"],
  aging: ["ageing", "longevity", "telomere"], ageing: ["aging", "longevity"], skin: ["acne", "pigment", "laser"], hormones: ["testosterone", "estradiol", "thyroid"],
  breath: ["respiratory", "lung", "asthma", "copd"], dna: ["genome", "genetic", "sequencing"], genes: ["genome", "genetic"], cholesterol: ["ldl", "lipid"],
};

export const tokens = (q: string) => {
  const base = q.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  return [...new Set(base.flatMap((w) => [w, ...(SYN[w] ?? [])]))];
};
const score = (hay: string, t: string[]) => t.reduce((s, w) => { const n = Math.min(3, hay.split(w).length - 1); return s + n * (w.length > 5 ? 2 : 1); }, 0);

export function matchIntent(q: string) {
  const t = tokens(q);
  if (!t.length) return null;
  const rank = <T,>(items: T[], hay: (x: T) => string, n: number) =>
    items.map((x) => ({ x, s: score(hay(x).toLowerCase(), t) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, n);
  const depts = rank(DEPARTMENTS, (d) => [d.name, d.tag, d.summary, ...d.keywords, ...d.signs, ...d.areas.map((a) => a.t)].join(" "), 3);
  const tests = rank(LAB_TESTS, (p) => `${p.title} ${p.bestFor ?? ""} ${p.category}`, 3);
  const formulas = rank(DRUG_PRODUCTS, (p) => `${p.title} ${p.summary} ${(p.goals ?? []).join(" ")} ${p.tagline ?? ""}`, 2);
  const markers = rank(MARKERS, (m) => `${m.label} ${m.short} ${m.systems.join(" ")} ${m.fact}`, 3);
  const goal = rank(GOAL_PATHS, (g) => `${g.label} ${g.reveals} ${g.id}`, 1)[0]?.x;
  const total = [...depts, ...tests, ...formulas, ...markers].reduce((a, r) => a + r.s, 0);
  const confidence = Math.min(96, Math.round(30 + total * 4));
  return { t, depts, tests, formulas, markers, goal, confidence };
}
