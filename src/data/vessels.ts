import type { V3 } from "@/lib/body";

/**
 * Cardiovascular system, simplified for education. Paths are traced in the same units as lib/body.ts
 * (feet y = -1, head y = 1, +x = the body's left, +z = front). Anatomy text is general, plain-language
 * education — not a diagnosis. Illustrative model, not to scale.
 */
export type VesselKind = "artery" | "vein" | "pulmonary-artery" | "pulmonary-vein" | "portal" | "coronary";

export interface VesselInfo { id: string; name: string; kind: VesselKind; what: string; fact: string; check?: string; dept?: string }
export interface Vessel { info: string; r: number; pts: V3[] }

export const VESSEL_INFO: VesselInfo[] = [
  { id: "aorta", name: "Aorta", kind: "artery", what: "The body's main artery. It carries oxygen-rich blood from the left side of the heart to every organ.", fact: "About the width of a garden hose; it arches over the heart, then runs down in front of the spine.", check: "Blood pressure, ApoB and lipids; ultrasound for the abdominal aorta.", dept: "cardiology" },
  { id: "carotid", name: "Carotid arteries", kind: "artery", what: "Two arteries up the front of the neck that feed the brain, face and eyes.", fact: "Plaque here is linked with stroke; it can be seen safely on ultrasound.", check: "Carotid ultrasound, ApoB, Lp(a).", dept: "cardiology" },
  { id: "arm-artery", name: "Subclavian & brachial arteries", kind: "artery", what: "Carry blood under the collarbone and down each arm to the hands.", fact: "A blood-pressure cuff measures the pressure in the brachial artery of the upper arm.", check: "Home and 24-hour ambulatory blood pressure.", dept: "cardiology" },
  { id: "coronary", name: "Coronary arteries", kind: "coronary", what: "Small arteries on the heart's surface that feed the heart muscle itself.", fact: "A blockage here causes a heart attack — the main reason we track cholesterol particles and inflammation.", check: "ApoB, Lp(a), hs-CRP; stress echo or imaging if advised.", dept: "cardiology" },
  { id: "renal-artery", name: "Renal arteries", kind: "artery", what: "Short arteries from the aorta to each kidney.", fact: "The kidneys receive about a fifth of every heartbeat's blood; narrowing can raise blood pressure.", check: "Kidney function (eGFR, urine albumin), blood pressure.", dept: "internal-medicine" },
  { id: "gut-artery", name: "Celiac & mesenteric arteries", kind: "artery", what: "Supply the stomach, liver, pancreas and intestines.", fact: "Blood flow to the gut rises after a meal to help digestion.", dept: "gut-health" },
  { id: "leg-artery", name: "Iliac, femoral & leg arteries", kind: "artery", what: "Split from the aorta at the navel and carry blood down each leg to the feet.", fact: "Calf pain on walking that eases with rest can be a sign of narrowed leg arteries.", check: "Ankle–brachial index, lipids, blood sugar.", dept: "cardiology" },
  { id: "pulm-artery", name: "Pulmonary arteries", kind: "pulmonary-artery", what: "Carry oxygen-poor blood from the right side of the heart to the lungs.", fact: "The only arteries that carry oxygen-poor blood — shown in purple.", dept: "respiratory-medicine" },
  { id: "pulm-vein", name: "Pulmonary veins", kind: "pulmonary-vein", what: "Bring freshly oxygenated blood from the lungs back to the left side of the heart.", fact: "The only veins that carry oxygen-rich blood.", dept: "respiratory-medicine" },
  { id: "svc", name: "Superior vena cava", kind: "vein", what: "Returns blood from the head, neck and arms to the right side of the heart.", fact: "Fed by the jugular and subclavian veins.", dept: "cardiology" },
  { id: "jugular", name: "Jugular veins", kind: "vein", what: "Drain blood from the brain, face and neck.", fact: "Clinicians look at the neck veins to judge fluid and heart pressure.", dept: "heart-failure" },
  { id: "arm-vein", name: "Arm veins", kind: "vein", what: "Return blood from the hands and arms toward the heart.", fact: "Blood tests are usually drawn from a vein inside the elbow.", check: "Where your BioAro blood draw happens." },
  { id: "ivc", name: "Inferior vena cava", kind: "vein", what: "The largest vein: returns blood from the legs, kidneys and abdomen to the heart.", fact: "Runs up the right side of the spine, next to the aorta.", dept: "cardiology" },
  { id: "renal-vein", name: "Renal veins", kind: "vein", what: "Carry filtered blood from the kidneys back to the vena cava.", fact: "Together the kidneys filter about 180 litres of blood plasma a day.", dept: "internal-medicine" },
  { id: "leg-vein", name: "Femoral & saphenous veins", kind: "vein", what: "Deep and surface veins that bring blood up from the feet and legs.", fact: "Calf muscles act as a second pump; long sitting slows flow — walk breaks help.", check: "Seek urgent care for a swollen, painful calf.", dept: "cardiology" },
  { id: "portal", name: "Portal vein", kind: "portal", what: "Carries nutrient-rich blood from the gut to the liver before it returns to the heart.", fact: "Lets the liver process sugars, fats and medicines first.", dept: "gut-health" },
  { id: "heart", name: "Heart", kind: "artery", what: "A four-chamber muscular pump: the right side sends blood to the lungs, the left side to the whole body.", fact: "About 100,000 beats a day and roughly 5 litres of blood a minute at rest.", check: "ECG, echocardiogram, stress echo, blood pressure, ApoB.", dept: "cardiology" },
];
export const vesselInfo = (id: string) => VESSEL_INFO.find((v) => v.id === id);

