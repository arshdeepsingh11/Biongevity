import type { IconName } from "@/components/ui/icons";

/* Content source: biongevity.com (Precision Health menu, Longevity Packages, Journey, Life, App). */

export const SITE_URL = "https://biongevity.com";

export interface Department {
  id: string;
  icon: IconName;
  name: string;          // "Precision Cardiology"
  short: string;         // "Cardiology"
  tag: string;           // one-line promise
  summary: string;       // hero paragraph
  approach: string[];    // deeper paragraphs
  services: { t: string; d: string }[];
  specialist?: { role: string; bio: string };
  keywords: string[];
  questions: string[];
  tests: string[];       // related BioAro Labs handles
  source: string;
  calm?: boolean;
}

const AESTHETIC_TECH = [
  { t: "Candela GentleMax Pro", d: "Versatile laser for hair removal, skin rejuvenation and pigmentation correction." },
  { t: "Q-Switched Laser", d: "Precisely targets hyperpigmentation, sunspots and unwanted tattoos." },
  { t: "HydraFacial", d: "Cleanses, exfoliates, extracts and hydrates for brighter, healthier skin." },
  { t: "Skin Analyzer", d: "Assesses hydration, texture and pigmentation in detail." },
  { t: "CO₂ Laser Resurfacing", d: "Targets wrinkles, acne scars and textural irregularities." },
  { t: "HIFU Tightening", d: "Non-invasive lifting that stimulates deep collagen production." },
];

