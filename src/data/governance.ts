import type { IconName } from "@/components/ui/icons";

/** How Biongevity's AI works — governance content for /ai/ (spec section 15). Plain statements of what is true today. */
export const AI_PRINCIPLES: { t: string; d: string; icon: IconName }[] = [
  { t: "AI explains, clinicians decide", d: "Biongevity SI educates and drafts. It does not diagnose, prescribe or replace your clinician.", icon: "stethoscope" },
  { t: "You start every AI call", d: "Nothing is sent to Biongevity SI on page load. A request goes only when you press Ask, Send or Explain.", icon: "sparkle" },
  { t: "Your words stay yours", d: "This website does not store what you type into AI tools. Health values are sent only after you tick the consent line.", icon: "lock" },
  { t: "Answers cite our pages", d: "Before asking Biongevity SI, your device finds the most relevant Biongevity passages and sends them as context, so answers can show sources.", icon: "book" },
  { t: "Uncertainty is shown", d: "Ranges and confidence, never one number presented as a verdict. Illustrative data is labelled.", icon: "gauge" },
  { t: "Escalation first", d: "Urgent symptoms are pointed to emergency services and clinicians — the AI does not try to triage emergencies.", icon: "siren" },
];

export const EVIDENCE_LEVELS = [
  { k: "Clinically validated", d: "Established tests and thresholds used in clinical guidelines (for example blood pressure, HbA1c, LDL).", tone: "teal" },
  { k: "Supportive evidence", d: "Consistent research findings that inform education but are not used alone for decisions.", tone: "gold" },
  { k: "Exploratory", d: "Emerging longevity science (for example some ageing clocks). Shown as context, never as a diagnosis.", tone: "faint" },
] as const;

/** Model cards for every AI or on-device model the website uses. */
export const MODEL_CARDS: { name: string; kind: "Biongevity SI" | "On-device"; use: string; inputs: string; outputs: string; limits: string }[] = [
  { name: "Biongevity SI chat", kind: "Biongevity SI", use: "Plain-language answers about our services, tests and health topics.", inputs: "Your question, page and section name, up to 3 passages from our pages, chosen language.", outputs: "Text answer with source links.", limits: "General education only; can be wrong; not medical advice." },
  { name: "Page summary", kind: "Biongevity SI", use: "Summarise the page you are reading.", inputs: "Visible text of the page (on click).", outputs: "Short summary and follow-up questions.", limits: "Summarises our page only; may omit detail." },
  { name: "Grounding search (BM25)", kind: "On-device", use: "Finds the 3 most relevant passages from our site index before a Biongevity SI call.", inputs: "Your question.", outputs: "Ranked passages and links.", limits: "Keyword based; may miss synonyms." },
  { name: "Intent matcher", kind: "On-device", use: "Matches what you type to departments, tests, formulas and biomarkers.", inputs: "Your words.", outputs: "Ranked matches with a strength bar.", limits: "Keyword scoring, not understanding." },
  { name: "Lab value flagger", kind: "On-device", use: "Reads pasted lab text and compares values with general adult reference ranges.", inputs: "Text you paste (never stored).", outputs: "Low / in range / high flags.", limits: "Labs use different ranges and units; your clinician interprets results." },
  { name: "Specialist router", kind: "On-device", use: "Suggests a department and test from a description.", inputs: "Your description.", outputs: "Up to 3 departments and tests.", limits: "A coordinator confirms the right service." },
  { name: "Next-step suggestions", kind: "On-device", use: "Suggests a next page from what you have viewed.", inputs: "Page visits stored in your browser only.", outputs: "Three suggestions.", limits: "Clear it any time from the strip." },
];

export const AI_FAQ = [
  { q: "Is Xevyo a doctor?", a: "No. Xevyo is an AI guide that explains and organises information. Diagnosis and treatment decisions are made by clinicians." },
  { q: "Does the website store my health data?", a: "No. Text you type into AI tools on this website is not stored by the site. It is sent to Xevyo only when you press a button." },
  { q: "Can Xevyo answer in Japanese?", a: "Yes. Switch the chat to 日本語 and replies come in Japanese." },
  { q: "Where is my digital twin?", a: "In the Biongevity member app. Use Sign in or Open my twin to go there." },
];
