import type { CatalogProduct, Collection } from "./types";
import type { IconName } from "@/components/ui/icons";
import { slugify } from "@/lib/utils";

/* Content: bioarolabs.com (home, /shop, categories). Prices USD as listed Oct 2026.
   Each test links to its real page: https://bioarolabs.com/shop?test=<slug> */

export const LABS_URL = "https://bioarolabs.com";
const SLUGS: Record<string, string> = { "Whole Genome Sequencing 100X": "genome-testing", "Whole Genome Sequencing 30X": "whole-genome-sequencing-30x", "Whole Exome Sequencing 100X": "whole-exome-sequencing-100x", "Disease-Based DNA Test": "disease-based-dna-test", "Pharmacogenomics Test": "pharmacogenomics-test", "Comprehensive Cell-free DNA Analysis": "comprehensive-cell-free-dna-analysis", "TNF-α (Tumor Necrosis Factor Alpha)": "tnf-alpha", "GDF-15 (Growth Differentiation Factor 15)": "gdf-15", "IL-6 (Interleukin-6)": "il-6", "IL-10 (Interleukin-10)": "il-10", "BioGut": "the-biogut-test", "BioSkin": "the-bioskin-test", "BioDental": "the-biodental-test", "BioFemme": "the-biofemme-test", "Telomere Length Testing": "telomere-length-testing", "Progesterone": "progesterone", "Total Testosterone": "testosterone", "Cortisol": "cortisol", "Resveratrol": "resveratrol", "Vitamin D, 25-Hydroxy (D2 + D3)": "vitamin-d2-d3", "Vitamin E (Alpha & Gamma Tocopherol)": "vitamin-e-α-γ", "hs-CRP (High-Sensitivity C-Reactive Protein)": "high-sensitive-crp-hs-crp", "sTNFR1 (Soluble TNF Receptors 1)": "interleukin-6-il-6", "MCP-1 (CCL2)": "mcp-1-ccl2", "PAI-1 Total (Plasminogen Activator Inhibitor-1)": "pai-1-total", "Cystatin C": "cystatin-c", "β2-Microglobulin (B2M)": "β2-microglobulin-b2m", "TIMP-1 (Tissue Inhibitor of Metalloproteinases-1)": "timp-1", "p-Tau217 (Phosphorylated Tau 217)": "p-tau-217", "Beta-Amyloid 40/42 Ratio": "beta-amyloid-40-42", "SHBG (Sex Hormone-Binding Globulin)": "shbg-sex-hormone-binding-globulin", "DHEA-S (Dehydroepiandrosterone Sulfate)": "dhea-s", "Androstenedione": "androstenedione", "Vitamin K1 (Phylloquinone)": "vitamin-k1", "Vitamin A (Retinol)": "vitamin-a-retinol", "Estradiol (E2)": "estradiol-e2", "DHT (Dihydrotestosterone)": "dht-dihydrotestosterone", "Hormone Health": "hormone-health", "Ultra Hormone Health": "ultra-hormone-health", "Essential Vitamin Health": "essential-vitamin-health", "Brain Health": "brain-health", "Core Inflammation Aging": "core-inflammation-aging", "Advanced Inflammation Aging": "advanced-inflammation-aging", "Ultra Inflammation Aging": "ultra-inflammation-aging", "Core Amino Acid Balance": "core-amino-acid-balance", "Advanced Amino Acid Metabolism": "advanced-amino-acid-metabolism", "Ultra Amino Acid Profile": "ultra-amino-acid-profile" };

