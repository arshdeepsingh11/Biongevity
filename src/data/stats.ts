/**
 * Evidence layer — public figures used in charts across the site.
 * Every figure carries its source. Anything marked `illustrative` is a teaching example, not member data.
 */

export interface StatItem { v: string; l: string; src?: string }
export type ChartSpec =
  | { kind: "bars"; title: string; unit?: string; data: { label: string; value: number; note?: string }[]; src: string; format?: "B" | "M" }
  | { kind: "waffle"; title: string; of: number; hit: number; src: string }
  | { kind: "donut"; title: string; center: string; sub: string; data: { label: string; value: number }[]; src: string; illustrative?: boolean }
  | { kind: "columns"; title: string; unit?: string; data: { label: string; value: number }[]; src: string; highlight?: string };

/* ---------- Five data streams (home: DataStreamExplorer) ---------- */
export const STREAMS = {
  Genomics: {
    lead: "Your genome is the instruction set. Whole-genome sequencing reads it end to end, so risk can be found before it shows up.",
    stats: [
      { v: "3.1B", l: "base pairs in the human genome", src: "NHGRI" },
      { v: "~20k", l: "protein-coding genes", src: "GENCODE" },
      { v: "4–5M", l: "sites where a typical genome differs from the reference", src: "1000 Genomes, 2015" },
      { v: "30X", l: "clinical-grade WGS read depth", src: "BioAro Labs" },
    ] as StatItem[],
  },
  Epigenetics: {
    lead: "Epigenetic marks switch genes on and off. They respond to sleep, diet, stress and exercise — which makes them measurable and changeable.",
    stats: [
      { v: "~28M", l: "CpG sites in the human genome", src: "Lövkvist et al., 2016" },
      { v: "353", l: "CpGs in the Horvath epigenetic clock", src: "Horvath, 2013" },
    ] as StatItem[],
    clock: { labels: ["30", "35", "40", "45", "50", "55", "60"], chrono: [30, 35, 40, 45, 50, 55, 60], bio: [31, 36, 40, 43, 46, 49, 52] },
  },
  Microbiome: {
    lead: "Trillions of microbes in the gut help digest food, make vitamins and train the immune system. Balance matters more than any single species.",
    stats: [
      { v: "~38T", l: "bacterial cells in a reference adult", src: "Sender, Fuchs & Milo, 2016" },
      { v: "~70%", l: "of immune tissue sits in the gut", src: "Vighi et al., 2008" },
    ] as StatItem[],
    phyla: [
      { label: "Bacillota (Firmicutes)", value: 58 }, { label: "Bacteroidota", value: 28 },
      { label: "Actinomycetota", value: 7 }, { label: "Pseudomonadota", value: 4 }, { label: "Other", value: 3 },
    ],
  },
  "Biological age": {
    lead: "Biological age reflects how your body is actually ageing. Routine blood markers can estimate it, and it can be tracked over time.",
    stats: [
      { v: "9", l: "routine blood markers in the PhenoAge model", src: "Levine et al., 2018" },
      { v: "Yearly", l: "re-test cadence in Biongevity programs", src: "Biongevity" },
    ] as StatItem[],
    trend: { labels: ["Y0", "Y1", "Y2", "Y3", "Y4", "Y5"], chrono: [48, 49, 50, 51, 52, 53], bio: [52, 51.5, 50.6, 50.1, 49.8, 49.6] },
  },
  "Clinical evaluations": {
    lead: "Function tells the story labs can't: fitness, lungs, vessels, strength and recovery — measured in clinic and mapped against your age group.",
    stats: [
      { v: "VO₂ max", l: "one of the strongest predictors of all-cause mortality", src: "Mandsager et al., JAMA Netw Open 2018" },
      { v: "≤ 0.90", l: "ankle-brachial index that indicates peripheral artery disease", src: "AHA/ACC 2016" },
    ] as StatItem[],
    radar: { axes: ["VO₂ max", "Lung function", "Vascular (ABI)", "Grip", "Body comp.", "HRV", "Cognition"], you: [0.72, 0.86, 0.9, 0.64, 0.58, 0.7, 0.82], ref: [0.6, 0.7, 0.75, 0.6, 0.6, 0.6, 0.7] },
  },
} as const;
export type StreamName = keyof typeof STREAMS;

