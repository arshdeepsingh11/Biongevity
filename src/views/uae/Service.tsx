import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, PriceBtn, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Disclaimer, FaqList, Head, Ticks } from "@/components/site/Blocks";
import { ServiceCard } from "@/components/site/Cards";
import { ALL_SERVICES, deptHref, englishName, findService, serviceHref } from "@/content/uae";
import { UAE_CLINIC, addressOf, waItem } from "@/content/contact";
import type { Faq, Service } from "@/content/types";
import { t, uaeBase, type Locale } from "@/i18n";
import { JsonLd, crumbsLd, faqPage, medicalPage } from "@/lib/seo";
import { brandDubai, uaeMeta } from "./meta";

export const serviceParams = () => ALL_SERVICES.map((r) => ({ dept: r.dept.id, service: r.service.slug }));

export function serviceMeta(dept: string, slug: string, l: Locale) {
  const r = findService(dept, slug, l);
  if (!r) return {};
  const { service: s } = r;
  const path = `/uae/${dept}/${slug}/`;
  // Titles stay under ~65 characters so Google shows them in full: long service names drop the area name.
  const fit = (long: string, short: string) => (long.length > 65 ? short : long);
  return l === "ar"
    ? uaeMeta(l, path, fit(`${s.name} في دبي | عيادة بيونجيفيتي، البرشاء`, `${s.name} في دبي | بيونجيفيتي`), `${s.short} ${s.name} في بيونجيفيتي دبي: ما هو، ولمن يناسب، وماذا يشمل، وكيف تحجز عبر واتساب.`)
    : uaeMeta(l, path, fit(`${s.name} in Dubai | Biongevity Clinic, Al Barsha`, `${s.name} in Dubai | Biongevity`), `${s.short} ${s.name} at Biongevity Dubai: what it is, who it suits, what's included and how to book on WhatsApp.`);
}

