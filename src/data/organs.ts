import type { OrganId } from "./deptExtra";

/**
 * Procedural 3D organ models for the Organ3D viewer — simplified anatomy built from ellipsoids, tubes and slabs
 * (our own geometry, no third-party model files). Units are roughly −1…1; y is up, z faces the viewer.
 * Each part carries a plain-language note and how it is usually checked. Educational, not to scale.
 */

export type V3 = [number, number, number];
export type Shape =
  | { k: "ell"; c: V3; r: V3; n?: number; w?: number }
  | { k: "tube"; path: V3[]; r: number; n?: number; taper?: number }
  | { k: "slab"; c: V3; s: V3; n?: number };
export type Tone = "ai" | "ai-hi" | "ai-2" | "artery" | "vein" | "warn" | "teal" | "gold" | "muted";
export interface Part { id: string; label: string; tone: Tone; shapes: Shape[]; note: string; check?: string }
export interface Organ { id: OrganId; name: string; blurb: string; parts: Part[] }

const coil = (): V3[] => Array.from({ length: 70 }, (_, i) => { const t = i / 69; return [Math.sin(t * Math.PI * 7) * 0.42 * (1 - t * 0.2), 0.15 - t * 0.75, Math.cos(t * Math.PI * 7) * 0.22] as V3; });
const arc = (c: V3, rx: number, ry: number, a0: number, a1: number, n = 24, z = 0): V3[] => Array.from({ length: n }, (_, i) => { const a = a0 + ((a1 - a0) * i) / (n - 1); return [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry, c[2] + z] as V3; });

