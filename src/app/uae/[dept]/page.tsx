import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Disclaimer, FaqList, Head } from "@/components/site/Blocks";
import { DeptCard, ServiceCard } from "@/components/site/Cards";
import { DEPARTMENTS, deptById, servicesOf } from "@/content/uae";
import { WA } from "@/content/contact";
import { JsonLd, crumbsLd, faqPage, medicalPage } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => DEPARTMENTS.map((d) => ({ dept: d.id }));

export async function generateMetadata({ params }: { params: Promise<{ dept: string }> }): Promise<Metadata> {
  const d = deptById((await params).dept);
  if (!d) return {};
  const path = `/uae/${d.id}/`;
  const names = servicesOf(d).slice(0, 6).map((s) => s.name).join(", ");
  return {
    title: { absolute: `${d.name} in Dubai | Biongevity Clinic` },
    description: `${d.tagline} ${names} and more at Biongevity Dubai, Al Barsha. Book on WhatsApp.`.slice(0, 300),
    alternates: { canonical: path },
    openGraph: { title: `${d.name} · Biongevity Dubai`, description: d.tagline, url: path, locale: "en_AE" },
  };
}

export default async function DepartmentPage({ params }: { params: Promise<{ dept: string }> }) {
  const d = deptById((await params).dept);
  if (!d) notFound();
  const path = `/uae/${d.id}/`;
  const all = servicesOf(d);
  const others = DEPARTMENTS.filter((x) => x.id !== d.id).slice(0, 3);

  return (
    <div data-dept={d.id} data-item={d.name}>
      <JsonLd data={[
        crumbsLd([["Biongevity Dubai", "/uae/"], [d.name, path]]),
        medicalPage({ name: `${d.name} · Biongevity Dubai`, description: d.intro, path, about: [d.name], procedures: all.map((s) => s.name) }),
        faqPage(d.faqs),
      ]} />

      {/* HERO */}
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-14 pt-[calc(100px+var(--safe-top))] lg:pb-20 lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[["Dubai", "/uae/"], ["Treatments", "/uae/#treatments"], [d.name]]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3" data-rv><span className="dept-tile"><Icon name={d.icon} size={22} /></span><span className="t-eyebrow">{all.length} treatments & services</span></div>
              <h1 className="t-h1 mt-6" data-rv style={{ "--d": "60ms" } as React.CSSProperties}>{d.name}</h1>
              <p className="mt-4 font-display text-[22px] italic leading-snug text-[rgb(var(--dept-deep))] sm:text-[26px]" data-rv style={{ "--d": "100ms" } as React.CSSProperties}>{d.tagline}</p>
              <p className="t-lede mt-5 max-w-[56ch]" data-rv style={{ "--d": "140ms" } as React.CSSProperties}>{d.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3" data-rv style={{ "--d": "180ms" } as React.CSSProperties}>
                <BookNow item={d.name} size="lg" />
                <WhatsAppBtn text={WA.help(d.short.toLowerCase())} label="Help me choose" size="lg" variant="ghost" item={d.name} />
              </div>
            </div>
            <div className="relative" data-rv style={{ "--d": "120ms" } as React.CSSProperties}>
              <Photo k={d.photo} priority className="aspect-[5/4] rounded-[32px] lg:aspect-[4/5]" w={820} sizes="(min-width:1024px) 40vw, 100vw" />
              <div className="card6 absolute -bottom-5 left-5 right-5 p-5 sm:left-auto sm:max-w-[320px]">
                <div className="t-eyebrow">Longevity</div>
                <p className="mt-2 text-[15px] font-medium leading-snug text-ink">{d.longevity}</p>
              </div>
            </div>
          </div>

          {d.groups.length > 1 && (
            <nav aria-label="Sections" className="no-scrollbar -mx-5 mt-14 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" data-rv>
              {d.groups.map((g) => <a key={g.id} href={`#${g.id}`} className="pill6 shrink-0 hover:border-ink/20"><span className="dept-dot" />{g.name}<span className="text-faint">{g.services.length}</span></a>)}
            </nav>
          )}
        </div>
      </section>

      {/* GROUPS → SERVICES */}
      {d.groups.map((g, gi) => (
        <section key={g.id} id={g.id} data-ai={g.name} className={`anchor6 ${gi % 2 === 0 ? "sec-tight sec-white" : "sec-tight"}`}>
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-[640px]" data-rv>
                <h2 className="t-h2">{g.name}</h2>
                {g.intro && <p className="t-lede mt-3">{g.intro}</p>}
              </div>
              <div className="flex items-center gap-4" data-rv>
                <span className="text-[14px] font-semibold text-[rgb(var(--dept-deep))]">{g.services.length} {g.services.length === 1 ? "treatment" : "treatments"}</span>
                <BookNow item={g.name} size="sm" />
              </div>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.services.map((s, i) => <ServiceCard key={s.slug} d={d} s={s} i={i} />)}
            </div>
          </div>
        </section>
      ))}

      {/* WHY + STEPS (dept tint) */}
      <section data-ai="Why us" className="sec sec-dept">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            {d.why.map((w, i) => (
              <div key={w.t} className="rounded-[26px] bg-white/70 p-7" data-rv style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                <Icon name="check" size={22} weight="bold" className="text-[rgb(var(--dept-deep))]" />
                <h3 className="t-h3 mt-4">{w.t}</h3>
                <p className="t-body mt-2">{w.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Head eyebrow="How it works" title="Your visit, step by step." />
              <div className="mt-7" data-rv><BookNow item={d.name} size="sm" /></div>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {d.steps.map((s, i) => (
                <li key={s.t} className="rounded-[24px] border border-ink/[0.07] bg-white p-6" data-rv style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                  <span className="font-display text-[30px] leading-none text-[rgb(var(--dept-deep))]">0{i + 1}</span>
                  <div className="t-h3 mt-3">{s.t}</div>
                  <p className="t-body mt-1.5">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* NOT SURE */}
      <section data-ai="Help me choose" className="sec-tight">
        <div className="wrap">
          <div className="card6 flex flex-col items-start gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9" data-rv>
            <div>
              <h2 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">Not sure which treatment is right?</h2>
              <p className="t-body mt-2 max-w-[56ch]">Send us a message with what you would like to improve. Our team will suggest the right option and share prices and current offers.</p>
            </div>
            <WhatsAppBtn text={WA.help(d.short.toLowerCase())} label="Help me choose" size="lg" item={d.name} className="shrink-0" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-ai="FAQ" className="sec">
        <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Head eyebrow="Questions" title={`${d.short}: good to know.`} />
            <div className="mt-7" data-rv><BookNow item={d.name} size="sm" /></div>
            <Disclaimer className="mt-6 max-w-[42ch]" />
          </div>
          <div data-rv><FaqList items={d.faqs} /></div>
        </div>
      </section>

      <BookBand item={d.name} title={<>Ready when <span className="t-italic">you are.</span></>} />

      {/* OTHER DEPARTMENTS */}
      <section data-ai="Other departments" className="sec-tight pb-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-h2">More at Biongevity Dubai</h2>
            <Link href="/uae/#treatments" className="link6 hidden sm:inline-flex">All departments <Icon name="arrow-right" size={15} /></Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => <DeptCard key={o.id} d={o} i={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
