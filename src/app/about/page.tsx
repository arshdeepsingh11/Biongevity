import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { AuroraText } from "@/components/fx/AuroraText";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { WorldMap } from "@/components/fx/WorldMap";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { PageSummary } from "@/components/ai/PageSummary";
import { EcosystemOrbit, ProtocolLoop, DataStack } from "@/components/pages/AboutParts";
import { ABOUT } from "@/data/clinic";
import { FOUNDER } from "@/data/site";
import { BOOK_URL } from "@/lib/env";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Biongevity — who we are, what we do and how",
  description: "Biongevity is the longevity and precision-health brand of BioAro Inc. We help people add more good years: a measured baseline, a personal plan, ongoing monitoring and a care team — connected in one record and explained by Biongevity SI.",
  alternates: { canonical: "/about/" },
};

const QUESTIONS = [
  { q: "How is my healthspan changing?", d: "Domain scores and trends over time — not one opaque number.", icon: "trend" },
  { q: "Why is it changing?", d: "Labs, genome, wearables and visits read together.", icon: "network" },
  { q: "What can I change?", d: "The few steps most likely to matter for you, first.", icon: "target" },
  { q: "Did it work?", d: "Re-test and compare with your own baseline.", icon: "check" },
];

const PRINCIPLES = [
  { t: "AI explains. Clinicians decide.", d: "Biongevity SI turns data into plain words and priorities. It never diagnoses or prescribes on its own.", icon: "stethoscope" },
  { t: "Transparent by default", d: "Every score shows its parts, every formula its ingredients and amounts, every claim its evidence.", icon: "eye" },
  { t: "Your data stays yours", d: "One record you own and share by permission — with your clinician, your family, or no one.", icon: "lock" },
  { t: "Measured, not guessed", d: "We start from a baseline and re-test, so every change can be seen and judged.", icon: "chart" },
];