export const DEPARTMENTS: Department[] = [
  {
    id: "internal-medicine", icon: "stethoscope", name: "Precision Internal Medicine", short: "Internal Medicine",
    tag: "Genomics, microbiomics and epigenetics — focused on you.",
    summary: "We redefine healthcare with a cutting-edge approach that incorporates genomics, microbiomics and epigenetics — to prevent disease, promote healthy ageing and enhance quality of life.",
    approach: ["This personalized approach empowers you to take charge of your health, with early detection, prevention and tailored interventions ensuring a vibrant, longer life.", "Advanced imaging — ultrasound, MRI and CT — is integrated with your genomic and microbiome data for precise, proactive care and continuous progress monitoring."],
    services: [{ t: "Genomics", d: "Analyse your genetics to identify chronic disease risks before symptoms develop." }, { t: "Microbiomics", d: "Optimise your gut microbiome for metabolism and immunity; help prevent obesity, IBS and metabolic syndrome." }, { t: "Epigenetics", d: "See how environment, diet and lifestyle affect your genes, for personalized prevention." }, { t: "Advanced imaging", d: "Ultrasound, MRI and CT scans for early detection." }],
    keywords: ["Genomics", "Microbiomics", "Epigenetics", "Imaging", "Prevention"], questions: ["Which baseline tests matter most for me?", "How often should we review my results?"],
    tests: ["whole-genome-sequencing-30x", "core-inflammation-aging", "cystatin-c"], source: `${SITE_URL}/precision-internal-medicine/`,
  },
  {
    id: "cardiology", icon: "heart", name: "Precision Cardiology", short: "Cardiology",
    tag: "Personalized heart health for a longer life.",
    summary: "Advanced diagnostics and genetic analysis to treat hypertension, arrhythmias and coronary artery disease — optimizing heart health for quality of life and longevity.",
    approach: ["By integrating advanced diagnostic tools and genetic analysis, our cardiology experts create personalized treatment plans for your heart.", "Genetic testing, cardiac imaging and microbiome analysis come together to deliver personalized cardiovascular care."],
    services: [{ t: "Ambulatory BP & extended Holter", d: "Detect blood-pressure fluctuations and diagnose arrhythmias." }, { t: "Heart wellness check-up", d: "Assessments, screenings and genetic predisposition evaluations." }, { t: "Diagnostics & monitoring", d: "ECG, echocardiography, stress testing, VO₂ max and vascular exams." }, { t: "Precision medicine", d: "Genetic and microbiome testing for personalized treatment." }],
    specialist: { role: "Specialist Cardiologist", bio: "Over 11 years of expertise in non-invasive cardiac care, advanced cardiac imaging and precision medicine." },
    keywords: ["Hypertension", "Arrhythmia", "ECG", "VO₂ max", "Genetic risk"], questions: ["What is my cardiovascular risk and why?", "Which numbers should I track at home?"],
    tests: ["hs-crp-high-sensitivity-c-reactive-protein", "pai-1-total-plasminogen-activator-inhibitor-1", "telomere-length-testing"], source: `${SITE_URL}/precision-cardiology/`,
  },
  {
    id: "dermatology", icon: "face", name: "Precision Dermatology", short: "Dermatology",
    tag: "Tailored care for your unique skin.",
    summary: "Advanced, personalized skin treatments — from acne to ageing — backed by science and your skin's own microbiome.",
    approach: ["Our experts analyse your skin microbiome — the community of microorganisms living on your skin — to treat acne, eczema, psoriasis and more.", "Great skin starts with the right diagnosis: the Skin Microbiome Test and Bio Skin Kit measure imbalances, hydration and texture to guide treatment."],
    services: [{ t: "Skin Microbiome Test", d: "Identifies imbalances behind acne, dryness or irritation." }, ...AESTHETIC_TECH],
    keywords: ["Skin microbiome", "Acne", "Eczema", "Laser", "Rejuvenation"], questions: ["What would help my skin most?", "Is skin microbiome testing useful for me?"],
    tests: ["bioskin"], source: `${SITE_URL}/precision-dermatology/`,
  },
  {
    id: "dental", icon: "tooth", name: "Precision Dental", short: "Dental",
    tag: "Exceptional dental care, patient first.",
    summary: "Advanced treatments and the latest technology for precise, comfortable and effective dental care — from routine check-ups to cosmetic enhancement.",
    approach: ["Our Oral Microbiome Test assesses harmful bacteria early, helping prevent oral health issues and supporting long-term wellbeing.", "A warm, welcoming environment where your oral health is the priority."],
    services: [{ t: "Oral Microbiome Test", d: "Detects harmful bacteria and imbalances early." }, { t: "Root canal treatment", d: "Save infected teeth and relieve pain precisely." }, { t: "Restorative & cosmetic", d: "Fillings, crowns, veneers, whitening and implants." }, { t: "Pediatric dentistry", d: "Healthy development and cavity prevention for children." }, { t: "Preventive & periodontal", d: "Cleanings, gum care and disease prevention." }, { t: "Extractions & surgery", d: "Including wisdom teeth and complex procedures." }],
    keywords: ["Oral microbiome", "Cosmetic", "Implants", "Pediatric", "Gum care"], questions: ["How does oral health relate to overall health?", "How often should I be reviewed?"],
    tests: ["biodental"], source: `${SITE_URL}/precision-dental/`,
  },
  {
    id: "womens-health", icon: "flower", name: "Precision Women's Health", short: "Women's Health",
    tag: "Optimal health at every stage of life.",
    summary: "Genomic, microbiome and epigenetic testing for early detection of cancer, osteoporosis and hormonal imbalance — with fertility support and preventive screening.",
    approach: ["Genomic insights detect risks for breast cancer, ovarian cancer and osteoporosis, enabling early prevention.", "Microbiome analysis supports gut and vaginal health, fertility, pregnancy outcomes and hormonal balance; epigenetics shows how stress, diet and environment affect you."],
    services: [{ t: "Genomic risk", d: "Breast, ovarian cancer and osteoporosis predisposition." }, { t: "Microbiome", d: "Gut and vaginal health, fertility and infection prevention." }, { t: "Epigenetics", d: "How lifestyle shapes your health." }, { t: "Imaging", d: "Mammography, bone density scans and pelvic ultrasound." }],
    keywords: ["Hormones", "Fertility", "Bone density", "Vaginal microbiome", "Screening"], questions: ["Which checks are right for my stage of life?", "How do hormones affect my plan?"],
    tests: ["hormone-health", "biofemme", "estradiol-e2"], source: `${SITE_URL}/precision-womens-health/`,
  },
  {
    id: "mens-health", icon: "person", name: "Precision Men's Health", short: "Men's Health",
    tag: "Peak health at every stage.",
    summary: "Preventive care, early detection and optimized wellness — genetic markers for prostate cancer, cardiovascular health and hormone balance.",
    approach: ["Epigenetic analysis builds custom lifestyle plans for diet, exercise and stress.", "Prostate ultrasound, cardiac MRI and body composition scans track your health precisely; microbiome research supports hormones, mood and metabolism."],
    services: [{ t: "Genomic markers", d: "Prostate cancer, cardiovascular and hormone risk." }, { t: "Hormonal optimization", d: "Testosterone and endocrine balance." }, { t: "Imaging", d: "Prostate ultrasound, cardiac MRI, body composition." }, { t: "Microbiome", d: "Gut health for immunity and metabolism." }],
    keywords: ["Prostate", "Testosterone", "Cardiac MRI", "Body composition"], questions: ["Which screenings should I start with?", "How do I optimise hormones safely?"],
    tests: ["total-testosterone", "dht-dihydrotestosterone", "ultra-hormone-health"], source: `${SITE_URL}/precision-mens-health/`,
  },
  {
    id: "gut-health", icon: "salad", name: "Precision Gut Health", short: "Gut Health",
    tag: "The foundation of overall wellness.",
    summary: "A balanced gut microbiome influences digestion, immunity, mental clarity and longevity. We identify risks, monitor imbalances and build personalized plans.",
    approach: ["Gut microbiome analysis shows its influence on immune function, mental health and conditions like IBS and metabolic disorders.", "Endoscopy and colonoscopy help detect gastrointestinal issues early."],
    services: [{ t: "Gut microbiome analysis", d: "Diversity, dysbiosis and metabolic efficiency." }, { t: "Genomic & epigenetic testing", d: "Predispositions and lifestyle effects on gene expression." }, { t: "Endoscopy & colonoscopy", d: "Early detection of GI issues." }],
    keywords: ["Microbiome", "IBS", "Immunity", "Digestion"], questions: ["What does my gut microbiome say?", "How should I change my diet?"],
    tests: ["biogut"], source: `${SITE_URL}/precision-gut-health/`,
  },
  {
    id: "gastroenterology", icon: "microscope", name: "Precision Gastroenterology", short: "Gastroenterology",
    tag: "Your unique digestive needs.",
    summary: "Advanced technology analyses your gut microbiome to personalize treatment for IBS, Crohn's and acid reflux — for a longer, healthier life.",
    approach: ["Treatment is tailored to your microbiome, symptoms and goals.", "Led by a consultant gastroenterologist with decades of experience in nutrition and cancer prevention."],
    services: [{ t: "IBS & Crohn's care", d: "Microbiome-guided personalized treatment." }, { t: "Acid reflux", d: "Targeted, evidence-based management." }, { t: "Cancer prevention", d: "Nutrition and screening strategies." }],
    specialist: { role: "Consultant Gastroenterologist · Dr. Janusz", bio: "Over 40 years in internal medicine, gastroenterology, nutrition and cancer prevention; trained at Cambridge, Oxford and London." },
    keywords: ["IBS", "Crohn's", "Reflux", "Nutrition"], questions: ["Could my symptoms be microbiome-related?", "Do I need a colonoscopy?"],
    tests: ["biogut", "core-amino-acid-balance"], source: `${SITE_URL}/precision-gastroenterology/`,
  },
  {
    id: "mental-health", icon: "brain", name: "Precision Mental Health", short: "Mental Health", calm: true,
    tag: "Lasting emotional wellbeing.",
    summary: "Personalized mental health care using advanced diagnostics and holistic treatment — CBT, trauma-informed therapy and family counselling.",
    approach: ["Specializing in anxiety, depression, PTSD and ADHD.", "Mindfulness, lifestyle coaching and psychoeducation for lasting resilience."],
    services: [{ t: "CBT", d: "Evidence-based cognitive behavioural therapy." }, { t: "Trauma-informed therapy", d: "Safe, paced care." }, { t: "Family counselling", d: "Support for the people around you." }, { t: "Lifestyle coaching", d: "Mindfulness, sleep and stress practices." }],
    specialist: { role: "Psychologist · Dr. Diya", bio: "British Chartered and UAE-licensed psychologist with 10+ years in mental health and holistic wellbeing." },
    keywords: ["Calm", "Resilience", "Support"], questions: ["How can I manage stress better?", "What support is available between visits?"],
    tests: ["cortisol"], source: `${SITE_URL}/precision-mental-health/`,
  },
];

