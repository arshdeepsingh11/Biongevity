import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { Head } from "@/components/home/HomeSections";
import { PlanStudio } from "@/components/shop/PlanStudio";
import { Catalogue } from "@/components/shop/Catalogue";
import { Ladder } from "@/components/shop/Ladder";
import { TrustStrip } from "@/components/shop/TrustStrip";
import { CATALOG } from "@/lib/catalog";
import { JsonLd, breadcrumb } from "@/lib/seo";
import { ShopConcierge, ShopKinds } from "@/components/shop/ShopConcierge";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Shop — longevity programs, health packages, lab tests & formulas",
  description: "Build your plan in one place: Biongevity longevity programs (3, 6 or 12 months), health packages, BioAro Labs tests and BioAro Drugs formulas. Prices in CAD.",
  alternates: { canonical: "/shop/" },
};

const STEPS = [
  { t: "Say your goal", d: "Type it or tap one — picks appear instantly." },
  { t: "Add to your plan", d: "One bag for tests, formulas and programs." },
  { t: "A clinician confirms", d: "Nothing ships before a care-team review." },
];

const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: "Biongevity store", itemListElement: CATALOG.slice(0, 30).map((i, k) => ({ "@type": "ListItem", position: k + 1, item: { "@type": "Product", name: i.title, description: i.summary, offers: { "@type": "Offer", price: i.price, priceCurrency: "CAD", url: `${SITE.url}/shop/` } } })) };

export default function ShopPage() {
  return (
    <>
      <JsonLd data={[breadcrumb([["Shop", "/shop/"]]), itemList]} />
      <section data-ai="Shop" className="relative z-[1] overflow-hidden pb-8 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
        <div aria-hidden className="grid-bg absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_20%,#000,transparent)]" />
        <div aria-hidden className="absolute left-1/2 top-20 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-ai/10 blur-[110px]" />
        <div className="container-x relative">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="hud-label">Shop · prices in CAD</div>
            <h1 className="h-display mt-4">Tell us the goal. <AuroraText>We’ll show what fits.</AuroraText></h1>
            <p className="lede mx-auto mt-4 max-w-[56ch]">Tests, formulas, health packages and longevity programs — matched to what you want to improve, explained by Biongevity SI and confirmed by a clinician.</p>
          </div>
          <div className="mx-auto mt-8 max-w-[1100px]"><ShopConcierge /></div>
          <ol className="mx-auto mt-6 grid max-w-[1100px] gap-2 text-[13px] sm:grid-cols-3">
            {STEPS.map((x, k) => (
              <li key={x.t} className="flex items-center gap-3 rounded-2xl bg-white/55 px-4 py-3 ring-1 ring-ink/[0.05] backdrop-blur">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ai text-[12px] font-bold text-on-ai">{k + 1}</span>
                <span><b className="block font-semibold">{x.t}</b><span className="text-muted">{x.d}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Section ai="Shop by kind" id="kinds" className="!pt-4">
        <div className="container-x">
          <Head n="01" label="Shop by kind" title={<>Four ways in, <AuroraText>one plan.</AuroraText></>} lede="Start small with one test, or go all in with a program. Tap a door to see just those." />
          <div className="mt-8"><ShopKinds /></div>
        </div>
      </Section>
      <Section ai="Plan Studio" id="studio" className="!pt-6 scroll-mt-20">
        <div className="container-x">
          <Head n="02" label="Plan Studio" title={<>Your goal, <AuroraText>assembled live.</AuroraText></>} lede="Tap goals or describe them, choose a depth and a budget. The board builds a plan from real tests, formulas, packages and programs — swap anything, then add it all in one tap." />
          <div className="mt-8"><PlanStudio /></div>
        </div>
      </Section>
      <Section ai="Choose your depth" id="depth" className="scroll-mt-20 bg-canvas/50">
        <div className="container-x">
          <Head n="03" label="Choose your depth" title={<>Test. Package. <AuroraText>Program.</AuroraText></>} lede="Three ways in, from one question to a full longevity program. Programs run 3, 6 or 12 months." />
          <div className="mt-8"><Ladder /></div>
        </div>
      </Section>
      <Section ai="Browse" id="browse" className="scroll-mt-20">
        <div className="container-x">
          <Head n="03" label="Browse everything" title={<>Everything, <AuroraText>one bag.</AuroraText></>} lede="Search across programs, packages, BioAro Labs tests and BioAro Drugs formulas. Open any item for details and what happens next." />
          <div className="mt-8"><Catalogue /></div>
        </div>
      </Section>
      <Section ai="After you buy" className="bg-canvas/50">
        <div className="container-x">
          <Head n="04" label="After you buy" title={<>Clear from <AuroraText>order to plan.</AuroraText></>} />
          <div className="mt-8"><TrustStrip /></div>
        </div>
      </Section>
    </>
  );
}
