"use client";
import { useState } from "react";
import Link from "next/link";
import { BeamFlow } from "@/components/fx/BeamFlow";
import { MorphingText } from "@/components/fx/MorphingText";
import { KeywordStream } from "@/components/fx/KeywordStream";
import { Text3DFlip } from "@/components/fx/Text3DFlip";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { AuroraText } from "@/components/fx/AuroraText";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { SignalConvergence } from "@/components/fx/SignalConvergence";
import { FocusedMarquee } from "@/components/fx/FocusedMarquee";
import { AnimatedList } from "@/components/fx/AnimatedList";
import { Terminal } from "@/components/fx/Terminal";
import { Globe } from "@/components/fx/Globe";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { DecodeText } from "@/components/fx/DecodeText";
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
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(59,130,246,.16),transparent_60%),radial-gradient(50%_45%_at_85%_20%,rgba(6,182,212,.14),transparent_60%),radial-gradient(40%_40%_at_60%_95%,rgba(245,158,11,.08),transparent_60%)]" />
      <div aria-hidden className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
      <div className="absolute inset-0 opacity-50"><BeamFlow /></div>
      <div className="container-x relative py-16 text-center">
        <div data-reveal className="glass mx-auto inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-[13px] shadow-card">
          <span className="rounded-full bg-iri px-2.5 py-0.5 text-[11px] font-bold text-white">BioELR AI</span>
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
          <Link href="/#store" className="btn-dark h-12 px-6 text-[16px]"><Icon name="cpu" size={17} />Run AI match</Link>
          <button onClick={() => setOpen(true)} className="btn glass relative h-12 overflow-hidden px-6 text-[16px] shadow-card">
            <ShineBorder radius={999} /><Icon name="sparkle" size={17} className="text-accent" />Ask Biongevity AI
          </button>
        </div>
        <div data-reveal className="mx-auto mt-14 grid max-w-[820px] grid-cols-2 gap-3 sm:grid-cols-4">
          {([[LAB_TESTS.length, "lab tests", "/#store"], [DRUG_PRODUCTS.length, "bioactive formulas", "/#store"], [DEPARTMENTS.length, "precision disciplines", "/precision-health/"], [OFFICES.length, "global offices", "/clinic/"]] as const).map(([n, l, h]) => (
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
  const [idx, setIdx] = useState(0);
  return (
    <Section ai="360° view" className="bg-canvas/60">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>A 360° view of your health</Eyebrow>
          <h2 className="h-section mt-3"><Text3DFlip text="Five data streams." /><br /><span className="text-muted">One </span><AuroraText>intelligence.</AuroraText></h2>
          <div data-reveal className="mt-8 space-y-2">
            {PILLARS.map((p, i) => (
              <button key={p.t} onClick={() => setIdx(i)} onMouseEnter={() => setIdx(i)} aria-pressed={idx === i}
                className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${idx === i ? "card" : "hover:bg-white/60"}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${idx === i ? "bg-iri text-white" : "bg-white text-faint ring-1 ring-ink/5"}`}><Icon name={p.icon} size={21} /></span>
                <span><span className="block text-[17px] font-semibold">{p.t}</span>
                  {idx === i && <span className="mt-1 block text-[14px] leading-relaxed text-muted">{p.d}</span>}</span>
              </button>
            ))}
          </div>
        </div>
        <div data-reveal>
          <SignalConvergence items={PILLARS.map((p) => p.t)} active={idx} />
          <p className="text-center text-[12px] text-faint">Live diagram · data sources converging in BioELR</p>
        </div>
      </div>
    </Section>
  );
}

export function Disciplines() {
  return (
    <Section ai="Precision Health" className="overflow-hidden">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <div><Eyebrow>Precision Health</Eyebrow><h2 className="h-section mt-3"><Text3DFlip text="Nine disciplines." /> <span className="text-muted">One record.</span></h2></div>
        <Link href="/precision-health/" className="btn-light">All departments<Icon name="arrow-right" size={15} /></Link>
      </div>
      <FocusedMarquee items={DEPARTMENTS.map((d) => ({ icon: d.icon, label: d.short, href: `/precision-health/${d.id}/` }))} />
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
        <div className="relative overflow-hidden rounded-5xl border border-ink/[0.06] bg-gradient-to-br from-accent-light via-white to-[#ECFEFF] p-6 sm:p-12">
          <ShineBorder radius={32} width={1} />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow>BioELR · Electronic Longevity Record</Eyebrow>
              <h2 className="mt-3 text-[34px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[46px]"><DiaTextReveal text="Continuous analysis, personal feedback." /></h2>
              <p data-reveal className="mt-4 text-[17px] leading-relaxed text-muted">Genomic sequencing, epigenetic analysis, metabolic profiling and gut microbiome data, combined with the Biongevity App and your wearables — with AI and clinicians assisting you before issues arise.</p>
              <div className="mt-8"><AnimatedList items={FEED} /></div>
              <p className="mt-4 text-[12px] text-faint">Feed, terminal and score are illustrative demonstrations, not live member data.</p>
            </div>
            <div data-reveal className="space-y-5 self-center">
              <div className="card flex items-center gap-5 p-5"><ProgressRing value={82} size={110} label="Longevity Score™" /><div><div className="text-[17px] font-semibold">Longevity Score™</div><div className="mt-1 text-[14px] text-muted">Biological vs chronological age proxy, updated as your data streams in.</div></div></div>
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
        <div className="mt-6 grid items-center gap-6 md:grid-cols-[minmax(0,360px)_1fr]">
          <div className="mx-auto w-full max-w-[360px]"><Globe markers={OFFICES.map((o) => ({ location: o.loc, size: 0.08 }))} /></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {OFFICES.map((o) => (
              <div key={o.city} className="card p-5"><div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{o.region}</div><div className="mt-1 text-[20px] font-semibold">{o.city}</div><div className="mt-2 text-[13px] leading-relaxed text-muted">{o.address}</div><a href={o.tel} className="mt-2 block text-[13px] font-semibold hover:text-accent">{o.phone}</a></div>
            ))}
          </div>
        </div>
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
          <Link href="/packages/" className="btn-light">Compare programs<Icon name="arrow-right" size={15} /></Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <Link key={p.handle} href="/packages/" data-reveal className={`card relative p-7 hover:-translate-y-1 ${p.featured ? "shadow-glow" : ""}`}>
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
        <p data-reveal className="lede mx-auto mt-4 max-w-[48ch]">Tell us what you want to improve. Biongevity AI suggests where to begin.</p>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact/" className="btn-dark h-12 px-6">Book a consultation</Link>
          <button onClick={() => ask("Where should I start with Biongevity?")} className="btn-light h-12 px-6"><Icon name="sparkle" size={16} className="text-accent" />Where should I start?</button>
        </div>
      </div>
    </Section>
  );
}
