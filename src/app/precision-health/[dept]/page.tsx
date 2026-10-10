import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { AskButton } from "@/components/pages/AskButton";
import { KeywordStream } from "@/components/fx/KeywordStream";
import { DecodeText } from "@/components/fx/DecodeText";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { DeptTabs } from "@/components/dept/DeptTabs";
import { DEPARTMENTS } from "@/data/health";

type P = { params: Promise<{ dept: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return DEPARTMENTS.map((d) => ({ dept: d.id })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = (await params).dept;
  const d = DEPARTMENTS.find((x) => x.id === k);
  return { title: d?.name ?? "Precision Health", description: d?.summary };
}

export default async function DeptPage({ params }: P) {
  const { dept } = await params;
  const i = DEPARTMENTS.findIndex((x) => x.id === dept);
  if (i < 0) notFound();
  const d = DEPARTMENTS[i], N = DEPARTMENTS.length, prev = DEPARTMENTS[(i + N - 1) % N], next = DEPARTMENTS[(i + 1) % N];
  return (
    <>
      <section data-ai={d.name} className="relative z-[1] overflow-hidden pb-10 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[620px] rounded-full bg-accent/10 blur-[110px]" />
        <div className="container-x relative">
          <Link href="/precision-health/" className="inline-flex items-center gap-1 text-[14px] font-medium text-muted hover:text-accent"><Icon name="chevron-left" size={16} />Precision Health</Link>
          <div className="mt-8 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={d.icon} size={26} /></span>
            <span className="text-[13px] font-semibold text-faint"><DecodeText text={`Department ${i + 1} of ${N}`} /></span>
          </div>
          <h1 className="h-display mt-6 max-w-[16ch]"><TextAnimate animation="blurIn">{d.name}</TextAnimate></h1>
          <p data-reveal className="mt-3 text-[20px] font-medium text-accent">{d.tag}</p>
          <p data-reveal className="lede mt-4 max-w-[62ch]">{d.summary}</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact/?interest=${encodeURIComponent(d.name)}`} className="btn-dark">Book {d.short}</Link>
            <AskButton q={`What happens in ${d.name}?`}>Ask Xevyo about this</AskButton>
            <a href={d.source} target="_blank" rel="noopener" className="btn-light">biongevity.com<Icon name="arrow-up-right" size={13} /></a>
          </div>
        </div>
      </section>
      {!d.calm && <section className="relative z-[1]"><KeywordStream words={[...d.keywords, ...d.keywords]} /></section>}
      <Section ai={`${d.short} details`} className="!pt-10"><div className="container-x"><DeptTabs id={d.id} /></div></Section>

      <section className="relative z-[1] pb-20">
        <div className="container-x flex justify-between gap-3">
          <Link href={`/precision-health/${prev.id}/`} className="btn-light"><Icon name="chevron-left" size={15} />{prev.short}</Link>
          <Link href={`/precision-health/${next.id}/`} className="btn-light">{next.short}<Icon name="chevron-right" size={15} /></Link>
        </div>
      </section>
    </>
  );
}
