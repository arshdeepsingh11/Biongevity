/**
 * Living evidence engine — curated summaries of published research behind the numbers on this site.
 * Add a study: append an entry below (the page, charts and Biongevity SI pick it up automatically).
 * GRADE: High · Moderate · Low · Very low (certainty of evidence). Effects are as reported by the source.
 * Summaries are paraphrased; always check the original paper. Last reviewed: October 2026.
 */
export type Grade = "High" | "Moderate" | "Low" | "Very low";
export type Topic = "Heart" | "Lifestyle" | "Biomarkers" | "Supplements";

export interface EvidenceCard {
  id: string; topic: Topic; title: string; claim: string;
  design: string; studies: number; people: number;
  /** Effect on a ratio scale (RR/HR) for the forest plot, with 95% CI; or a plain-language effect. */
  ratio?: { v: number; lo: number; hi: number; label: string };
  effect: string; grade: Grade; why: string; source: string; year: number; test?: string; dept?: string;
}