const M = (p: V3[]): V3[] => p.map(([x, y, z]) => [-x, y, z]);
const both = (info: string, r: number, pts: V3[]): Vessel[] => [{ info, r, pts }, { info, r, pts: M(pts) }];

export const VESSELS: Vessel[] = [
  // ── Arteries ──
  { info: "aorta", r: 0.016, pts: [[0.02, 0.42, 0.06], [0.012, 0.5, 0.045], [0, 0.545, 0.02], [0.03, 0.548, -0.012], [0.036, 0.49, -0.045], [0.026, 0.32, -0.05], [0.014, 0.16, -0.04], [0.004, 0.01, -0.012]] },
  ...both("leg-artery", 0.009, [[0.004, 0.01, -0.012], [0.055, -0.07, 0.002], [0.082, -0.13, 0.025], [0.09, -0.3, 0.032], [0.096, -0.48, -0.004], [0.097, -0.7, 0.004], [0.1, -0.92, 0.02], [0.1, -0.968, 0.09]]),
  { info: "carotid", r: 0.0075, pts: [[0, 0.545, 0.02], [-0.028, 0.6, 0.022], [-0.034, 0.7, 0.024], [-0.04, 0.78, 0.004], [-0.03, 0.86, -0.004], [-0.02, 0.92, 0]] },
  { info: "carotid", r: 0.0075, pts: [[0.016, 0.546, 0.01], [0.032, 0.62, 0.02], [0.036, 0.7, 0.024], [0.04, 0.78, 0.004], [0.03, 0.86, -0.004], [0.02, 0.92, 0]] },
  { info: "arm-artery", r: 0.0075, pts: [[-0.028, 0.6, 0.022], [-0.12, 0.625, 0.004], [-0.2, 0.6, 0.002], [-0.262, 0.32, -0.004], [-0.298, 0.06, 0.036], [-0.322, -0.05, 0.045]] },
  { info: "arm-artery", r: 0.0075, pts: [[0.03, 0.548, -0.012], [0.12, 0.625, 0.004], [0.2, 0.6, 0.002], [0.262, 0.32, -0.004], [0.298, 0.06, 0.036], [0.322, -0.05, 0.045]] },
  ...both("renal-artery", 0.0055, [[0.02, 0.195, -0.045], [0.045, 0.192, -0.042], [0.064, 0.19, -0.04]]),
  { info: "gut-artery", r: 0.006, pts: [[0.018, 0.23, -0.04], [0.02, 0.21, 0.0], [0.035, 0.15, 0.04], [0.02, 0.08, 0.05]] },
  { info: "gut-artery", r: 0.005, pts: [[0.018, 0.23, -0.04], [-0.02, 0.25, 0.0], [-0.05, 0.265, 0.03]] },
  // ── Veins ──
  { info: "svc", r: 0.013, pts: [[-0.002, 0.43, 0.05], [-0.03, 0.5, 0.035], [-0.034, 0.58, 0.028]] },
  { info: "jugular", r: 0.0075, pts: [[-0.034, 0.58, 0.028], [-0.062, 0.61, 0.034], [-0.056, 0.7, 0.034], [-0.062, 0.8, 0.004], [-0.05, 0.88, -0.02]] },
  { info: "jugular", r: 0.0075, pts: [[-0.034, 0.58, 0.028], [0.02, 0.6, 0.036], [0.062, 0.61, 0.034], [0.056, 0.7, 0.034], [0.062, 0.8, 0.004], [0.05, 0.88, -0.02]] },
  ...both("arm-vein", 0.0065, [[-0.062, 0.61, 0.034], [-0.15, 0.635, 0.024], [-0.21, 0.61, 0.03], [-0.272, 0.32, 0.022], [-0.306, 0.06, 0.05], [-0.326, -0.05, 0.055]]),
  { info: "ivc", r: 0.014, pts: [[0.004, 0.36, 0.035], [-0.026, 0.3, -0.02], [-0.026, 0.16, -0.032], [-0.014, 0.005, -0.008]] },
  ...both("leg-vein", 0.0085, [[-0.014, 0.005, -0.008], [-0.066, -0.07, 0.012], [-0.074, -0.13, 0.04], [-0.08, -0.3, 0.046], [-0.086, -0.48, 0.006], [-0.09, -0.7, 0.006], [-0.094, -0.93, 0.024], [-0.1, -0.968, 0.095]]),
  ...both("leg-vein", 0.005, [[-0.07, -0.12, 0.055], [-0.052, -0.32, 0.06], [-0.05, -0.5, 0.045], [-0.06, -0.72, 0.035], [-0.07, -0.93, 0.04]]),
  ...both("renal-vein", 0.0055, [[-0.024, 0.185, -0.03], [-0.045, 0.186, -0.034], [-0.064, 0.188, -0.038]]),
  { info: "portal", r: 0.0065, pts: [[0.01, 0.09, 0.05], [-0.01, 0.16, 0.04], [-0.035, 0.22, 0.035], [-0.055, 0.262, 0.032]] },
  // ── Lungs ──
  { info: "pulm-artery", r: 0.011, pts: [[0.025, 0.43, 0.075], [0.03, 0.485, 0.05], [0.0, 0.5, 0.02]] },
  { info: "pulm-artery", r: 0.0085, pts: [[0.0, 0.5, 0.02], [-0.06, 0.48, 0.015], [-0.095, 0.45, 0.0], [-0.11, 0.4, -0.01]] },
  { info: "pulm-artery", r: 0.0085, pts: [[0.0, 0.5, 0.02], [0.065, 0.48, 0.015], [0.1, 0.45, 0.0], [0.11, 0.4, -0.01]] },
  ...both("pulm-vein", 0.0075, [[0.012, 0.405, 0.03], [0.05, 0.4, 0.018], [0.09, 0.39, 0.0], [0.11, 0.35, -0.01]]),
];

/** Small branching airways/vessels inside each lung so the lungs read as tissue (deterministic). */
export function lungBranches(): Vessel[] {
  const out: Vessel[] = [];
  for (const s of [-1, 1]) for (let k = 0; k < 7; k++) {
    const a = -1.1 + k * 0.36, y0 = 0.44 - k * 0.012;
    const p0: V3 = [s * 0.1, y0, 0], p1: V3 = [s * (0.1 + Math.cos(a) * 0.035), y0 + Math.sin(a) * 0.07, (k % 2 ? 0.02 : -0.02)];
    const p2: V3 = [s * (0.1 + Math.cos(a) * 0.055), y0 + Math.sin(a) * 0.11, (k % 2 ? 0.03 : -0.03)];
    out.push({ info: k % 2 ? "pulm-vein" : "pulm-artery", r: 0.0028, pts: [p0, p1, p2] });
  }
  return out;
}
