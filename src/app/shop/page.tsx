import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { AuroraText } from "@/components/fx/AuroraText";
import { Icon } from "@/components/ui/Icon";
import { Head } from "@/components/home/HomeSections";
import { PlanStudio } from "@/components/shop/PlanStudio";
import { Catalogue } from "@/components/shop/Catalogue";
import { Ladder } from "@/components/shop/Ladder";
import { TrustStrip } from "@/components/shop/TrustStrip";
import { CATALOG } from "@/lib/catalog";
import { JsonLd, breadcrumb } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Shop — longevity programs, health packages, lab tests & formulas",
  description: "Build your plan in one place: Biongevity longevity programs (3, 6 or 12 months), health packages, BioAro Labs tests and BioAro Drugs formulas. Prices in CAD.",
  alternates: { canonical: "/shop/" },
};

const DOORS = [
  { href: "#studio", icon: "sparkle", t: "I have a goal", d: "Plan Studio assembles a plan around it, live." },
  { href: "#depth", icon: "crown", t: "I want a complete plan", d: "Compare tests, packages and programs side by side." },
  { href: "#browse", icon: "search", t: "I know what I need", d: `Search all ${CATALOG.length} items and add in one tap.` },
];

const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: "Biongevity store", itemListElement: CATALOG.slice(0, 30).map((i, k) => ({ "@type": "ListItem", position: k + 1, item: { "@type": "Product", name: i.title, description: i.summary, offers: { "@type": "Offer", price: i.price, priceCurrency: "CAD", url: `${SITE.url}/shop/` } } })) };

export default function ShopPage() {
  return (
    <>
      <JsonLd data={[breadcrumb([["Shop", "/shop/"]]), itemList]} />
      <section data-ai="Shop" className="relative z-[1] overflow-hidden pb-10 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
        <div aria-hidden className="grid-bg absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_20%,#000,transparent)]" />
        <div className="container-x relative">
          <div className="hud-label">Shop · CAD</div>
          <h1 className="h-display mt-4 max-w-[16ch]">Build your plan, <AuroraText>not a cart.</AuroraText></h1>
          <p className="lede mt-5 max-w-[60ch]">Programs, health packages, BioAro tests and formulas in one place — assembled around your goal, explained by AI and confirmed by our care team.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {DOORS.map((d) => (
              <a key={d.href} href={d.href} className="hud group flex items-center gap-4 rounded-[24px] bg-white/85 p-5 shadow-card ring-1 ring-ink/[0.06] backdrop-blur transition-transform hover:-translate-y-0.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center icon-tile"><Icon name={d.icon} size={24} weight="duotone" /></span>
                <span className="flex-1"><span className="block text-[17px] font-semibold">{d.t}</span><span className="block text-[13px] text-muted">{d.d}</span></span>
                <Icon name="arrow-right" size={18} className="text-accent transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </section>
      <Section ai="Plan Studio" id="studio" className="!pt-6 scroll-mt-20">
        <div className="container-x">
          <Head n="01" label="Plan Studio" title={<>Your goal, <AuroraText>assembled live.</AuroraText></>} lede="Tap goals or describe them, choose a depth and a budget. The board builds a plan from real tests, formulas, packages and programs — swap anything, then add it all in one tap." />
          <div className="mt-8"><PlanStudio /></div>
        </div>
      </Section>
      <Section ai="Choose your depth" id="depth" className="scroll-mt-20 bg-canvas/50">
        <div className="container-x">
          <Head n="02" label="Choose your depth" title={<>Test. Package. <AuroraText>Program.</AuroraText></>} lede="Three ways in, from one question to a full longevity program. Programs run 3, 6 or 12 months." />
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
