import { LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";
import type { CatalogProduct } from "@/data/types";

/**
 * Test intelligence — a transparent, on-device "test utility score" for every BioAro Labs test
 * (spec section 13: evidence, actionability, cost, redundancy). No AI call; weights are shown in the UI.
 */
export type Evidence = "Clinically validated" | "Supportive evidence" | "Exploratory";
export const EVIDENCE_SCORE: Record<Evidence, number> = { "Clinically validated": 1, "Supportive evidence": 0.65, Exploratory: 0.35 };

export const GOAL_TAGS = [
  { id: "heart", label: "Heart", icon: "heart" },
  { id: "metabolic", label: "Energy & weight", icon: "bolt" },
  { id: "brain", label: "Brain & memory", icon: "brain" },
  { id: "ageing", label: "Ageing well", icon: "hourglass" },
  { id: "gut", label: "Gut", icon: "gut" },
  { id: "hormones", label: "Hormones", icon: "test-tube" },
  { id: "sleep", label: "Sleep & stress", icon: "moon" },
  { id: "strength", label: "Strength & mobility", icon: "walk" },
  { id: "genes", label: "Genes & medicines", icon: "dna" },
] as const;
export type GoalId = (typeof GOAL_TAGS)[number]["id"];

/** Rules by name keyword → evidence, actionability (0–1), goals, re-test interval (months, 0 = once), what it reveals. */
const RULES: { m: RegExp; ev: Evidence; act: number; goals: GoalId[]; retest: number; reveals: string }[] = [
  { m: /hs-crp/i, ev: "Clinically validated", act: 0.85, goals: ["heart", "ageing"], retest: 6, reveals: "Low-grade inflammation linked with cardiovascular risk." },
  { m: /vitamin d/i, ev: "Clinically validated", act: 0.9, goals: ["ageing", "strength", "metabolic"], retest: 3, reveals: "Vitamin D status for bones, muscles and immunity." },
  { m: /cystatin/i, ev: "Clinically validated", act: 0.8, goals: ["heart", "ageing"], retest: 12, reveals: "Kidney function, less affected by muscle mass than creatinine." },
  { m: /pharmacogenomics/i, ev: "Clinically validated", act: 0.8, goals: ["genes"], retest: 0, reveals: "How your genes may affect how you process common medicines." },
  { m: /disease-based dna/i, ev: "Clinically validated", act: 0.65, goals: ["genes", "heart"], retest: 0, reveals: "Variants linked to specific inherited conditions." },
  { m: /cell-free dna/i, ev: "Clinically validated", act: 0.55, goals: ["genes"], retest: 0, reveals: "Tumour DNA profiling, used with an oncology team." },
  { m: /whole genome sequencing 100x/i, ev: "Supportive evidence", act: 0.6, goals: ["genes", "ageing"], retest: 0, reveals: "Your full genome at high depth — a lifelong reference." },
  { m: /whole genome sequencing 30x/i, ev: "Supportive evidence", act: 0.6, goals: ["genes", "ageing"], retest: 0, reveals: "Your full genome — a lifelong reference for inherited risk." },
  { m: /exome/i, ev: "Supportive evidence", act: 0.5, goals: ["genes"], retest: 0, reveals: "The protein-coding genes, for inherited-variant questions." },
  { m: /p-tau|amyloid|brain health/i, ev: "Supportive evidence", act: 0.5, goals: ["brain"], retest: 0, reveals: "Blood markers used in medically guided memory evaluation." },
  { m: /testosterone|estradiol|progesterone|shbg|dhea|androstenedione|dht|hormone health|cortisol/i, ev: "Clinically validated", act: 0.7, goals: ["hormones", "metabolic", "sleep"], retest: 6, reveals: "Hormone levels behind energy, mood, body composition and sleep." },
  { m: /essential vitamin|vitamin a|vitamin e|vitamin k1/i, ev: "Supportive evidence", act: 0.55, goals: ["ageing", "metabolic"], retest: 6, reveals: "Fat-soluble vitamin status for immunity, bones and cells." },
  { m: /telomere/i, ev: "Exploratory", act: 0.2, goals: ["ageing"], retest: 12, reveals: "Telomere length — a research marker of cellular ageing." },
  { m: /gdf-15/i, ev: "Exploratory", act: 0.3, goals: ["ageing", "metabolic"], retest: 6, reveals: "A cellular-stress signal studied in ageing and metabolism." },
  { m: /inflammation aging/i, ev: "Supportive evidence", act: 0.5, goals: ["ageing", "heart"], retest: 6, reveals: "A panel of inflammation and ageing markers together." },
  { m: /il-6|il-10|tnf|mcp-1|stnfr1/i, ev: "Exploratory", act: 0.35, goals: ["ageing"], retest: 6, reveals: "Individual inflammation and immune signals." },
  { m: /pai-1|timp-1|b2m|β2/i, ev: "Exploratory", act: 0.4, goals: ["heart", "metabolic"], retest: 6, reveals: "Vascular, kidney and tissue-remodelling stress signals." },
  { m: /biogut/i, ev: "Exploratory", act: 0.5, goals: ["gut", "metabolic"], retest: 6, reveals: "Gut microbiome diversity and balance." },
  { m: /bioskin|biodental|biofemme/i, ev: "Exploratory", act: 0.5, goals: ["gut"], retest: 6, reveals: "Microbiome balance at the skin, mouth or vaginal site." },
  { m: /amino/i, ev: "Exploratory", act: 0.45, goals: ["strength", "metabolic"], retest: 6, reveals: "Amino-acid balance behind muscle, recovery and metabolism." },
  { m: /resveratrol/i, ev: "Exploratory", act: 0.2, goals: ["ageing"], retest: 6, reveals: "Resveratrol level when supplementing." },
];
const FALLBACK = { ev: "Supportive evidence" as Evidence, act: 0.45, goals: ["ageing"] as GoalId[], retest: 6, reveals: "" };

export interface TestIntel {
  t: CatalogProduct; evidence: Evidence; actionability: number; goals: GoalId[]; retest: number; reveals: string;
  /** 0–100, transparent: 40% evidence · 30% actionability · 20% cost · 10% breadth */
  utility: number; categoryLabel: string; categoryIndex: number;
}

const maxPrice = Math.max(...LAB_TESTS.map((t) => t.price));
export const TEST_INTEL: TestIntel[] = LAB_TESTS.map((t) => {
  const r = RULES.find((x) => x.m.test(t.title)) ?? FALLBACK;
  const cost = 1 - Math.log(t.price) / Math.log(maxPrice);
  const breadth = /health|panel|aging|profile|metabolism|genome|exome/i.test(t.title) ? 1 : 0.5;
  const utility = Math.round(100 * (0.4 * EVIDENCE_SCORE[r.ev] + 0.3 * r.act + 0.2 * Math.max(0, cost) + 0.1 * breadth));
  const ci = LAB_COLLECTIONS.findIndex((c) => c.handle === t.category);
  return { t, evidence: r.ev, actionability: r.act, goals: r.goals, retest: r.retest, reveals: r.reveals || t.summary, utility, categoryLabel: LAB_COLLECTIONS[ci]?.title ?? t.category, categoryIndex: Math.max(0, ci) };
});
