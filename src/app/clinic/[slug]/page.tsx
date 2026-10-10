import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/Section";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { TextAnimate } from "@/components/fx/TextAnimate";
import { DiaTextReveal } from "@/components/fx/DiaTextReveal";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { AskButton } from "@/components/pages/AskButton";
import { Icon } from "@/components/ui/Icon";
import { CLINICS } from "@/data/clinic";
import { CARE_PHASES } from "@/data/health";

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
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 h-[420px] w-[680px] rounded-full bg-cyan/10 blur-[110px]" />
        <div className="container-x relative">
          <Link href="/clinic/" className="inline-flex items-center gap-1 text-[14px] font-medium text-muted hover:text-accent"><Icon name="chevron-left" size={16} />Global Clinic</Link>
          <div className="mt-8 flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={c.icon} size={26} /></span></div>
          <h1 className="h-display mt-6 max-w-[16ch]"><TextAnimate animation="blurIn">{c.name}</TextAnimate></h1>
          <p data-reveal className="mt-3 text-[20px] font-medium text-accent">{c.tag}</p>
          <p data-reveal className="lede mt-4 max-w-[62ch]">{c.summary}</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact/?interest=${encodeURIComponent(c.name)}`} className="btn-dark">{c.id === "uae" ? "Book a visit" : "Start your journey"}</Link>
            <AskButton q={`How does the ${c.name} work?`}>Ask AI</AskButton>
            <a href={c.source} target="_blank" rel="noopener" className="btn-light">biongevity.com<Icon name="arrow-up-right" size={13} /></a>
          </div>
        </div>
      </section>

      {c.id === "uae" && <Section ai="Clinic film" className="!pt-0"><div className="container-x"><FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside the UAE Precision Clinic" className="aspect-video" /></div></Section>}

      <Section ai={c.id === "uae" ? "Advanced longevity assessments" : "What you get"} className="!pt-0">
        <div className="container-x">
          {c.id === "uae" && <><Eyebrow>Advanced Longevity Packages</Eyebrow><h2 className="h-section mt-3 mb-8 max-w-[20ch]"><DiaTextReveal text="Ten assessments. One picture of you." /></h2></>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.points.map((p, k) => (
              <div key={p.t} data-reveal data-scan className="card p-6">
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-light text-accent"><Icon name={p.icon ?? "check"} size={20} /></span><span className="text-[12px] font-semibold text-faint">{String(k + 1).padStart(2, "0")}</span></div>
                <div className="mt-5 text-[19px] font-semibold tracking-tight">{p.t}</div>
                <div className="mt-2 text-[15px] text-muted">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {c.id === "journey" && (
        <Section ai="Longevity journey steps" className="!pt-0">
          <div className="container-x">
            <Eyebrow>Personalize your health</Eyebrow>
            <h2 className="h-section mt-3 max-w-[18ch]"><DiaTextReveal text="Why precision health matters for you." /></h2>
            <div className="relative mt-10 space-y-3">
              <div aria-hidden className="absolute bottom-6 left-[31px] top-6 hidden w-px bg-gradient-to-b from-accent via-cyan to-amber/60 sm:block" />
              {CARE_PHASES.map((s) => (
                <div key={s.n} data-reveal data-scan className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-iri text-white"><Icon name={s.icon} size={18} /></span>
                  <div className="flex-1"><div className="text-[12px] font-semibold text-accent">Step {s.n} · {s.short}</div><div className="text-[19px] font-semibold">{s.t}</div><p className="mt-1 text-[14px] text-muted">{s.d}</p></div>
                </div>
              ))}
            </div>
            <div data-reveal className="card mt-6 flex flex-col items-center gap-6 p-8 sm:flex-row">
              <ProgressRing value={64} size={130} label="illustrative" />
              <div><div className="text-[24px] font-semibold tracking-tight">Biological vs chronological age</div><p className="mt-2 max-w-[60ch] text-[15px] text-muted">Biological age reflects cellular health, influenced by DNA, habits and environment. Precision Age reveals personalized age insights.</p>
                <AskButton q="What is biological age and how is it measured?" className="mt-4">How is it measured?</AskButton></div>
            </div>
          </div>
        </Section>
      )}

      <section className="relative z-[1] pb-20">
        <div className="container-x flex flex-wrap justify-center gap-3">
          {CLINICS.filter((x) => x.id !== c.id).map((x) => <Link key={x.id} href={`/clinic/${x.id}/`} className="btn-light"><Icon name={x.icon} size={15} />{x.name}</Link>)}
        </div>
      </section>
    </>
  );
}
