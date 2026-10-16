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

export const EVIDENCE: EvidenceCard[] = [
  { id: "ldl", topic: "Heart", title: "Lowering LDL cholesterol", claim: "Each 1 mmol/L lower LDL cuts major heart and stroke events by about a fifth.", design: "Meta-analysis of randomised trials", studies: 26, people: 170000,
    ratio: { v: 0.78, lo: 0.76, hi: 0.8, label: "per 1 mmol/L LDL" }, effect: "22% fewer major vascular events", grade: "High", why: "Many large randomised trials, consistent and precise.", source: "Cholesterol Treatment Trialists' Collaboration, Lancet 2010", year: 2010, dept: "cardiology" },
  { id: "bp-lower", topic: "Heart", title: "Lowering blood pressure", claim: "Each 10 mmHg lower systolic pressure cuts major cardiovascular events by about 20%.", design: "Meta-analysis of randomised trials", studies: 123, people: 613815,
    ratio: { v: 0.8, lo: 0.77, hi: 0.83, label: "per 10 mmHg" }, effect: "20% fewer major cardiovascular events", grade: "High", why: "Large randomised evidence, consistent across groups.", source: "Ettehad et al., Lancet 2016", year: 2016, dept: "cardiology" },
  { id: "bp-usual", topic: "Heart", title: "Usual blood pressure and risk", claim: "From 115 mmHg upward, every 20 mmHg higher systolic pressure roughly doubles vascular death risk (ages 40–69).", design: "Meta-analysis of prospective cohorts", studies: 61, people: 1000000,
    effect: "≈2× vascular death per +20 mmHg", grade: "Moderate", why: "Observational, but very large with a strong dose–response.", source: "Prospective Studies Collaboration, Lancet 2002", year: 2002, dept: "cardiology" },
  { id: "lpa", topic: "Biomarkers", title: "Lipoprotein(a)", claim: "Higher Lp(a) is linked with more coronary disease; it is largely inherited, so one test is usually enough.", design: "Meta-analysis of prospective studies", studies: 36, people: 126634,
    ratio: { v: 1.13, lo: 1.09, hi: 1.18, label: "per 3.5× higher Lp(a)" }, effect: "13% higher coronary risk per 3.5-fold higher Lp(a)", grade: "Moderate", why: "Observational, supported by genetic (Mendelian randomisation) studies.", source: "Emerging Risk Factors Collaboration, JAMA 2009", year: 2009, dept: "cardiology" },
  { id: "crp", topic: "Biomarkers", title: "hs-CRP (inflammation)", claim: "Higher CRP is associated with more coronary heart disease.", design: "Meta-analysis of prospective cohorts", studies: 54, people: 160309,
    ratio: { v: 1.37, lo: 1.27, hi: 1.48, label: "per 1 SD higher log CRP" }, effect: "37% higher coronary risk per SD", grade: "Low", why: "Observational; association weakens after adjustment for other risk factors.", source: "Emerging Risk Factors Collaboration, Lancet 2010", year: 2010, test: "hs-CRP", dept: "cardiology" },
  { id: "sleep", topic: "Lifestyle", title: "Short sleep", claim: "Consistently sleeping less than about 6–7 hours is linked with higher mortality.", design: "Meta-analysis of prospective cohorts", studies: 16, people: 1382999,
    ratio: { v: 1.12, lo: 1.06, hi: 1.18, label: "short vs 7–8 h" }, effect: "12% higher mortality (long sleep: 30%)", grade: "Low", why: "Observational; sleep may reflect other illness.", source: "Cappuccio et al., Sleep 2010", year: 2010, test: "Cortisol", dept: "respiratory-medicine" },
  { id: "steps", topic: "Lifestyle", title: "Daily steps", claim: "More daily steps are linked with lower mortality, levelling off around 6,000–8,000 (60+) and 8,000–10,000 (under 60).", design: "Meta-analysis of prospective cohorts", studies: 15, people: 47471,
    ratio: { v: 0.47, lo: 0.39, hi: 0.57, label: "highest vs lowest quartile" }, effect: "≈53% lower mortality in the most active quarter", grade: "Low", why: "Observational with a clear dose–response; device-measured steps.", source: "Paluch et al., Lancet Public Health 2022", year: 2022 },
  { id: "five", topic: "Lifestyle", title: "Five healthy habits", claim: "Never smoking, healthy weight, 30+ minutes of activity, moderate alcohol and a quality diet add years.", design: "Two large prospective cohorts", studies: 2, people: 123219,
    effect: "+14.0 years (women) and +12.2 years (men) of life expectancy at 50", grade: "Low", why: "Observational; US health professionals.", source: "Li et al., Circulation 2018", year: 2018 },
  { id: "genes-life", topic: "Lifestyle", title: "Genes vs lifestyle", claim: "A favourable lifestyle is linked with about half the coronary risk, even with high genetic risk.", design: "Four prospective cohorts and studies", studies: 4, people: 55685,
    ratio: { v: 0.54, lo: 0.47, hi: 0.63, label: "favourable vs unfavourable" }, effect: "46% lower relative coronary risk", grade: "Low", why: "Observational; consistent across genetic risk groups.", source: "Khera et al., NEJM 2016", year: 2016, test: "Whole Genome Sequencing 30X", dept: "cardiology" },
  { id: "quit", topic: "Lifestyle", title: "Stopping smoking", claim: "Stopping by age 30 avoids almost all the excess risk; stopping at 40, 50 or 60 still gains about 9, 6 or 3 years.", design: "Prospective cohort, 50 years of follow-up", studies: 1, people: 34439,
    effect: "Up to ≈10 years of life regained", grade: "Moderate", why: "Very long follow-up with a large, consistent effect.", source: "Doll et al., BMJ 2004", year: 2004, dept: "respiratory-medicine" },
  { id: "fitness", topic: "Lifestyle", title: "Cardiorespiratory fitness", claim: "Low fitness carries a mortality risk comparable to or greater than smoking or diabetes.", design: "Retrospective cohort (treadmill testing)", studies: 1, people: 122007,
    ratio: { v: 5.04, lo: 4.1, hi: 6.2, label: "lowest vs elite fitness" }, effect: "≈5× higher mortality, lowest vs elite", grade: "Low", why: "Single-centre, observational; strong gradient.", source: "Mandsager et al., JAMA Network Open 2018", year: 2018 },
  { id: "med-diet", topic: "Lifestyle", title: "Mediterranean diet", claim: "A Mediterranean diet with extra-virgin olive oil or nuts lowered major cardiovascular events.", design: "Randomised trial", studies: 1, people: 7447,
    ratio: { v: 0.69, lo: 0.53, hi: 0.91, label: "olive-oil arm vs control" }, effect: "≈30% fewer major cardiovascular events", grade: "Moderate", why: "Single large trial, re-analysed after randomisation issues.", source: "Estruch et al., NEJM 2018", year: 2018, dept: "nutrition" },
  { id: "epa", topic: "Supplements", title: "High-dose EPA (omega-3, prescription)", claim: "In people with high triglycerides on statins, high-dose purified EPA lowered cardiovascular events.", design: "Randomised trial", studies: 1, people: 8179,
    ratio: { v: 0.75, lo: 0.68, hi: 0.83, label: "icosapent ethyl vs placebo" }, effect: "25% fewer cardiovascular events", grade: "Moderate", why: "One large trial; debate about the mineral-oil placebo. Not the same as over-the-counter fish oil.", source: "Bhatt et al., NEJM 2019 (REDUCE-IT)", year: 2019, dept: "cardiology" },
  { id: "vitd", topic: "Supplements", title: "Vitamin D supplements", claim: "In generally healthy adults, vitamin D did not lower cancer or cardiovascular events.", design: "Randomised trial", studies: 1, people: 25871,
    ratio: { v: 0.97, lo: 0.85, hi: 1.12, label: "cardiovascular events" }, effect: "No clear benefit for heart events (cancer HR 0.96)", grade: "High", why: "Large, well-run randomised trial — a useful 'no effect' result.", source: "Manson et al., NEJM 2019 (VITAL)", year: 2019, test: "Vitamin D, 25-Hydroxy" },
];
