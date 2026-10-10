import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { PlanetSystem } from "@/components/fx/PlanetSystem";
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
            <p data-reveal className="mt-3 text-[13px] text-faint">Move your cursor or finger to shift the light.</p>
          </div>
          <PlanetSystem moons={["Resorts", "Home", "Offices", "Cities", "Schools"]} />
        </div>
      </section>
      <Section ai="Spaces" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LIFE_PLACES.map((l) => (
            <div key={l.t} data-reveal data-scan className="card flex flex-col p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-light text-accent"><Icon name={l.icon} size={20} /></span>
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
            <a href="https://biongevity.com/join-waitlist/" target="_blank" rel="noopener" className="btn-dark">Join the virtual clinic waitlist<Icon name="arrow-up-right" size={14} /></a>
            <Link href="/clinic/virtual/" className="btn-light">About the Virtual Clinic</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
