import Link from "next/link";
import { CARE_PATH, type Department } from "@/data/departments";
import { DEPT_EXTRA } from "@/data/deptExtra";
import { PACKAGES } from "@/data/health";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BookNow, BookRow, WhatsAppLink } from "@/components/ui/BookNow";
import { Price, PriceNote } from "@/components/region/Price";
import { TeamSection } from "@/components/trust/TeamSection";
import { Reveal } from "@/components/motion/Reveal";

function Head({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <div className="max-w-[720px]">
      <Reveal><div className="eyebrow flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-ai-2/60" />{eyebrow}</div></Reveal>
      <Reveal delay={60}><h2 className="h-section mt-4 text-balance">{title}</h2></Reveal>
      {lede && <Reveal delay={120}><p className="lede mt-4">{lede}</p></Reveal>}
    </div>
  );
}

const cad = (s?: string) => (s ? Number(s.replace(/[^0-9.]/g, "")) : NaN);

/**
 * The service page as a landing page: what's included, who it's for, pricing, the care team, how it works and FAQ.
 * Everything a visitor arriving from Google needs before they press Book now. The interactive deep dive (tabs) follows it.
 */
export function ServiceLanding({ d }: { d: Department }) {
  const x = DEPT_EXTRA[d.id];
  const packages = x?.packages ?? [];
  const wa = `Hi Biongevity, I'd like to book ${d.name}.`;
  return (
    <>
      {/* What's included */}
      <Section ai={`${d.short} — what's included`} id="included" chip={false} className="!pt-10 scroll-mt-24">
        <div className="container-x">
          <Head eyebrow="What's included" title={`What ${d.short} covers.`} lede={`${d.services.length} tests and services, chosen case by case after a specialist review. Onsite first; precision lab tests only when they answer a real question.`} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.services.map((s, i) => (
              <Reveal key={s.t} delay={Math.min(i, 5) * 60} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3"><span className="icon-tile h-11 w-11"><Icon name={s.icon} size={21} /></span>{s.time && <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11.5px] font-semibold text-accent">{s.time}</span>}</div>
                  <h3 className="mt-4 text-[18px] font-semibold tracking-tight">{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.d}</p>
                  {s.prep && s.prep.length > 0 && <p className="mt-3 text-[12.5px] text-faint">Prep: {s.prep.join(" · ")}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Who it's for */}
      <Section ai={`${d.short} — who it's for`} id="for-you" chip={false} className="!pt-0 scroll-mt-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <Head eyebrow="Is this for you?" title="Reasons people come to us." lede={d.tag} />
          <Reveal delay={120}>
            <div className="card p-6 sm:p-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {d.when.map((w) => <li key={w} className="flex gap-2.5 text-[15px]"><Icon name="check" size={17} weight="bold" className="mt-0.5 shrink-0 text-accent" />{w}</li>)}
              </ul>
              {d.signs.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{d.signs.map((s) => <span key={s} className="rounded-full bg-canvas px-3 py-1 text-[12.5px] font-medium text-muted ring-1 ring-ink/[0.06]">{s}</span>)}</div>}
              {d.urgent && <p className="mt-5 rounded-2xl bg-warn/10 px-4 py-3 text-[13px] leading-snug text-warn">{d.urgent}</p>}
              <BookRow className="mt-7" text={wa} />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Pricing */}
      <Section ai={`${d.short} — pricing`} id="pricing" chip={false} className="!pt-0 scroll-mt-24">
        <div className="container-x">
          <Head eyebrow="Pricing" title="Clear about cost." lede={packages.length ? "Packages pair a clinic visit with the BioAro Labs tests that answer the question. Lab prices are list prices; clinic fees are confirmed when you book." : "Consultation fees are confirmed when you book. Lab tests are priced individually at BioAro Labs list prices, and a longevity program can include this department."} />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {packages.map((p, i) => (
              <Reveal key={p.name} delay={i * 80} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Package</div>
                  <h3 className="mt-1 text-[20px] font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-muted">{p.for}</p>
                  <div className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">In clinic</div>
                  <ul className="mt-1.5 grid gap-1.5 text-[14px]">{p.clinic.map((c) => <li key={c} className="flex gap-2"><Icon name="check" size={15} weight="bold" className="mt-0.5 shrink-0 text-accent" />{c}</li>)}</ul>
                  <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">BioAro Labs</div>
                  <ul className="mt-1.5 grid gap-1.5 text-[14px]">{p.labs.map((c) => <li key={c} className="flex gap-2"><Icon name="test-tube" size={15} className="mt-0.5 shrink-0 text-accent" />{c}</li>)}</ul>
                  <div className="mt-auto pt-6">
                    {Number.isFinite(cad(p.labPrice)) && <div className="flex items-baseline gap-1.5"><span className="text-[13px] text-muted">Lab tests</span><Price cad={cad(p.labPrice)} className="text-[26px] font-semibold tracking-tight" /></div>}
                    <div className="text-[12.5px] text-faint">Clinic fees confirmed when you book</div>
                    <div className="mt-4 flex flex-wrap gap-2"><BookNow size="sm" /><WhatsAppLink size="sm" label="Ask price" text={`Hi Biongevity, what does the ${p.name} package cost?`} /></div>
                  </div>
                </div>
              </Reveal>
            ))}
            {!packages.length && (
              <Reveal className="h-full lg:col-span-2">
                <div className="card flex h-full flex-col p-6 sm:p-8">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Consultation</div>
                  <h3 className="mt-1 text-[22px] font-semibold tracking-tight">{d.name} consultation</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">A specialist review of your history, medications and results, ending with a clear plan. Virtual or in person. The fee is confirmed when you book; message us for a quote first if you prefer.</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6"><BookNow /><WhatsAppLink label="Ask about fees" text={`Hi Biongevity, what does a ${d.name} consultation cost?`} /></div>
                </div>
              </Reveal>
            )}
            <Reveal delay={packages.length * 80} className="h-full">
              <div className="card flex h-full flex-col p-6">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Longevity programs</div>
                <h3 className="mt-1 text-[20px] font-semibold tracking-tight">Or start with a program</h3>
                <ul className="mt-4 grid gap-3">
                  {PACKAGES.map((p) => <li key={p.handle} className="flex items-center justify-between gap-3 text-[14.5px]"><span className="font-medium">{p.name}</span><Price cad={p.price} from className="font-semibold" /></li>)}
                </ul>
                <p className="mt-3 text-[12.5px] text-faint">Testing, an AI-guided plan and the app, with this department&apos;s care inside it.</p>
                <Link href="/shop/#depth" className="btn-light mt-auto h-10 self-start px-4 pt-0 text-[14px]">Compare programs<Icon name="arrow-right" size={14} /></Link>
              </div>
            </Reveal>
          </div>
          <PriceNote />
        </div>
      </Section>

      {/* Care team */}
      <Section ai={`${d.short} — care team`} id="team" chip={false} className="!pt-0 scroll-mt-24">
        <div className="container-x"><TeamSection dept={d.id} title={`Who looks after you in ${d.short}.`} /></div>
      </Section>

      {/* How it works */}
      <Section ai={`${d.short} — how it works`} id="how" chip={false} className="!pt-0 scroll-mt-24">
        <div className="container-x">
          <Head eyebrow="How it works" title="From booking to plan, in four steps." />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CARE_PATH.map((s, i) => (
              <Reveal key={s.t} delay={i * 80} as="li" className="h-full">
                <div className="card h-full p-6">
                  <div className="flex items-center justify-between"><span className="icon-tile h-10 w-10"><Icon name={s.icon} size={19} /></span><span className="text-[13px] font-semibold tabular-nums text-faint">0{i + 1}</span></div>
                  <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* FAQ */}
      {d.faq.length > 0 && (
        <Section ai={`${d.short} — FAQ`} id="faq" chip={false} className="!pt-0 scroll-mt-24">
          <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            <div><Head eyebrow="Questions" title={`${d.short}, answered.`} /><Reveal delay={160}><BookRow className="mt-8" text={wa} /></Reveal></div>
            <Reveal delay={120}>
              <div className="faq divide-y divide-ink/[0.07] rounded-[28px] bg-white/70 px-6 ring-1 ring-ink/[0.06] backdrop-blur-xl sm:px-8">
                {d.faq.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex items-center justify-between gap-4 text-[16.5px] font-semibold tracking-tight">{f.q}<span className="faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas text-accent transition-transform"><Icon name="plus" size={14} weight="bold" /></span></summary>
                    <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>
      )}
    </>
  );
}
