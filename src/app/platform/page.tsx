import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { Icon } from "@/components/ui/Icon";
import { AIPanel } from "@/components/ai/AIPanel";
import { AppButtons, LayerStack, TwinStates, WhyThis } from "@/components/platform/PlatformParts";
import { PLATFORM_QUESTIONS, DOMAIN_SCORES, ROADMAP, DEVICES, PORTALS } from "@/data/platform";
import { env } from "@/lib/env";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Healthspan platform & digital twin",
  description: "Biongevity's healthspan intelligence platform: a longevity digital twin, domain scores with a transparent Healthspan Index, a multilingual AI coach, and clinician and family views.",
  alternates: { canonical: "/platform/" },
};

export default function PlatformPage() {
  return (
    <>
      <JsonLd data={[breadcrumb([["Healthspan platform", "/platform/"]]), { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Biongevity app", applicationCategory: "HealthApplication", operatingSystem: "Web, iOS, Android", url: env.appUrl, publisher: { "@type": "Organization", name: "BioAro Inc." } }]} />
      <PageHero eyebrow="Healthspan platform" ai="Healthspan platform" title={<>Your healthspan, <span className="text-ai-grad">as a living model.</span></>}
        lede="Repeated labs, genomics, wearables and lifestyle — learned over time into a personal digital twin. Biongevity SI explains what changed and why; your clinician decides what to do. The twin lives in the Biongevity app.">
        <AppButtons />
      </PageHero>

      <Section ai="Four questions" className="!pt-0">
        <div className="container-x">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_QUESTIONS.map((q, i) => (
              <div key={q.q} className="card p-5">
                <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ai-soft text-ai"><Icon name={q.icon} size={19} weight="duotone" /></span><span className="font-mono text-[11px] text-faint">0{i + 1}</span></div>
                <div className="mt-4 text-[17px] font-semibold leading-snug">{q.q}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{q.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="Seven layers" className="bg-canvas/50">
        <div className="container-x">
          <Head n="01" label="Architecture" title="Seven layers, one picture of you." lede="From raw data to a decision you can understand. Hover a layer; ask Biongevity SI for an example." />
          <div className="mt-10"><LayerStack /></div>
        </div>
      </Section>

      <Section ai="Digital twin">
        <div className="container-x">
          <Head n="02" label="Digital twin" title="Six states. Your own baseline." lede="A change from your own normal can matter more than a value inside a broad population range. The twin tracks direction, speed and confidence for each domain." />
          <div className="mt-10"><TwinStates /></div>
          <div className="mt-8 flex justify-center"><a href="/twin/" className="btn-ai h-12 px-6"><Icon name="fingerprint" size={18} />Take the 3D Digital Twin tour</a></div>
        </div>
      </Section>

      <Section ai="Scores and recommendations" className="bg-canvas/50">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Head n="03" label="Scores" title="No single black-box score." lede="Domain scores and a transparent Healthspan Index — every component visible, always with uncertainty." />
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DOMAIN_SCORES.map((d) => (
                <div key={d.t} className="rounded-2xl bg-white p-3 ring-1 ring-ink/[0.06]">
                  <Icon name={d.icon} size={18} weight="duotone" className="text-accent" />
                  <div className="mt-2 text-[13.5px] font-semibold leading-tight">{d.t}</div>
                  <div className="mt-0.5 text-[11.5px] leading-snug text-muted">{d.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pt-24"><WhyThis /></div>
        </div>
      </Section>

      <Section ai="Portals and devices">
        <div className="container-x">
          <Head n="04" label="Who it's for" title="You, your clinician, your family." lede="Family members see only the domains you allow. Clinicians can accept, edit or dismiss every AI insight." />
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {PORTALS.map((p) => (
              <a key={p.id} href={env.appUrl} className="card group flex items-start gap-4 p-5 hover:-translate-y-0.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center icon-tile"><Icon name={p.icon} size={21} weight="duotone" /></span>
                <span className="flex-1"><span className="block text-[17px] font-semibold">{p.t}</span><span className="block text-[13.5px] text-muted">{p.d}</span></span>
                <Icon name="arrow-up-right" size={16} className="mt-1 text-faint group-hover:text-accent" />
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">Connects with</span>
            {DEVICES.map((d) => <span key={d} className="rounded-full bg-white px-3 py-1.5 text-[13px] ring-1 ring-ink/[0.07]">{d}</span>)}
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {ROADMAP.map((r) => <div key={r.k} className="rounded-2xl bg-canvas p-5"><div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{r.k}</div><p className="mt-2 text-[14px] leading-relaxed text-muted">{r.d}</p></div>)}
          </div>
        </div>
      </Section>

      <Section ai="Ask about the platform" className="bg-canvas/50" chip={false}>
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="h-section">Questions about your twin?</h2>
            <p className="lede mt-4">Xevyo answers from this page and our other pages, with sources. Then open the app to see your own data.</p>
            <div className="mt-6"><AppButtons /></div>
          </div>
          <AIPanel title="Ask about the platform" context="Healthspan platform and digital twin" prompts={["What is my digital twin?", "How is the Healthspan Index calculated?", "Can my family see my results?"]} />
        </div>
      </Section>
    </>
  );
}
