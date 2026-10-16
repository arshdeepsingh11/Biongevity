import type { IconName } from "@/components/ui/icons";

/**
 * Biongevity 2.0 — healthspan intelligence platform (from the 2.0 Developer Product & AI Architecture Specification).
 * The member app with the digital twin already exists at NEXT_PUBLIC_APP_URL. This website only explains it and links to it.
 */
export const PLATFORM_QUESTIONS = [
  { q: "How is my healthspan changing?", d: "Your own baseline, tracked over months and years — not a single snapshot.", icon: "chart" as IconName },
  { q: "Why is it changing?", d: "Which signals moved first, and which habits, results or conditions sit behind them.", icon: "network" as IconName },
  { q: "What can I change?", d: "Modifiable drivers, ranked — sleep, activity, nutrition, blood pressure, metabolic health.", icon: "target" as IconName },
  { q: "Did it work?", d: "Re-test and compare: responding, no change, or worse — so the plan keeps learning.", icon: "check" as IconName },
];

export const PLATFORM_LAYERS: { n: string; t: string; d: string; icon: IconName }[] = [
  { n: "01", t: "Data fabric", d: "Labs, wearables, genomics, imaging, medications, lifestyle and questionnaires — normalised, with the source, time and unit kept on every value.", icon: "layers" },
  { n: "02", t: "Biomarker intelligence", d: "Each result read against your personal baseline, age and sex context, reference ranges and trend.", icon: "wave" },
  { n: "03", t: "Longevity digital twin", d: "A personal model of your biological ageing, resilience and healthspan trajectory.", icon: "fingerprint" },
  { n: "04", t: "Risk & trajectory models", d: "Direction and speed of change with uncertainty — not deterministic predictions.", icon: "trend" },
  { n: "05", t: "Intervention engine", d: "Turns signals into prioritised, explainable actions and the right follow-up tests.", icon: "route" },
  { n: "06", t: "AI longevity coach", d: "Biongevity SI: multilingual education, check-ins and habit coaching, with clinician escalation.", icon: "sparkle" },
  { n: "07", t: "Clinician & family centre", d: "Clinician review and override, family permissions per data domain, alerts and longitudinal reports.", icon: "users" },
];

export const TWIN_STATES: { t: string; d: string; icon: IconName }[] = [
  { t: "Biological", d: "Biomarkers, genomics, metabolomics, epigenetics, clinical measures", icon: "dna" },
  { t: "Physiological", d: "Heart rate, HRV, sleep, activity, breathing and other digital biomarkers", icon: "activity" },
  { t: "Functional", d: "Aerobic capacity, strength, mobility and daily function", icon: "walk" },
  { t: "Behavioural", d: "Nutrition, exercise, sleep habits, stress and adherence", icon: "salad" },
  { t: "Clinical", d: "Conditions, medications, procedures, imaging and clinician notes", icon: "stethoscope" },
  { t: "Trajectory", d: "Direction, speed, variability and confidence of each health domain", icon: "trend" },
];

/** Domain scores + a transparent composite (spec section 8). Shown with ranges and uncertainty in the app. */
export const DOMAIN_SCORES: { t: string; d: string; icon: IconName }[] = [
  { t: "Biological ageing", d: "Age-related biomarker trajectory", icon: "hourglass" },
  { t: "Cardiometabolic", d: "Blood pressure, lipids, glucose, body composition", icon: "heart" },
  { t: "Brain health", d: "Cognition, sleep, vascular and metabolic factors", icon: "brain" },
  { t: "Metabolic", d: "Glucose regulation and insulin sensitivity", icon: "flame" },
  { t: "Inflammation", d: "Long-term inflammatory signals", icon: "virus" },
  { t: "Physical function", d: "VO₂ max, activity, mobility, strength", icon: "walk" },
  { t: "Sleep & recovery", d: "Sleep quality, HR/HRV, recovery", icon: "moon" },
  { t: "Nutrition", d: "Nutrients, amino acids, diet quality", icon: "salad" },
  { t: "Resilience", d: "Recovery after stress and illness", icon: "shield" },
];

/** The five action labels every recommendation ends with (spec section 9). */
export const ACTION_LABELS = ["Action now", "Monitor", "Repeat test", "Discuss with clinician", "No action needed"];

/** Recommendation chain shown in "Why this?" explanations. */
export const WHY_CHAIN = ["Signal", "Validated", "Context", "Importance", "Modifiable driver", "Recommendation", "Monitoring", "Reassess"];

/** Illustrative only — demonstrates the "Why this?" chain. Not real member data. */
export const WHY_EXAMPLE = [
  { k: "Signal", v: "Home blood pressure average 138/86 over 7 days" },
  { k: "Validated", v: "Morning and evening readings, validated cuff, 14 readings" },
  { k: "Context", v: "Age 52 · family history of heart disease · LDL rising over 2 tests" },
  { k: "Importance", v: "Blood pressure is one of the strongest modifiable drivers of heart and brain ageing" },
  { k: "Modifiable driver", v: "Sodium, alcohol, sleep and activity patterns" },
  { k: "Recommendation", v: "Discuss with clinician · lifestyle plan first" },
  { k: "Monitoring", v: "Repeat 7-day home readings in 6 weeks" },
  { k: "Reassess", v: "Compare against your own baseline: responding · no change · worse" },
];

export const ROADMAP = [
  { k: "Now", d: "Wearables and lab results in one longitudinal record, domain scores, personal baseline, Biongevity SI coach, clinician view." },
  { k: "Next", d: "Genome and microbiome in the record, epigenetic age, intervention response, family portal, dynamic re-testing." },
  { k: "Later", d: "The full digital twin, multimodal risk models, imaging, personal simulations and research mode." },
];

export const DEVICES = ["Apple Health", "Health Connect", "Garmin", "Oura", "WHOOP", "Fitbit", "Polar", "CGM", "Home BP cuff"];

export const PORTALS = [
  { id: "member", t: "Member", d: "Your twin, results, plan and Biongevity SI coach.", icon: "user" as IconName },
  { id: "clinician", t: "Clinician", d: "Review AI insights, accept, edit or dismiss, and plan follow-up.", icon: "stethoscope" as IconName },
  { id: "family", t: "Family", d: "A permissioned view of a parent's or partner's trends.", icon: "users" as IconName },
];
