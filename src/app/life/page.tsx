import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PlanetSystem } from "@/components/fx/PlanetSystem";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Icon } from "@/components/ui/Icon";
import { LIFE_PLACES } from "@/data/health";

export const metadata: Metadata = { title: "Biongevity Life" };

export default function LifePage() {
  return (
    <>
      <section data-ai="Biongevity Life" className="relative z-[1] overflow-hidden pb-10 pt-[calc(96px+var(--safe-top))] sm:pt-[120px]">
        <div className="container-x grid items-center gap-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Biongevity Life</Eyebrow>
            <h1 data-reveal className="h-display mt-4">Longevity at your home, office and vacation place.</h1>
            <p data-reveal className="lede mt-5">Your care orbits you. Move the cursor — or your finger — to shift the light.</p>
          </div>
          <PlanetSystem moons={["Home", "Office", "Travel", "Clinic"]} />
        </div>
      </section>
      <Section ai="Places" className="!pt-0">
        <div className="container-x grid gap-4 md:grid-cols-3">
          {LIFE_PLACES.map((l) => (
            <div key={l.t} data-reveal data-scan className="card overflow-hidden">
              <MediaSlot id={l.media} className="aspect-[4/3]" rounded="rounded-none" />
              <div className="p-6"><div className="flex items-center gap-2 text-[20px] font-semibold"><Icon name={l.icon} size={19} className="text-violet" />{l.t}</div><div className="mt-2 text-[15px] text-muted">{l.d}</div></div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
