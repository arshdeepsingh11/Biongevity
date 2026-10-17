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
          <p data-reveal className="lede mt-4 max-w-[62ch]">This is the Digital Twin overview — your scores, live signals, a model of your body and your trends on one screen. Tap any part to learn what it is for. The numbers here are examples.</p>
          <div className="mt-10"><AppTwin /></div>
        </div>
      </Section>
      <Section ai="How the app works" className="!pt-0">
        <div className="container-x">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="h-section mt-3 max-w-[20ch]">Connect. Understand. Act.</h2>
          <div className="mt-8"><AppHowItWorks /></div>
        </div>
      </Section>
      <Section ai="BioELR in your pocket" className="!pt-0">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>BioELR</Eyebrow>
            <h2 className="h-section mt-3 max-w-[16ch]">Track your vitals with AI.</h2>
            <p data-reveal className="lede mt-4">Heart rate, blood pressure, oxygen and sleep from your wearables and home devices — read by Biongevity SI against your own baseline, with personalised tips and your care team one tap away.</p>
            <div className="mt-8"><AppSignup /></div>
          </div>
          <div className="card space-y-5 p-6">
            <div className="flex items-center gap-5"><ProgressRing value={78} size={100} label="today" /><div><div className="text-[17px] font-semibold">Daily readiness</div><div className="text-[14px] text-muted">Illustrative · sleep, HRV and activity</div></div></div>
            <AnimatedList items={INSIGHTS} />
          </div>
        </div>
      </Section>
    </>
  );
}
