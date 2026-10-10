import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Globe } from "@/components/fx/Globe";
import { AuroraText } from "@/components/fx/AuroraText";
import { Icon } from "@/components/ui/Icon";
import { CLINICS, OFFICES } from "@/data/clinic";

export const metadata: Metadata = { title: "Global Clinic" };

export default function ClinicPage() {
  return (
    <>
      <PageHero eyebrow="Global Clinic" title={<>Your longevity clinic, <AuroraText>anywhere.</AuroraText></>}
        lede="In person in Dubai, virtually wherever you are, and guided end to end by the Longevity Journey." />
      <Section ai="Clinic film" className="!pt-0"><div className="container-x"><FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside Biongevity Clinic Dubai" className="aspect-video" /></div></Section>
      <Section ai="Clinic experiences" className="!pt-0">
        <div className="container-x grid gap-4 md:grid-cols-3">
          {CLINICS.map((c) => (
            <Link key={c.id} href={`/clinic/${c.id}/`} data-reveal data-scan className="card group flex flex-col p-7 hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-light text-accent group-hover:bg-iri group-hover:text-white"><Icon name={c.icon} size={22} /></span>
              <div className="mt-6 text-[22px] font-semibold tracking-tight">{c.name}</div>
              <div className="mt-1 text-[14px] text-accent">{c.tag}</div>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{c.summary}</p>
              <div className="flex-1" />
              <div className="mt-5 flex items-center gap-1 text-[14px] font-semibold text-accent">Explore<Icon name="arrow-right" size={14} /></div>
            </Link>
          ))}
        </div>
      </Section>
      <Section ai="Offices" className="!pt-0">
        <div className="container-x grid items-center gap-8 md:grid-cols-[minmax(0,400px)_1fr]">
          <div className="mx-auto w-full max-w-[400px]"><Globe markers={OFFICES.map((o) => ({ location: o.loc, size: 0.09 }))} /></div>
          <div className="space-y-3">
            {OFFICES.map((o) => (
              <div key={o.city} className="card p-6"><div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{o.region}</div><div className="mt-1 text-[22px] font-semibold">{o.city}</div><div className="mt-1 text-[14px] text-muted">{o.address}</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[14px] font-semibold"><a href={o.tel} className="hover:text-accent">{o.phone}</a>{o.email && <a href={`mailto:${o.email}`} className="hover:text-accent">{o.email}</a>}</div></div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
