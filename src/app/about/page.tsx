import type { Metadata } from "next";
import { PageHero, Section, Eyebrow } from "@/components/ui/Section";
import { Text3DFlip } from "@/components/fx/Text3DFlip";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { AuroraText } from "@/components/fx/AuroraText";
import { WorldMap } from "@/components/fx/WorldMap";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { ABOUT, OFFICES } from "@/data/clinic";
import { ABOUT_FACTS, FOUNDER } from "@/data/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Biongevity" title={<>Longevity with <AuroraText>biology.</AuroraText></>} lede={ABOUT.intro} />
      <Section ai="Mission & vision" className="!pt-0">
        <div className="container-x grid gap-4 md:grid-cols-2">
          {[["Our mission", ABOUT.mission, "target"], ["Our vision", ABOUT.vision, "eye"]].map(([t, d, i]) => (
            <div key={t} data-reveal data-scan className="card p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white"><Icon name={i} size={22} /></span>
              <div className="mt-6 text-[24px] font-semibold tracking-tight">{t}</div>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section ai="BioAro group" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_FACTS.map((f) => <div key={f.k} data-reveal className="card p-6"><div className="text-[13px] text-faint">{f.k}</div><div className="mt-2 text-[22px] font-semibold tracking-tight"><Text3DFlip text={f.v} /></div></div>)}
        </div>
      </Section>
      <Section ai="Founder" className="!pt-0">
        <div className="container-x">
          <div data-reveal className="card grid items-center gap-8 p-8 md:grid-cols-[auto_1fr]">
            <span className="grid h-28 w-28 place-items-center rounded-[32px] bg-accent-light"><LogoMark size={64} /></span>
            <div>
              <Eyebrow>Leadership</Eyebrow>
              <div className="mt-2 text-[26px] font-semibold tracking-tight">{FOUNDER.name}</div>
              <div className="text-[14px] text-muted">{FOUNDER.role}</div>
              <p className="mt-4 text-[17px] leading-relaxed text-ink/80">Biongevity is part of BioAro — a Calgary-based genomics and precision health group — with clinics and offices in Canada, the UAE and Europe.</p>
            </div>
          </div>
        </div>
      </Section>
      <Section ai="Reach" className="!pt-0">
        <div className="container-x text-center">
          <h2 className="h-section mx-auto max-w-[18ch]"><DiaTextReveal text="Three regions. One record." /></h2>
          <div className="mt-8 text-left"><WorldMap /></div>
        </div>
      </Section>
    </>
  );
}