export const deptById = (id: string) => DEPARTMENTS.find((d) => d.id === id) ?? DEPARTMENTS[0];

const TRIAGE: Record<string, string[]> = {
  "internal-medicine": ["general", "check", "tired", "fatigue", "blood test", "ageing", "aging"],
  cardiology: ["heart", "cholesterol", "blood pressure", "chest", "lipid", "palpitation"],
  dermatology: ["skin", "acne", "wrinkle", "eczema", "pigment", "hair"],
  dental: ["teeth", "tooth", "gum", "dental", "breath"],
  "womens-health": ["menopaus", "period", "fertility", "pregnan", "estrogen", "pcos"],
  "mens-health": ["testosterone", "prostate", "libido", "erectile"],
  "gut-health": ["gut", "bloat", "digest", "microbiome"],
  gastroenterology: ["ibs", "crohn", "reflux", "colon", "stomach"],
  "mental-health": ["stress", "anxi", "mood", "depress", "burnout", "sleep", "adhd"],
};

export function scoreDepartments(text: string): string[] {
  const s = text.toLowerCase();
  const ranked = Object.entries(TRIAGE).map(([id, w]) => [id, w.filter((x) => s.includes(x)).length] as const).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  return ranked.length ? ranked.slice(0, 3) : ["internal-medicine"];
}

