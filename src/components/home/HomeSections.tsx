"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { WorldMap } from "@/components/fx/WorldMap";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Stories } from "@/components/media/Stories";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { useAI } from "@/components/ai/AIProvider";
import { CLINICS } from "@/data/clinic";

/** Section heading with a HUD index label. */
export function Head({ n, label, title, lede, center }: { n: string; label: string; title: ReactNode; lede?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-[760px] text-center" : "max-w-[760px]"}>
      <div className={`hud-label flex items-center gap-2 ${center ? "justify-center" : ""}`}><span className="text-faint">{n}</span><span className="h-px w-6 bg-accent/40" />{label}</div>
      <h2 className="h-section mt-3">{title}</h2>
      {lede && <p data-reveal className="lede mt-4">{lede}</p>}
    </div>
  );
}

export function BrandFilm() {
  return (
    <Section ai="Brand film">
      <div className="container-x">
        <Head n="06" label="Biongevity" title={<DiaTextReveal text="Redefining health with multiomics." />} lede="Genomics, microbiome, epigenetics and clinical data — turned into one personal longevity plan." />
        <FilmPlayer film="brandFilm" loop="brandLoop" label="Precision Health. Shared Longevity." className="mt-10 aspect-video" />
      </div>
    </Section>
  );
}

export function StoriesSection() {
  return (
    <Section ai="Stories" className="bg-canvas/60">
      <div className="container-x">
        <Head center n="07" label="Stories" title={<TextAnimate animation="slideUp">Real people. Real biology.</TextAnimate>} lede="From the clinic floor to an at-home test kit. Hover to preview, tap to watch." />
        <div className="mt-10"><Stories /></div>
      </div>
    </Section>
  );
}

export function GlobalClinic() {
  return (
    <Section ai="Global clinic">
      <div className="container-x">
        <Head n="08" label="Global clinic" title={<TextAnimate animation="blurIn">Your longevity clinic, anywhere in the world.</TextAnimate>} />
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside Biongevity Clinic Dubai" className="aspect-video lg:col-span-3" />
          <div className="grid gap-3 lg:col-span-2">
            {CLINICS.map((c) => (
              <Link key={c.id} href={`/clinic/${c.id}/`} className="card group flex items-start gap-4 p-5 hover:-translate-y-0.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-light text-accent group-hover:bg-iri group-hover:text-white"><Icon name={c.icon} size={22} weight="duotone" /></span>
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

export function FinalCTA() {
  const { ask } = useAI();
  return (
    <Section ai="Get started">
      <div className="container-x text-center">
        <h2 className="h-section mx-auto max-w-[16ch]"><DiaTextReveal text="Start with a conversation." /></h2>
        <p data-reveal className="lede mx-auto mt-4 max-w-[48ch]">Ask Xevyo anything, take the 2-minute match quiz, or book a consultation.</p>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact/" className="btn-dark h-12 px-6">Book a consultation</Link>
          <Link href="/shop/?tab=match" className="btn-light h-12 px-6"><Icon name="target" size={16} className="text-accent" />Find my match</Link>
          <button onClick={() => ask("Where should I start with Biongevity?")} className="btn-light h-12 px-6"><Icon name="sparkle" size={16} weight="duotone" className="text-accent" />Ask Xevyo</button>
        </div>
      </div>
    </Section>
  );
}
