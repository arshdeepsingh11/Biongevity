import type { Metadata } from "next";
import { PageHero, Section, Eyebrow } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { Icon } from "@/components/ui/Icon";
import { AIBadge } from "@/components/ai/AIBadge";
import { AIPanel } from "@/components/ai/AIPanel";
import { PageSummary } from "@/components/ai/PageSummary";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AppShowcase, AppSignup } from "@/components/pages/AppDock";
import { AppTwin } from "@/components/pages/AppTwin";
import { TwinTour } from "@/components/twin/TwinTour";
import { TwinWhatIf } from "@/components/twin/TwinWhatIf";
import { AuroraText } from "@/components/fx/AuroraText";
import { APP_MAP, TWIN_GLOSSARY, TWIN_PATH } from "@/data/twin";
import { DEVICES } from "@/data/platform";
import { env } from "@/lib/env";
import { JsonLd, breadcrumb, faqPage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Biongevity App & Digital Twin",
  description: "The Biongevity app and your Digital Twin in one place: Health and Recovery scores, live monitor, a model of your body, trends, what-if simulations, the AI coach and your BioELR record — explained in plain words.",
  alternates: { canonical: "/app/" },
};

const FLOW = [
  { t: "Your data", d: "Labs, wearables, genome, visits", icon: "layers" },
  { t: "Your baseline", d: "What normal looks like for you", icon: "fingerprint" },
  { t: "Biongevity SI", d: "Spots changes and explains them", icon: "sparkle" },
  { t: "You & your clinician", d: "Decide the next small step", icon: "users" },
];

