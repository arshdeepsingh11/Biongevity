import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { AppShowcase, AppSignup } from "@/components/pages/AppDock";
import { MediaSlot } from "@/components/ui/MediaSlot";

export const metadata: Metadata = { title: "ELR App" };

export default function AppPage() {
  return (
    <>
      <PageHero eyebrow="ELR App" title="Stay connected to your health journey." lede="In-clinic and telemedicine consultations, remote monitoring with wearables and smart home devices, and personalized feedback from BioELR. Hover the dock to explore." />
      <Section ai="App dock" className="!pt-0"><div className="container-x"><AppShowcase /></div></Section>
      <Section ai="App preview" className="!pt-0"><div className="container-x"><MediaSlot id="appVideo" className="mx-auto aspect-[9/16] max-w-[340px] sm:aspect-video sm:max-w-none" /></div></Section>
      <Section ai="Get the app" className="!pt-0"><div className="container-x max-w-[640px] text-center"><h2 className="text-[30px] font-semibold tracking-tight">Be first to get the ELR App.</h2><div className="mt-6"><AppSignup /></div></div></Section>
    </>
  );
}
