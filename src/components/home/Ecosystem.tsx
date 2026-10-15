import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { env } from "@/lib/env";

/** The BioAro ecosystem — what each site does, where the AI shows up here, and a link out to the real site. */
export function Ecosystem() {
  const items = [
    { t: "BioAro Labs", d: `${LAB_TESTS.length} tests — genome, microbiome, hormones, inflammation and vitamins, from CLIA-registered labs.`, ai: "AI Test Navigator ranks every test for you", icon: "test-tubes", here: "/precision-health/bioaro-labs/", ext: "https://bioarolabs.com", host: "bioarolabs.com" },
    { t: "BioAro Drugs", d: `${DRUG_PRODUCTS.length} transparent bioactive formulas, every ingredient and dose shown.`, ai: "AI Protocol Studio checks timing and overlap", icon: "tablets", here: "/precision-health/bioaro-drugs/", ext: "https://bioarodrugs.com/us", host: "bioarodrugs.com" },
    { t: "Biongevity app", d: "Your digital twin, results, plan and Xevyo coach — with clinician and family views.", ai: "Xevyo learns your personal baseline", icon: "fingerprint", here: "/platform/", ext: env.appUrl, host: env.appUrl.replace(/^https?:\/\//, "") },
    { t: "BioELR", d: "The longevity health record for clinics, resorts and communities.", ai: "AI drafts notes, flags interactions, answers patients", icon: "layers", here: "/bioelr/", ext: "", host: "" },
    { t: "NEYU Health", d: "Health information, care and intelligent guidance in one experience.", ai: "Partner health platform", icon: "globe", here: "", ext: "https://neyuhealth.com", host: "neyuhealth.com" },
  ];
  return (
    <div className="relative">
      <div className="relative mx-auto mb-8 grid h-28 w-28 place-items-center">
        <div aria-hidden className="absolute inset-0 animate-spinSlow rounded-full border border-dashed border-ai/40" />
        <XevyoOrb size={76} live halo />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((x) => (
          <div key={x.t} className="card flex flex-col p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-light text-accent"><Icon name={x.icon} size={21} weight="duotone" /></span>
            <div className="mt-3 text-[17px] font-semibold">{x.t}</div>
            <p className="mt-1 text-[13px] leading-snug text-muted">{x.d}</p>
            <div className="mt-3 rounded-xl bg-ai-soft/70 px-2.5 py-1.5 text-[12px] font-medium text-ai">✦ {x.ai}</div>
            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-[13px] font-semibold">
              {x.here && <Link href={x.here} className="text-accent hover:underline">Explore</Link>}
              {x.ext && <a href={x.ext} target="_blank" rel="noopener" className="inline-flex items-center gap-0.5 text-muted hover:text-accent">{x.host}<Icon name="arrow-up-right" size={12} /></a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
