import type { IconName } from "@/components/ui/icons";

/* Core programme content: pillars, journey, packages, life and app. Departments live in ./departments. */

export const SITE_URL = "https://biongevity.com"; // canonical domain (this site)

export { DEPARTMENTS, deptById, scoreDepartments, type Department } from "./departments";

export const PILLARS: { t: string; icon: IconName; d: string }[] = [
  { t: "Genomics", icon: "dna", d: "Whole exome and genome assessment — genes guide how your cells, tissues and organs develop and function." },
  { t: "Epigenetics", icon: "layers", d: "Your DNA is influenced by factors you can change through lifestyle." },
  { t: "Microbiome", icon: "gut", d: "Up to 50 trillion microorganisms that shape your wellbeing while in balance." },
  { t: "Biological age", icon: "hourglass", d: "Molecular, genetic and metabolic age indicators — your body's real clock." },
  { t: "Clinical evaluations", icon: "radar", d: "Cardiovascular, physical, digestive and cognitive assessments in one roadmap." },
];

/** Longevity Journey steps. */
export const CARE_PHASES: { n: string; icon: IconName; t: string; short: string; d: string }[] = [
  { n: "01", icon: "hourglass", t: "Molecular age", short: "Genetic and metabolic age indicators.", d: "Age is a complex interplay of factors — your molecular age serves as the body's clock." },
  { n: "02", icon: "dna", t: "Power of genomics", short: "Whole exome / genome assessment.", d: "Genes guide your development and function, shaping cells, tissues and organs." },
  { n: "03", icon: "heart", t: "Physical health", short: "Multidisciplinary physical assessment.", d: "Cardiovascular, physical and digestive health — maintaining the body is harder than a Ferrari." },
  { n: "04", icon: "activity", t: "Microfloral balance", short: "Comprehensive microbiome assessment.", d: "Up to 50 trillion microorganisms play a vital role in your wellbeing." },
  { n: "05", icon: "brain", t: "Cognitive health", short: "Mind wellness, explored.", d: "Many physical problems have a cognitive background; mental wellness needs care and rest." },
  { n: "06", icon: "dumbbell", t: "Fitness & strength", short: "Kinesiological assessment.", d: "Knowing your limits is vital for optimal health and fitness." },
  { n: "07", icon: "scan", t: "Imaging", short: "Internal health, revealed.", d: "Imaging reveals internal structure and evidence of hidden abnormalities." },
  { n: "08", icon: "pill", t: "Pharmacogenomics", short: "Medication matched to your genes.", d: "Understand how your genes influence your response to medications." },
];

export interface Package {
  handle: "core" | "precision" | "elite";
  name: string; price: number; currency: string; cadence: string; featured?: boolean; url: string;
  diagnostics: string[]; ai: string[]; app: string[]; bioactives: string;
}

export const PACKAGES: Package[] = [
  {
    handle: "core", name: "Biongevity Core", price: 369, currency: "USD", cadence: "Baseline + annual", url: "/contact/?interest=core",
    diagnostics: ["Longevity genomics panel — FOXO3, SIRT, mTOR, AMPK, inflammation pathways", "Gut microbiome snapshot — diversity, dysbiosis, metabolic efficiency", "Epigenetic ageing proxies — DNA methylation, inflammaging", "Glucose & insulin · Cortisol · Testosterone · Progesterone · Vit D & E"],
    ai: ["Personalized AI-driven longevity roadmap", "Daily micro-coaching: nutrition, sleep, movement, stress", "Conversational AI explaining biomarker changes", "Adherence tracking with intelligent nudging"],
    app: ["Longevity Score™ — biological vs chronological age proxy", "Habit, sleep and activity tracking", "Integrated wearables (sleep, HRV, activity, recovery)", "Monthly AI-generated longevity summaries"],
    bioactives: "Core formulation",
  },
  {
    handle: "precision", name: "Biongevity Precision", price: 699, currency: "USD", cadence: "Baseline + annual", featured: true, url: "/contact/?interest=precision",
    diagnostics: ["Everything in Core", "Whole Genome Sequencing 30X", "Telomere length measurement", "Pharmacogenomics", "IL-6 · IL-10 · TNF-α · CRP"],
    ai: ["Continuous biological age and risk forecasting", "AI-driven “what-if” intervention modelling", "Wearable physiology: HRV, sleep efficiency, recovery", "Monthly AI protocol updates · quarterly expert review"],
    app: ["Telomere and epigenetic trend visualization", "Precision nutrition timing & fasting guidance", "Sleep and circadian optimization", "Clinician-shareable longitudinal reports"],
    bioactives: "Precision nutraceutical stack",
  },
  {
    handle: "elite", name: "Biongevity Elite", price: 999, currency: "USD", cadence: "Baseline + 3–6 months", url: "/contact/?interest=elite",
    diagnostics: ["Whole Genome Sequencing 100X", "Multi-omics microbiome · metabolomics", "Advanced epigenetic ageing clocks", "Telomere dynamics · GDF-15, IGF-1, NAD/NADH, GlycA", "Targeted proteomics incl. p-Tau217, Aβ 40/42", "cfDNA & RNA sequencing (additional cost)"],
    ai: ["Continuous high-resolution longevity monitoring", "Intervention orchestration across nutrition, supplements, movement, recovery, stress", "Scenario planning: travel, stress load, illness, performance", "Direct collaboration with an assigned longevity physician / scientist"],
    app: ["Executive-grade longevity intelligence dashboard", "Family or cohort benchmarking", "Continuous wearable, CGM and device integration", "Quarterly executive longevity reports"],
    bioactives: "LONgevity+ clinical grade",
  },
];

export const KEYWORDS_A = ["Whole genome sequencing", "Epigenetic clocks", "Biological age", "Telomere length", "Gut microbiome", "Pharmacogenomics", "Proteomics", "Metabolomics", "Methylation", "Continuous monitoring"];
export const KEYWORDS_B = ["BioELR", "Biongevity App", "Virtual clinic", "Wearables", "Longevity Score™", "Precision nutrition", "Sleep & circadian", "Stress resilience", "VO₂ max", "AI longevity coach"];

/** Biongevity Life — the spaces where care is delivered. */
export const LIFE_PLACES: { icon: IconName; t: string; d: string }[] = [
  { icon: "plane", t: "Resorts", d: "Your time off should be more than a getaway — it should be a reset." },
  { icon: "home", t: "Home", d: "Healthy living starts at home." },
  { icon: "briefcase", t: "Offices", d: "Fostering wellness in the workplace." },
  { icon: "globe", t: "Cities", d: "Cities can be chaotic — they don't have to be unhealthy." },
  { icon: "book", t: "Schools", d: "Promoting longevity through health and wellness in schools." },
];

/** Biongevity App features. */
export const APP_FEATURES: { icon: IconName; t: string; d: string }[] = [
  { icon: "eye", t: "AI vitals", d: "Heart rate and blood pressure measured from your face through the camera." },
  { icon: "calendar", t: "Expert advice", d: "Book consultations with top healthcare professionals." },
  { icon: "stethoscope", t: "Specialized services", d: "Choose from a range of specialized healthcare services." },
  { icon: "utensils", t: "Diet tips", d: "Expert-curated nutrition for your goals and preferences." },
  { icon: "globe", t: "Live weather", d: "Plan your day and adjust routines to conditions." },
  { icon: "book", t: "News & events", d: "Healthcare news, events, sessions and blogs." },
];
