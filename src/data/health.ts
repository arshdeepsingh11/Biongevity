import type { IconName } from "@/components/ui/icons";

/* Content: biongevity.com + Biongevity package details / press (via design artifact). */

export interface Department {
  id: string;
  icon: IconName;
  name: string;
  short: string;
  tag: string;
  summary: string;
  focus: { t: string; d: string }[];
  keywords: string[];
  source: string;
  questions: string[];
  calm?: boolean;
}

const S1 = "biongevity.com (comprehensive evaluations)";
const S2 = "Biongevity package details / press";

export const DEPARTMENTS: Department[] = [
  { id: "internal-medicine", icon: "stethoscope", name: "Internal Medicine", short: "Internal Medicine", tag: "The physician-led core of your evaluation.", summary: "Medical history, physical exam and guideline-based management of chronic disease and prevention.", focus: [{ t: "History & exam", d: "A complete baseline of your health today." }, { t: "Chronic disease", d: "Guideline-based therapies where needed." }, { t: "Prevention", d: "Screening and risk reduction planned with you." }], keywords: ["Medical history", "Physical exam", "Guideline-based care", "Prevention"], source: S1, questions: ["Which baseline tests matter most for me?", "How often should we review my results?"] },
  { id: "geriatric-medicine", icon: "hourglass", name: "Geriatric Medicine", short: "Geriatric", tag: "Healthy ageing, planned ahead.", summary: "Evaluation focused on function, independence and healthspan as you age.", focus: [{ t: "Function", d: "Mobility, strength and daily independence." }, { t: "Medications", d: "Reviewing what you take together." }, { t: "Healthspan", d: "Goals for the decades ahead." }], keywords: ["Healthspan", "Function", "Biological age", "Mobility"], source: S1, questions: ["What does healthy ageing look like for me?", "Which changes are normal with age?"] },
  { id: "cardiology", icon: "heart", name: "Cardiology", short: "Cardiology", tag: "Heart and vessel health over the long term.", summary: "Cardiovascular evaluation as part of your longevity baseline and ongoing monitoring.", focus: [{ t: "Risk assessment", d: "Understanding your cardiovascular risk." }, { t: "Monitoring", d: "Tracking change over time." }, { t: "Remote care", d: "Biongevity has described a Virtual Hypertension Clinic." }], keywords: ["Blood pressure", "Lipids", "Cardiovascular risk", "Remote monitoring"], source: S1, questions: ["What is my cardiovascular risk and why?", "Which numbers should I track at home?"] },
  { id: "neurology", icon: "brain", name: "Neurology", short: "Neurology", tag: "Brain health and cognition.", summary: "Neurological evaluation as part of a whole-person view of ageing.", focus: [{ t: "Cognition", d: "Memory and attention baseline." }, { t: "Brain ageing", d: "Understanding risk factors." }, { t: "Sleep & brain", d: "How rest affects cognition." }], keywords: ["Cognition", "Brain ageing", "Memory", "Sleep"], source: S1, questions: ["How can I protect my cognition?", "Should I have a cognitive baseline?"] },
  { id: "mental-health", icon: "leaf", name: "Mental Health", short: "Mental Health", tag: "Calm, confidential support.", summary: "Counselling and support for stress, mood and resilience. Package details mention psychologist counselling.", focus: [{ t: "Stress", d: "Understanding what drains and restores you." }, { t: "Counselling", d: "Sessions with a psychologist." }, { t: "Support", d: "A quiet, confidential space." }], keywords: ["Calm", "Support", "Resilience"], source: S1, questions: ["How can I manage stress better?", "What support is available between visits?"], calm: true },
  { id: "kinesiology", icon: "dumbbell", name: "Kinesiology & Fitness", short: "Kinesiology", tag: "Movement as medicine.", summary: "Exercise programs and fitness training built around your evaluation. Core package details list 10 training sessions per month.", focus: [{ t: "Assessment", d: "How you move today." }, { t: "Programs", d: "Exercise programs tailored to you." }, { t: "Training", d: "Coached sessions." }], keywords: ["Exercise programs", "Strength", "Mobility", "Fitness training"], source: S1, questions: ["What training suits my goals?", "How do I progress safely?"] },
  { id: "dietology", icon: "utensils", name: "Dietology & Nutrition", short: "Dietology", tag: "Nutrition built around you.", summary: "Nutrition counselling and personalized diet plans. Core package details list monthly personalized diet plans.", focus: [{ t: "Nutrition counselling", d: "Guidance from a dietitian." }, { t: "Diet plans", d: "Monthly personalized plans." }, { t: "Lifestyle", d: "Food that fits your routine." }], keywords: ["Nutrition counseling", "Diet plans", "Metabolic profiling"], source: S1, questions: ["What should I change first in my diet?", "How do my results affect my nutrition plan?"] },
  { id: "dermatology", icon: "droplet", name: "Dermatology", short: "Dermatology", tag: "Skin health and skin longevity.", summary: "Dermatology consultations. Package materials mention AI skin analysis and skin microbiome analysis; confirm per package.", focus: [{ t: "Consultations", d: "Skin health reviews." }, { t: "AI skin analysis", d: "Listed in package materials." }, { t: "Skin microbiome", d: "BioSkin test from BioAro Labs." }], keywords: ["Skin health", "AI skin analysis", "Skin microbiome"], source: S2, questions: ["What would help my skin most?", "Is skin microbiome testing useful for me?"] },
  { id: "dental", icon: "tooth", name: "Dental Care", short: "Dental", tag: "Oral health as part of longevity.", summary: "Dental consultation is listed in Biongevity package details.", focus: [{ t: "Consultation", d: "Oral health review." }, { t: "Prevention", d: "Keeping problems small." }, { t: "Oral microbiome", d: "BioDental test from BioAro Labs." }], keywords: ["Oral health", "Dental consultation", "Oral microbiome"], source: S2, questions: ["How does oral health relate to overall health?", "How often should I be reviewed?"] },
  { id: "radiology", icon: "scan", name: "Radiology", short: "Radiology", tag: "Imaging, when it adds information.", summary: "Radiology is listed among the services in Biongevity package details.", focus: [{ t: "Imaging", d: "When imaging is appropriate." }, { t: "Interpretation", d: "Results explained clearly." }, { t: "Follow-up", d: "Planned next steps." }], keywords: ["Imaging", "Interpretation"], source: S2, questions: ["Do I need imaging, and why?", "What will the scan show and not show?"] },
  { id: "mens-womens-health", icon: "users", name: "Men's & Women's Health", short: "Men's & Women's", tag: "Care across every life stage.", summary: "Men's and women's health services are listed in Biongevity's announced health plans.", focus: [{ t: "Life stages", d: "Care that fits your stage of life." }, { t: "Hormones", d: "Hormone & steroid balance testing via BioAro Labs." }, { t: "Family", d: "Plans for you and your family." }], keywords: ["Life stages", "Hormones", "Family health"], source: S2, questions: ["Which checks are right for my stage of life?", "How do hormones affect my plan?"] },
];

