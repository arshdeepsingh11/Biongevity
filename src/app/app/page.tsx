import type { Metadata } from "next";
import { PageHero, Section, Eyebrow } from "@/components/ui/Section";
import { AppShowcase, AppSignup } from "@/components/pages/AppDock";
import { AnimatedList } from "@/components/fx/AnimatedList";
import { AuroraText } from "@/components/fx/AuroraText";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { INSIGHTS } from "@/data/dashboard";

export const metadata: Metadata = { title: "Biongevity App" };

export default function AppPage() {
  return (
    <>
      <PageHero eyebrow="Biongevity App" title={<>Your all-in-one health <AuroraText>companion.</AuroraText></>}
        lede="AI-powered health monitoring, seamless appointment booking and your BioELR record — healthcare at your fingertips. Hover the dock to explore." />
      <Section ai="App features" className="!pt-0"><div className="container-x"><AppShowcase /></div></Section>
      <Section ai="BioELR in your pocket" className="!pt-0">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>BioELR</Eyebrow>
            <h2 className="h-section mt-3 max-w-[16ch]">Track your vitals with AI.</h2>
            <p data-reveal className="lede mt-4">Heart rate and blood pressure measured just by detecting your face through the camera. Personalized diet tips, live weather and the latest healthcare news — in one place.</p>
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
