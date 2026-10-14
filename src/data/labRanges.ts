/**
 * General adult reference ranges for the lab-result explainer (education only).
 * Labs differ in methods, units and ranges — the range printed on your report and your clinician's interpretation always win.
 * Sources: Canadian / international guideline thresholds (Diabetes Canada, CCS lipid guideline, KDIGO, Endocrine Society, AHA/CDC).
 */
export interface LabRange {
  id: string; label: string; aliases: string[]; unit: string;
  /** Alternate unit with a factor to convert into `unit` (value × factor). */
  alt?: { unit: string; factor: number }[];
  low?: number; high?: number; note: string; marker?: string;
}

export const LAB_RANGES: LabRange[] = [
  { id: "ldl", label: "LDL cholesterol", aliases: ["ldl-c", "ldl cholesterol", "ldl"], unit: "mmol/L", alt: [{ unit: "mg/dL", factor: 1 / 38.67 }], high: 3.5, note: "Lower targets apply when overall cardiovascular risk is higher.", marker: "ldl" },
  { id: "hdl", label: "HDL cholesterol", aliases: ["hdl-c", "hdl cholesterol", "hdl"], unit: "mmol/L", alt: [{ unit: "mg/dL", factor: 1 / 38.67 }], low: 1.0, note: "Below about 1.0 (men) or 1.3 (women) is considered low." },
  { id: "tc", label: "Total cholesterol", aliases: ["total cholesterol", "cholesterol total", "cholesterol"], unit: "mmol/L", alt: [{ unit: "mg/dL", factor: 1 / 38.67 }], high: 5.2, note: "Read together with LDL, HDL and non-HDL." },
  { id: "tg", label: "Triglycerides", aliases: ["triglycerides", "triglyceride", "tg"], unit: "mmol/L", alt: [{ unit: "mg/dL", factor: 1 / 88.57 }], high: 1.7, note: "Fasting state, alcohol and recent meals change this value." },
  { id: "apob", label: "ApoB", aliases: ["apolipoprotein b", "apo b", "apob"], unit: "g/L", alt: [{ unit: "mg/dL", factor: 0.01 }], high: 1.0, note: "ApoB counts atherogenic particles; targets depend on risk." },
  { id: "lpa", label: "Lp(a)", aliases: ["lipoprotein(a)", "lipoprotein a", "lp(a)", "lpa"], unit: "nmol/L", high: 100, note: "Mostly genetic; measuring once in adulthood is usually enough." },
  { id: "a1c", label: "HbA1c", aliases: ["hemoglobin a1c", "haemoglobin a1c", "hba1c", "a1c"], unit: "%", low: undefined, high: 5.9, note: "6.0–6.4% suggests prediabetes; 6.5% or more suggests diabetes (needs confirmation).", marker: "a1c" },
  { id: "glu", label: "Fasting glucose", aliases: ["fasting glucose", "fasting blood glucose", "glucose fasting", "fbg", "glucose"], unit: "mmol/L", alt: [{ unit: "mg/dL", factor: 1 / 18 }], low: 3.9, high: 6.0, note: "6.1–6.9 suggests impaired fasting glucose." },
  { id: "crp", label: "hs-CRP", aliases: ["high sensitivity crp", "hs-crp", "hscrp", "c-reactive protein", "crp"], unit: "mg/L", high: 3, note: "Under 1 low, 1–3 average, over 3 higher risk; recent illness raises it.", marker: "crp" },
  { id: "vitd", label: "Vitamin D (25-OH)", aliases: ["25-hydroxy vitamin d", "25-oh vitamin d", "25(oh)d", "vitamin d"], unit: "nmol/L", alt: [{ unit: "ng/mL", factor: 2.496 }], low: 50, high: 250, note: "Many labs use 75 nmol/L as optimal." },
  { id: "ferritin", label: "Ferritin", aliases: ["ferritin"], unit: "µg/L", alt: [{ unit: "ng/mL", factor: 1 }], low: 30, high: 300, note: "Ranges differ by sex; inflammation raises ferritin." },
  { id: "b12", label: "Vitamin B12", aliases: ["vitamin b12", "b12", "cobalamin"], unit: "pmol/L", alt: [{ unit: "pg/mL", factor: 0.738 }], low: 150, note: "Borderline values are often checked with methylmalonic acid." },
  { id: "tsh", label: "TSH", aliases: ["thyroid stimulating hormone", "tsh"], unit: "mIU/L", low: 0.4, high: 4.0, note: "Thyroid medication and timing affect TSH." },
  { id: "egfr", label: "eGFR", aliases: ["egfr", "estimated gfr"], unit: "mL/min/1.73m²", low: 60, note: "Under 60 for 3 months or more suggests reduced kidney function.", marker: "cysc" },
  { id: "creat", label: "Creatinine", aliases: ["creatinine"], unit: "µmol/L", alt: [{ unit: "mg/dL", factor: 88.4 }], low: 45, high: 110, note: "Depends on muscle mass, age and sex." },
  { id: "alt", label: "ALT", aliases: ["alanine aminotransferase", "alt", "sgpt"], unit: "U/L", high: 40, note: "Alcohol, fatty liver, medications and exercise can raise ALT." },
  { id: "uric", label: "Uric acid", aliases: ["uric acid", "urate"], unit: "µmol/L", alt: [{ unit: "mg/dL", factor: 59.48 }], high: 420, note: "Linked with gout and cardiometabolic risk." },
  { id: "hcy", label: "Homocysteine", aliases: ["homocysteine"], unit: "µmol/L", high: 15, note: "B12, folate and kidney function affect it." },
];