const SERVE = [
  { t: "People", d: "Who want to act before problems appear and keep the years ahead healthy and active.", icon: "user" },
  { t: "Families", d: "Who look after a parent or partner and want one clear, shared view.", icon: "users" },
  { t: "Clinicians", d: "Who want a longitudinal picture across labs and devices, with AI drafts they control.", icon: "stethoscope" },
  { t: "Clinics & communities", d: "Who run longevity care at scale on BioELR.", icon: "building" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[breadcrumb([["About", "/about/"]]), { "@context": "https://schema.org", "@type": "Organization", name: "Biongevity", parentOrganization: { "@type": "Organization", name: "BioAro Inc." }, url: "https://biongevity.com", description: ABOUT.intro, founder: { "@type": "Person", name: FOUNDER.name } }]} />

      {/* Hero */}
      <section data-ai="About Biongevity" className="relative z-[1] overflow-hidden pb-12 pt-[calc(108px+var(--safe-top))] sm:pt-[150px]">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[960px] max-w-[140vw] -translate-x-1/2 rounded-full bg-ai/15 blur-[120px]" />
        <div className="container-x relative text-center">
          <div className="flex justify-center"><AIBadge label="About Biongevity · part of BioAro" /></div>
          <h1 className="h-display mx-auto mt-6 max-w-[17ch]">We’re building <AuroraText>more good years.</AuroraText></h1>
          <p className="lede mx-auto mt-5 max-w-[60ch]">Longevity, for us, means healthspan — more years of good health, not just more years. We measure where you are, plan what to change, follow it over time and explain every step in plain words.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={BOOK_URL} target="_blank" rel="noopener" className="btn-dark h-12 px-6"><Icon name="calendar" size={17} />Book a consultation<Icon name="arrow-up-right" size={14} /></a>
            <Link href="/join/" className="btn-light h-12 px-6"><Icon name="user" size={16} />Join the app</Link>
          </div>
          <div className="mt-5 flex justify-center"><PageSummary /></div>
          {/* who / what / how jump strip */}
          <div className="mx-auto mt-12 grid max-w-[880px] gap-3 sm:grid-cols-3">
            {[["Who we are", "#who", "LogoMark"], ["What we do", "#what", "grid"], ["How we do it", "#how", "route"]].map(([t, h, i]) => (
              <a key={t} href={h} className="group flex items-center gap-3 rounded-[22px] bg-white/75 p-4 text-left ring-1 ring-ink/[0.06] backdrop-blur-xl transition hover:-translate-y-0.5 hover:ring-ai/30">
                <span className="icon-tile h-11 w-11">{i === "LogoMark" ? <LogoMark size={22} /> : <Icon name={i} size={20} />}</span>
                <span className="flex-1 text-[16px] font-semibold">{t}</span>
                <Icon name="arrow-right" size={16} className="text-ai transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <Section ai="Who we are" id="who" className="scroll-mt-20 !pt-4">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow>01 · Who we are</Eyebrow>
            <h2 className="h-section mt-3 max-w-[20ch]">Doctors, scientists and engineers with one goal.</h2>
            <p data-reveal className="lede mt-4">{ABOUT.intro}</p>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">Biongevity is the longevity brand of <b className="text-ink">BioAro Inc.</b>, a Calgary-based genomics and precision-health group. Our family brings clinics, CLIA-registered laboratories, transparent formulas, a member app and BioELR — the longevity-focused health record — together around one person: you.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[["Our mission", ABOUT.mission, "target"], ["Our vision", ABOUT.vision, "eye"]].map(([t, d, i]) => (
              <div key={t} data-reveal className="rounded-[26px] bg-white/80 p-6 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl">
                <span className="icon-tile h-11 w-11"><Icon name={i} size={20} /></span>
                <div className="mt-4 text-[19px] font-semibold tracking-tight">{t}</div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{d}</p>
              </div>
            ))}
            <div className="flex items-center gap-4 rounded-[26px] bg-white/80 p-5 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl sm:col-span-2">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-ai-soft"><LogoMark size={36} /></span>
              <div><div className="text-[17px] font-semibold">{FOUNDER.name}</div><div className="text-[13px] text-muted">{FOUNDER.role}</div></div>
            </div>
          </div>
        </div>
      </Section>

      {/* What we do */}
      <Section ai="What we do" id="what" className="scroll-mt-20 bg-canvas/50">
        <div className="container-x">
          <Head n="02" label="What we do" title={<>One record. <AuroraText>A whole family of care.</AuroraText></>} lede="Everything we offer connects to your healthspan record, so each test, visit and formula adds to the same picture. Tap any part to see what it does." />
          <div className="mt-10"><EcosystemOrbit /></div>
        </div>
      </Section>

      {/* How we do it */}
      <Section ai="How we do it" id="how" className="scroll-mt-20">
        <div className="container-x">
          <Head n="03" label="How we do it" title={<>Measure. Plan. Follow. <AuroraText>Repeat.</AuroraText></>} lede="Our protocol is a loop, not a one-off check-up. Every round starts from what was measured last time." />
          <div className="mt-10"><ProtocolLoop /></div>
        </div>
      </Section>

      {/* Four questions */}
      <Section ai="Four questions" className="bg-canvas/50">
        <div className="container-x">
          <Head n="04" label="What we answer" title={<>Four questions, <AuroraText>asked again and again.</AuroraText></>} lede="Everything we build keeps answering the same four questions for you — honestly, with ranges and uncertainty, never one magic score." />
          <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden className="absolute left-[12%] right-[12%] top-[38px] hidden h-[2px] bg-gradient-to-r from-ai/10 via-ai/50 to-ai/10 lg:block" />
            {QUESTIONS.map((x, k) => (
              <div key={x.q} data-reveal className="relative rounded-[26px] bg-white/80 p-5 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl">
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-ai text-on-ai shadow-lift"><Icon name={x.icon} size={20} /><span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white font-mono text-[11px] font-bold text-ai ring-1 ring-ai/30">{k + 1}</span></span>
                <div className="mt-4 text-[17px] font-semibold leading-snug">{x.q}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Data stack (3D) */}
      <Section ai="Your data over time">
        <div className="container-x">
          <Head n="05" label="What makes it different" title={<>Your data, <AuroraText>layered over time.</AuroraText></>} lede="A single test is a snapshot. Our strength is the record that builds with you — layer on layer, year after year." />
          <div className="mt-10"><DataStack /></div>
        </div>
      </Section>

      {/* Principles */}
      <Section ai="Our principles" className="bg-canvas/50">
        <div className="container-x">
          <Head n="06" label="How we work" title={<>Four promises <AuroraText>we keep.</AuroraText></>} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.t} data-reveal className="flex gap-4 rounded-[26px] bg-white/80 p-6 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl">
                <span className="icon-tile h-12 w-12 shrink-0"><Icon name={p.icon} size={21} /></span>
                <span><span className="block text-[18px] font-semibold">{p.t}</span><span className="mt-1 block text-[14.5px] leading-relaxed text-muted">{p.d}</span></span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Who we serve */}
      <Section ai="Who we serve">
        <div className="container-x">
          <Head n="07" label="Who we serve" title={<>Built for people — <AuroraText>and the people around them.</AuroraText></>} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVE.map((s) => (
              <div key={s.t} data-reveal className="rounded-[26px] bg-white/80 p-5 ring-1 ring-ink/[0.06] backdrop-blur-xl">
                <span className="icon-tile h-11 w-11"><Icon name={s.icon} size={20} /></span>
                <div className="mt-3 text-[17px] font-semibold">{s.t}</div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Where */}
      <Section ai="Where we are" className="bg-canvas/50">
        <div className="container-x text-center">
          <Eyebrow>08 · Where we are</Eyebrow>
          <h2 className="h-section mx-auto mt-3 max-w-[18ch]"><DiaTextReveal text="Three regions. One record." /></h2>
          <div className="mt-8 text-left"><WorldMap /></div>
        </div>
      </Section>

      {/* CTA */}
      <Section ai="Start with Biongevity">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[34px] bg-white/80 p-8 text-center shadow-lift ring-1 ring-ai/20 backdrop-blur-xl sm:p-12">
            <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ai/15 blur-3xl" />
            <div className="relative mx-auto w-fit"><XevyoOrb size={56} live halo /></div>
            <h2 className="h-section relative mx-auto mt-4 max-w-[20ch]">Start with your baseline.</h2>
            <p className="lede relative mx-auto mt-3 max-w-[52ch]">Book a consultation, join the app, or ask Biongevity SI where to begin.</p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <a href={BOOK_URL} target="_blank" rel="noopener" className="btn-dark h-12 px-6"><Icon name="calendar" size={17} />Book a consultation</a>
              <Link href="/join/" className="btn-light h-12 px-6">Join the app<Icon name="arrow-right" size={15} /></Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
