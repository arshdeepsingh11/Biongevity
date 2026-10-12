import { Icon } from "@/components/ui/Icon";
import { POLICIES } from "@/config/store";

const STEPS = [
  { icon: "bag", t: "Build your plan", d: "Studio, search or shortcuts — one bag for everything." },
  { icon: "call", t: "We confirm", d: "A coordinator confirms fit, scheduling and any clinic quote." },
  { icon: "home", t: "Sample or visit", d: "Home kit, blood draw or a clinic appointment." },
  { icon: "microscope", t: "Results", d: "From days for blood markers to 4–6 weeks for genomes." },
  { icon: "stethoscope", t: "Clinician review", d: "Results explained and a plan in your record." },
];
const TRUST = [
  { icon: "shield", t: "CLIA-registered labs", d: "BioAro Labs testing" },
  { icon: "stethoscope", t: "Clinician-reviewed", d: "Every result, every plan" },
  { icon: "lock", t: "Private by design", d: "One secure record" },
  { icon: "eye", t: "Full transparency", d: "Every ingredient and dose shown" },
];

/** What happens after you buy, plus trust signals. Policy lines appear only when configured. */
export function TrustStrip() {
  return (
    <div className="space-y-5">
      <div className="relative grid gap-3 md:grid-cols-5">
        <div aria-hidden className="absolute left-[10%] right-[10%] top-7 hidden h-[2px] bg-iri-x opacity-40 md:block" />
        {STEPS.map((s, i) => (
          <div key={s.t} className="relative rounded-2xl bg-white p-4 text-center ring-1 ring-ink/[0.06]">
            <span className="relative z-[1] mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white ring-4 ring-pearl"><Icon name={s.icon} size={22} weight="duotone" /></span>
            <div className="mt-2 hud-label">Step {i + 1}</div><div className="text-[14.5px] font-semibold">{s.t}</div><div className="mt-1 text-[12px] text-muted">{s.d}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TRUST.map((t) => <div key={t.t} className="flex items-center gap-3 rounded-2xl bg-navy p-4"><Icon name={t.icon} size={24} weight="duotone" className="shrink-0 text-accent" /><div><div className="text-[14px] font-semibold">{t.t}</div><div className="text-[12px] text-muted">{t.d}</div></div></div>)}
      </div>
      {(POLICIES.refunds || POLICIES.shipping || POLICIES.kitRegions) && (
        <div className="rounded-2xl bg-canvas p-4 text-[12.5px] text-muted">{[POLICIES.refunds, POLICIES.shipping, POLICIES.kitRegions].filter(Boolean).join(" · ")}</div>
      )}
      <p className="text-[11.5px] text-faint">All prices in CAD. Program prices shown are for 12 months; 3- and 6-month terms are priced by our care team.</p>
    </div>
  );
}