export const LAB_COLLECTIONS: Collection[] = [
  { handle: "biological-aging-healthspan-panels", title: "Biological Aging & Healthspan Panels", description: "Panels that estimate biological ageing to compare over time.", icon: "hourglass" },
  { handle: "genome-sequencing", title: "Genome Sequencing", description: "Explore genetic insights for inherited traits and personalized health.", icon: "dna" },
  { handle: "hormone-steroid-balance", title: "Hormone & Steroid Balance", description: "Explore hormones linked to energy, stress, metabolism, and reproductive health.", icon: "test-tube" },
  { handle: "inflammation-biological-aging", title: "Inflammation & Biological Aging", description: "Explore inflammation, cellular stress, and healthy aging.", icon: "flame" },
  { handle: "brain-aging-neurodegeneration", title: "Brain Aging & Neurodegeneration", description: "Explore biomarkers linked to brain aging and neurodegeneration.", icon: "brain" },
  { handle: "microbiome", title: "Microbiome", description: "Explore your microbiome and its role in health and balance.", icon: "gut" },
  { handle: "vitamin-nutritional-status", title: "Vitamin & Nutritional Status", description: "Explore key vitamins for immune, bone, and cellular health.", icon: "sun" },
  { handle: "amino-acids-metabolism", title: "Amino Acids & Metabolism", description: "Amino acid balance and metabolic pathways.", icon: "atom" },
  { handle: "vascular-organ-stress", title: "Vascular & Organ Stress", description: "Kidney, vascular and tissue-remodeling markers.", icon: "heart" },
];

type Row = [title: string, price: number, collection: string, bestFor?: string];

