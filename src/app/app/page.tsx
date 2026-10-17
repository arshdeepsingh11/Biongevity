import type { Metadata } from "next";
import { PageHero, Section, Eyebrow } from "@/components/ui/Section";
import { AppShowcase, AppSignup } from "@/components/pages/AppDock";
import { AppTwin, AppHowItWorks } from "@/components/pages/AppTwin";
import { AnimatedList } from "@/components/fx/AnimatedList";
import { AuroraText } from "@/components/fx/AuroraText";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { INSIGHTS } from "@/data/dashboard";

export const metadata: Metadata = { title: "Biongevity App" };

export default function AppPage() {
  return (
    <>
      <PageHero eyebrow="Biongevity App" title={<>Your all-in-one health <AuroraText>companion.</AuroraText></>}
        lede="AI-powered health monitoring, seamless appointment booking and your BioELR record — healthcare at your fingertips. Tap an icon to explore, then look inside the app below." />
      <Section ai="App features" className="!pt-0"><div className="container-x"><AppShowcase /></div></Section>
      <Section ai="Inside the app" id="inside">
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
