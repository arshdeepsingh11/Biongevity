import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Disclaimer, Head } from "@/components/site/Blocks";
import { UAE_SUPPLEMENTS } from "@/content/supplements";
import { deptById, deptHref } from "@/content/uae";
import { JsonLd, crumbsLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Longevity Supplements in the UAE | Biongevity Dubai" },
  description: "Longevity supplements available in the UAE at Biongevity Dubai: LONgevity+, CellOmega+ and Creagen. Ask our team on WhatsApp.",
  alternates: { canonical: "/uae/supplements/" },
};

/** Only UAE-approved formulas are listed (see src/content/supplements.ts). No prices: visitors ask on WhatsApp. */
export default function UaeSupplements() {
  const longevity = deptById("longevity-precision-health")!;
  return (
    <div data-dept="longevity-precision-health">
      <JsonLd data={crumbsLd([["Biongevity Dubai", "/uae/"], ["Supplements", "/uae/supplements/"]])} />
      <section data-ai="Supplements" className="relative isolate overflow-hidden pb-16 pt-[calc(100px+var(--safe-top))] lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[["Dubai", "/uae/"], ["Supplements"]]} />
          <Head as="h1" className="mt-8" eyebrow="Longevity supplements" title={<>Daily support, <span className="t-italic">chosen with your doctor.</span></>} lede="Formulas available in the UAE. Ask our team which one fits your goals, any medicines you take and your test results." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {UAE_SUPPLEMENTS.map((s, i) => (
              <article key={s.id} className="card6 flex flex-col p-7" data-item={s.name} data-rv style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                <div className="font-display text-[34px] leading-none text-[rgb(var(--dept-deep))]">{s.name}</div>
                <p className="mt-3 text-[16px] font-semibold">{s.line}</p>
                <p className="t-body mt-2 !text-[15.5px]">{s.detail}</p>
                <WhatsAppBtn text={`Hi Biongevity Dubai, I'd like to know more about ${s.name}.`} label="Ask about it" size="sm" item={s.name} className="mt-auto self-start" />
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <Disclaimer />
            <Link href={deptHref(longevity)} className="link6 lg:justify-self-end">Longevity & Precision Health <Icon name="arrow-right" size={15} /></Link>
          </div>
          <p className="mt-4 max-w-[70ch] text-[13px] text-faint">Supplements are not intended to diagnose, treat, cure or prevent any disease. If you are pregnant, breastfeeding, taking medicines or have a medical condition, speak to your doctor first.</p>
        </div>
      </section>
      <BookBand item="Longevity supplements" title={<>Not sure which one <span className="t-italic">is right for you?</span></>} lede="Message us. Our team will help you choose, and can book a longevity consultation if you would like a full plan." />
    </div>
  );
}
