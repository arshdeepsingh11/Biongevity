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
      <PageHero eyebrow="About Biongevity" title={<>Longevity with <AuroraText>biology.</AuroraText></>} lede={ABOUT.intro} />
      <Section ai="Mission & vision" className="!pt-0">
        <div className="container-x grid gap-4 md:grid-cols-2">
          {[["Our mission", ABOUT.mission, "target"], ["Our vision", ABOUT.vision, "eye"]].map(([t, d, i]) => (
            <div key={t} data-reveal data-scan className="card p-8">
              <span className="grid h-12 w-12 place-items-center icon-tile"><Icon name={i} size={22} /></span>
              <div className="mt-6 text-[24px] font-semibold tracking-tight">{t}</div>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section ai="BioAro group" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_FACTS.map((f) => <div key={f.k} data-reveal className="card p-6"><div className="text-[13px] text-faint">{f.k}</div><div className="mt-2 text-[22px] font-semibold tracking-tight"><TextAnimate animation="blurIn">{f.v}</TextAnimate></div></div>)}
        </div>
      </Section>
      <Section ai="Founder" className="!pt-0">
        <div className="container-x">
          <div data-reveal className="card grid items-center gap-8 p-8 md:grid-cols-[auto_1fr]">
            <span className="grid h-28 w-28 place-items-center rounded-[32px] bg-accent-light"><LogoMark size={64} /></span>
            <div>
              <Eyebrow>Leadership</Eyebrow>
              <div className="mt-2 text-[26px] font-semibold tracking-tight">{FOUNDER.name}</div>
              <div className="text-[14px] text-muted">{FOUNDER.role}</div>
              <p className="mt-4 text-[17px] leading-relaxed text-ink/80">Biongevity is part of BioAro — a Calgary-based genomics and precision health group — with clinics and offices in Canada, the UAE and Europe.</p>
            </div>
          </div>
        </div>
      </Section>
      <Section ai="Reach" className="!pt-0">
        <div className="container-x text-center">
          <h2 className="h-section mx-auto max-w-[18ch]"><DiaTextReveal text="Three regions. One record." /></h2>
          <div className="mt-8 text-left"><WorldMap /></div>
        </div>
      </Section>
    </>
  );
}