export const PILLARS: { t: string; icon: IconName; d: string }[] = [
  { t: "Genomics", icon: "dna", d: "Whole exome and genome assessment — genes guide how your cells, tissues and organs develop and function." },
  { t: "Epigenetics", icon: "layers", d: "Your DNA is influenced by factors you can change through lifestyle." },
  { t: "Microbiome", icon: "gut", d: "Up to 50 trillion microorganisms that shape your wellbeing while in balance." },
  { t: "Biological age", icon: "hourglass", d: "Molecular, genetic and metabolic age indicators — your body's real clock." },
  { t: "Clinical evaluations", icon: "radar", d: "Cardiovascular, physical, digestive and cognitive assessments in one roadmap." },
];

/** Longevity Journey steps (biongevity.com/journey). */
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
    handle: "core", name: "Biongevity Core", price: 369, currency: "USD", cadence: "Baseline + annual", url: `${SITE_URL}/longevity-packages-payment?pkg=core`,
    diagnostics: ["Longevity genomics panel — FOXO3, SIRT, mTOR, AMPK, inflammation pathways", "Gut microbiome snapshot — diversity, dysbiosis, metabolic efficiency", "Epigenetic ageing proxies — DNA methylation, inflammaging", "Glucose & insulin · Cortisol · Testosterone · Progesterone · Vit D & E"],
    ai: ["Personalized AI-driven longevity roadmap", "Daily micro-coaching: nutrition, sleep, movement, stress", "Conversational AI explaining biomarker changes", "Adherence tracking with intelligent nudging"],
    app: ["Longevity Score™ — biological vs chronological age proxy", "Habit, sleep and activity tracking", "Integrated wearables (sleep, HRV, activity, recovery)", "Monthly AI-generated longevity summaries"],
    bioactives: "Core formulation",
  },
  {
    handle: "precision", name: "Biongevity Precision", price: 699, currency: "USD", cadence: "Baseline + annual", featured: true, url: `${SITE_URL}/longevity-packages-payment?pkg=precision`,
    diagnostics: ["Everything in Core", "Whole Genome Sequencing 30X", "Telomere length measurement", "Pharmacogenomics", "IL-6 · IL-10 · TNF-α · CRP"],
    ai: ["Continuous biological age and risk forecasting", "AI-driven “what-if” intervention modelling", "Wearable physiology: HRV, sleep efficiency, recovery", "Monthly AI protocol updates · quarterly expert review"],
    app: ["Telomere and epigenetic trend visualization", "Precision nutrition timing & fasting guidance", "Sleep and circadian optimization", "Clinician-shareable longitudinal reports"],
    bioactives: "Precision nutraceutical stack",
  },
  {
    handle: "elite", name: "Biongevity Elite", price: 999, currency: "USD", cadence: "Baseline + 3–6 months", url: `${SITE_URL}/longevity-packages-payment?pkg=elite`,
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