export type Flag = "low" | "in range" | "high" | "no range";
export interface Parsed { r: LabRange; value: number; unit: string; flag: Flag; raw: string }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Reads pasted lab text and finds known markers with a number. Runs on-device only. */
export function parseLabs(text: string): Parsed[] {
  const out: Parsed[] = [], seen = new Set<string>();
  for (const line of text.split(/\n|;/)) {
    const l = line.toLowerCase();
    for (const r of LAB_RANGES) {
      if (seen.has(r.id)) continue;
      const alias = r.aliases.find((a) => new RegExp(`(^|[^a-z])${esc(a)}([^a-z]|$)`).test(l));
      if (!alias) continue;
      const after = l.slice(l.indexOf(alias) + alias.length);
      const m = after.match(/(-?\d+(?:[.,]\d+)?)\s*(mmol\/l|mg\/dl|g\/l|nmol\/l|ng\/ml|µg\/l|ug\/l|pmol\/l|pg\/ml|miu\/l|µmol\/l|umol\/l|u\/l|mg\/l|%)?/);
      if (!m) continue;
      let v = parseFloat(m[1].replace(",", ".")), unit = r.unit;
      const u = (m[2] ?? "").replace("ug", "µg").replace("umol", "µmol");
      const alt = r.alt?.find((a) => a.unit.toLowerCase() === u);
      if (alt) v = Math.round(v * alt.factor * 100) / 100;
      else if (u && u !== r.unit.toLowerCase()) unit = `${r.unit} (converted guess from ${m[2]})`;
      const flag: Flag = r.low === undefined && r.high === undefined ? "no range" : r.low !== undefined && v < r.low ? "low" : r.high !== undefined && v > r.high ? "high" : "in range";
      out.push({ r, value: v, unit, flag, raw: line.trim().slice(0, 80) }); seen.add(r.id);
      break; // one marker per line (so "LDL cholesterol" is not also read as total cholesterol)
    }
  }
  return out;
}

export const SAMPLE_LABS = `LDL-C 3.9 mmol/L
HDL 1.2 mmol/L
Triglycerides 1.9 mmol/L
HbA1c 5.8 %
hs-CRP 2.4 mg/L
Vitamin D 48 nmol/L
TSH 2.1 mIU/L`;
