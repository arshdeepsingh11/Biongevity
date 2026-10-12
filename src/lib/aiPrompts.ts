import { DEPARTMENTS } from "@/data/departments";

/**
 * Smart questions — ready prompts for the page (and section) the visitor is on.
 * These are only QUESTIONS; every answer comes from Xevyo.
 */
const PAGE: Record<string, string[]> = {
  home: ["What is BioELR?", "Which test should I start with?", "How is Biongevity different from a regular clinic?"],
  "precision-health": ["Which department fits my symptoms?", "What happens at a first precision visit?", "Do I need a referral?"],
  "bioaro-labs": ["Which lab test should I start with?", "What is the difference between genome and microbiome tests?", "How long do results take?"],
  "bioaro-drugs": ["Which formula fits my goal?", "Can I take these with my medication?", "What is in LONgevity+?"],
  clinic: ["How does a virtual visit work?", "Where is the Dubai clinic?", "What does the Longevity Journey include?"],
  shop: ["Compare Core, Precision and Elite", "Should I start with a test or a program?", "What happens after I order?"],
  life: ["How does Biongevity work at a resort or office?", "Can my company offer this to staff?"],
  app: ["What does the Biongevity App track?", "Which wearables work with the app?"],
  insights: ["What is biological age?", "Which habits add the most healthy years?"],
  about: ["Who is behind Biongevity?", "Where are your clinics?"],
  dashboard: ["What does a BioELR record show?", "How often should I re-test?"],
  contact: ["How do I book a consultation?", "Can I start with a virtual visit?"],
};

/** Page key from a pathname: department id, BioAro hub, or first segment. */
export function pageKey(path: string): string {
  const seg = path.split("/").filter(Boolean);
  if (!seg.length) return "home";
  if (seg[0] === "precision-health" && seg[1]) return seg[1];
  return seg[0];
}

export function pagePrompts(path: string, section?: string): string[] {
  const key = pageKey(path);
  const dept = DEPARTMENTS.find((d) => d.id === key);
  const base = dept ? [...dept.prompts, `When should I see ${dept.short}?`] : PAGE[key] ?? PAGE.home;
  const sec = section ? [`Explain “${section}” in simple words`] : [];
  return [...sec, ...base].slice(0, 4);
}

/** Readable page label for Xevyo's context. */
export function pageLabel(path: string): string {
  const key = pageKey(path);
  return DEPARTMENTS.find((d) => d.id === key)?.name ?? key;
}
