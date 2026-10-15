import type { Evidence } from "@/lib/testIntel";

const TONE: Record<Evidence, string> = {
  "Clinically validated": "bg-teal-light text-teal",
  "Supportive evidence": "bg-gold-soft text-gold-deep",
  Exploratory: "bg-canvas text-muted ring-1 ring-ink/[0.08]",
};

/** Evidence level label (see /ai/ — validated, supportive, exploratory). */
export function EvidencePill({ e }: { e: Evidence }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${TONE[e]}`}>{e}</span>;
}
