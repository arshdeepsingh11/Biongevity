import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { AskButton } from "@/components/pages/AskButton";
import { KeywordStream } from "@/components/fx/KeywordStream";
import { DecodeText } from "@/components/fx/DecodeText";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { ProductCard } from "@/components/products/ProductCard";
import { DEPARTMENTS } from "@/data/health";
import { LAB_TESTS } from "@/data/labs";

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
  const tests = d.tests.map((h) => LAB_TESTS.find((t) => t.handle === h)).filter((t) => t !== undefined);
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
            <AskButton q={`What happens in ${d.name}?`}>Ask AI about this</AskButton>
            <a href={d.source} target="_blank" rel="noopener" className="btn-light">biongevity.com<Icon name="arrow-up-right" size={13} /></a>
          </div>
        </div>
      </section>
      {!d.calm && <section className="relative z-[1]"><KeywordStream words={[...d.keywords, ...d.keywords]} /></section>}

      <Section ai="Approach">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div><Eyebrow>Our approach</Eyebrow><h2 className="h-section mt-3 max-w-[14ch]">Personal by design.</h2></div>
          <div className="space-y-4">{d.approach.map((a) => <p key={a} data-reveal className="text-[18px] leading-relaxed text-ink/80">{a}</p>)}</div>
        </div>
      </Section>

      <Section ai="Services" className="!pt-0">
        <div className="container-x">
          <h2 className="text-[28px] font-semibold tracking-tight">Services & technology</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.services.map((f, k) => (
              <div key={f.t} data-reveal data-scan className="card p-6">
                <span className="text-[13px] font-semibold text-accent">{String(k + 1).padStart(2, "0")}</span>
                <div className="mt-3 text-[19px] font-semibold tracking-tight">{f.t}</div>
                <div className="mt-2 text-[15px] text-muted">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {d.specialist && (
        <Section ai="Specialist" className="!pt-0">
          <div className="container-x max-w-[900px]">
            <div data-reveal className="card relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
              <ShineBorder radius={28} width={1} />
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent-light text-accent"><Icon name="user" size={28} /></span>
              <div><div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">Meet your specialist</div><div className="mt-1 text-[22px] font-semibold">{d.specialist.role}</div><p className="mt-2 text-[15px] text-muted">{d.specialist.bio}</p></div>
            </div>
          </div>
        </Section>
      )}

      <Section ai="Clinician questions" className="!pt-0">
        <div className="container-x max-w-[820px]">
          <div data-reveal className="card p-6 sm:p-8">
            <div className="text-[19px] font-semibold">Questions to bring to your clinician</div>
            <div className="mt-4 space-y-2">{d.questions.map((q) => <AskButton key={q} q={q} variant="row">{q}</AskButton>)}</div>
            <div className="mt-4 text-[12px] text-faint">Source: {d.source.replace("https://", "")}. Services may vary by location; confirm with the clinic.</div>
          </div>
        </div>
      </Section>

      {tests.length > 0 && (
        <Section ai="Related tests" className="!pt-0">
          <div className="container-x">
            <h2 className="text-[26px] font-semibold tracking-tight">Related BioAro Labs tests</h2>
            <p className="mt-1 text-[14px] text-muted">Opens the official test page on bioarolabs.com.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tests.map((t) => <ProductCard key={t.handle} p={t} />)}</div>
          </div>
        </Section>
      )}

      <section className="relative z-[1] pb-20">
        <div className="container-x flex justify-between gap-3">
          <Link href={`/precision-health/${prev.id}/`} className="btn-light"><Icon name="chevron-left" size={15} />{prev.short}</Link>
          <Link href={`/precision-health/${next.id}/`} className="btn-light">{next.short}<Icon name="chevron-right" size={15} /></Link>
        </div>
      </section>
    </>
  );
}
