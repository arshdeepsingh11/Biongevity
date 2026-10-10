"use client";
import { useState } from "react";
import Link from "next/link";
import { BeamFlow } from "@/components/fx/BeamFlow";
import { MorphingText } from "@/components/fx/MorphingText";
import { KeywordStream } from "@/components/fx/KeywordStream";
import { Text3DFlip } from "@/components/fx/Text3DFlip";
import { SignalConvergence } from "@/components/fx/SignalConvergence";
import { FocusedMarquee } from "@/components/fx/FocusedMarquee";
import { AnimatedList } from "@/components/fx/AnimatedList";
import { Terminal } from "@/components/fx/Terminal";
import { BentoGrid, BentoCell } from "@/components/fx/BentoGrid";
import { Globe } from "@/components/fx/Globe";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { VideoText } from "@/components/fx/VideoText";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { DecodeText } from "@/components/fx/DecodeText";
import { Icon } from "@/components/ui/Icon";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Eyebrow, Section } from "@/components/ui/Section";
import { useAI } from "@/components/ai/AIProvider";
import { DEPARTMENTS, PILLARS, CARE_PHASES, KEYWORDS_A, KEYWORDS_B } from "@/data/health";
import { FEED } from "@/data/dashboard";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { MEDIA } from "@/config/media";

