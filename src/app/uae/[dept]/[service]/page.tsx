import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, PriceBtn, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Disclaimer, FaqList, Head, Ticks } from "@/components/site/Blocks";
import { ServiceCard } from "@/components/site/Cards";
import { ALL_SERVICES, deptHref, findService } from "@/content/uae";
import { UAE_CLINIC, WA } from "@/content/contact";
import type { Faq } from "@/content/types";
import { JsonLd, crumbsLd, faqPage, medicalPage } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => ALL_SERVICES.map((r) => ({ dept: r.dept.id, service: r.service.slug }));

export async function generateMetadata({ params }: { params: Promise<{ dept: string; service: string }> }): Promise<Metadata> {
  const p = await params;
  const r = findService(p.dept, p.service);
  if (!r) return {};
  const { dept, service } = r;
  const path = `/uae/${dept.id}/${service.slug}/`;
  return {
    title: { absolute: `${service.name} in Dubai | Biongevity Clinic, Al Barsha` },
    description: `${service.short} ${service.name} at Biongevity Dubai: what it is, who it suits, what's included and how to book on WhatsApp.`.slice(0, 300),
    alternates: { canonical: path },
    openGraph: { title: `${service.name} · Biongevity Dubai`, description: service.short, url: path, locale: "en_AE" },
  };
}

const FACT_LABELS: [keyof NonNullable<import("@/content/types").Service["facts"]>, string, string][] = [
  ["time", "Time", "clock"],
  ["downtime", "Downtime", "leaf"],
  ["sessions", "Sessions", "calendar"],
  ["where", "Where", "pin"],
];