export const deptById = (id: string) => DEPARTMENTS.find((d) => d.id === id) ?? DEPARTMENTS[0];

/** Keyword triage used by AI starting point + contact routing (rule-based; no PHI leaves the device). */
const TRIAGE: Record<string, string[]> = {
  "internal-medicine": ["general", "check", "tired", "fatigue", "blood test"],
  "geriatric-medicine": ["ageing", "aging", "older", "elderly"],
  cardiology: ["heart", "cholesterol", "blood pressure", "chest", "lipid"],
  neurology: ["memory", "focus", "brain", "headache", "fog"],
  "mental-health": ["stress", "anxi", "mood", "depress", "burnout"],
  kinesiology: ["fitness", "strength", "muscle", "stiff", "run", "exercise", "joint"],
  dietology: ["weight", "diet", "food", "nutrition", "sugar", "eat"],
  dermatology: ["skin", "acne", "wrinkle", "hair"],
  dental: ["teeth", "tooth", "gum", "dental", "breath"],
  radiology: ["scan", "imaging", "x-ray", "mri"],
  "mens-womens-health": ["hormone", "menopaus", "testosterone", "period", "fertility"],
};

export function scoreDepartments(text: string): string[] {
  const s = text.toLowerCase();
  const ranked = Object.entries(TRIAGE)
    .map(([id, w]) => [id, w.filter((x) => s.includes(x)).length] as const)
    .filter((x) => x[1] > 0)
    .sort((a, b) => b[1] - a[1])
    .map((x) => x[0]);
  return ranked.length ? ranked.slice(0, 3) : ["internal-medicine"];
}