const ROWS: Row[] = [
  ["Whole Genome Sequencing 100X", 1499, "genome-sequencing", "Comprehensive genetic and inherited-risk assessment."],
  ["Whole Genome Sequencing 30X", 699, "genome-sequencing", "Broad genetic and inherited-risk insights."],
  ["Whole Exome Sequencing 100X", 499, "genome-sequencing", "Rare disease and inherited-variant assessment."],
  ["Disease-Based DNA Test", 499, "genome-sequencing", "Condition-specific genetic evaluation."],
  ["Pharmacogenomics Test", 499, "genome-sequencing", "Medication selection and dose optimization."],
  ["Comprehensive Cell-free DNA Analysis", 1700, "genome-sequencing", "Tumor profiling, treatment selection, or therapy monitoring."],
  ["TNF-α (Tumor Necrosis Factor Alpha)", 140, "inflammation-biological-aging", "Inflammation and immune-response assessment."],
  ["GDF-15 (Growth Differentiation Factor 15)", 130, "biological-aging-healthspan-panels", "Cellular stress and metabolic health assessment."],
  ["IL-6 (Interleukin-6)", 140, "inflammation-biological-aging", "Assessing active inflammation and immune activity."],
  ["IL-10 (Interleukin-10)", 105, "inflammation-biological-aging", "Understanding inflammatory regulation and immune balance."],
  ["BioGut", 279, "microbiome", "Digestive symptoms and gut microbiome assessment."],
  ["BioSkin", 279, "microbiome", "Persistent skin concerns, irritation, or skincare response."],
  ["BioDental", 279, "microbiome", "Gum concerns, bad breath, cavities, or recurring oral issues."],
  ["BioFemme", 279, "microbiome", "Recurring yeast infections, BV, irritation, odor, or discharge."],
  ["Telomere Length Testing", 299, "biological-aging-healthspan-panels", "Longevity and biological aging insights."],
  ["Progesterone", 150, "hormone-steroid-balance", "Cycle, fertility, and hormone evaluation."],
  ["Total Testosterone", 110, "hormone-steroid-balance", "Understanding testosterone status and hormone balance."],
  ["Cortisol", 129, "hormone-steroid-balance", "Understanding cortisol balance and stress-related changes."],
  ["Resveratrol", 120, "vitamin-nutritional-status", "Dietary or supplementation monitoring."],
  ["Vitamin D, 25-Hydroxy (D2 + D3)", 115, "vitamin-nutritional-status", "Low vitamin D, limited sun exposure, or supplementation monitoring."],
  ["Vitamin E (Alpha & Gamma Tocopherol)", 115, "vitamin-nutritional-status", "Vitamin E status and supplementation monitoring."],
  ["hs-CRP (High-Sensitivity C-Reactive Protein)", 60, "inflammation-biological-aging", "Inflammation and cardiovascular risk assessment."],
  ["sTNFR1 (Soluble TNF Receptors 1)", 105, "inflammation-biological-aging", "Chronic inflammation and TNF-pathway assessment."],
  ["MCP-1 (CCL2)", 105, "inflammation-biological-aging", "Inflammatory and immune activity assessment."],
  ["PAI-1 Total (Plasminogen Activator Inhibitor-1)", 105, "vascular-organ-stress", "Metabolic and vascular health assessment."],
  ["Cystatin C", 99, "vascular-organ-stress", "Kidney function assessment."],
  ["β2-Microglobulin (B2M)", 89, "vascular-organ-stress", "Immune activity and kidney health assessment."],
  ["TIMP-1 (Tissue Inhibitor of Metalloproteinases-1)", 105, "vascular-organ-stress", "Tissue remodeling and fibrosis assessment."],
  ["p-Tau217 (Phosphorylated Tau 217)", 430, "brain-aging-neurodegeneration", "Adults with cognitive symptoms undergoing medical evaluation."],
  ["Beta-Amyloid 40/42 Ratio", 450, "brain-aging-neurodegeneration", "Memory concerns or medically guided cognitive evaluation."],
  ["SHBG (Sex Hormone-Binding Globulin)", 79, "hormone-steroid-balance", "Understanding hormone levels and interpretation."],
  ["DHEA-S (Dehydroepiandrosterone Sulfate)", 180, "hormone-steroid-balance", "Understanding hormone changes over time."],
  ["Androstenedione", 105, "hormone-steroid-balance", "Assessing reproductive and hormone balance."],
  ["Vitamin K1 (Phylloquinone)", 115, "vitamin-nutritional-status", "Vitamin K status and supplementation monitoring."],
  ["Vitamin A (Retinol)", 115, "vitamin-nutritional-status", "Vitamin A status and supplementation monitoring."],
  ["Estradiol (E2)", 85, "hormone-steroid-balance", "Estrogen balance and reproductive health assessment."],
  ["DHT (Dihydrotestosterone)", 95, "hormone-steroid-balance", "Assessing testosterone-related hormone changes."],
  ["Hormone Health", 499, "hormone-steroid-balance", "People looking to understand their hormone status and balance."],
  ["Ultra Hormone Health", 499, "hormone-steroid-balance", "People seeking a broader understanding of their hormone health."],
  ["Essential Vitamin Health", 349.99, "vitamin-nutritional-status", "Vitamin status and supplementation monitoring."],
  ["Brain Health", 749.99, "brain-aging-neurodegeneration", "Memory or cognitive health evaluation."],
  ["Core Inflammation Aging", 489.99, "inflammation-biological-aging", "Monitoring low-grade inflammation."],
  ["Advanced Inflammation Aging", 699.99, "inflammation-biological-aging", "Inflammation and metabolic health insights."],
  ["Ultra Inflammation Aging", 899, "inflammation-biological-aging", "Overall inflammation and biological health insights."],
  ["Core Amino Acid Balance", 149.99, "amino-acids-metabolism"],
  ["Advanced Amino Acid Metabolism", 199.99, "amino-acids-metabolism"],
  ["Ultra Amino Acid Profile", 249.99, "amino-acids-metabolism"],
];

const colIcon = (h: string): IconName => LAB_COLLECTIONS.find((c) => c.handle === h)?.icon ?? "flask";

export const LAB_TESTS: CatalogProduct[] = ROWS.map(([title, price, category, bestFor]) => ({
  handle: slugify(title.replace("α", "alpha").replace("β", "beta")),
  url: SLUGS[title] ? `${LABS_URL}/shop?test=${encodeURIComponent(SLUGS[title])}` : `${LABS_URL}/explore-tests/${category}`,
  title,
  vendor: "BioAro Labs",
  kind: "lab-test",
  price,
  currency: "USD",
  category,
  bestFor,
  summary: bestFor ?? LAB_COLLECTIONS.find((c) => c.handle === category)?.description ?? "",
  icon: colIcon(category),
}));

export const labCategoryUrl = (c: string) => `${LABS_URL}/explore-tests/${c}`;

