/* All dashboard data is ILLUSTRATIVE demo data. Replace with BioELR / Shopify customer data later. */

export const BIO_AGE_SERIES = [44, 43.6, 43.1, 42.2, 41.8, 41.1, 40.6, 40.2, 39.6, 39.3, 38.9, 38.4];

export type BmStatus = "ok" | "discuss" | "neutral";
export const BIOMARKERS: { n: string; sys: string; v: string; u: string; range: string; s: BmStatus; what: string; not: string; q: string }[] = [
  { n: "ApoB", sys: "Cardio", v: "72", u: "mg/dL", range: "Common target < 90", s: "ok", what: "Apolipoprotein B sits on each LDL and related particle, so it approximates how many particles can enter artery walls.", not: "Whether plaque is present. Imaging answers that.", q: "Is ApoB a better target for me than LDL-C?" },
  { n: "Lp(a)", sys: "Cardio", v: "18", u: "nmol/L", range: "Often < 75 used", s: "ok", what: "Lipoprotein(a), a largely inherited lipid particle that changes little over life, so it is often measured once.", not: "Your risk on its own. It is read together with other risk factors.", q: "Does my Lp(a) change how early we act?" },
  { n: "hs-CRP", sys: "Inflammation", v: "0.6", u: "mg/L", range: "< 1.0 lower risk", s: "ok", what: "A general marker of inflammation in the body.", not: "The source of inflammation. It rises briefly with infection, injury or hard training.", q: "Should we repeat this when I am well rested?" },
  { n: "HbA1c", sys: "Metabolic", v: "5.3", u: "%", range: "< 5.7", s: "ok", what: "Average blood glucose over roughly the past two to three months.", not: "Daily glucose swings or insulin sensitivity.", q: "Would a continuous glucose monitor add useful detail?" },
  { n: "Fasting insulin", sys: "Metabolic", v: "6.1", u: "µIU/mL", range: "Lab-specific", s: "neutral", what: "Insulin after fasting; with glucose it can indicate insulin sensitivity.", not: "A diagnosis on its own; ranges vary widely by lab.", q: "How do my insulin and glucose look together?" },
  { n: "Vitamin D (25-OH)", sys: "Nutrients", v: "52", u: "ng/mL", range: "30–100 typical", s: "ok", what: "The main circulating form of vitamin D, reflecting intake and sun exposure.", not: "Bone density or other outcomes directly.", q: "Do I need to change my supplement dose?" },
  { n: "Triglycerides", sys: "Cardio", v: "168", u: "mg/dL", range: "< 150 typical", s: "discuss", what: "Blood fats affected by recent meals, alcohol, carbohydrates and metabolic health.", not: "Long-term risk from one sample, especially if not fasting.", q: "Was I fasting, and should we retest?" },
  { n: "HRV (rMSSD)", sys: "Recovery", v: "58", u: "ms", range: "Personal baseline", s: "neutral", what: "Variation between heartbeats measured by a wearable; higher usually means better recovery relative to your own baseline.", not: "Comparisons with other people; devices measure differently.", q: "How should I use HRV to plan training?" },
  { n: "Ferritin", sys: "Nutrients", v: "24", u: "ng/mL", range: "Lab-specific", s: "discuss", what: "The storage form of iron in the body.", not: "Iron status alone; ferritin also rises with inflammation.", q: "Should we check full iron studies?" },
];

export const VARIANTS = [
  { g: "APOE", v: "ε3/ε3", tag: "Brain", d: "The most common genotype.", not: "Whether you will or won't develop dementia." },
  { g: "CYP2C19", v: "*1/*2", tag: "Medication", d: "Intermediate metabolizer; some medicines may need review.", not: "Which medicine you should take; that is a clinician decision." },
  { g: "SLCO1B1", v: "T/C", tag: "Medication", d: "Associated with statin side-effect risk.", not: "That you will have side effects." },
  { g: "MTHFR", v: "C677T het", tag: "Nutrition", d: "A common variant.", not: "A health problem on its own." },
];

export const PLAN = [
  { t: "Zone 2 cardio · 45 min", m: "Mon, Wed, Fri" },
  { t: "Lights out by 22:30", m: "Daily" },
  { t: "Protein at each meal", m: "Daily" },
  { t: "Strength training", m: "Tue, Thu" },
  { t: "10-minute breathwork", m: "Evenings" },
  { t: "Re-test lipids", m: "Discuss timing with clinician" },
];

export const VISITS = [
  { mo: "Oct", day: "14", t: "Cardiology review", time: "10:30", where: "Calgary clinic" },
  { mo: "Oct", day: "28", t: "Telemedicine check-in", time: "09:00", where: "Biongevity App" },
  { mo: "Nov", day: "11", t: "Quarterly review", time: "14:00", where: "Video call" },
];

export const SLOTS = [["Mon 20", "09:00"], ["Mon 20", "14:30"], ["Tue 21", "11:00"], ["Wed 22", "10:00"], ["Wed 22", "16:00"], ["Thu 23", "08:30"], ["Fri 24", "13:00"], ["Fri 24", "15:30"]];

export const REPORTS = [
  { t: "Genetic testing summary", date: "Jul 12, 2026", src: "BioAro Labs", findings: "No high-impact hereditary variants reported in this illustrative report. Pharmacogenomic findings listed for CYP2C19 and SLCO1B1.", sum: "In plain terms: nothing high-risk stood out, and two genes may affect how some medicines work for you. Ask your clinician whether either affects anything you take." },
  { t: "Gut microbiome report", date: "Jun 03, 2026", src: "BioAro Labs", findings: "Diversity reported in the mid range in this illustrative report, with lower fibre-associated species.", sum: "The report suggests room to add more varied fibre. It is not a diagnosis; composition changes with diet and time." },
  { t: "Biomarker panel", date: "Sep 30, 2026", src: "Illustrative lab", findings: "Triglycerides and ferritin flagged for review; other listed markers within typical ranges.", sum: "Two markers are worth discussing. Triglycerides depend on fasting status; ferritin can be low for several reasons." },
];

export const INSIGHTS = [
  { t: "Triglycerides flagged", d: "Illustrative panel · discuss", icon: "activity" },
  { t: "Sleep timing steadier", d: "Illustrative wearable data", icon: "moon" },
  { t: "Report explanation ready", d: "Verify against the report", icon: "file" },
  { t: "Plan check-in logged", d: "From your Plan tab", icon: "check" },
];

export const FEED = [
  { t: "Genome data linked", d: "Illustrative · BioAro Labs", icon: "dna" },
  { t: "Sleep trend updated", d: "Illustrative · Biongevity App", icon: "moon" },
  { t: "Visit summary drafted", d: "For clinician review", icon: "file" },
  { t: "Activity synced", d: "Illustrative · wearable", icon: "activity" },
  { t: "Microbiome report parsed", d: "Illustrative · BioGut", icon: "flask" },
];
