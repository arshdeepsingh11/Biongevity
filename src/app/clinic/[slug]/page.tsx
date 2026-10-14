import Link from "next/link";
import { PageSummary } from "@/components/ai/PageSummary";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { AskButton } from "@/components/pages/AskButton";
import { Icon } from "@/components/ui/Icon";
import { CLINICS } from "@/data/clinic";
import { ClinicTabs } from "@/components/clinic/ClinicTabs";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return CLINICS.map((c) => ({ slug: c.id })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = (await params).slug;
  const c = CLINICS.find((x) => x.id === k);
  return { title: c?.name, description: c?.summary };
}

export default async function ClinicSubPage({ params }: P) {
  const { slug } = await params;
  const c = CLINICS.find((x) => x.id === slug);
  if (!c) notFound();
  return (
    <>
      <section data-ai={c.name} className="relative z-[1] overflow-hidden pb-10 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 h-[420px] w-[680px] rounded-full bg-accent/10 blur-[110px]" />
        <div className="container-x relative">
          <Link href="/clinic/" className="inline-flex items-center gap-1 text-[14px] font-medium text-muted hover:text-accent"><Icon name="chevron-left" size={16} />Global Clinic</Link>
          <div className="mt-8 flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={c.icon} size={26} /></span></div>
          <h1 className="h-display mt-6 max-w-[16ch]"><TextAnimate animation="blurIn">{c.name}</TextAnimate></h1>
          <p data-reveal className="mt-3 text-[20px] font-medium text-accent">{c.tag}</p>
          <p data-reveal className="lede mt-4 max-w-[62ch]">{c.summary}</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact/?interest=${encodeURIComponent(c.name)}`} className="btn-dark">{c.id === "uae" ? "Book a visit" : "Start your journey"}</Link>
            <AskButton q={`How does the ${c.name} work?`}>Ask Xevyo</AskButton>
          </div>
          <div data-reveal className="mt-5"><PageSummary /></div>
        </div>
      </section>

      <Section ai={`${c.short} details`} className="!pt-0"><div className="container-x"><ClinicTabs id={c.id} /></div></Section>

      <section className="relative z-[1] pb-20">
        <div className="container-x flex flex-wrap justify-center gap-3">
          {CLINICS.filter((x) => x.id !== c.id).map((x) => <Link key={x.id} href={`/clinic/${x.id}/`} className="btn-light"><Icon name={x.icon} size={15} />{x.name}</Link>)}
        </div>
      </section>
    </>
  );
}
