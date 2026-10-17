import type { IconName } from "@/components/ui/icons";

/**
 * Department deep dives — what each department offers in practice, how it links to the rest of the record,
 * and where the information comes from. Paraphrased in our own words from BioAro-group clinic sites
 * (NEYU Health, ARC Network, NEA Precision Skin, BioGut Clinic) and BioAro Labs. Reviewed October 2026.
 * Confirm services and availability with the care team; nothing here is a price promise unless it is a BioAro Labs list price.
 */

export type OrganId = "lungs" | "skin" | "brain" | "gut" | "thyroid" | "kidneys" | "tooth" | "knee" | "uterus" | "prostate" | "liver";

export interface DeptExtra {
  organ?: OrganId;
  offer: { t: string; d: string; icon: IconName }[];
  links: { t: string; d: string }[];
  numbers?: { v: string; l: string }[];
  partner?: { name: string; url: string; line: string };
  sources: { name: string; url: string }[];
  /** Packages a department runs (clinic services are quoted by the team; lab prices are BioAro list prices, CAD). */
  packages?: { name: string; for: string; clinic: string[]; labs: string[]; labPrice?: string }[];
  /** A step-by-step program the department runs. */
  program?: { name: string; for?: string; steps: { t: string; d: string }[]; note?: string };
  faq?: { q: string; a: string }[];
}

const LABS = { name: "BioAro Labs", url: "https://bioarolabs.com/shop" };

