"use client";
import { useState } from "react";
import Link from "next/link";
import { BeamFlow } from "@/components/fx/BeamFlow";
import { MorphingText } from "@/components/fx/MorphingText";
import { KeywordStream } from "@/components/fx/KeywordStream";

import { TextAnimate } from "@/components/fx/TextAnimate";
import { AuroraText } from "@/components/fx/AuroraText";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { AnimatedList } from "@/components/fx/AnimatedList";
import { Terminal } from "@/components/fx/Terminal";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { DecodeText } from "@/components/fx/DecodeText";
import { WorldMap } from "@/components/fx/WorldMap";
import { DataStreamExplorer } from "./DataStreamExplorer";
import { DisciplineExplorer } from "./DisciplineExplorer";
import { ShimmerButton } from "@/components/fx/ShimmerButton";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Stories } from "@/components/media/Stories";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Section } from "@/components/ui/Section";
import { useAI } from "@/components/ai/AIProvider";
import { DEPARTMENTS, PILLARS, PACKAGES, KEYWORDS_A, KEYWORDS_B } from "@/data/health";
import { CLINICS, OFFICES } from "@/data/clinic";
import { FEED } from "@/data/dashboard";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";

export function Hero() {
  const { setOpen } = useAI();
  return (
    <section data-ai="Hero" className="relative z-[1] grid min-h-[100svh] place-items-center overflow-hidden pt-[calc(60px+var(--safe-top))]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(184,146,92,.16),transparent_60%),radial-gradient(50%_45%_at_85%_20%,rgba(94,127,98,.12),transparent_60%),radial-gradient(40%_40%_at_60%_95%,rgba(184,135,59,.08),transparent_60%)]" />
      <div aria-hidden className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(60,44,20,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(60,44,20,.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
      <div className="absolute inset-0 opacity-50"><BeamFlow /></div>
      <div className="container-x relative py-16 text-center">
        <div data-reveal className="glass mx-auto inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-[13px] shadow-card">
          <span className="rounded-full bg-iri px-2.5 py-0.5 text-[11px] font-bold text-white">BioELR</span>
          <DecodeText text="Precision health. Shared longevity." className="font-medium text-muted" />
        </div>
        <h1 className="h-display mx-auto mt-6 max-w-[15ch]">
          <TextAnimate animation="blurIn" by="word">Longevity, enhanced by</TextAnimate>{" "}
          <MorphingText words={["AI.", "biology.", "your genome.", "your data."]} />
        </h1>
        <TextAnimate as="p" animation="slideUp" by="word" delay={0.3} stagger={0.02} className="lede mx-auto mt-6 block max-w-[58ch]">
          A new way of living where your longevity is enhanced through the power of biology — crafted with leading technology, scientists and healthcare professionals, delivered anywhere, anytime.
        </TextAnimate>
        <div data-reveal className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/shop/?tab=match" className="btn-dark h-12 px-6 text-[16px]"><Icon name="target" size={17} />Find my match</Link>
          <button onClick={() => setOpen(true)} className="btn glass relative h-12 overflow-hidden px-6 text-[16px] shadow-card">
            <ShineBorder radius={999} /><Icon name="bot" size={17} className="text-accent" />Ask Xevyo
          </button>
        </div>
        <div data-reveal className="mx-auto mt-14 grid max-w-[820px] grid-cols-2 gap-3 sm:grid-cols-4">
          {([[LAB_TESTS.length, "lab tests", "/precision-health/bioaro-labs/"], [DRUG_PRODUCTS.length, "bioactive formulas", "/precision-health/bioaro-drugs/"], [DEPARTMENTS.length, "departments", "/precision-health/"], [OFFICES.length, "global offices", "/clinic/"]] as const).map(([n, l, h]) => (
            <Link key={l} href={h} className="card p-4 hover:-translate-y-1">
              <div className="text-[30px] font-semibold tracking-tight sm:text-[36px]"><NumberTicker value={n} /></div>
              <div className="text-[13px] text-muted">{l}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Streams() {
  return (
    <section data-ai="Signal stream" className="relative z-[1] space-y-1 py-6">
      <KeywordStream words={KEYWORDS_A} />
      <KeywordStream words={KEYWORDS_B} reverse duration={58} />
    </section>
  );
}

export function BrandFilm() {
  return (
    <Section ai="Brand film">
      <div className="container-x">
        <Eyebrow>Biongevity</Eyebrow>
        <h2 className="h-section mt-3 max-w-[20ch]"><DiaTextReveal text="Redefining health with multiomics." /></h2>
        <p data-reveal className="lede mt-4 max-w-[58ch]">Cutting-edge technologies like multiomics analysis — genomics, microbiome, epigenetics and more — turned into one personal longevity plan.</p>
        <FilmPlayer film="brandFilm" loop="brandLoop" label="Precision Health. Shared Longevity." className="mt-10 aspect-video" />
      </div>
    </Section>
  );
}

export function ThreeSixty() {
  return (
    <Section ai="360° view" className="bg-canvas/60">
      <div className="container-x">
        <Eyebrow>A 360° view of your health</Eyebrow>
        <h2 className="h-section mt-3 max-w-[20ch]"><TextAnimate animation="blurIn">{"Five data streams."}</TextAnimate> <span className="text-muted">One </span><AuroraText>intelligence.</AuroraText></h2>
        <p data-reveal className="lede mt-4 max-w-[60ch]">Tap or hover a stream to see what it measures, the numbers behind it and how it shows up in your record.</p>
        <div className="mt-10"><DataStreamExplorer /></div>
      </div>
    </Section>
  );
}

export function Disciplines() {
  return (
    <Section ai="Precision Health">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <div><Eyebrow>Precision Health</Eyebrow><h2 className="h-section mt-3"><TextAnimate animation="blurIn">{"Fourteen departments."}</TextAnimate> <span className="text-muted">One record.</span></h2><p data-reveal className="lede mt-3 max-w-[56ch]">Tap or hover a department — see why it matters, the evidence and what we measure.</p></div>
        <Link href="/precision-health/" className="btn-light">All departments<Icon name="arrow-right" size={15} /></Link>
      </div>
      <div className="container-x mt-10"><DisciplineExplorer /></div>
    </Section>
  );
}

export function StoriesSection() {
  return (
    <Section ai="Stories" className="bg-canvas/60">
      <div className="container-x">
        <div className="text-center">
          <Eyebrow>Stories</Eyebrow>
          <h2 className="h-section mx-auto mt-3 max-w-[18ch]"><TextAnimate animation="slideUp">Real people. Real biology.</TextAnimate></h2>
          <p data-reveal className="lede mx-auto mt-4 max-w-[52ch]">From the clinic floor to an at-home test kit. Hover to preview, tap to watch.</p>
        </div>
        <div className="mt-10"><Stories /></div>
      </div>
    </Section>
  );
}

export function AILayer() {
  return (
    <Section ai="BioELR intelligence">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-5xl border border-ink/[0.06] bg-gradient-to-br from-accent-light via-white to-[#F3F7F1] p-6 sm:p-12">
          <ShineBorder radius={32} width={1} />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div className="min-w-0">
              <Eyebrow>BioELR · Electronic Longevity Record</Eyebrow>
              <h2 className="mt-3 text-[34px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[46px]"><DiaTextReveal text="Continuous analysis, personal feedback." /></h2>
              <p data-reveal className="mt-4 text-[17px] leading-relaxed text-muted">Genomic sequencing, epigenetic analysis, metabolic profiling and gut microbiome data, combined with the Biongevity App and your wearables — with AI and clinicians assisting you before issues arise.</p>
              <div className="mt-8"><AnimatedList items={FEED} /></div>
              <p className="mt-4 text-[12px] text-faint">Feed, terminal and score are illustrative demonstrations, not live member data.</p>
            </div>
            <div data-reveal className="min-w-0 space-y-5 self-center">
              <div className="card flex flex-col items-center gap-5 p-5 text-center sm:flex-row sm:text-left"><ProgressRing value={82} size={110} label="Longevity Score™" /><div><div className="text-[17px] font-semibold">Longevity Score™</div><div className="mt-1 text-[14px] text-muted">Biological vs chronological age proxy, updated as your data streams in.</div></div></div>
              <Terminal height={230} lines={["$ bioelr ingest --sources genome,microbiome,wearables", "> WGS 30X · gut snapshot · 90 days HRV and sleep", "✓ Sources linked to one record", "$ bioelr forecast --biological-age", "> Estimates per organ system (illustrative)", "✓ Draft plan queued for clinician review"]} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function GlobalClinic() {
  return (
    <Section ai="Global clinic">
      <div className="container-x">
        <Eyebrow>Global clinic</Eyebrow>
        <h2 className="h-section mt-3 max-w-[20ch]"><TextAnimate animation="blurIn">Your longevity clinic, anywhere in the world.</TextAnimate></h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside Biongevity Clinic Dubai" className="aspect-video lg:col-span-3" />
          <div className="grid gap-3 lg:col-span-2">
            {CLINICS.map((c) => (
              <Link key={c.id} href={`/clinic/${c.id}/`} data-scan className="card group flex items-start gap-4 p-5 hover:-translate-y-0.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-light text-accent group-hover:bg-iri group-hover:text-white"><Icon name={c.icon} size={20} /></span>
                <span className="flex-1"><span className="block text-[17px] font-semibold">{c.name}</span><span className="block text-[14px] text-muted">{c.tag}</span></span>
                <Icon name="arrow-right" size={16} className="mt-1 text-faint group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
        <div data-reveal className="mt-6"><WorldMap /></div>
      </div>
    </Section>
  );
}

export function ProgramsTeaser() {
  return (
    <Section ai="Longevity programs" className="bg-canvas/60">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>Longevity packages</Eyebrow><h2 className="h-section mt-3">Core. Precision. <AuroraText>Elite.</AuroraText></h2></div>
          <Link href="/shop/?tab=programs" className="btn-light">Compare programs<Icon name="arrow-right" size={15} /></Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <Link key={p.handle} href="/shop/?tab=programs" data-reveal className={`card relative p-7 hover:-translate-y-1 ${p.featured ? "shadow-glow" : ""}`}>
              {p.featured && <ShineBorder radius={28} />}
              <div className="text-[13px] font-semibold text-muted">{p.cadence}</div>
              <div className="mt-1 text-[24px] font-semibold tracking-tight">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1"><span className="text-[15px] text-muted">USD</span><span className="text-[44px] font-semibold tracking-tight"><NumberTicker value={p.price} /></span></div>
              <div className="mt-3 text-[14px] text-muted">{p.diagnostics[0]}</div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function FinalCTA() {
  const { ask } = useAI();
  return (
    <Section ai="Get started">
      <div className="container-x text-center">
        <h2 className="h-section mx-auto max-w-[16ch]"><DiaTextReveal text="Start with a conversation." /></h2>
        <p data-reveal className="lede mx-auto mt-4 max-w-[48ch]">Tell us what you want to improve — or take the 2-minute match quiz to see where to begin.</p>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact/" className="btn-dark h-12 px-6">Book a consultation</Link>
          <Link href="/shop/?tab=match" className="btn-light h-12 px-6"><Icon name="target" size={16} className="text-accent" />Find my match</Link>
          <button onClick={() => ask("Where should I start with Biongevity?")} className="btn-light h-12 px-6"><Icon name="bot" size={16} className="text-accent" />Ask Xevyo</button>
        </div>
      </div>
    </Section>
  );
}

/** Store teaser — tests + formulas live on /shop; the home page shows the match quiz entry and top picks. */
export function StoreTeaser() {
  const picks = [LAB_TESTS.find((t) => t.title === "Whole Genome Sequencing 30X")!, LAB_TESTS.find((t) => t.title === "BioGut")!, DRUG_PRODUCTS.find((d) => d.handle === "longevity-plus")!];
  return (
    <Section ai="Shop" id="store" className="scroll-mt-20">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>Shop · BioAro Labs × BioAro Drugs</Eyebrow><h2 className="h-section mt-3 max-w-[18ch]">Measure your biology. Then act on it.</h2></div>
          <Link href="/precision-health/bioaro-labs/" className="btn-light">Browse {LAB_TESTS.length} tests & {DRUG_PRODUCTS.length} formulas<Icon name="arrow-right" size={15} /></Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden rounded-[28px] bg-navy p-7 text-white shadow-lift sm:p-9">
            <div aria-hidden className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-teal-soft"><Icon name="target" size={15} />Find my match · 8 questions · 2 minutes</div>
              <div className="mt-3 text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">Which tests, formulas and program fit you?</div>
              <p className="mt-3 max-w-[46ch] text-[15px] text-white/70">Answer about your age, goals, symptoms, family history and lifestyle. Get a ranked match with charts — scored on your device.</p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[["7", "health domains scored"], [String(LAB_TESTS.length), "tests considered"], ["0", "data sent"]].map(([v, l]) => <div key={l} className="rounded-2xl bg-white/5 p-3"><div className="text-[24px] font-semibold">{v}</div><div className="text-[11px] text-white/60">{l}</div></div>)}
              </div>
              <ShimmerButton href="/shop/?tab=match" className="mt-7" light>Start the quiz<Icon name="arrow-right" size={15} /></ShimmerButton>
            </div>
          </div>
          <div className="grid content-start gap-3">
            {picks.map((p, i) => {
              const row = (
                <a href={p.url} target="_blank" rel="noopener" className="group flex items-center gap-4 rounded-3xl bg-white p-4 ring-1 ring-ink/[0.06] transition-transform hover:-translate-y-0.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-iri text-white"><Icon name={p.icon} size={22} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-teal">{p.vendor}</span><span className="block truncate text-[16px] font-semibold">{p.title}</span><span className="block truncate text-[13px] text-muted">{p.bestFor ?? p.summary}</span></span>
                  <span className="text-right"><span className="block text-[16px] font-semibold">${p.price}</span><span className="text-[12px] text-faint group-hover:text-accent">View ↗</span></span>
                </a>
              );
              return i === 0 ? <ElectricBorder key={p.handle} radius={24}>{row}</ElectricBorder> : <div key={p.handle}>{row}</div>;
            })}
            <p className="px-2 text-[12px] text-faint">Popular picks. Purchase happens on bioarolabs.com and bioarodrugs.com.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
