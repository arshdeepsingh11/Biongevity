import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Text3DFlip } from "@/components/fx/Text3DFlip";
import { Globe } from "@/components/fx/Globe";
import { ABOUT_FACTS, FOUNDER } from "@/data/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Pioneering the future of longevity medicine." />
      <Section ai="Story" className="!pt-0">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <MediaSlot id="founder" className="aspect-[4/5]" />
          <div data-reveal className="space-y-5 self-center text-[18px] leading-relaxed text-ink/80">
            <p>We at Biongevity are dedicated to promoting longevity through a holistic approach combining advanced epigenetic analysis, personalized guideline-based therapies, and continuous monitoring.</p>
            <p>Biongevity is a subsidiary of BioAro, a Calgary-based genomics and precision-health company led by {FOUNDER.name}, {FOUNDER.role.split("·")[0].trim().toLowerCase()}, with clinic launches in Calgary and Dubai.</p>
            <p>BioAro Labs brings advanced at-home diagnostics; BioAro Drugs brings transparent, AI-guided bioactive protocols. Together, they feed one Electronic Longevity Record: BioELR.</p>
            <p className="text-[13px] text-faint">Founder wording to be confirmed by the client.</p>
          </div>
        </div>
      </Section>
      <Section ai="BioAro group" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_FACTS.map((f) => <div key={f.k} data-reveal className="card p-6"><div className="text-[13px] text-faint">{f.k}</div><div className="mt-2 text-[24px] font-semibold tracking-tight"><Text3DFlip text={f.v} /></div></div>)}
        </div>
      </Section>
      <Section ai="Reach" className="!pt-0"><div className="container-x mx-auto max-w-[520px]"><Globe markers={[{ location: [51.0447, -114.0719], size: 0.1 }, { location: [25.2048, 55.2708], size: 0.1 }, { location: [37.3382, -121.8863], size: 0.06 }]} /></div></Section>
    </>
  );
}
