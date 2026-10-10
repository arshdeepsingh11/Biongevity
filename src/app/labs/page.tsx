import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section, Eyebrow } from "@/components/ui/Section";
import { LabsExplorer } from "@/components/pages/LabsExplorer";
import { EvervaultCard } from "@/components/fx/EvervaultCard";
import { AskButton } from "@/components/pages/AskButton";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Icon } from "@/components/ui/Icon";
import { LAB_COLLECTIONS, LAB_INTELLIGENCE, LAB_STEPS, LAB_DIFFERENCE, LAB_TESTS } from "@/data/labs";
import { CONTACTS } from "@/data/site";

export const metadata: Metadata = { title: "BioAro Labs — Advanced Health Testing", description: "At-home DNA, microbiome, hormone and inflammation testing with clinician-reviewed results from CLIA-registered labs." };

export default function LabsPage() {
  return (
    <>
      <PageHero eyebrow="BioAro Labs · Live 2.0" title="Understand your biology before symptoms become decisions."
        lede="Advanced biomarker, microbiome, and genomic testing designed to turn complex biological data into clearer health insights. Scroll to rotate the test sphere; tap a test for details.">
        <div className="flex flex-wrap gap-3">
          <Link href="/labs/tests/" className="btn-dark">Explore {LAB_TESTS.length} tests<Icon name="arrow-right" size={15} /></Link>
          <AskButton q="Which BioAro Labs test should I consider first?">Ask BioAro Intelligence</AskButton>
        </div>
      </PageHero>

      <LabsExplorer />

      <Section ai="BioAro Intelligence">
        <div className="container-x">
          <Eyebrow>BioAro Intelligence</Eyebrow>
          <h2 data-reveal className="h-section mt-3 max-w-[20ch]">Results in isolation only tell part of the story.</h2>
          <p data-reveal className="lede mt-4 max-w-[60ch]">BioAro Intelligence connects your test results, reveals meaningful patterns, and helps guide what to explore next, today and over time.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {LAB_INTELLIGENCE.map((x) => (
              <div key={x.t} data-reveal data-scan className="card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white"><Icon name={x.icon} size={22} /></span>
                <div className="mt-6 text-[20px] font-semibold">{x.t}</div>
                <div className="mt-2 text-[15px] text-muted">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="Privacy & journey" className="!pt-0">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div data-reveal><EvervaultCard text="DNA" label="Secure health data" /></div>
          <div data-reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="h-section mt-3">Your testing journey.</h2>
            <p className="lede mt-3">Simple steps. Advanced insights. Personalized for you.</p>
            <div className="mt-8 space-y-3">
              {LAB_STEPS.map((s) => (
                <div key={s.n} data-scan className="flex gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/[0.04]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas text-[14px] font-semibold text-violet">{s.n}</span>
                  <div><div className="text-[16px] font-semibold">{s.t}</div><div className="text-[14px] text-muted">{s.d}</div></div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="https://bioarolabs.com/activate-kit" target="_blank" rel="noopener" className="btn-light">Activate your kit<Icon name="external" size={13} /></a>
              <Link href="/contact/?interest=Send%20a%20sample" className="btn-light">Send a sample</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section ai="Connected health view" className="!pt-0">
        <div className="container-x grid gap-6 lg:grid-cols-5">
          <div data-reveal className="lg:col-span-2">
            <Eyebrow>Connected health view</Eyebrow>
            <h2 className="h-section mt-3">One report. A clearer view of your health.</h2>
            <p className="lede mt-3">BioAro brings biomarkers, genomics, microbiome, and other health data together in one connected report.</p>
          </div>
          <MediaSlot id="labsVideo" className="aspect-video lg:col-span-3" />
        </div>
      </Section>

      <Section ai="BioAro vs typical lab" className="!pt-0">
        <div className="container-x">
          <h2 data-reveal className="h-section max-w-[20ch]">A different way to experience testing.</h2>
          <div className="card mt-8 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-black/[0.06] px-5 py-3 text-[12px] font-semibold uppercase tracking-wider text-faint"><span /><span className="w-24 text-center text-violet">BioAro</span><span className="w-24 text-center">Typical lab</span></div>
            {LAB_DIFFERENCE.map((r) => (
              <div key={r.t} data-scan className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-black/[0.04] px-5 py-4 last:border-0">
                <div><div className="text-[15px] font-semibold">{r.t}</div><div className="text-[13px] text-muted">{r.d}</div></div>
                <span className="grid w-24 place-items-center"><span className="grid h-7 w-7 place-items-center rounded-full bg-iri text-white"><Icon name="check" size={14} strokeWidth={2.4} /></span></span>
                <span className="grid w-24 place-items-center text-faint"><Icon name="minus" size={16} /></span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="Test categories" className="!pt-0">
        <div className="container-x">
          <h2 className="text-[28px] font-semibold tracking-tight">Shop by category</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LAB_COLLECTIONS.map((c) => (
              <Link key={c.handle} href={`/labs/tests/?c=${c.handle}`} data-scan className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/[0.04] hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-canvas group-hover:bg-iri group-hover:text-white"><Icon name={c.icon} size={20} /></span>
                <div className="min-w-0 flex-1"><div className="truncate text-[15px] font-semibold">{c.title}</div><div className="text-[12px] text-faint">{LAB_TESTS.filter((t) => t.category === c.handle).length} tests</div></div>
                <Icon name="chevron-right" size={16} className="text-faint" />
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-white p-5 text-[14px] ring-1 ring-black/[0.05]">
            <span className="font-semibold">BioAro Labs support</span>
            <a href={CONTACTS.labs.tel} className="flex items-center gap-1.5 text-muted hover:text-ink"><Icon name="call" size={16} />{CONTACTS.labs.phone}</a>
            <a href={`mailto:${CONTACTS.labs.email}`} className="flex items-center gap-1.5 text-muted hover:text-ink"><Icon name="mail" size={16} />{CONTACTS.labs.email}</a>
            <span className="flex items-center gap-1.5 text-muted"><Icon name="pin" size={16} />{CONTACTS.labs.address}</span>
          </div>
        </div>
      </Section>
    </>
  );
}
