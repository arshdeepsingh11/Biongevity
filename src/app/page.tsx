import { Hero } from "@/components/home/premium/Hero";
import { ServicesGrid, HowItWorks, Features, Programs, StoriesBlock, Locations, Trust, Technology, Faq, HOME_FAQ, WhatsAppStrip } from "@/components/home/premium/Sections";
import { Section } from "@/components/ui/Section";
import { TeamSection } from "@/components/trust/TeamSection";
import { AskBand } from "@/components/home/premium/AskBand";
import { BookBand, BookRow } from "@/components/ui/BookNow";
import { JsonLd, faqPage } from "@/lib/seo";

/**
 * Home — service-first, like a premium clinic: what we offer, how it works, programs, stories, clinics, trust, FAQ.
 * Every section ends in Book now; the fixed WhatsApp button is on every page. The interactive tools live at /explore/.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPage(HOME_FAQ)} />
      <Hero />
      <ServicesGrid />
      <HowItWorks />
      <Features />
      <Programs />
      <StoriesBlock />
      <Locations />
      <Trust />
      <Section ai="Doctors" chip={false} className="!pt-0"><div className="container-x"><TeamSection title="Doctors who read the whole picture." lede="Specialist physicians, a coordinator who keeps your record together, and an AI guide between visits." /><BookRow className="mt-8" text="Hi Biongevity, I would like to book a consultation with your team." /></div></Section>
      <Technology />
      <Faq />
      <div className="relative z-[1] space-y-6 py-4"><AskBand /><WhatsAppStrip /></div>
      <BookBand title="Ready to start?" lede="Book your first consultation online — virtual or in person — or message us on WhatsApp and we'll help you choose." />
    </>
  );
}
