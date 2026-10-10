import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { AskButton } from "@/components/pages/AskButton";
import { Icon } from "@/components/ui/Icon";
import { CARE_PHASES } from "@/data/health";

export const metadata: Metadata = { title: "The Member Journey" };

export default function JourneyPage() {
  return (
    <>
      <PageHero eyebrow="The member journey" title="A holistic approach, continued over time." lede="Four phases — from a comprehensive baseline to lifelong, AI-assisted monitoring." />
      <Section ai="Phases" className="!pt-0">
        <div className="container-x relative">
          <div aria-hidden className="absolute bottom-8 left-[39px] top-8 hidden w-px bg-gradient-to-b from-coral via-violet-soft to-sky sm:block" />
          <div className="space-y-4">
            {CARE_PHASES.map((c) => (
              <div key={c.n} data-reveal data-scan data-ai={c.t} className="card relative flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={c.icon} size={24} /></span>
                <div><div className="text-[13px] font-semibold text-violet">Phase {c.n}</div><div className="mt-1 text-[26px] font-semibold tracking-tight">{c.t}</div><p className="mt-2 max-w-[70ch] text-[16px] leading-relaxed text-muted">{c.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section ai="Biological age" className="!pt-0">
        <div className="container-x">
          <div data-reveal className="flex flex-col items-center gap-8 rounded-5xl bg-night p-8 text-white sm:flex-row sm:p-12">
            <ProgressRing value={64} size={140} dark label="illustrative" />
            <div>
              <div className="text-[28px] font-semibold tracking-tight">Biological vs chronological age</div>
              <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-white/65">Biological age reflects cellular health, influenced by DNA, habits and environment. Biongevity assesses which ageing molecules your body produces to estimate the biological age of each organ system.</p>
              <AskButton q="What is biological age and how is it measured?" className="mt-5 !bg-white/10 text-white">How is it measured?</AskButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
