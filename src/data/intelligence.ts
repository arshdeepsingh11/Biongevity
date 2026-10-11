import type { IconName } from "@/components/ui/icons";

/**
 * Home intelligence data — the connections the home page reasons over.
 * Every figure carries a source. Ranges are population guidance, not personal diagnosis.
 */

/* ───────── Biomarker constellation: systems ⟷ markers ⟷ departments ───────── */

export interface BodySystem { id: string; label: string; icon: IconName; depts: string[]; why: string }
export interface Marker { id: string; label: string; short: string; icon: IconName; systems: string[]; how: string; range: string; fact: string; src: string; test?: string }

export const SYSTEMS: BodySystem[] = [
  { id: "heart", label: "Heart & vessels", icon: "heart", depts: ["cardiology", "heart-failure"], why: "Cardiovascular disease is the leading cause of death worldwide." },
  { id: "metabolism", label: "Metabolism", icon: "flame", depts: ["endocrinology", "internal-medicine", "nutrition"], why: "Blood sugar, weight and lipids drive heart, kidney and brain risk together." },
  { id: "brain", label: "Brain & mood", icon: "brain", depts: ["geriatric-medicine", "mental-health"], why: "Sleep, stress and vascular health shape memory and mood." },
  { id: "gut", label: "Gut", icon: "gut", depts: ["gut-health", "nutrition"], why: "The gut hosts most immune tissue and trillions of microbes." },
  { id: "hormones", label: "Hormones", icon: "test-tube", depts: ["endocrinology", "womens-health", "mens-health"], why: "Hormones govern energy, body composition, bone and mood." },
  { id: "lungs", label: "Lungs & sleep", icon: "lungs", depts: ["respiratory-medicine"], why: "Breathing and sleep quality affect the heart and brain every night." },
  { id: "kidneys", label: "Kidneys", icon: "droplet", depts: ["internal-medicine", "cardiology"], why: "Kidneys filter blood and are closely tied to blood pressure and diabetes." },
  { id: "ageing", label: "Cellular ageing", icon: "hourglass", depts: ["internal-medicine"], why: "Inflammation and cellular stress underlie many age-related diseases." },
];