/* ---------- Department evidence (home: DisciplineExplorer, department pages) ---------- */
export const DEPT_EVIDENCE: Record<string, { why: string; stats: StatItem[]; chart: ChartSpec }> = {
  "internal-medicine": {
    why: "Most chronic disease builds silently for years. Internal medicine connects the dots across organs, labs and lifestyle.",
    stats: [{ v: "74%", l: "of global deaths are from non-communicable diseases", src: "WHO, 2023" }, { v: "41M", l: "NCD deaths every year", src: "WHO, 2023" }],
    chart: { kind: "bars", title: "Annual NCD deaths by cause", format: "M", src: "WHO NCD fact sheet, 2023", data: [{ label: "Cardiovascular", value: 17.9 }, { label: "Cancers", value: 9.3 }, { label: "Chronic respiratory", value: 4.1 }, { label: "Diabetes (incl. kidney)", value: 2.0 }] },
  },
  cardiology: {
    why: "Heart disease is the world's leading cause of death — and blood pressure, lipids and rhythm can be measured long before symptoms.",
    stats: [{ v: "17.9M", l: "deaths from cardiovascular disease each year", src: "WHO" }, { v: "1.28B", l: "adults aged 30–79 live with hypertension", src: "WHO, 2023" }],
    chart: { kind: "waffle", title: "About 1 in 3 adults worldwide has hypertension", of: 30, hit: 10, src: "WHO Global report on hypertension, 2023" },
  },
  dermatology: {
    why: "Skin shows biology on the surface — hydration, pigment, barrier and the skin microbiome can all be measured and treated precisely.",
    stats: [{ v: "~80%", l: "of visible facial ageing attributed to UV exposure", src: "Flament et al., 2013" }, { v: "1.8B", l: "people affected by a skin condition at any time", src: "WHO" }],
    chart: { kind: "donut", title: "Drivers of visible facial ageing", center: "UV", sub: "main driver", src: "Flament et al., Clin Cosmet Investig Dermatol 2013", data: [{ label: "Sun (UV) exposure", value: 80 }, { label: "Intrinsic & other factors", value: 20 }] },
  },
  dental: {
    why: "The mouth is linked to heart and metabolic health. Oral disease is the most common non-communicable condition on earth.",
    stats: [{ v: "3.5B", l: "people affected by oral diseases", src: "WHO Global oral health report, 2022" }, { v: "~19%", l: "of adults have severe gum disease", src: "WHO, 2022" }],
    chart: { kind: "bars", title: "People affected worldwide", format: "B", src: "WHO Global oral health status report, 2022", data: [{ label: "Caries, permanent teeth", value: 2.0 }, { label: "Severe periodontal disease", value: 1.0 }, { label: "Caries, primary teeth", value: 0.51 }] },
  },
  "womens-health": {
    why: "Hormones shift across every life stage. Bone, heart and metabolic risk change with them — especially around menopause.",
    stats: [{ v: "1 in 3", l: "women over 50 will have an osteoporotic fracture", src: "International Osteoporosis Foundation" }, { v: "51", l: "average age at menopause", src: "The Menopause Society" }],
    chart: { kind: "waffle", title: "1 in 3 women over 50 will have an osteoporotic fracture", of: 30, hit: 10, src: "International Osteoporosis Foundation" },
  },
  "mens-health": {
    why: "Men live shorter lives on average and see doctors less. Hormones, prostate and heart health are best tracked early.",
    stats: [{ v: "1.4M", l: "new prostate cancer cases worldwide (2020)", src: "GLOBOCAN 2020" }, { v: "5 yrs", l: "shorter life expectancy than women, globally", src: "WHO World Health Statistics" }],
    chart: { kind: "columns", title: "Global life expectancy at birth (2019)", unit: " yrs", src: "WHO World Health Statistics 2021", highlight: "Men", data: [{ label: "Men", value: 70.8 }, { label: "Women", value: 75.9 }] },
  },
  "gut-health": {
    why: "The gut microbiome shapes digestion, immunity and mood. Fibre is its main fuel — and most adults don't get enough.",
    stats: [{ v: "~70%", l: "of immune tissue is in the gut", src: "Vighi et al., 2008" }, { v: "~50%", l: "of the recommended fibre is what most Canadians eat", src: "Dietitians of Canada" }],
    chart: { kind: "bars", title: "Daily fibre targets (Health Canada)", unit: " g", src: "Health Canada Dietary Reference Intakes", data: [{ label: "Adult men", value: 38 }, { label: "Adult women", value: 25 }, { label: "Typical intake (≈ half)", value: 16, note: "approximate" }] },
  },
  gastroenterology: {
    why: "Reflux, IBS and bowel cancer are common — and colorectal cancer is highly treatable when found early by screening.",
    stats: [{ v: "1.9M", l: "new colorectal cancer cases worldwide (2020)", src: "GLOBOCAN 2020" }, { v: "3rd", l: "most common cancer worldwide", src: "WHO" }],
    chart: { kind: "bars", title: "Global prevalence", unit: "%", src: "Nirwan et al., Sci Rep 2020; Sperber et al., Gastroenterology 2021", data: [{ label: "GERD (reflux)", value: 14 }, { label: "IBS (Rome IV)", value: 4.1 }] },
  },
  "mental-health": {
    why: "Mental health is health. Sleep, stress physiology and lifestyle are measurable levers alongside therapy and medicine.",
    stats: [{ v: "1 in 8", l: "people live with a mental disorder", src: "WHO, 2022" }, { v: "7+ hrs", l: "nightly sleep recommended for adults", src: "AASM / SRS" }],
    chart: { kind: "bars", title: "People living with…", format: "M", src: "WHO World mental health report, 2022", data: [{ label: "Anxiety disorders", value: 301 }, { label: "Depressive disorders", value: 280 }] },
  },
};