/** Six headline test areas (AI knowledge + home recommendations). */
export const LAB_AREAS = [
  { id: "genome-sequencing", icon: "dna" as IconName, k: "Genomics", name: "Genome Sequencing", explores: "Genetic insights for inherited traits and personalized health.", sample: "At-home collection. BioAro has described a cheek-swab kit, with blood samples also available. Confirm current kit.", shows: "Inherited variants associated with health risks, traits and medication response, interpreted with clinician review.", not: "A diagnosis. Most conditions also depend on environment and lifestyle; a variant shows risk, not certainty.", from: 499 },
  { id: "microbiome", icon: "activity" as IconName, k: "Microbiome", name: "Microbiome", explores: "Your microbiome and its role in health and balance.", sample: "BioGut (stool), BioDental (oral), BioSkin (skin swab) and BioFemme (vaginal).", shows: "Which bacteria and fungi are present and their diversity, with recommendations.", not: "A disease diagnosis. Composition changes with diet, medication and time.", from: 279 },
  { id: "hormone-steroid-balance", icon: "droplet" as IconName, k: "Hormones", name: "Hormone & Steroid Balance", explores: "Hormones linked to energy, stress, metabolism and reproductive health.", sample: "At-home collection. Sample type to confirm per test.", shows: "Hormone levels such as cortisol, testosterone, estradiol, progesterone, DHEA-S and SHBG.", not: "The cause of symptoms on its own; hormones vary with time of day and cycle.", from: 79 },
  { id: "inflammation-biological-aging", icon: "shield" as IconName, k: "Inflammation", name: "Inflammation & Biological Aging", explores: "Inflammation, cellular stress, and healthy aging.", sample: "Blood sample. Collection option to confirm.", shows: "Markers such as hs-CRP, IL-6, IL-10, TNF-α and MCP-1 that can inform a longevity plan.", not: "A specific disease. Inflammation rises temporarily with illness or hard exercise.", from: 60 },
  { id: "vitamin-nutritional-status", icon: "leaf" as IconName, k: "Nutrition", name: "Vitamin & Nutritional Status", explores: "Key vitamins for immune, bone, and cellular health.", sample: "Blood sample. Collection option to confirm.", shows: "Vitamin A, D, E and K1 status, and resveratrol levels for supplementation monitoring.", not: "Your whole diet quality, or bone density and other outcomes directly.", from: 115 },
  { id: "brain-aging-neurodegeneration", icon: "brain" as IconName, k: "Brain", name: "Brain Aging & Neurodegeneration", explores: "Biomarkers linked to brain aging and neurodegeneration.", sample: "Blood sample, ordered as part of a medical evaluation.", shows: "p-Tau217 and Beta-Amyloid 40/42 ratio — risk-related information to discuss with a clinician.", not: "Whether you will develop a neurological condition.", from: 430 },
];

export const LAB_STEPS = [
  { n: "01", t: "Choose your test", d: "Find the test that matches your goals." },
  { n: "02", t: "Collect your sample", d: "Use an at-home kit or sample collection option." },
  { n: "03", t: "Laboratory analysis", d: "Your sample is processed using validated methods." },
  { n: "04", t: "Understand your results", d: "Access secure results with connected interpretation." },
];

export const LAB_INTELLIGENCE = [
  { icon: "layers" as IconName, t: "Connect your results", d: "Brings biomarkers, genomics, microbiome, and other results together in one connected view." },
  { icon: "eye" as IconName, t: "Understand what matters", d: "Reveals patterns and relationships across your results that may be missed when viewed separately." },
  { icon: "route" as IconName, t: "Guide what comes next", d: "Helps identify relevant next steps, including follow-up testing and tracking changes over time." },
];

export const LAB_DIFFERENCE = [
  { t: "Track changes over time", d: "Longitudinal insights that show how you're changing.", typical: false },
  { t: "BioAro Intelligence", d: "Connects your results and reveals meaningful patterns.", typical: false },
  { t: "Biomarkers, genomics & microbiome in one place", d: "All your data, integrated for a complete picture.", typical: false },
  { t: "Specialized tests beyond routine panels", d: "Access advanced testing options when you need them.", typical: false },
];