export function Hero() {
  const { setOpen } = useAI();
  return (
    <section data-ai="Hero" className="relative z-[1] grid min-h-[100svh] place-items-center overflow-hidden bg-pearl pt-[calc(60px+var(--safe-top))]">
      <div className="absolute inset-0"><BeamFlow /></div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
      <div className="container-x relative py-20 text-center">
        <div data-reveal className="glass mx-auto inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-[13px] shadow-card">
          <span className="rounded-full bg-iri px-2.5 py-0.5 text-[11px] font-bold text-white">BioELR AI</span>
          <DecodeText text="Precision health and longevity medicine" className="font-medium text-muted" />
        </div>
        <h1 data-reveal className="h-display mx-auto mt-6 max-w-[14ch]">
          Longevity,<br />enhanced by <MorphingText words={["AI.", "biology.", "your genome.", "your data."]} />
        </h1>
        <p data-reveal className="lede mx-auto mt-6 max-w-[56ch]">
          A new way of living where longevity is enhanced through the power of biology. Crafted with leading technology, scientists and healthcare professionals, delivered anywhere, anytime.
        </p>
        <div data-reveal className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/packages/" className="btn-dark h-12 px-6 text-[16px]">Explore packages<Icon name="arrow-right" size={17} /></Link>
          <button onClick={() => setOpen(true)} className="btn relative h-12 overflow-hidden bg-white px-6 text-[16px] shadow-card">
            <ShineBorder radius={999} /><Icon name="sparkle" size={17} className="text-violet" />Ask Biongevity AI
          </button>
        </div>
        <div data-reveal className="mx-auto mt-14 grid max-w-[720px] grid-cols-3 gap-3">
          {[[LAB_TESTS.length, "lab tests", "/labs/tests/"], [DRUG_PRODUCTS.length, "bioactive formulas", "/drugs/shop/"], [DEPARTMENTS.length, "clinical disciplines", "/precision-health/"]].map(([n, l, h]) => (
            <Link key={l as string} href={h as string} className="glass rounded-2xl p-3 shadow-card sm:p-4">
              <div className="text-[26px] font-semibold tracking-tight sm:text-[34px]"><NumberTicker value={n as number} /></div>
              <div className="text-[12px] text-muted sm:text-[13px]">{l}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Streams() {
  return (
    <section data-ai="Keyword stream" className="relative z-[1] space-y-1 py-6">
      <KeywordStream words={KEYWORDS_A} />
      <KeywordStream words={KEYWORDS_B} reverse duration={58} />
    </section>
  );
}

export function ThreeSixty() {
  const [idx, setIdx] = useState(0);
  return (
    <Section ai="360° view">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>A 360° view of your health</Eyebrow>
          <h2 data-reveal className="h-section mt-3"><Text3DFlip text="Five data streams." /><br /><span className="text-muted">One intelligence.</span></h2>
          <div data-reveal className="mt-8 space-y-2">
            {PILLARS.map((p, i) => (
              <button key={p.t} onClick={() => setIdx(i)} onMouseEnter={() => setIdx(i)} aria-pressed={idx === i}
                className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${idx === i ? "bg-white shadow-card ring-1 ring-black/[0.05]" : "hover:bg-white/60"}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${idx === i ? "bg-iri text-white" : "bg-white text-faint ring-1 ring-black/5"}`}><Icon name={p.icon} size={21} /></span>
                <span><span className="block text-[17px] font-semibold">{p.t}</span>
                  {idx === i && <span className="mt-1 block text-[14px] leading-relaxed text-muted">{p.d}</span>}</span>
              </button>
            ))}
          </div>
        </div>
        <div data-reveal>
          <SignalConvergence items={PILLARS.map((p) => p.t)} active={idx} />
          <p className="text-center text-[12px] text-faint">Diagram · data sources converging in BioELR</p>
        </div>
      </div>
    </Section>
  );
}

export function Disciplines() {
  return (
    <Section ai="Departments" className="overflow-hidden">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <div><Eyebrow>Precision Health</Eyebrow><h2 data-reveal className="h-section mt-3"><Text3DFlip text="Eleven disciplines." /> <span className="text-muted">One record.</span></h2></div>
        <Link href="/precision-health/" className="btn-light">All departments<Icon name="arrow-right" size={15} /></Link>
      </div>
      <FocusedMarquee items={DEPARTMENTS.map((d) => ({ icon: d.icon, label: d.short, href: `/precision-health/${d.id}/` }))} />
    </Section>
  );
}

export function AILayer() {
  return (
    <Section ai="AI layer">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-5xl bg-night p-6 text-white sm:p-12">
          <div aria-hidden data-ai-fx className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-iri opacity-30 blur-[120px]" />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <div className="eyebrow !text-[#B9A8FF]"><DecodeText text="BioELR · Electronic Longevity Record" /></div>
              <h2 data-reveal className="mt-3 text-[34px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[48px]">Continuous data analysis, personal feedback.</h2>
              <p data-reveal className="mt-4 text-[17px] leading-relaxed text-white/65">BioELR integrates genomic sequencing, epigenetic analysis, metabolic profiling and gut microbiome assessments, alongside data from the ELR App and connected wearables.</p>
              <div className="mt-8"><AnimatedList items={FEED} dark /></div>
              <p className="mt-4 text-[12px] text-white/40">Feed and terminal are illustrative demonstrations, not live member data.</p>
            </div>
            <div data-reveal className="self-center">
              <Terminal lines={["$ bioelr ingest --member demo --sources genome,epigenome,app", "> Whole genome · methylation panel · 90 days app data", "✓ Sources linked to one record", "$ bioelr age --by-organ-system", "> Estimates generated per organ system (illustrative)", "$ bioelr plan --draft --for clinician-review", "✓ Draft queued for clinician review"]} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Ecosystem() {
  return (
    <Section ai="Ecosystem">
      <div className="container-x">
        <Eyebrow>The BioAro ecosystem</Eyebrow>
        <h2 data-reveal className="h-section mt-3 max-w-[18ch]">Test. Understand. Act. All in one place.</h2>
        <BentoGrid className="mt-10">
          <BentoCell span="md:col-span-4 md:row-span-2" className="flex flex-col">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-violet"><Icon name="flask" size={16} />Diagnostics · BioAro Labs</div>
            <div className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">Understand your biology before symptoms become decisions.</div>
            <p className="mt-2 max-w-[52ch] text-[15px] text-muted">Advanced biomarker, microbiome, and genomic testing — at home, clinician-reviewed, from CLIA-registered labs.</p>
            <MediaSlot id="homeLabs" className="mt-5 min-h-[200px] flex-1" rounded="rounded-3xl" />
            <div className="mt-5 flex flex-wrap gap-2"><Link href="/labs/" className="btn-dark">Explore Labs<Icon name="arrow-right" size={15} /></Link><Link href="/labs/tests/" className="btn-light">Shop {LAB_TESTS.length} tests</Link></div>
          </BentoCell>
          <BentoCell span="md:col-span-2">
            <div className="text-[13px] font-semibold text-muted">Clinics</div>
            <div className="text-[22px] font-semibold">Calgary · Dubai</div>
            <div className="-mb-24 mt-2"><Globe markers={[{ location: [51.0447, -114.0719], size: 0.08 }, { location: [25.2048, 55.2708], size: 0.08 }, { location: [37.3382, -121.8863], size: 0.05 }]} /></div>
          </BentoCell>
          <BentoCell span="md:col-span-2" dark>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#B9A8FF]"><Icon name="pill" size={16} />Bioactives · BioAro Drugs</div>
            <div className="mt-2 text-[22px] font-semibold leading-snug">Your goals. Your routine. Your protocol.</div>
            <p className="mt-2 text-[14px] text-white/60">AI-guided protocols with every ingredient and amount shown.</p>
            <Link href="/drugs/" className="btn mt-5 bg-white text-ink">Build my protocol<Icon name="arrow-right" size={15} /></Link>
          </BentoCell>
          <BentoCell span="md:col-span-3">
            <div className="text-[13px] font-semibold text-muted">Longevity packages</div>
            <div className="mt-1 text-[26px] font-semibold tracking-tight">Core. Plus. Elite.</div>
            <p className="mt-2 text-[14px] text-muted">Three 12-month programs that differ in expert access and genetic testing depth.</p>
            <Link href="/packages/" className="btn-light mt-5">Compare packages</Link>
          </BentoCell>
          <BentoCell span="md:col-span-3">
            <div className="text-[13px] font-semibold text-muted">ELR App</div>
            <div className="mt-1 text-[26px] font-semibold tracking-tight">Your care, in your pocket.</div>
            <p className="mt-2 text-[14px] text-muted">Telemedicine, wearables, smart-home devices and BioELR feedback.</p>
            <Link href="/app/" className="btn-light mt-5">Explore the app</Link>
          </BentoCell>
        </BentoGrid>
      </div>
    </Section>
  );
}

export function CareModel() {
  return (
    <Section ai="Care model">
      <div className="container-x">
        <Eyebrow>The care model</Eyebrow>
        <h2 data-reveal className="h-section mt-3 max-w-[18ch]">From baseline to lifelong monitoring.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARE_PHASES.map((c) => (
            <Link href="/journey/" key={c.n} data-reveal data-scan className="card p-6 transition-transform duration-500 hover:-translate-y-1">
              <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-canvas"><Icon name={c.icon} size={21} /></span><span className="text-[13px] font-semibold text-faint">{c.n}</span></div>
              <div className="mt-6 text-[19px] font-semibold">{c.t}</div>
              <div className="mt-1.5 text-[14px] text-muted">{c.short}</div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function FilmBand() {
  return (
    <Section ai="Brand film" className="!py-10">
      <div className="container-x">
        <VideoText text="LONGEVITY" src={MEDIA.videoText.video} />
        <MediaSlot id="heroVideo" className="mt-6 aspect-video w-full" />
      </div>
    </Section>
  );
}

export function FinalCTA() {
  const { ask } = useAI();
  return (
    <Section ai="Get started">
      <div className="container-x text-center">
        <h2 data-reveal className="h-section mx-auto max-w-[16ch]">Start with a conversation.</h2>
        <p data-reveal className="lede mx-auto mt-4 max-w-[48ch]">Tell us what you want to improve. Biongevity AI suggests where to begin.</p>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact/" className="btn-dark h-12 px-6">Request a consultation</Link>
          <button onClick={() => ask("Where should I start with Biongevity?")} className="btn-light h-12 px-6"><Icon name="sparkle" size={16} className="text-violet" />Where should I start?</button>
        </div>
      </div>
    </Section>
  );
}