export default async function ServicePage({ params }: { params: Promise<{ dept: string; service: string }> }) {
  const p = await params;
  const r = findService(p.dept, p.service);
  if (!r) notFound();
  const { dept: d, group: g, service: s } = r;
  const path = `/uae/${d.id}/${s.slug}/`;
  const related = g.services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const fill = related.length < 3 ? d.groups.flatMap((x) => x.services).filter((x) => x.slug !== s.slug && !related.includes(x)).slice(0, 3 - related.length) : [];
  const faqs: Faq[] = [
    ...(s.faqs ?? []),
    { q: `How much does ${s.name} cost?`, a: `The price depends on your plan and current offers. Message us on WhatsApp for today's price. ${UAE_CLINIC.vatNote}` },
    { q: "How do I book?", a: "Tap Book now or WhatsApp us. Our team confirms the time and answers your questions. You can also call the clinic." },
  ];
  const facts = FACT_LABELS.filter(([k]) => s.facts?.[k]);

  return (
    <div data-dept={d.id} data-item={s.name} data-page-item={s.name}>
      <JsonLd data={[
        crumbsLd([["Biongevity Dubai", "/uae/"], [d.name, deptHref(d)], [s.name, path]]),
        medicalPage({ name: `${s.name} · Biongevity Dubai`, description: s.about, path, about: [d.name], procedures: [s.name] }),
        faqPage(faqs),
      ]} />

      {/* HERO */}
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-12 pt-[calc(100px+var(--safe-top))] lg:pb-16 lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[["Dubai", "/uae/"], [d.short, deptHref(d)], [s.name]]} />
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div>
              <Link href={`${deptHref(d)}#${g.id}`} className="t-eyebrow hover:opacity-80" data-rv>{g.name}</Link>
              <h1 className="t-h1 mt-5" data-rv style={{ "--d": "60ms" } as React.CSSProperties}>{s.name} <span className="t-italic block text-[0.62em] text-[rgb(var(--dept-deep))]">in Dubai</span></h1>
              <p className="t-lede mt-5 max-w-[54ch]" data-rv style={{ "--d": "120ms" } as React.CSSProperties}>{s.short}</p>
              <div className="mt-8 flex flex-wrap gap-3" data-rv style={{ "--d": "160ms" } as React.CSSProperties}>
                <BookNow item={s.name} size="lg" />
                <PriceBtn item={s.name} size="lg" />
              </div>
              {facts.length > 0 && (
                <dl className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-4" data-rv style={{ "--d": "200ms" } as React.CSSProperties}>
                  {facts.map(([k, label, icon]) => (
                    <div key={k} className="fact6">
                      <dt className="flex items-center gap-1.5"><Icon name={icon} size={13} />{label}</dt>
                      <dd>{s.facts![k]}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div data-rv style={{ "--d": "120ms" } as React.CSSProperties}>
              <Photo k={s.photo ?? g.photo ?? d.photo} priority className="aspect-[5/4] rounded-[32px]" w={820} sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS / WHO / INCLUDED */}
      <section data-ai="About this treatment" className="sec-tight sec-white">
        <div className="wrap grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
          <div>
            <h2 className="t-h2" data-rv>What is {s.name}?</h2>
            <p className="mt-5 text-[18px] leading-[1.75] text-ink/80" data-rv>{s.about}</p>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div data-rv>
                <h3 className="t-h3">Who it may suit</h3>
                <Ticks items={s.forWho} className="mt-4" />
              </div>
              <div data-rv style={{ "--d": "80ms" } as React.CSSProperties}>
                <h3 className="t-h3">What&apos;s included</h3>
                <Ticks items={s.includes} className="mt-4" />
              </div>
            </div>
          </div>

          {/* Price & booking card */}
          <aside className="lg:sticky lg:top-[110px] lg:self-start" data-ai="Price and booking">
            <div className="card6 overflow-hidden" data-rv>
              <div className="bg-[rgb(var(--dept-soft))] px-7 py-6">
                <div className="t-eyebrow">Price & offers</div>
                <p className="mt-3 text-[16px] leading-relaxed text-ink/85">Prices depend on your plan, and we often have offers. Message us for today&apos;s price for {s.name}.</p>
              </div>
              <div className="grid gap-3 p-7">
                <BookNow item={s.name} className="w-full" />
                <WhatsAppBtn text={WA.price(s.name)} label="Ask for price on WhatsApp" item={s.name} className="w-full" />
                <a href={UAE_CLINIC.tel} className="btn6 btn6-ghost w-full"><Icon name="call" size={17} />Call {UAE_CLINIC.phone}</a>
                <p className="pt-1 text-center text-[13px] text-faint">{UAE_CLINIC.vatNote}</p>
              </div>
            </div>
            <p className="mt-4 px-2 text-[14px] text-muted"><Icon name="pin" size={14} className="mr-1 inline" />{UAE_CLINIC.address[0]}, {UAE_CLINIC.address[1]}</p>
          </aside>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section data-ai="How it works" className="sec-tight">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Head eyebrow="How it works" title="From first message to follow-up." />
            <div data-rv><BookNow item={s.name} size="sm" /></div>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.steps.map((st, i) => (
              <li key={st.t} className="rounded-[24px] border border-ink/[0.07] bg-white p-6" data-rv style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                <span className="font-display text-[30px] leading-none text-[rgb(var(--dept-deep))]">0{i + 1}</span>
                <div className="t-h3 mt-3">{st.t}</div>
                <p className="t-body mt-1.5">{st.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LONGEVITY LINE */}
      <section data-ai="Longevity" className="sec-tight">
        <div className="wrap">
          <div className="sec-dark relative overflow-hidden rounded-[30px] px-7 py-10 sm:px-12 sm:py-12" data-rv>
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(var(--dept)/.35),transparent)]" />
            <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-[rgb(var(--dept))]"><Icon name={d.icon} size={30} /></span>
              <div>
                <div className="t-eyebrow">Part of your longevity plan</div>
                <p className="mt-3 font-display text-[24px] leading-snug sm:text-[30px]">{d.longevity}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-ai="FAQ" className="sec-tight">
        <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Head eyebrow="Questions" title={`${s.name}: your questions.`} />
            <div className="mt-7" data-rv><BookNow item={s.name} size="sm" /></div>
            <Disclaimer className="mt-6 max-w-[42ch]" />
          </div>
          <div data-rv><FaqList items={faqs} /></div>
        </div>
      </section>

      <BookBand item={s.name} title={<>Book {s.name} <span className="t-italic">in Dubai.</span></>} />

      {/* RELATED */}
      <section data-ai="Related" className="sec-tight pb-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-h2">You may also like</h2>
            <Link href={deptHref(d)} className="link6 hidden sm:inline-flex">All {d.short} <Icon name="arrow-right" size={15} /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...related, ...fill].map((x, i) => <ServiceCard key={x.slug} d={d} s={x} i={i} />)}
          </div>
          <Link href={deptHref(d)} className="link6 mt-6 sm:hidden">All {d.short} <Icon name="arrow-right" size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