export const PILLARS: { t: string; icon: IconName; d: string }[] = [
  { t: "Genomics", icon: "dna", d: "The most comprehensive genetic analysis to reveal insights built into your DNA." },
  { t: "Epigenetics", icon: "layers", d: "Your DNA is influenced by factors that can be modified by changing your lifestyle." },
  { t: "Life data", icon: "phone", d: "Data from the mobile apps you already use, integrated to aid medical diagnosis." },
  { t: "Biological age", icon: "hourglass", d: "Which ageing molecules your body produces, to understand the biological age of each organ system." },
  { t: "Clinical evaluations", icon: "stethoscope", d: "Comprehensive evaluations across internal medicine, cardiology, neurology, mental health and more." },
];

export const CARE_PHASES: { n: string; icon: IconName; t: string; short: string; d: string }[] = [
  { n: "01", icon: "target", t: "Baseline", short: "Comprehensive evaluations and advanced diagnostics.", d: "Establish your health baseline with comprehensive evaluations and advanced tests, including genomic and epigenetic analyses, from medical history and physical exams to DNA methylation profiling and gene expression studies." },
  { n: "02", icon: "file", t: "Personalized care", short: "Guideline-based therapy plus lifestyle.", d: "Guideline-based therapies for chronic disease management and preventive care, combined with nutrition counselling, exercise programs, stress management and sleep hygiene." },
  { n: "03", icon: "activity", t: "Longitudinal monitoring", short: "ELR App, telemedicine and wearables.", d: "In-clinic and telemedicine consultations via the ELR App, remote monitoring with wearables and smart home devices, and continuous analysis with personal feedback from BioELR." },
  { n: "04", icon: "users", t: "Holistic care", short: "Multidisciplinary support and education.", d: "Alternative therapies and multidisciplinary support, community engagement and patient education for informed decisions and sustainable outcomes." },
];

export const PACKAGES = [
  { handle: "biongevity-core", name: "Biongevity Core", consult: "Once monthly", featured: false, desc: "Entry-level plan with biological age tracking, metabolic efficiency optimization and predictive health insights.", tests: ["Whole genome sequencing", "Gut microbiome test", "Telomere length analysis"], extras: ["Monthly personalized diet plans", "10 fitness training sessions / month"] },
  { handle: "biongevity-plus", name: "Biongevity Plus", consult: "Twice monthly", featured: true, desc: "Advanced genomic testing, epigenetic analysis and gut microbiome optimization.", tests: ["Everything in Core", "Targeted methylation analysis", "Pharmacogenomics"], extras: ["Psychologist counselling", "Dermatology & dental consultations"] },
  { handle: "biongevity-elite", name: "Biongevity Elite", consult: "Unlimited", featured: false, desc: "The most advanced program, with unlimited access to various healthcare providers.", tests: ["Everything in Plus", "Transcriptomics / gene expression", "Cell-free DNA cancer screening"], extras: ["Unlimited provider access", "Radiology as indicated"] },
];

export const KEYWORDS_A = ["Whole genome sequencing", "Epigenetic analysis", "Biological age", "Telomere length", "Gut microbiome", "Pharmacogenomics", "Proteomics", "Methylation", "Gene expression", "Continuous monitoring"];
export const KEYWORDS_B = ["BioELR", "ELR App", "Telemedicine", "Wearables", "Smart home devices", "Guideline-based therapy", "Nutrition counseling", "Sleep hygiene", "Stress management", "Exercise programs"];

export const LIFE_PLACES: { icon: IconName; t: string; d: string; media: string }[] = [
  { icon: "home", t: "Home", d: "Remote monitoring with wearables and smart home devices.", media: "lifeHome" },
  { icon: "briefcase", t: "Office", d: "Telemedicine consultations through the ELR App.", media: "lifeOffice" },
  { icon: "plane", t: "Travel", d: "Your BioELR record goes wherever you are.", media: "lifeTravel" },
];

export const APP_FEATURES: { icon: IconName; t: string; d: string }[] = [
  { icon: "phone", t: "ELR App", d: "Your health journey in one place." },
  { icon: "video", t: "Telemedicine", d: "Consultations by video through the ELR App." },
  { icon: "activity", t: "Wearables", d: "Remote monitoring with wearables and smart home devices." },
  { icon: "sparkle", t: "BioELR feedback", d: "Personalized feedback and continuous data analysis." },
  { icon: "message", t: "Care team", d: "Stay in touch between visits." },
  { icon: "calendar", t: "Visits", d: "In-clinic and telemedicine appointments." },
];