export const ORGANS: Record<OrganId, Organ> = {
  lungs: { id: "lungs", name: "Lungs & airways", blurb: "Air travels down the trachea, splits into the bronchi and ends in about 480 million alveoli.", parts: [
    { id: "trachea", label: "Trachea", tone: "ai-2", shapes: [{ k: "tube", path: [[0, 1.08, 0], [0, 0.52, 0]], r: 0.075 }], note: "The windpipe — rings of cartilage keep it open.", check: "Spirometry, imaging" },
    { id: "bronchi", label: "Bronchi", tone: "ai-2", shapes: [{ k: "tube", path: [[0, 0.52, 0], [-0.22, 0.38, 0.02], [-0.42, 0.18, 0.05]], r: 0.05 }, { k: "tube", path: [[0, 0.52, 0], [0.2, 0.4, 0.02], [0.4, 0.22, 0.05]], r: 0.048 }, { k: "tube", path: [[-0.42, 0.18, 0.05], [-0.55, -0.2, 0.08]], r: 0.03 }, { k: "tube", path: [[0.4, 0.22, 0.05], [0.52, -0.15, 0.08]], r: 0.03 }], note: "Branching airways that narrow in asthma and COPD.", check: "Spirometry before and after a bronchodilator" },
    { id: "right", label: "Right lung (3 lobes)", tone: "ai", shapes: [{ k: "ell", c: [-0.46, 0.02, 0], r: [0.38, 0.74, 0.32], n: 1800 }], note: "Slightly larger, with three lobes.", check: "Lung function, CT when needed" },
    { id: "left", label: "Left lung (2 lobes)", tone: "ai", shapes: [{ k: "ell", c: [0.46, 0.04, 0], r: [0.34, 0.7, 0.3], n: 1600 }], note: "Two lobes, leaving room for the heart.", check: "Lung function, CT when needed" },
    { id: "diaphragm", label: "Diaphragm", tone: "warn", shapes: [{ k: "ell", c: [0, -0.82, 0], r: [0.95, 0.09, 0.5], n: 420 }], note: "The main breathing muscle. In sleep apnea it keeps working while the upper airway closes.", check: "Sleep study for apnea" },
  ] },
  skin: { id: "skin", name: "Skin layers", blurb: "A cross-section: the epidermis on top, the dermis with follicles and glands, and fat below.", parts: [
    { id: "epi", label: "Epidermis", tone: "gold", shapes: [{ k: "slab", c: [0, 0.6, 0], s: [1.8, 0.1, 1.1], n: 1800 }], note: "The outer barrier; pigment cells live here.", check: "Skin exam, imaging for pigment" },
    { id: "derm", label: "Dermis", tone: "warn", shapes: [{ k: "slab", c: [0, 0.22, 0], s: [1.8, 0.6, 1.1], n: 1500 }], note: "Collagen and elastin — the layer that lasers and microneedling remodel.", check: "Clinical assessment" },
    { id: "follicle", label: "Hair follicles", tone: "ai", shapes: [-0.6, -0.15, 0.3, 0.7].map((x, i) => ({ k: "tube" as const, path: [[x, -0.15, (i % 2 ? 0.2 : -0.2)], [x + 0.05, 0.95, (i % 2 ? 0.2 : -0.2)]] as V3[], r: 0.035, n: 90 })), note: "Where hair grows; PRP targets the follicle.", check: "Scalp assessment" },
    { id: "gland", label: "Sweat & oil glands", tone: "teal", shapes: [[-0.35, 0.05, 0.25], [0.1, 0.1, -0.3], [0.5, 0.05, 0.3]].map((c) => ({ k: "ell" as const, c: c as V3, r: [0.08, 0.06, 0.08] as V3, n: 80 })), note: "Oil glands feed acne; the skin microbiome lives around them.", check: "BioSkin microbiome test" },
    { id: "fat", label: "Subcutaneous fat", tone: "gold", shapes: [{ k: "slab", c: [0, -0.42, 0], s: [1.8, 0.55, 1.1], n: 1400 }], note: "Insulation and energy storage; body contouring works here.", check: "Body composition" },
    { id: "vessel", label: "Blood vessels", tone: "artery", shapes: [{ k: "tube", path: [[-0.9, -0.1, 0], [-0.3, -0.05, 0.1], [0.3, -0.12, -0.05], [0.9, -0.08, 0]], r: 0.04 }], note: "Supply the skin; flushing and rosacea involve these.", check: "Clinical exam" },
  ] },
  brain: { id: "brain", name: "Brain", blurb: "Two hemispheres, the cerebellum for balance and the brainstem for life-sustaining rhythms.", parts: [
    { id: "lh", label: "Left hemisphere", tone: "ai-hi", shapes: [{ k: "ell", c: [-0.33, 0.15, 0], r: [0.31, 0.42, 0.62], n: 2200, w: 0.07 }], note: "Language and logic for most people.", check: "Cognitive assessment, imaging" },
    { id: "rh", label: "Right hemisphere", tone: "ai-hi", shapes: [{ k: "ell", c: [0.33, 0.15, 0], r: [0.31, 0.42, 0.62], n: 2200, w: 0.07 }], note: "Spatial awareness and attention.", check: "Cognitive assessment, imaging" },
    { id: "hippo", label: "Hippocampus", tone: "warn", shapes: [{ k: "ell", c: [-0.25, -0.05, -0.05], r: [0.06, 0.05, 0.16], n: 90 }, { k: "ell", c: [0.25, -0.05, -0.05], r: [0.06, 0.05, 0.16], n: 90 }], note: "Forms new memories; affected early in Alzheimer's disease.", check: "p-Tau217 and amyloid blood markers, under medical guidance" },
    { id: "cb", label: "Cerebellum", tone: "ai-2", shapes: [{ k: "ell", c: [0, -0.34, -0.42], r: [0.38, 0.18, 0.22], n: 700, w: 0.05 }], note: "Balance and coordination — key for falls.", check: "Balance and gait tests" },
    { id: "stem", label: "Brainstem", tone: "ai", shapes: [{ k: "tube", path: [[0, -0.15, -0.2], [0, -0.9, -0.28]], r: 0.1 }], note: "Breathing, heart rate and sleep–wake control.", check: "Sleep study" },
  ] },
  gut: { id: "gut", name: "Digestive tract", blurb: "From the stomach through the small intestine to the colon, home to trillions of microbes.", parts: [
    { id: "eso", label: "Oesophagus", tone: "ai-2", shapes: [{ k: "tube", path: [[0.05, 1.1, 0], [0.18, 0.62, 0]], r: 0.06 }], note: "Carries food to the stomach; reflux irritates its lining.", check: "Endoscopy if symptoms persist" },
    { id: "stomach", label: "Stomach", tone: "warn", shapes: [{ k: "ell", c: [0.32, 0.5, 0], r: [0.38, 0.22, 0.22], n: 500 }], note: "Acid and enzymes start digestion.", check: "Breath test for H. pylori" },
    { id: "small", label: "Small intestine", tone: "ai-hi", shapes: [{ k: "tube", path: coil(), r: 0.07, n: 1200 }], note: "Most nutrients are absorbed here.", check: "Blood tests, BioGut" },
    { id: "colon", label: "Large intestine", tone: "ai", shapes: [{ k: "tube", path: [[-0.62, -0.75, 0.05], [-0.68, 0.3, 0.05], [0.65, 0.32, 0.05], [0.66, -0.75, 0.05], [0.2, -0.95, 0.05]], r: 0.1, n: 1000 }], note: "Where the densest microbiome lives.", check: "BioGut microbiome test; colorectal screening by age" },
  ] },
  thyroid: { id: "thyroid", name: "Thyroid & neck glands", blurb: "A butterfly-shaped gland that sets your metabolic pace.", parts: [
    { id: "lobes", label: "Thyroid lobes", tone: "ai-hi", shapes: [{ k: "ell", c: [-0.3, 0, 0.12], r: [0.17, 0.42, 0.14], n: 500 }, { k: "ell", c: [0.3, 0, 0.12], r: [0.17, 0.42, 0.14], n: 500 }], note: "Make T4 and T3, which set metabolic rate.", check: "TSH, free T4, ultrasound" },
    { id: "isthmus", label: "Isthmus", tone: "ai", shapes: [{ k: "tube", path: [[-0.18, -0.12, 0.2], [0.18, -0.12, 0.2]], r: 0.07 }], note: "The bridge between the lobes.", check: "Ultrasound" },
    { id: "para", label: "Parathyroids", tone: "warn", shapes: [[-0.32, 0.25, -0.02], [0.32, 0.25, -0.02], [-0.32, -0.28, -0.02], [0.32, -0.28, -0.02]].map((c) => ({ k: "ell" as const, c: c as V3, r: [0.05, 0.05, 0.05] as V3, n: 40 })), note: "Control calcium for bones and nerves.", check: "Calcium and PTH" },
    { id: "trachea", label: "Trachea", tone: "ai-2", shapes: [{ k: "tube", path: [[0, 0.95, -0.12], [0, -0.95, -0.12]], r: 0.16 }], note: "The windpipe runs just behind the thyroid.", check: "—" },
  ] },
  kidneys: { id: "kidneys", name: "Kidneys", blurb: "Two filters that clean about 180 litres of blood a day and help set blood pressure.", parts: [
    { id: "kid", label: "Kidneys", tone: "artery", shapes: [{ k: "ell", c: [-0.48, 0.15, 0], r: [0.22, 0.38, 0.16], n: 600 }, { k: "ell", c: [0.48, 0.12, 0], r: [0.22, 0.38, 0.16], n: 600 }], note: "Filter waste and balance salt and water.", check: "Creatinine, cystatin C, urine albumin" },
    { id: "adr", label: "Adrenal glands", tone: "gold", shapes: [{ k: "ell", c: [-0.42, 0.56, 0], r: [0.12, 0.07, 0.08], n: 80 }, { k: "ell", c: [0.42, 0.53, 0], r: [0.12, 0.07, 0.08], n: 80 }], note: "Make cortisol and adrenaline.", check: "Cortisol" },
    { id: "aorta", label: "Aorta & vena cava", tone: "artery", shapes: [{ k: "tube", path: [[-0.06, 1, -0.1], [-0.06, -0.8, -0.1]], r: 0.07 }, { k: "tube", path: [[0.1, 1, -0.12], [0.1, -0.8, -0.12]], r: 0.08 }], note: "The great vessels feed and drain the kidneys.", check: "Blood pressure" },
    { id: "ureter", label: "Ureters & bladder", tone: "teal", shapes: [{ k: "tube", path: [[-0.4, -0.2, 0], [-0.2, -0.75, 0.05]], r: 0.03 }, { k: "tube", path: [[0.4, -0.22, 0], [0.2, -0.75, 0.05]], r: 0.03 }, { k: "ell", c: [0, -0.88, 0.05], r: [0.25, 0.15, 0.18], n: 260 }], note: "Carry urine down to the bladder.", check: "Urinalysis" },
  ] },
  tooth: { id: "tooth", name: "Tooth & gum", blurb: "Enamel on top, living pulp inside, roots anchored in bone under the gum.", parts: [
    { id: "crown", label: "Crown & enamel", tone: "gold", shapes: [{ k: "ell", c: [0, 0.45, 0], r: [0.45, 0.33, 0.4], n: 800 }], note: "The hardest tissue in the body.", check: "Dental exam" },
    { id: "pulp", label: "Pulp", tone: "artery", shapes: [{ k: "ell", c: [0, 0.35, 0], r: [0.16, 0.14, 0.14], n: 140 }, { k: "tube", path: [[-0.12, 0.25, 0], [-0.2, -0.75, 0]], r: 0.03 }, { k: "tube", path: [[0.12, 0.25, 0], [0.2, -0.75, 0]], r: 0.03 }], note: "Nerves and blood vessels — why deep decay hurts.", check: "X-ray" },
    { id: "roots", label: "Roots", tone: "ai-hi", shapes: [{ k: "tube", path: [[-0.2, 0.18, 0], [-0.25, -0.85, 0]], r: 0.11 }, { k: "tube", path: [[0.2, 0.18, 0], [0.25, -0.85, 0]], r: 0.11 }], note: "Anchor the tooth in the jawbone.", check: "X-ray" },
    { id: "gum", label: "Gum line", tone: "warn", shapes: [{ k: "slab", c: [0, 0.05, 0], s: [1.5, 0.12, 0.9], n: 500 }], note: "Gum inflammation is linked with heart and metabolic disease.", check: "BioDental oral microbiome" },
  ] },
  knee: { id: "knee", name: "Knee joint", blurb: "Thigh bone meets shin bone, cushioned by cartilage and held by ligaments.", parts: [
    { id: "femur", label: "Femur", tone: "gold", shapes: [{ k: "tube", path: [[0, 1.15, 0], [0, 0.28, 0]], r: 0.2 }, { k: "ell", c: [-0.16, 0.18, 0], r: [0.17, 0.14, 0.2], n: 200 }, { k: "ell", c: [0.16, 0.18, 0], r: [0.17, 0.14, 0.2], n: 200 }], note: "The thigh bone.", check: "X-ray" },
    { id: "cart", label: "Cartilage & menisci", tone: "ai-hi", shapes: [{ k: "ell", c: [0, 0.02, 0], r: [0.38, 0.035, 0.25], n: 300 }], note: "Smooth cushioning; inflamed or worn in arthritis.", check: "Ultrasound or MRI" },
    { id: "tibia", label: "Tibia", tone: "gold", shapes: [{ k: "ell", c: [0, -0.1, 0], r: [0.36, 0.08, 0.24], n: 260 }, { k: "tube", path: [[0, -0.15, 0], [0, -1.15, 0]], r: 0.18 }], note: "The shin bone.", check: "X-ray" },
    { id: "patella", label: "Kneecap", tone: "ai", shapes: [{ k: "ell", c: [0, 0.22, 0.3], r: [0.13, 0.17, 0.06], n: 120 }], note: "Protects the front of the joint.", check: "Exam" },
    { id: "synov", label: "Synovium", tone: "warn", shapes: [{ k: "ell", c: [0, 0.08, 0], r: [0.46, 0.28, 0.34], n: 420 }], note: "The joint lining — swells in juvenile arthritis.", check: "Exam, ultrasound, inflammation markers" },
  ] },
  uterus: { id: "uterus", name: "Uterus & ovaries", blurb: "Hormones from the ovaries shape the cycle, bone and heart health.", parts: [
    { id: "ut", label: "Uterus", tone: "artery", shapes: [{ k: "ell", c: [0, 0.12, 0], r: [0.32, 0.4, 0.24], n: 700 }], note: "Lined by endometrium that responds to hormones each cycle.", check: "Ultrasound" },
    { id: "cx", label: "Cervix", tone: "warn", shapes: [{ k: "tube", path: [[0, -0.28, 0], [0, -0.7, 0]], r: 0.11 }], note: "Screened regularly for HPV-related change.", check: "Cervical screening" },
    { id: "tubes", label: "Fallopian tubes", tone: "ai-2", shapes: [{ k: "tube", path: arc([0, 0.3, 0], 0.65, 0.25, Math.PI * 0.95, Math.PI * 0.55), r: 0.035 }, { k: "tube", path: arc([0, 0.3, 0], 0.65, 0.25, Math.PI * 0.05, Math.PI * 0.45), r: 0.035 }], note: "Carry eggs from ovary to uterus.", check: "—" },
    { id: "ov", label: "Ovaries", tone: "ai-hi", shapes: [{ k: "ell", c: [-0.68, 0.12, 0], r: [0.14, 0.1, 0.1], n: 120 }, { k: "ell", c: [0.68, 0.12, 0], r: [0.14, 0.1, 0.1], n: 120 }], note: "Make estradiol and progesterone.", check: "Estradiol, progesterone, hormone panels" },
  ] },
  prostate: { id: "prostate", name: "Bladder & prostate", blurb: "The prostate sits below the bladder and grows with age.", parts: [
    { id: "bl", label: "Bladder", tone: "teal", shapes: [{ k: "ell", c: [0, 0.38, 0], r: [0.44, 0.38, 0.38], n: 700 }], note: "Stores urine.", check: "Urinalysis" },
    { id: "pr", label: "Prostate", tone: "artery", shapes: [{ k: "ell", c: [0, -0.15, 0], r: [0.25, 0.18, 0.2], n: 260 }], note: "Enlarges with age; screened as part of men's health.", check: "PSA with shared decision-making" },
    { id: "sv", label: "Seminal vesicles", tone: "gold", shapes: [{ k: "ell", c: [-0.25, 0.02, -0.28], r: [0.16, 0.06, 0.06], n: 80 }, { k: "ell", c: [0.25, 0.02, -0.28], r: [0.16, 0.06, 0.06], n: 80 }], note: "Glands behind the bladder.", check: "—" },
    { id: "ur", label: "Urethra", tone: "ai-2", shapes: [{ k: "tube", path: [[0, 0.05, 0], [0, -0.95, 0.05]], r: 0.035 }], note: "Passes through the prostate — why enlargement affects flow.", check: "Flow history" },
  ] },
  liver: { id: "liver", name: "Liver & metabolism", blurb: "The liver handles fats and sugars; the pancreas sets insulin.", parts: [
    { id: "liv", label: "Liver", tone: "artery", shapes: [{ k: "ell", c: [-0.22, 0.3, 0], r: [0.72, 0.34, 0.4], n: 1100 }, { k: "ell", c: [0.45, 0.38, 0], r: [0.3, 0.2, 0.25], n: 300 }], note: "Fatty liver is common and often silent.", check: "Liver enzymes, ultrasound" },
    { id: "gb", label: "Gallbladder", tone: "teal", shapes: [{ k: "ell", c: [-0.2, -0.05, 0.25], r: [0.09, 0.14, 0.08], n: 90 }], note: "Stores bile for digesting fat.", check: "Ultrasound" },
    { id: "st", label: "Stomach", tone: "warn", shapes: [{ k: "ell", c: [0.55, 0.0, -0.05], r: [0.3, 0.2, 0.18], n: 320 }], note: "Where meals start their journey.", check: "—" },
    { id: "pan", label: "Pancreas", tone: "gold", shapes: [{ k: "tube", path: [[-0.15, -0.35, -0.1], [0.3, -0.3, -0.12], [0.75, -0.2, -0.12]], r: 0.08 }], note: "Makes insulin — central to diabetes.", check: "Glucose, HbA1c, insulin" },
  ] },
};
