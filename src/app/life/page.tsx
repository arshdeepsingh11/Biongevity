import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { OrbitingCircles } from "@/components/fx/OrbitingCircles";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { Icon } from "@/components/ui/Icon";
import { LIFE_PLACES } from "@/data/health";
import Link from "next/link";

export const metadata: Metadata = { title: "Biongevity Life" };

export default function LifePage() {
  return (
    <>
      <section data-ai="Biongevity Life" className="relative z-[1] overflow-hidden pb-10 pt-[calc(96px+var(--safe-top))] sm:pt-[120px]">
        <div className="container-x grid items-center gap-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Biongevity Life</Eyebrow>
            <h1 className="h-display mt-4"><TextAnimate animation="blurIn">Longevity, where life happens.</TextAnimate></h1>
            <p data-reveal className="lede mt-5">Longevity isn&apos;t a luxury — it&apos;s an investment in yourself. We deliver care in the spaces that matter most: resorts, communities, offices, cities and schools.</p>
                      </div>
          <div className="grid place-items-center"><OrbitingCircles radius={140} duration={36} items={LIFE_PLACES.map((l) => <span key={l.t} className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold shadow-card ring-1 ring-ink/[0.06]"><Icon name={l.icon} size={16} weight="duotone" className="text-accent" />{l.t}</span>)}><div className="grid h-28 w-28 place-items-center rounded-full bg-iri text-center text-white shadow-glow"><div><Icon name="hourglass" size={26} weight="duotone" className="mx-auto" /><div className="mt-1 text-[12px] font-semibold">Biongevity Life</div></div></div></OrbitingCircles></div>
        </div>
      </section>
      <Section ai="Spaces" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LIFE_PLACES.map((l) => (
            <div key={l.t} data-reveal data-scan className="card flex flex-col p-6">
              <span className="grid h-11 w-11 place-items-center icon-tile"><Icon name={l.icon} size={24} weight="duotone" /></span>
              <div className="mt-5 text-[20px] font-semibold">{l.t}</div>
              <div className="mt-2 text-[14px] text-muted">{l.d}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section ai="Join the waitlist" className="!pt-0">
        <div className="container-x text-center">
          <h2 className="h-section mx-auto max-w-[20ch]"><DiaTextReveal text="Add life to your years." /></h2>
          <p data-reveal className="lede mx-auto mt-4 max-w-[52ch]">Whether you&apos;re at home, on vacation, at work or raising a family — we&apos;re here to help you live your healthiest, longest life.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/contact/?interest=waitlist" className="btn-dark">Join the virtual clinic waitlist<Icon name="arrow-up-right" size={14} /></a>
            <Link href="/clinic/virtual/" className="btn-light">About the Virtual Clinic</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
