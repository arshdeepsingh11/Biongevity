import type { IconName } from "@/components/ui/icons";

/** Caring for a parent — concerns an adult child can pick, and what usually helps (education; a clinician decides). */
export const PARENT_CONCERNS: { id: string; t: string; icon: IconName; dept: string; tests: string[]; checks: string[] }[] = [
  { id: "memory", t: "Memory or confusion", icon: "brain", dept: "geriatric-medicine", tests: ["p-tau217-phosphorylated-tau-217", "beta-amyloid-40-42-ratio"], checks: ["Note examples and dates of memory lapses", "List every medicine — some affect memory", "Check hearing and vision"] },
  { id: "falls", t: "Falls or unsteadiness", icon: "walk", dept: "geriatric-medicine", tests: ["vitamin-d-25-hydroxy-d2-d3"], checks: ["Remove loose rugs; add night lights", "Review medicines that cause dizziness", "Ask about a strength and balance plan"] },
  { id: "heart", t: "Heart or blood pressure", icon: "heart", dept: "cardiology", tests: ["hs-crp-high-sensitivity-c-reactive-protein"], checks: ["Take 7 days of home blood-pressure readings", "Bring the readings to the visit", "Note breathlessness or ankle swelling"] },
  { id: "kidney", t: "Kidneys or medicines", icon: "droplet", dept: "internal-medicine", tests: ["cystatin-c"], checks: ["Bring all pill bottles to one review", "Ask whether doses fit kidney function", "Keep a simple medicine list on the fridge"] },
  { id: "mood", t: "Low mood or loneliness", icon: "face", dept: "mental-health", tests: [], checks: ["Ask open questions about sleep, appetite and interest", "Plan regular calls or visits", "Look for community or group activities"] },
  { id: "energy", t: "Tiredness or weight loss", icon: "bolt", dept: "internal-medicine", tests: ["essential-vitamin-health"], checks: ["Track appetite and weight weekly", "Check for new or worsening symptoms", "Book a full review if weight drops without trying"] },
];

/** Illustrative only — what a permissioned family view can show in the Biongevity app. */
export const FAMILY_DOMAINS = [
  { id: "bp", t: "Blood pressure trend", on: true },
  { id: "activity", t: "Daily activity", on: true },
  { id: "sleep", t: "Sleep", on: true },
  { id: "meds", t: "Medicine reminders", on: false },
  { id: "labs", t: "Lab results", on: false },
  { id: "visits", t: "Upcoming visits", on: true },
];

/** Illustrative 8-week home blood-pressure series for the family-view demo. */
export const FAMILY_BP = { labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], sys: [148, 146, 143, 141, 138, 136, 134, 133], dia: [88, 88, 86, 85, 84, 83, 82, 82] };