export const DEPT_EXTRA: Record<string, DeptExtra> = {
  cardiology: {
    packages: [
      { name: "Heart Health Check", for: "Family history of heart disease, high blood pressure or cholesterol — or peace of mind", clinic: ["Cardiology consultation", "Electrocardiogram (ECG)", "Echocardiography"], labs: ["hs-CRP", "PAI-1 Total"], labPrice: "$165" },
      { name: "Executive Health", for: "Busy professionals who want the complete picture in one morning", clinic: ["Internal medicine assessment", "Exercise stress echocardiogram", "Carotid ultrasound", "24-hour ambulatory blood pressure"], labs: ["Inflammation, kidney and vitamin D panel"], labPrice: "$833.99" },
      { name: "Precision Genomics", for: "Family history, medicine safety, or a lifelong genetic reference", clinic: ["Genetic results review with a physician"], labs: ["Whole Genome Sequencing 30X", "Pharmacogenomics Test"], labPrice: "$1,198" },
    ],
    program: { name: "Virtual Hypertension Clinic", for: "Diagnosed high blood pressure, high home readings, on medication but not at target — or not sure", steps: [
      { t: "Enrol", d: "A short intake; a physician reviews your history." },
      { t: "Measure", d: "Two readings morning and evening for 7 days with a validated upper-arm cuff." },
      { t: "Coaching", d: "Biongevity SI explains your readings and the habits that move them, between visits." },
      { t: "Physician review", d: "Your physician reviews the 7-day average and adjusts the plan." },
      { t: "Keep improving", d: "Regular check-ins until your home average reaches 135/85 or lower — and stays there." },
    ], note: "Home target 135/85 mmHg (Hypertension Canada). Included in membership plans; the team confirms details before you start." },
    faq: [
      { q: "What is a stress echo?", a: "An ultrasound of the heart at rest and straight after exercise, to see how the heart muscle and valves respond when they are asked to work harder. It is done onsite, in the same visit." },
      { q: "Why measure blood pressure at home?", a: "One clinic reading can be high from nerves or low by chance. A 7-day home average is a truer picture and is what treatment is tuned to." },
    ],
    offer: [
      { icon: "heart", t: "Onsite exercise stress echo", d: "One of Alberta's first onsite exercise stress echocardiogram programs — the heart is imaged at rest and straight after exercise, in the same visit." },
      { icon: "wave", t: "Echo, Holter and ambulatory BP", d: "Echocardiography for valves and pumping; multi-day rhythm and blood-pressure recording to catch what one clinic reading misses." },
      { icon: "gauge", t: "Virtual Hypertension Clinic", d: "A remote blood-pressure program: home readings flow in, coaching between visits, and a physician reviews the trend." },
      { icon: "dna", t: "Genes and medicines", d: "Pharmacogenomics ($499 CAD) and whole genome sequencing 30x ($699 CAD) through BioAro Labs, read with inherited risk." },
      { icon: "clipboard", t: "Private heart checks", d: "Packages that combine imaging, labs and a physician review in one morning, with a written plan." },
      { icon: "route", t: "Risk scored against Canadian guidelines", d: "Lipids, blood pressure, glucose and family history turned into one risk picture and a follow-up schedule." },
    ],
    links: [
      { t: "Heart + kidneys", d: "High blood pressure strains both; kidney function changes how heart medicines are dosed." },
      { t: "Heart + metabolism", d: "Diabetes and insulin resistance raise cardiovascular risk, so endocrinology reads the same record." },
      { t: "Heart + sleep", d: "Untreated sleep apnea raises blood pressure and is linked to atrial fibrillation." },
      { t: "Heart + lungs", d: "Breathlessness can be cardiac or pulmonary — both are tested before a conclusion." },
    ],
    numbers: [{ v: "8", l: "physicians across NEYU" }, { v: "5", l: "data layers in one record" }, { v: "40+", l: "advanced lab tests" }],
    partner: { name: "NEYU Health", url: "https://neyuhealth.com/diagnostics", line: "Cardiology, internal medicine and endocrinology in one Calgary clinic." },
    sources: [{ name: "NEYU Health — Diagnostics", url: "https://neyuhealth.com/diagnostics" }, { name: "NEYU Health — Virtual Hypertension Clinic", url: "https://neyuhealth.com/hypertension-clinic" }, LABS],
  },
  "heart-failure": {
    program: { name: "Heart failure follow-up", steps: [
      { t: "Baseline", d: "Echo for pumping function, kidney function and potassium, symptoms and weight." },
      { t: "Daily at home", d: "Weight, blood pressure and breathlessness logged each morning." },
      { t: "Early warning", d: "A rise of about 2 kg in 3 days or new swelling is flagged to the team." },
      { t: "Titrate", d: "Guideline medicines adjusted step by step with blood tests in between." },
      { t: "Review", d: "Repeat echo to see how the heart has responded." },
    ] },
    offer: [
      { icon: "heart-half", t: "Pumping function on echo", d: "Ejection fraction and chamber size followed over time on echocardiography." },
      { icon: "gauge", t: "Home monitoring", d: "Weight, blood pressure and symptoms tracked at home so changes are caught early." },
      { icon: "tablets", t: "Medication optimisation", d: "Guideline therapies titrated step by step, with kidney function and potassium checked along the way." },
      { icon: "dna", t: "Pharmacogenomics", d: "How your genes may affect common heart medicines (BioAro Labs, $499 CAD)." },
    ],
    links: [{ t: "Heart + kidneys", d: "Fluid, salt and medicine doses depend on kidney function." }, { t: "Heart + sleep", d: "Sleep apnea is common in heart failure and treatable." }],
    partner: { name: "NEYU Health", url: "https://neyuhealth.com/care", line: "Specialist heart care with onsite imaging and monitoring." },
    sources: [{ name: "NEYU Health — Care", url: "https://neyuhealth.com/care" }, LABS],
  },
  "respiratory-medicine": {
    organ: "lungs",
    offer: [
      { icon: "bed", t: "Sleep apnea diagnosis", d: "Sleep consultation with home or in-lab sleep studies to confirm obstructive sleep apnea and its severity." },
      { icon: "wind", t: "CPAP set-up and support", d: "A broad choice of CPAP machines, masks and accessories, fitted and followed up until therapy is comfortable." },
      { icon: "lungs", t: "Respiratory diagnostics", d: "Lung function testing (spirometry) and respiratory consultation for asthma, COPD and unexplained breathlessness." },
      { icon: "droplet", t: "Home oxygen", d: "Assessment and home oxygen services when blood oxygen levels call for it." },
      { icon: "heart", t: "Heart and sleep together", d: "The network also covers cardiology, because sleep apnea and heart rhythm problems often travel together." },
    ],
    links: [{ t: "Lungs + heart", d: "Breathlessness is tested from both sides." }, { t: "Sleep + blood pressure", d: "Treating apnea can lower blood pressure." }, { t: "Sleep + metabolism", d: "Poor sleep worsens blood sugar and appetite control." }],
    numbers: [{ v: "936M", l: "adults estimated to have sleep apnea worldwide" }],
    partner: { name: "ARC Network (Advanced Respiratory Care)", url: "https://www.arcnetwork.ca/", line: "Respiratory, sleep and heart services with CPAP equipment, across Alberta." },
    sources: [{ name: "ARC Network", url: "https://www.arcnetwork.ca/" }, { name: "Benjafield et al., Lancet Respir Med 2019", url: "https://doi.org/10.1016/S2213-2600(19)30198-5" }],
  },
  "skin-health": {
    organ: "skin",
    offer: [
      { icon: "microscope", t: "Microbiome-guided skin plans", d: "BioSkin microbiome testing ($279 CAD, BioAro Labs) with DNA and lifestyle data used to tailor treatment." },
      { icon: "sparkle", t: "Fotona laser", d: "Laser treatments for acne, pigmentation, texture and rejuvenation, chosen to your skin type." },
      { icon: "syringe", t: "Injectables and microneedling", d: "Physician-managed injectables and collagen-induction microneedling for lines and scarring." },
      { icon: "face", t: "Medical facials and peels", d: "Clinical peels and facials, with medical-grade skincare lines to continue at home." },
      { icon: "user", t: "Hair restoration", d: "PRP treatment and support for hair thinning, assessed first for underlying causes." },
      { icon: "salad", t: "Nutrition for skin", d: "Registered Dietitian-led nutrition through the BioGut Nutrition Clinic, because gut and skin are linked." },
    ],
    links: [{ t: "Skin + gut", d: "The gut microbiome shapes inflammation that shows up in the skin." }, { t: "Skin + hormones", d: "Adult acne and hair thinning often have a hormone story." }],
    numbers: [{ v: "15 min", l: "free first consultation" }, { v: "Mon–Sat", l: "clinic days, Calgary NE" }],
    partner: { name: "NEA Precision Skin", url: "https://neaprecisionskin.com/", line: "Physician-managed skin, laser and wellness in Calgary NE." },
    sources: [{ name: "NEA Precision Skin — Treatments", url: "https://neaprecisionskin.com/treatments/" }, { name: "NEA — Microbiome testing", url: "https://neaprecisionskin.com/our-treatments-microbiome-testing/" }, LABS],
  },
  "gut-health": {
    organ: "gut",
    offer: [
      { icon: "gut", t: "At-home gut microbiome test", d: "BioGut ($279 CAD, BioAro Labs) — diversity, balance and metabolic efficiency." },
      { icon: "salad", t: "Dietitian-led nutrition", d: "Registered Dietitian plans built on your microbiome result, with follow-up." },
      { icon: "stethoscope", t: "Specialist referral", d: "Gastroenterology and colorectal screening when symptoms or age call for it." },
    ],
    links: [{ t: "Gut + immunity", d: "Around 70% of immune tissue sits in the gut." }, { t: "Gut + skin", d: "Inflammation from the gut can show in the skin." }],
    partner: { name: "BioGut Clinic", url: "https://biogutclinic.com/", line: "Microbiome-led nutrition from the BioAro group." },
    sources: [{ name: "BioGut Clinic", url: "https://biogutclinic.com/" }, LABS],
  },
  nutrition: {
    organ: "liver",
    offer: [
      { icon: "salad", t: "Personalised plans", d: "Built on your labs, microbiome and goals rather than a generic meal plan." },
      { icon: "gut", t: "Microbiome-informed", d: "BioGut results translated into foods to add and foods to reduce." },
      { icon: "chart", t: "Track the change", d: "Re-test markers like lipids and glucose to see whether the plan is working." },
    ],
    links: [{ t: "Nutrition + heart", d: "A Mediterranean-style diet lowered major cardiovascular events in a large trial." }, { t: "Nutrition + metabolism", d: "Weight and glucose respond to small, sustained changes." }],
    partner: { name: "BioGut Nutrition Clinic", url: "https://neaprecisionskin.com/our-biogut-nutrition-clinic/", line: "Registered Dietitian-led nutrition in Calgary." },
    sources: [{ name: "BioGut Nutrition Clinic", url: "https://neaprecisionskin.com/our-biogut-nutrition-clinic/" }, LABS],
  },
  endocrinology: {
    organ: "thyroid",
    offer: [
      { icon: "test-tube", t: "Hormone panels", d: "Hormone Health and Ultra Hormone Health panels ($499 CAD each, BioAro Labs)." },
      { icon: "bolt", t: "Diabetes and prediabetes", d: "Young-onset type 2 diabetes and insulin resistance managed with the same record as your heart." },
      { icon: "flower", t: "PCOS and thyroid", d: "Thyroid, adrenal and pituitary conditions, and PCOS care." },
    ],
    links: [{ t: "Hormones + heart", d: "Metabolic risk and heart risk are read together." }, { t: "Hormones + sleep", d: "Cortisol rhythm affects sleep and energy." }],
    partner: { name: "NEYU Health", url: "https://neyuhealth.com/care", line: "Endocrinology alongside cardiology and internal medicine." },
    sources: [{ name: "NEYU Health — Care", url: "https://neyuhealth.com/care" }, LABS],
  },
  "internal-medicine": {
    organ: "kidneys",
    offer: [
      { icon: "stethoscope", t: "One physician, the whole picture", d: "Several conditions read together, with one coordinated plan." },
      { icon: "droplet", t: "Kidney checks", d: "Cystatin C ($99 CAD, BioAro Labs) for kidney function less affected by muscle mass." },
      { icon: "clipboard", t: "Executive health", d: "A single-morning assessment with a follow-up plan." },
    ],
    links: [{ t: "Kidneys + heart", d: "Blood pressure and medicine doses depend on both." }],
    partner: { name: "NEYU Health", url: "https://neyuhealth.com/packages", line: "Internal medicine, packages and executive health." },
    sources: [{ name: "NEYU Health — Packages", url: "https://neyuhealth.com/packages" }, LABS],
  },
  "geriatric-medicine": {
    organ: "brain",
    offer: [
      { icon: "brain", t: "Memory assessment", d: "Medically guided evaluation, with Brain Health blood markers ($749.99 CAD, BioAro Labs) where appropriate." },
      { icon: "walk", t: "Falls and mobility", d: "Strength, balance and home-safety review." },
      { icon: "tablets", t: "Medication review", d: "Fewer, better-fitting medicines — informed by pharmacogenomics when useful." },
    ],
    links: [{ t: "Brain + heart", d: "Blood pressure in midlife shapes memory in later life." }, { t: "Brain + sleep", d: "Sleep problems and memory complaints often travel together." }],
    sources: [LABS],
  },
  "mental-health": {
    organ: "brain",
    offer: [
      { icon: "message", t: "CBT and trauma-informed therapy", d: "Evidence-based talking therapies, in person or by video." },
      { icon: "moon", t: "Sleep and stress physiology", d: "Cortisol and sleep tracked alongside therapy." },
      { icon: "users", t: "Family counselling", d: "Support for the people around you, too." },
    ],
    links: [{ t: "Mind + sleep", d: "Better sleep often comes before better mood." }],
    sources: [LABS],
  },
  dental: {
    organ: "tooth",
    offer: [
      { icon: "tooth", t: "Preventive and restorative", d: "Cleanings, fillings and cosmetic care." },
      { icon: "microscope", t: "Oral microbiome", d: "BioDental ($279 CAD, BioAro Labs) for gum concerns, bad breath and recurring issues." },
    ],
    links: [{ t: "Gums + heart", d: "Gum disease is associated with cardiovascular and metabolic disease." }],
    sources: [LABS],
  },
  "pediatric-rheumatology": {
    organ: "knee",
    offer: [
      { icon: "baby", t: "Joint and inflammatory care", d: "Assessment and long-term care for children and teens with joint, muscle and inflammatory conditions." },
      { icon: "users", t: "Family support", d: "Plans that fit school, sport and family life." },
    ],
    links: [{ t: "Joints + growth", d: "Inflammation is managed with growth and activity in mind." }],
    sources: [LABS],
  },
  "womens-health": {
    organ: "uterus",
    offer: [
      { icon: "flower", t: "Hormones through every stage", d: "Cycle, fertility, perimenopause and menopause — Estradiol, Progesterone and hormone panels via BioAro Labs." },
      { icon: "microscope", t: "BioFemme", d: "Vaginal microbiome test ($279 CAD) for recurring infections or irritation." },
      { icon: "bone", t: "Bone and heart", d: "Preventive screening that rises in importance after menopause." },
    ],
    links: [{ t: "Hormones + heart", d: "Heart risk changes after menopause." }],
    sources: [LABS],
  },
  "mens-health": {
    organ: "prostate",
    offer: [
      { icon: "person", t: "Prostate and heart", d: "Early detection read alongside family history and genetics." },
      { icon: "test-tube", t: "Testosterone and hormones", d: "Total Testosterone ($110 CAD), SHBG and DHT via BioAro Labs." },
      { icon: "dumbbell", t: "Body composition and performance", d: "Strength, recovery and amino-acid balance." },
    ],
    links: [{ t: "Hormones + metabolism", d: "Low testosterone and insulin resistance often appear together." }],
    sources: [LABS],
  },
};