const FACTS: [keyof NonNullable<Service["facts"]>, string][] = [["time", "clock"], ["downtime", "leaf"], ["sessions", "calendar"], ["where", "pin"]];
const dl = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function ServiceView({ dept, slug, l }: { dept: string; slug: string; l: Locale }) {
  const r = findService(dept, slug, l);
  if (!r) notFound();
  const { dept: d, group: g, service: s } = r;
  const x = t(l);
  const base = uaeBase(l);
  const path = serviceHref(d, s, l);
  const en = englishName(d.id, s.slug);
  const item = waItem(l, s.name, en);
  const related = g.services.filter((o) => o.slug !== s.slug).slice(0, 3);
  const fill = related.length < 3 ? d.groups.flatMap((o) => o.services).filter((o) => o.slug !== s.slug && !related.includes(o)).slice(0, 3 - related.length) : [];
  const faqs: Faq[] = [...(s.faqs ?? []), { q: x.faqPrice(s.name), a: x.faqPriceA }, { q: x.faqBook, a: x.faqBookA }];
  const facts = FACTS.filter(([k]) => s.facts?.[k]);
  const addr = addressOf(l);

  return (
    <div data-dept={d.id} data-item={en} data-page-item={item} data-page-track={en}>
      <JsonLd data={[
        crumbsLd([[brandDubai(l), `${base}/`], [d.name, deptHref(d, l)], [s.name, path]]),
        medicalPage({ name: `${s.name} · ${brandDubai(l)}`, description: s.about, path, about: [d.name], procedures: [s.name] }),
        faqPage(faqs),
      ]} />

      {/* HERO */}
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-12 pt-[calc(100px+var(--safe-top))] lg:pb-16 lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[[x.dubai, `${base}/`], [d.short, deptHref(d, l)], [s.name]]} />
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div>
              <Link href={`${deptHref(d, l)}#${g.id}`} className="t-eyebrow hover:opacity-80" data-rv>{g.name}</Link>
              <h1 className="t-h1 mt-5" data-rv style={dl(60)}>{s.name} <span className="t-italic block text-[0.62em] text-[rgb(var(--dept-deep))]">{x.inDubai}</span></h1>
              <p className="t-lede mt-5 max-w-[54ch]" data-rv style={dl(120)}>{s.short}</p>
              <div className="mt-8 flex flex-wrap gap-3" data-rv style={dl(160)}>
                <BookNow l={l} item={item} track={en} size="lg" />
                <PriceBtn l={l} item={item} track={en} size="lg" />
              </div>
              {facts.length > 0 && (
                <dl className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-4" data-rv style={dl(200)}>
                  {facts.map(([k, icon]) => (
                    <div key={k} className="fact6">
                      <dt className="flex items-center gap-1.5"><Icon name={icon} size={13} />{x.facts[k]}</dt>
                      <dd>{s.facts![k]}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div data-rv style={dl(120)}>
              <Photo k={s.photo ?? g.photo ?? d.photo} priority className="aspect-[5/4] rounded-[32px]" w={820} sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS / WHO / INCLUDED */}
      <section data-ai="About this treatment" className="sec-tight sec-white">
        <div className="wrap grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
          <div>
            <h2 className="t-h2" data-rv>{x.whatIs(s.name)}</h2>
            <p className="t-read mt-5" data-rv>{s.about}</p>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div data-rv>
                <h3 className="t-h3">{x.whoSuits}</h3>
                <Ticks items={s.forWho} className="mt-4" />
              </div>
              <div data-rv style={dl(80)}>
                <h3 className="t-h3">{x.included}</h3>
                <Ticks items={s.includes} className="mt-4" />
              </div>
            </div>
          </div>

          {/* Price & booking card */}
          <aside className="lg:sticky lg:top-[110px] lg:self-start" data-ai="Price and booking">
            <div className="card6 overflow-hidden" data-rv>
              <div className="bg-[rgb(var(--dept-soft))] px-7 py-6">
                <div className="t-eyebrow">{x.priceOffers}</div>
                <p className="mt-3 text-[16px] leading-relaxed text-ink/85">{x.priceText(s.name)}</p>
              </div>
              <div className="grid gap-3 p-7">
                <BookNow l={l} item={item} track={en} className="w-full" />
                <WhatsAppBtn l={l} text={x.wa.price(item)} label={x.askPriceWa} item={en} className="w-full" />
                <a href={UAE_CLINIC.tel} className="btn6 btn6-ghost w-full"><Icon name="call" size={17} />{x.call} <span dir="ltr">{UAE_CLINIC.phone}</span></a>
                <p className="pt-1 text-center text-[13px] text-faint">{x.vatNote}</p>
              </div>
            </div>
            <p className="mt-4 px-2 text-[14px] text-muted"><Icon name="pin" size={14} className="me-1 inline" />{addr[0]}{l === "ar" ? "، " : ", "}{addr[1]}</p>
          </aside>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section data-ai="How it works" className="sec-tight">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Head eyebrow={x.howItWorks} title={x.firstToFollow} />
            <div data-rv><BookNow l={l} item={item} track={en} size="sm" /></div>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.steps.map((st, i) => (
              <li key={st.t} className="rounded-[24px] border border-ink/[0.07] bg-white p-6" data-rv style={dl(i * 60)}>
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
            <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(var(--dept)/.35),transparent)]" />
            <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-[rgb(var(--dept))]"><Icon name={d.icon} size={30} /></span>
              <div>
                <div className="t-eyebrow">{x.partOfPlan}</div>
                <p className="t-quote mt-3">{d.longevity}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-ai="FAQ" className="sec-tight">
        <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Head eyebrow={x.questions} title={x.yourQuestions(s.name)} />
            <div className="mt-7" data-rv><BookNow l={l} item={item} track={en} size="sm" /></div>
            <Disclaimer l={l} className="mt-6 max-w-[42ch]" />
          </div>
          <div data-rv><FaqList items={faqs} /></div>
        </div>
      </section>

      <BookBand l={l} item={item} track={en} title={<>{x.bookIn(s.name)} <span className="t-italic">{x.inDubai}.</span></>} />

      {/* RELATED */}
      <section data-ai="Related" className="sec-tight pb-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-h2">{x.youMayLike}</h2>
            <Link href={deptHref(d, l)} className="link6 hidden sm:inline-flex">{x.allOf(d.short)} <Icon name="arrow-right" size={15} className="flip-rtl" /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...related, ...fill].map((o, i) => <ServiceCard key={o.slug} d={d} s={o} l={l} i={i} />)}
          </div>
          <Link href={deptHref(d, l)} className="link6 mt-6 sm:hidden">{x.allOf(d.short)} <Icon name="arrow-right" size={15} className="flip-rtl" /></Link>
        </div>
      </section>
    </div>
  );
}
