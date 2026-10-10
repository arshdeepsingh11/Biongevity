import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Globe } from "@/components/fx/Globe";
import { Icon } from "@/components/ui/Icon";
import { LOCATIONS } from "@/data/site";

export const metadata: Metadata = { title: "Biongevity Clinic" };

/** Calm page: AI effects are muted here (see AIInteractionLayer). */
export default function ClinicPage() {
  return (
    <>
      <PageHero eyebrow="Biongevity Clinic" title="Executive care with innovative medicine." lede="A personalized longevity journey for you and your family, in clinic and by telemedicine." />
      <Section ai="Clinic" className="!pt-0"><div className="container-x"><MediaSlot id="clinicHero" className="aspect-[21/9] min-h-[260px]" /></div></Section>
      <Section ai="Locations" className="!pt-0">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-[460px]"><Globe markers={[{ location: [51.0447, -114.0719], size: 0.1 }, { location: [25.2048, 55.2708], size: 0.1 }]} /></div>
          <div className="space-y-3">
            {LOCATIONS.map((l) => (
              <div key={l.city} className="card p-6"><div className="flex items-center gap-2 text-[20px] font-semibold"><Icon name="pin" size={19} className="text-violet" />{l.city}</div><div className="mt-2 text-[15px] text-muted">{l.d}</div><div className="mt-1 text-[13px] text-faint">{l.note}</div></div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-ink p-5 text-white"><span>Visits are by appointment.</span><Link href="/contact/?interest=Clinic%20visit" className="btn bg-white text-ink">Request a visit</Link></div>
          </div>
        </div>
      </Section>
    </>
  );
}