export const MARKERS: Marker[] = [
  { id: "ldl", label: "LDL cholesterol", short: "LDL", icon: "droplet", systems: ["heart", "metabolism"], how: "Blood test", range: "Target depends on overall risk", fact: "Each 1 mmol/L reduction in LDL lowers major vascular events by about 22%.", src: "CTT Collaboration, Lancet 2010" },
  { id: "bp", label: "Blood pressure", short: "BP", icon: "gauge", systems: ["heart", "kidneys", "brain"], how: "Home & 24-hour monitoring", range: "Home average < 135/85 mmHg", fact: "Every 20 mmHg higher systolic pressure roughly doubles cardiovascular death risk (ages 40–69).", src: "Prospective Studies Collaboration, Lancet 2002; Hypertension Canada" },
  { id: "crp", label: "hs-CRP", short: "hs-CRP", icon: "flame", systems: ["heart", "ageing", "gut"], how: "Blood test", range: "< 1 low · 1–3 average · > 3 mg/L higher risk", fact: "hs-CRP above 3 mg/L marks higher cardiovascular risk in otherwise healthy adults.", src: "AHA/CDC scientific statement, 2003", test: "hs-CRP (High-Sensitivity C-Reactive Protein)" },
  { id: "a1c", label: "HbA1c", short: "HbA1c", icon: "chart", systems: ["metabolism", "kidneys", "heart"], how: "Blood test", range: "< 6.0% normal · 6.0–6.4% prediabetes · ≥ 6.5% diabetes", fact: "HbA1c reflects average blood sugar over about three months.", src: "Diabetes Canada guidelines" },
  { id: "pai1", label: "PAI-1", short: "PAI-1", icon: "network", systems: ["heart", "metabolism"], how: "Blood test", range: "Interpreted by a clinician", fact: "PAI-1 links clotting with insulin resistance and vascular health.", src: "BioAro Labs", test: "PAI-1 Total (Plasminogen Activator Inhibitor-1)" },
  { id: "cysc", label: "Cystatin C", short: "Cys C", icon: "droplet", systems: ["kidneys", "ageing"], how: "Blood test", range: "Used to estimate eGFR", fact: "Combining cystatin C with creatinine gives a more accurate kidney-function estimate.", src: "KDIGO CKD guideline, 2024", test: "Cystatin C" },
  { id: "vitd", label: "Vitamin D", short: "Vit D", icon: "sun", systems: ["hormones", "metabolism"], how: "Blood test", range: "≥ 50 nmol/L sufficient for bone health in most people", fact: "Vitamin D is essential for calcium absorption and bone strength.", src: "Institute of Medicine, 2011; Health Canada", test: "Vitamin D, 25-Hydroxy (D2 + D3)" },
  { id: "cortisol", label: "Cortisol", short: "Cortisol", icon: "wave", systems: ["hormones", "brain"], how: "Timed blood or saliva test", range: "Highest after waking, lowest at night", fact: "Cortisol peaks 30–45 minutes after waking — sample timing changes the result.", src: "Endocrine physiology", test: "Cortisol" },
  { id: "hormones", label: "Sex hormones", short: "E2 · T · SHBG", icon: "test-tube", systems: ["hormones"], how: "Blood panel", range: "Varies with age, sex and cycle", fact: "Estradiol, testosterone and SHBG together explain more than any single value.", src: "BioAro Labs", test: "Hormone Health" },
  { id: "gdf15", label: "GDF-15", short: "GDF-15", icon: "atom", systems: ["ageing", "metabolism"], how: "Blood test", range: "Rises with age and stress", fact: "GDF-15 rises with cellular stress and is among the most studied ageing biomarkers.", src: "BioAro Labs", test: "GDF-15 (Growth Differentiation Factor 15)" },
  { id: "telomere", label: "Telomere length", short: "Telomeres", icon: "dna", systems: ["ageing"], how: "Blood test", range: "Compared with age-matched reference", fact: "Telomeres shorten as cells divide — a research marker of biological ageing, not a diagnosis.", src: "BioAro Labs", test: "Telomere Length Testing" },
  { id: "ptau", label: "p-Tau217", short: "p-Tau217", icon: "brain", systems: ["brain"], how: "Blood test, medically guided", range: "Interpreted with clinical evaluation", fact: "Blood p-tau217 identified Alzheimer's pathology with high accuracy in research cohorts.", src: "Palmqvist et al., JAMA 2020", test: "p-Tau217 (Phosphorylated Tau 217)" },
  { id: "microbiome", label: "Gut microbiome", short: "Microbiome", icon: "gut", systems: ["gut", "metabolism", "brain"], how: "At-home stool test", range: "Higher diversity generally healthier", fact: "About 38 trillion bacteria live in a reference adult, mostly in the gut.", src: "Sender, Fuchs & Milo, 2016", test: "BioGut" },
  { id: "vo2", label: "VO₂ max", short: "VO₂ max", icon: "walk", systems: ["heart", "lungs", "ageing"], how: "Exercise test", range: "Compared with age and sex norms", fact: "Low versus elite cardiorespiratory fitness carries about 5× the risk of death.", src: "Mandsager et al., JAMA Netw Open 2018" },
  { id: "spiro", label: "Spirometry", short: "FEV₁/FVC", icon: "lungs", systems: ["lungs"], how: "Breathing test", range: "FEV₁/FVC < 0.70 suggests airflow obstruction", fact: "Spirometry is the standard test to diagnose COPD and assess asthma.", src: "GOLD report" },
  { id: "sleep", label: "Sleep duration", short: "Sleep", icon: "moon", systems: ["brain", "lungs", "metabolism"], how: "Wearable or sleep study", range: "7+ hours for adults", fact: "Consistently short sleep is linked to about 12% higher mortality.", src: "AASM/SRS; Cappuccio et al., Sleep 2010" },
  { id: "dna", label: "Whole genome", short: "Genome", icon: "dna", systems: ["heart", "brain", "metabolism", "hormones"], how: "One-time sequencing", range: "30X clinical read depth", fact: "A typical genome differs from the reference at 4–5 million sites.", src: "1000 Genomes Project, 2015", test: "Whole Genome Sequencing 30X" },
];

/* ───────── Lifestyle → life expectancy (Li et al., Circulation 2018) ───────── */

export const LIFESTYLE_FACTORS = [
  { id: "smoke", label: "Never smoked", icon: "no-smoking" as IconName, detail: "No tobacco use" },
  { id: "bmi", label: "Healthy BMI", icon: "scale" as IconName, detail: "BMI 18.5–24.9" },
  { id: "move", label: "Active 30+ min a day", icon: "walk" as IconName, detail: "Moderate-to-vigorous activity" },
  { id: "alcohol", label: "Moderate alcohol or none", icon: "wine" as IconName, detail: "Women ≤ 1, men ≤ 2 drinks a day" },
  { id: "diet", label: "High-quality diet", icon: "salad" as IconName, detail: "Top 40% diet quality score" },
];