/** One page for the Biongevity app and the Digital Twin inside it (the twin is the app's main screen). */
export default function AppPage() {
  const url = `${env.appUrl}${TWIN_PATH}`;
  return (
    <>
      <JsonLd data={[breadcrumb([["Biongevity App & Digital Twin", "/app/"]]), faqPage(TWIN_GLOSSARY.map((g) => ({ q: `What is ${g.t}?`, a: g.d })))]} />
      <PageHero eyebrow="Biongevity App · Digital Twin" ai="Biongevity App" summary={false} title={<>Your health, <AuroraText>as a living twin.</AuroraText></>}
        lede="The Biongevity app is where your Digital Twin lives: scores, live signals, a model of your body, trends, what-if simulations, your AI coach, bookings and your BioELR record. Here is what you'll see — and how it works.">
        <div className="flex flex-wrap items-center gap-3">
          <a href={url} target="_blank" rel="noopener" className="btn-ai h-12 px-6"><Icon name="fingerprint" size={18} />Open my Digital Twin<Icon name="arrow-up-right" size={14} /></a>
          <PageSummary className="h-12" />
          <span className="flex gap-2"><AIBadge label="Explained by Biongevity SI" /></span>
        </div>
      </PageHero>

      <Section ai="App features" className="!pt-0"><div className="container-x"><AppShowcase /></div></Section>

      <Section ai="Inside the app" id="twin" className="scroll-mt-20">
        <div className="container-x">
          <Eyebrow>Inside the app · Digital Twin</Eyebrow>
          <h2 className="h-section mt-3 max-w-[20ch]">What you’ll see when you open it.</h2>
          <p data-reveal className="lede mt-4 max-w-[62ch]">The Digital Twin overview — your scores, live signals, a model of your body and your trends on one screen. Tap any part to learn what it is for. The numbers here are examples.</p>
          <div className="mt-10"><AppTwin /></div>
        </div>
      </Section>

      <Section ai="Digital Twin tour" id="tour" className="!pt-0 scroll-mt-20">
        <div className="container-x">
          <Head n="01" label="Guided tour" title={<>Six stops, <AuroraText>one clear picture.</AuroraText></>} lede="Follow the tour through the twin — scores, live health, your body, trends, what-if and the AI coach." />
          <div className="mt-8"><TwinTour /></div>
        </div>
      </Section>

      <Section ai="Twin heat map" id="whatif" className="scroll-mt-20">
        <div className="container-x">
          <Head n="02" label="Heat map simulator" title={<>What if you changed <span className="text-ai-grad">one thing?</span></>} lede="The website version of the app's Heat Map Simulator. Move sleep, steps or blood pressure and watch each organ glow hotter or calmer — with healthy years and risk updating live from published studies." />
          <div className="mt-10"><TwinWhatIf /></div>
        </div>
      </Section>

      <Section ai="How the app works" className="bg-canvas/50">
        <div className="container-x">
          <Head n="03" label="How it works" title="From your data to one clear next step." lede="The twin learns your own normal over weeks. When something moves, Biongevity SI explains it in plain words and your clinician decides what to do." />
          <div className="relative mt-10 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div aria-hidden className="absolute left-[12%] right-[12%] top-[44px] hidden h-[2px] bg-ai bg-ai-grad opacity-40 md:block" />
            {FLOW.map((f, i) => (
              <div key={f.t} className="relative flex flex-col items-center text-center">
                {i === 2 ? <span className="grid h-[88px] w-[88px] place-items-center rounded-[28px] bg-white shadow-lift ai-ring"><XevyoOrb size={58} live halo /></span> : <span className="icon-tile h-[88px] w-[88px]"><Icon name={f.icon} size={34} /></span>}
                <div className="mt-4 text-[17px] font-semibold">{f.t}</div><div className="text-[13.5px] text-muted">{f.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">{DEVICES.map((d) => <span key={d} className="rounded-full bg-white px-3 py-1.5 text-[13px] ring-1 ring-ink/[0.07]">{d}</span>)}</div>
        </div>
      </Section>

      <Section ai="App map">
        <div className="container-x">
          <Head n="04" label="Find your way" title="Where everything lives in the app." lede="The top bar takes you around the app; the twin's sidebar opens each view." />
          <div className="mt-8 overflow-hidden rounded-[30px] bg-white ring-1 ring-ink/[0.07]">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-ink/[0.06] p-3">{APP_MAP.top.map((t) => <span key={t} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${t === "Digital Twin" ? "bg-ai text-on-ai" : "bg-canvas text-muted"}`}>{t}</span>)}</div>
            <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {APP_MAP.side.map((s, i) => <div key={s.t} className="rounded-2xl bg-canvas p-4"><div className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</div><div className="text-[15px] font-semibold">{s.t}</div><div className="text-[12.5px] text-muted">{s.d}</div></div>)}
            </div>
          </div>
        </div>
      </Section>

      <Section ai="Twin glossary" className="bg-canvas/50">
        <div className="container-x grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Head n="05" label="Plain words" title="What the numbers mean." />
            <div className="mt-6 grid gap-2">{TWIN_GLOSSARY.map((g) => <details key={g.t} className="group rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06]"><summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">{g.t}<Icon name="chevron-down" size={16} className="text-faint transition-transform group-open:rotate-180" /></summary><p className="mt-2 text-[14px] leading-relaxed text-muted">{g.d}</p></details>)}</div>
          </div>
          <div className="lg:pt-16">
            <AIPanel title="Ask about the app and your twin" context="Biongevity App and Digital Twin" prompts={["Why is my Health Score low?", "What is a good HRV for my age?", "How does the twin learn my baseline?"]} />
            <a href={url} target="_blank" rel="noopener" className="btn-ai mt-4 h-12 w-full px-6"><Icon name="fingerprint" size={18} />Open my Digital Twin<Icon name="arrow-up-right" size={14} /></a>
            <p className="mt-2 text-center text-[11.5px] text-faint">Opens {url.replace(/^https?:\/\//, "")} · sign-in happens in the app. Values on this page are examples.</p>
          </div>
        </div>
      </Section>

      <Section ai="Get the app">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Get the app</Eyebrow>
            <h2 className="h-section mt-3 max-w-[18ch]">Be first when it reaches your phone.</h2>
            <p data-reveal className="lede mt-4">Leave your email and we&apos;ll tell you when the Biongevity app is ready for your device. Members can already open their twin at {env.appUrl.replace(/^https?:\/\//, "")}.</p>
          </div>
          <div className="card p-6"><AppSignup /></div>
        </div>
      </Section>
    </>
  );
}
