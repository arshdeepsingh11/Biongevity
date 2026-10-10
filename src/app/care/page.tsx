import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section, Eyebrow } from "@/components/ui/Section";
import { CareNav } from "@/components/pages/CareNav";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { PlanetSystem } from "@/components/fx/PlanetSystem";
import { Globe } from "@/components/fx/Globe";
import { AskButton } from "@/components/pages/AskButton";
import { AppShowcase, AppSignup } from "@/components/pages/AppDock";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Icon } from "@/components/ui/Icon";
import { CARE_PHASES, LIFE_PLACES } from "@/data/health";
import { LOCATIONS } from "@/data/site";

export const metadata: Metadata = { title: "Care", description: "Member journey, care anywhere, clinics and the ELR App." };

/** Care = Journey + Life + Clinic + ELR App, one page. */
export default function CarePage() {
  return (
    <>
      <PageHero eyebrow="Care" title="One continuous system of care." lede="From a comprehensive baseline to lifelong monitoring — at home, at work, in clinic, and in your pocket." />
      <CareNav />

      <Section ai="Member journey" id="journey" className="scroll-mt-32">
        <div className="container-x">
          <Eyebrow>01 · Journey</Eyebrow>
          <h2 data-reveal className="h-section mt-3 max-w-[18ch]">A holistic approach, continued over time.</h2>
          <div className="relative mt-10 space-y-4">
            <div aria-hidden className="absolute bottom-8 left-[39px] top-8 hidden w-px bg-gradient-to-b from-aqua via-sky to-indigo sm:block" />
            {CARE_PHASES.map((c) => (
              <div key={c.n} data-reveal data-scan className="card flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={c.icon} size={24} /></span>
                <div><div className="text-[13px] font-semibold text-aqua">Phase {c.n}</div><div className="mt-1 text-[24px] font-semibold tracking-tight">{c.t}</div><p className="mt-2 max-w-[70ch] text-[15px] leading-relaxed text-muted">{c.d}</p></div>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-6 flex flex-col items-center gap-8 rounded-5xl border border-white/[0.08] bg-night p-8 sm:flex-row sm:p-10">
            <ProgressRing value={64} size={140} dark label="illustrative" />
            <div>
              <div className="text-[26px] font-semibold tracking-tight">Biological vs chronological age</div>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">Biological age reflects cellular health, influenced by DNA, habits and environment. Biongevity assesses which ageing molecules your body produces to estimate the biological age of each organ system.</p>
              <AskButton q="What is biological age and how is it measured?" className="mt-5">How is it measured?</AskButton>
            </div>
          </div>
        </div>
      </Section>

      <Section ai="Care anywhere" id="anywhere" className="scroll-mt-32">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>02 · Anywhere</Eyebrow>
            <h2 data-reveal className="h-section mt-3">Longevity at home, office and wherever you travel.</h2>
            <p data-reveal className="lede mt-4">Your care orbits you. Move the cursor — or your finger — to shift the light.</p>
            <div className="mt-8 space-y-3">
              {LIFE_PLACES.map((l) => (
                <div key={l.t} data-scan className="card flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-canvas text-aqua"><Icon name={l.icon} size={20} /></span>
                  <div><div className="font-semibold">{l.t}</div><div className="text-[14px] text-muted">{l.d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <PlanetSystem moons={["Home", "Office", "Travel", "Clinic"]} />
        </div>
      </Section>

      <Section ai="Clinics" id="clinics" className="scroll-mt-32">
        <div className="container-x">
          <Eyebrow>03 · Clinics</Eyebrow>
          <h2 data-reveal className="h-section mt-3 max-w-[18ch]">Executive care with innovative medicine.</h2>
          <MediaSlot id="clinicHero" className="mt-8 aspect-[21/9] min-h-[240px]" />
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
            <div className="mx-auto w-full max-w-[420px]"><Globe markers={[{ location: [51.0447, -114.0719], size: 0.1 }, { location: [25.2048, 55.2708], size: 0.1 }]} /></div>
            <div className="space-y-3">
              {LOCATIONS.map((l) => (
                <div key={l.city} className="card p-6"><div className="flex items-center gap-2 text-[19px] font-semibold"><Icon name="pin" size={18} className="text-aqua" />{l.city}</div><div className="mt-2 text-[15px] text-muted">{l.d}</div><div className="mt-1 text-[13px] text-faint">{l.note}</div></div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/[0.08] bg-night p-5"><span className="text-muted">Visits are by appointment.</span><Link href="/contact/?interest=Clinic%20visit" className="btn-dark">Request a visit</Link></div>
            </div>
          </div>
        </div>
      </Section>

      <Section ai="ELR App" id="app" className="scroll-mt-32">
        <div className="container-x">
          <Eyebrow>04 · ELR App</Eyebrow>
          <h2 data-reveal className="h-section mt-3 max-w-[18ch]">Stay connected to your health journey.</h2>
          <p data-reveal className="lede mt-4 max-w-[60ch]">In-clinic and telemedicine consultations, remote monitoring with wearables and smart home devices, and personalized feedback from BioELR.</p>
          <div className="mt-10"><AppShowcase /></div>
          <div className="mx-auto mt-12 grid max-w-[980px] items-center gap-8 md:grid-cols-2">
            <MediaSlot id="appVideo" className="aspect-[9/16] max-h-[520px] w-full md:max-w-[300px] md:justify-self-end" />
            <div><div className="text-[26px] font-semibold tracking-tight">Be first to get the ELR App.</div><div className="mt-5"><AppSignup /></div></div>
          </div>
        </div>
      </Section>
    </>
  );
}
