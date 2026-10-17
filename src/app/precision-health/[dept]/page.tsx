import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { AskButton } from "@/components/pages/AskButton";
import { KeywordStream } from "@/components/fx/KeywordStream";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { DeptTabs } from "@/components/dept/DeptTabs";
import { PageSummary } from "@/components/ai/PageSummary";
import { DeptTests } from "@/components/labs/DeptTests";
import { deptHasTests } from "@/lib/deptGoals";
import { DeptBody } from "@/components/dept/DeptBody";
import { DEPARTMENTS } from "@/data/departments";
import { JsonLd, breadcrumb, faqPage, medicalPage } from "@/lib/seo";

type P = { params: Promise<{ dept: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return DEPARTMENTS.map((d) => ({ dept: d.id })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = (await params).dept;
  const d = DEPARTMENTS.find((x) => x.id === k);
  if (!d) return {};
  return {
    title: `${d.name} — ${d.services.slice(0, 3).map((s) => s.t).join(", ")}`,
    description: d.summary,
    keywords: [...d.keywords, d.name, `${d.name} Calgary`, "precision health"],
    alternates: { canonical: `/precision-health/${d.id}/` },
    openGraph: { title: `${d.name} · Biongevity`, description: d.tag },
  };
}

export default async function DeptPage({ params }: P) {
  const { dept } = await params;
  const i = DEPARTMENTS.findIndex((x) => x.id === dept);
  if (i < 0) notFound();
  const d = DEPARTMENTS[i], N = DEPARTMENTS.length, prev = DEPARTMENTS[(i + N - 1) % N], next = DEPARTMENTS[(i + 1) % N];
  const path = `/precision-health/${d.id}/`;
  return (
    <>
      <JsonLd data={[breadcrumb([["Precision Health", "/precision-health/"], [d.name, path]]), faqPage(d.faq), medicalPage({ name: d.name, description: d.summary, path, about: d.areas.map((a) => a.t), procedures: d.services.map((s) => s.t) })]} />
      <section data-ai={d.name} className="relative z-[1] overflow-hidden pb-8 pt-[calc(96px+var(--safe-top))] sm:pt-[120px]">
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[620px] rounded-full bg-gold-soft blur-[110px]" />
        <div className="container-x relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <Link href="/precision-health/" className="inline-flex items-center gap-1 text-[14px] font-medium text-muted hover:text-accent"><Icon name="chevron-left" size={16} />Precision Health</Link>
            <div className="mt-7 flex items-center gap-3">
              <span className="icon-tile h-14 w-14"><Icon name={d.icon} size={26} /></span>
              <span className="rounded-full bg-accent-light px-3 py-1 text-[12px] font-semibold text-accent">{d.group}</span>
            </div>
            <h1 className="h-display mt-6 max-w-[16ch]"><TextAnimate animation="blurIn">{d.name}</TextAnimate></h1>
            <p data-reveal className="mt-3 text-[20px] font-medium text-accent">{d.tag}</p>
            <p data-reveal className="lede mt-4 max-w-[60ch]">{d.summary}</p>
            <div data-reveal className="mt-8 grid grid-cols-2 items-center gap-2.5 sm:flex sm:flex-wrap">
              <Link href={`/contact/?interest=${encodeURIComponent(d.name)}`} className="btn-dark col-span-2 h-12 px-6">Book {d.short}</Link>
              <AskButton q={`What happens in ${d.name} at Biongevity?`} className="h-12">Ask Biongevity SI</AskButton>
              <PageSummary compact className="h-12 justify-center" />
            </div>
            <div data-reveal className="mt-8 grid max-w-[560px] grid-cols-2 gap-2 sm:grid-cols-4">
              {([[d.services.length, "tests & services"], [d.areas.length, "areas of care"], [d.when.length, "reasons to come"], ["24/7", "Biongevity SI"]] as const).map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white/80 p-3 ring-1 ring-ink/[0.06]"><div className="text-[24px] font-semibold leading-none tracking-tight">{v}</div><div className="mt-1 text-[11.5px] text-muted">{l}</div></div>
              ))}
            </div>
          </div>
          <DeptBody dept={d.id} name={d.name} signs={d.signs} />
        </div>
      </section>
      {!d.calm && <section className="relative z-[1]"><KeywordStream words={[...d.keywords, ...d.keywords]} /></section>}
      <Section ai={`${d.short} details`} id="details" className="!pt-10 scroll-mt-24"><div className="container-x"><DeptTabs id={d.id} /></div></Section>
      {deptHasTests(d.id) && <Section ai={`${d.short} tests`} className="!pt-0" chip={false}><div className="container-x"><DeptTests dept={d.id} name={d.name} /></div></Section>}
      <section className="relative z-[1] pb-20">
        <div className="container-x flex justify-between gap-3">
          <Link href={`/precision-health/${prev.id}/`} className="btn-light"><Icon name="chevron-left" size={15} />{prev.short}</Link>
          <Link href={`/precision-health/${next.id}/`} className="btn-light">{next.short}<Icon name="chevron-right" size={15} /></Link>
        </div>
      </section>
    </>
  );
}
