/**
 * Procedural 3D human — a point-cloud body and its organs, generated in code (no model files, no images).
 * Units: the body stands from y = -1 (feet) to y = 1 (top of head), facing +z. +x is the body's left
 * (the viewer's right when seen from the front).
 */
export type V3 = [number, number, number];

export interface Organ {
  id: string; label: string; plain: string; at: V3; r: V3; n: number;
  /** Where the label sits (defaults to the organ centre) — keeps neighbouring labels apart. */
  tag?: V3;
  /** Departments that look after this part of the body (ids from data/departments.ts). */
  depts: string[];
}

export const ORGANS: Organ[] = [
  { id: "brain", label: "Brain", plain: "Memory, mood, sleep and focus", at: [0, 0.885, 0], r: [0.07, 0.05, 0.065], n: 140, tag: [-0.13, 0.95, 0.02], depts: ["geriatric-medicine", "mental-health"] },
  { id: "eyes", label: "Eyes", plain: "Vision and the small blood vessels behind the eye", at: [0, 0.845, 0.092], r: [0.045, 0.012, 0.01], n: 24, tag: [0.14, 0.84, 0.1], depts: [] },
  { id: "mouth", label: "Mouth & gums", plain: "Oral microbiome linked with heart and metabolic health", at: [0, 0.765, 0.085], r: [0.025, 0.012, 0.012], n: 20, tag: [-0.12, 0.76, 0.09], depts: ["dental"] },
  { id: "thyroid", label: "Thyroid", plain: "Sets your metabolic pace and energy", at: [0, 0.695, 0.04], r: [0.028, 0.012, 0.012], n: 26, tag: [0.12, 0.69, 0.05], depts: ["endocrinology"] },
  { id: "lungs", label: "Lungs", plain: "Breathing, oxygen and sleep breathing", at: [0, 0.43, 0], r: [0.15, 0.11, 0.06], n: 220, tag: [-0.15, 0.47, 0.05], depts: ["respiratory-medicine"] },
  { id: "heart", label: "Heart", plain: "Pumping, rhythm, blood pressure and arteries", at: [0.028, 0.395, 0.045], r: [0.042, 0.048, 0.036], n: 110, tag: [0.1, 0.36, 0.08], depts: ["cardiology", "heart-failure"] },
  { id: "liver", label: "Liver", plain: "Fats, sugar, medicines and detoxification", at: [-0.055, 0.265, 0.03], r: [0.08, 0.04, 0.05], n: 100, tag: [-0.08, 0.26, 0.06], depts: ["internal-medicine"] },
  { id: "stomach", label: "Stomach", plain: "Digestion and appetite", at: [0.06, 0.255, 0.04], r: [0.045, 0.035, 0.03], n: 50, tag: [0.09, 0.27, 0.06], depts: ["gut-health", "nutrition"] },
  { id: "pancreas", label: "Pancreas", plain: "Insulin and blood sugar", at: [0.012, 0.205, 0], r: [0.055, 0.012, 0.015], n: 34, tag: [0.04, 0.2, 0.06], depts: ["endocrinology"] },
  { id: "kidneys", label: "Kidneys", plain: "Filtering blood and balancing blood pressure", at: [0, 0.19, -0.04], r: [0.09, 0.035, 0.02], n: 60, tag: [-0.09, 0.17, -0.04], depts: ["internal-medicine"] },
  { id: "gut", label: "Gut", plain: "Microbiome, immunity and nutrient absorption", at: [0, 0.075, 0.03], r: [0.095, 0.075, 0.05], n: 170, tag: [0.03, 0.06, 0.07], depts: ["gut-health", "nutrition"] },
  { id: "pelvis", label: "Hormones & pelvis", plain: "Reproductive and hormonal health", at: [0, -0.04, 0.03], r: [0.055, 0.03, 0.03], n: 40, tag: [0, -0.06, 0.08], depts: ["womens-health", "mens-health"] },
  { id: "spine", label: "Bones & spine", plain: "Bone strength, posture and falls risk", at: [0, 0.3, -0.06], r: [0.012, 0.36, 0.012], n: 90, tag: [0, 0.55, -0.1], depts: ["geriatric-medicine"] },
  { id: "joints", label: "Joints", plain: "Knees, hips and inflammation", at: [0, -0.5, 0.02], r: [0.13, 0.03, 0.03], n: 50, tag: [0.1, -0.5, 0.05], depts: ["pediatric-rheumatology"] },
  { id: "muscles", label: "Muscles", plain: "Strength, metabolism and mobility", at: [0, -0.27, 0.02], r: [0.15, 0.12, 0.05], n: 70, tag: [-0.1, -0.25, 0.06], depts: ["internal-medicine"] },
  { id: "skin", label: "Skin", plain: "Barrier, ageing and skin microbiome", at: [-0.215, 0.5, 0.03], r: [0.03, 0.08, 0.03], n: 40, depts: ["skin-health"] },
];
export const organById = (id: string) => ORGANS.find((o) => o.id === id);

/** Small seeded random generator so the body looks the same on every visit. */
function rng(seed = 7) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
