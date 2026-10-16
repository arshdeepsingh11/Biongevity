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