/** Remaining life expectancy at age 50 with 0 vs 5 low-risk factors. Intermediate counts interpolated. */
export const LIFE_EXPECTANCY = { women: { zero: 29.0, five: 43.1 }, men: { zero: 25.5, five: 37.6 }, src: "Li et al., Circulation 2018 (US cohorts, 123,219 adults)" };

/** Relative mortality risk vs reference, from meta-analyses. */
export const SLEEP_RISK = { short: 1.12, long: 1.30, src: "Cappuccio et al., Sleep 2010 (16 cohorts, 1.38M people)" };
export const BP_RISK = { ref: 115, doubleEvery: 20, src: "Prospective Studies Collaboration, Lancet 2002" };
export const STEPS_RISK = { src: "Paluch et al., Lancet Public Health 2022 (15 cohorts, 47,471 adults)", bands: [{ steps: 3500, rr: 1 }, { steps: 5800, rr: 0.6 }, { steps: 7800, rr: 0.55 }, { steps: 10900, rr: 0.47 }] };

/* ───────── Goal → test → insight → protocol → care pipeline ───────── */

export interface GoalPath { id: string; label: string; icon: IconName; test: string; reveals: string; formula: string; program: string; dept: string; stat: { v: string; l: string; src: string } }
export const GOAL_PATHS: GoalPath[] = [
  { id: "heart", label: "Protect my heart", icon: "heart", test: "hs-CRP (High-Sensitivity C-Reactive Protein)", reveals: "Low-grade vascular inflammation that cholesterol alone can miss.", formula: "cellomega-plus", program: "Heart Health Check", dept: "cardiology", stat: { v: "17.9M", l: "cardiovascular deaths a year", src: "WHO" } },
  { id: "age", label: "Age slower", icon: "hourglass", test: "Core Inflammation Aging", reveals: "Inflammation and cellular-stress markers behind biological ageing.", formula: "longevity-plus", program: "Longevity Baseline", dept: "internal-medicine", stat: { v: "12–14 yrs", l: "longer life with 5 healthy habits", src: "Li et al., 2018" } },
  { id: "energy", label: "More energy", icon: "bolt", test: "Essential Vitamin Health", reveals: "Vitamin A, D, E and K status that shapes energy and immunity.", formula: "glutara", program: "Metabolic & Hormone", dept: "endocrinology", stat: { v: "1 in 3", l: "Canadians with diabetes or prediabetes", src: "Diabetes Canada" } },
  { id: "gut", label: "Fix my gut", icon: "gut", test: "BioGut", reveals: "Microbiome diversity, balance and metabolic efficiency.", formula: "glutara", program: "Biongevity Core", dept: "gut-health", stat: { v: "~70%", l: "of immune tissue sits in the gut", src: "Vighi et al., 2008" } },
  { id: "hormones", label: "Balance hormones", icon: "test-tube", test: "Hormone Health", reveals: "Estradiol, testosterone, SHBG, DHEA-S and cortisol together.", formula: "creagen-femme-energy", program: "Metabolic & Hormone", dept: "endocrinology", stat: { v: "51", l: "average age at menopause", src: "The Menopause Society" } },
  { id: "sleep", label: "Sleep better", icon: "moon", test: "Cortisol", reveals: "Stress-hormone rhythm that disrupts falling and staying asleep.", formula: "sleepo", program: "Biongevity Precision", dept: "respiratory-medicine", stat: { v: "936M", l: "adults estimated to have sleep apnea", src: "Benjafield et al., 2019" } },
  { id: "brain", label: "Sharper mind", icon: "brain", test: "Brain Health", reveals: "Amyloid and tau biomarkers for medically guided evaluation.", formula: "creagen-brain-boost", program: "Executive Health", dept: "geriatric-medicine", stat: { v: "55M", l: "people live with dementia", src: "WHO, 2021" } },
  { id: "perform", label: "Perform & recover", icon: "dumbbell", test: "Advanced Amino Acid Metabolism", reveals: "Fuel and recovery signals that guide training load.", formula: "creagen-pro-power", program: "Executive Health", dept: "internal-medicine", stat: { v: "5×", l: "mortality risk, low vs elite fitness", src: "Mandsager et al., 2018" } },
];
