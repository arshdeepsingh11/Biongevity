"use client";
import { BOOK_URL } from "@/lib/env";
import Link from "next/link";
import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ClinicGlobe } from "@/components/clinic3d/ClinicGlobe";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Stories } from "@/components/media/Stories";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { useAI } from "@/components/ai/AIProvider";
import { CLINICS } from "@/data/clinic";

/** The accent in a section title: the theme's AI signature (the olive gradient). */
export function Em({ children }: { children: ReactNode }) {
  return <span className="text-ai-grad">{children}</span>;
}

/** Section heading: index + label, a headline that rises line by line, a lede that follows. */
export function Head({ n, label, title, lede, center }: { n: string; label: string; title: ReactNode; lede?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-[800px] text-center" : "max-w-[800px]"}>
      <Reveal>
        <div className={`hud-label flex items-center gap-2.5 ${center ? "justify-center" : ""}`}><span className="text-faint tabular-nums">{n}</span><span className="h-px w-6 bg-ai-2/50" />{label}</div>
      </Reveal>
      <SplitReveal as="h2" className="h-section mt-4">{title}</SplitReveal>
      {lede && <Reveal delay={160}><p className="lede mt-5">{lede}</p></Reveal>}
    </div>
  );
}

export function BrandFilm() {
  return (
    <Section ai="Brand film">
      <div className="container-x">
        <Head n="10" label="Biongevity" title={<>Redefining health <Em>with multiomics.</Em></>} lede="Genomics, microbiome, epigenetics and clinical data — turned into one personal longevity plan." />
        <Reveal variant="scale" delay={120}><FilmPlayer film="brandFilm" loop="brandLoop" label="Precision Health. Shared Longevity." className="mt-10 aspect-video" /></Reveal>
      </div>
    </Section>
  );
}

export function StoriesSection() {
  return (
    <Section ai="Stories" className="bg-canvas/60">
      <div className="container-x">
        <Head center n="11" label="Stories" title={<>Real people. <Em>Real biology.</Em></>} lede="From the clinic floor to an at-home test kit. Hover to preview, tap to watch." />
        <div className="mt-10"><Stories /></div>
      </div>
    </Section>
  );
}

export function GlobalClinic() {
  return (
    <Section ai="Global clinic" id="clinics">
      <div className="container-x">
        <Head n="12" label="Global clinic" title={<>Your longevity clinic, <Em>anywhere in the world.</Em></>} />
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside Biongevity Clinic Dubai" className="aspect-video lg:col-span-3" />
          <div className="grid gap-3 lg:col-span-2">
            {CLINICS.map((c, i) => (
              <Reveal key={c.id} delay={i * 90}>
              <Link href={`/clinic/${c.id}/`} className="card group flex items-start gap-4 p-5 hover:-translate-y-0.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-light text-accent group-hover:bg-iri group-hover:text-white"><Icon name={c.icon} size={22} weight="duotone" /></span>
                <span className="flex-1"><span className="block text-[17px] font-semibold">{c.name}</span><span className="block text-[14px] text-muted">{c.tag}</span></span>
                <Icon name="arrow-right" size={16} className="mt-1 text-faint group-hover:text-accent" />
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-6"><ClinicGlobe /></div>
      </div>
    </Section>
  );
}

export function FinalCTA() {
  const { ask } = useAI();
  return (
    <Section ai="Get started">
      <div className="container-x text-center">
        <SplitReveal as="h2" className="h-display mx-auto max-w-[14ch] text-[clamp(2.5rem,7vw,5.5rem)]">Start with <Em>a conversation.</Em></SplitReveal>
        <Reveal delay={120}><p className="lede mx-auto mt-5 max-w-[48ch]">Ask Biongevity SI anything, build a plan in Plan Studio, or book a consultation.</p></Reveal>
        <Reveal delay={200}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Magnetic><a href={BOOK_URL} target="_blank" rel="noopener" className="btn-dark h-12 px-6">Book a consultation</a></Magnetic>
            <Magnetic><Link href="/shop/#studio" className="btn-light h-12 px-6"><Icon name="sparkle" size={16} weight="duotone" className="text-accent" />Plan Studio</Link></Magnetic>
            <Magnetic><button onClick={() => ask("Where should I start with Biongevity?")} className="btn-light h-12 px-6"><Icon name="sparkle" size={16} weight="duotone" className="text-accent" />Ask Biongevity SI</button></Magnetic>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
