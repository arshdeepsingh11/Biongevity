import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Disclaimer, FaqList, Head } from "@/components/site/Blocks";
import { DeptCard, ServiceCard } from "@/components/site/Cards";
import { DEPARTMENTS, departments, deptById, deptHref, englishName, servicesOf } from "@/content/uae";
import { waItem } from "@/content/contact";
import { t, uaeBase, type Locale } from "@/i18n";
import { JsonLd, crumbsLd, faqPage, medicalPage } from "@/lib/seo";
import { brandDubai, uaeMeta } from "./meta";

export const deptParams = () => DEPARTMENTS.map((d) => ({ dept: d.id }));

export function deptMeta(id: string, l: Locale) {
  const d = deptById(id, l);
  if (!d) return {};
  const names = servicesOf(d).slice(0, 6).map((s) => s.name).join(l === "ar" ? "، " : ", ");
  return l === "ar"
    ? uaeMeta(l, `/uae/${d.id}/`, `${d.name} في دبي | عيادة بيونجيفيتي`, `${d.tagline} ${names} والمزيد في بيونجيفيتي دبي، البرشاء. احجز عبر واتساب.`)
    : uaeMeta(l, `/uae/${d.id}/`, `${d.name} in Dubai | Biongevity Clinic`, `${d.tagline} ${names} and more at Biongevity Dubai, Al Barsha. Book on WhatsApp.`);
}

const dl = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function DepartmentView({ id, l }: { id: string; l: Locale }) {
  const d = deptById(id, l);
  if (!d) notFound();
  const x = t(l);
  const base = uaeBase(l);
  const path = deptHref(d, l);
  const en = englishName(d.id);
  const item = waItem(l, d.name, en);
  const all = servicesOf(d);
  const others = departments(l).filter((o) => o.id !== d.id).slice(0, 3);

  return (
    <div data-dept={d.id} data-item={en}>
      <JsonLd data={[
        crumbsLd([[brandDubai(l), `${base}/`], [d.name, path]]),
        medicalPage({ name: `${d.name} · ${brandDubai(l)}`, description: d.intro, path, about: [d.name], procedures: all.map((s) => s.name) }),
        faqPage(d.faqs),
      ]} />

      {/* HERO */}
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-14 pt-[calc(100px+var(--safe-top))] lg:pb-20 lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[[x.dubai, `${base}/`], [x.crumbTreatments, `${base}/#treatments`], [d.name]]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3" data-rv><span className="dept-tile"><Icon name={d.icon} size={22} /></span><span className="t-eyebrow">{x.treatmentsServicesCount(all.length)}</span></div>
              <h1 className="t-h1 mt-6" data-rv style={dl(60)}>{d.name}</h1>
              <p className="t-tag mt-4 text-[rgb(var(--dept-deep))]" data-rv style={dl(100)}>{d.tagline}</p>
              <p className="t-lede mt-5 max-w-[56ch]" data-rv style={dl(140)}>{d.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3" data-rv style={dl(180)}>
                <BookNow l={l} item={item} track={en} size="lg" />
                <WhatsAppBtn l={l} text={x.wa.help(l === "ar" ? item : d.short.toLowerCase())} label={x.helpMeChoose} size="lg" variant="ghost" item={en} />
              </div>
            </div>
            <div className="relative" data-rv style={dl(120)}>
              <Photo k={d.photo} priority className="aspect-[5/4] rounded-[32px] lg:aspect-[4/5]" w={820} sizes="(min-width:1024px) 40vw, 100vw" />
              <div className="card6 absolute -bottom-5 end-5 start-5 p-5 sm:start-auto sm:max-w-[320px]">
                <div className="t-eyebrow">{x.longevityLabel}</div>
                <p className="mt-2 text-[15px] font-medium leading-snug text-ink">{d.longevity}</p>
              </div>
            </div>
          </div>

          {d.groups.length > 1 && (
            <nav aria-label={x.sections} className="no-scrollbar -mx-5 mt-14 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" data-rv>
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
                <span className="text-[14px] font-semibold text-[rgb(var(--dept-deep))]">{x.treatmentsCount(g.services.length)}</span>
                <BookNow l={l} item={waItem(l, g.name, DEPARTMENTS.find((o) => o.id === d.id)!.groups[gi].name)} track={DEPARTMENTS.find((o) => o.id === d.id)!.groups[gi].name} size="sm" />
              </div>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.services.map((s, i) => <ServiceCard key={s.slug} d={d} s={s} l={l} i={i} />)}
            </div>
          </div>
        </section>
      ))}

      {/* WHY + STEPS (department tint) */}
      <section data-ai="Why us" className="sec sec-dept">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            {d.why.map((w, i) => (
              <div key={w.t} className="rounded-[26px] bg-white/70 p-7" data-rv style={dl(i * 70)}>
                <Icon name="check" size={22} weight="bold" className="text-[rgb(var(--dept-deep))]" />
                <h3 className="t-h3 mt-4">{w.t}</h3>
                <p className="t-body mt-2">{w.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Head eyebrow={x.howItWorks} title={x.stepByStep} />
              <div className="mt-7" data-rv><BookNow l={l} item={item} track={en} size="sm" /></div>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {d.steps.map((s, i) => (
                <li key={s.t} className="rounded-[24px] border border-ink/[0.07] bg-white p-6" data-rv style={dl(i * 60)}>
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
              <h2 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">{x.notSureDeptTitle}</h2>
              <p className="t-body mt-2 max-w-[56ch]">{x.notSureDeptText}</p>
            </div>
            <WhatsAppBtn l={l} text={x.wa.help(l === "ar" ? item : d.short.toLowerCase())} label={x.helpMeChoose} size="lg" item={en} className="shrink-0" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-ai="FAQ" className="sec">
        <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Head eyebrow={x.questions} title={x.goodToKnowDept(d.short)} />
            <div className="mt-7" data-rv><BookNow l={l} item={item} track={en} size="sm" /></div>
            <Disclaimer l={l} className="mt-6 max-w-[42ch]" />
          </div>
          <div data-rv><FaqList items={d.faqs} /></div>
        </div>
      </section>

      <BookBand l={l} item={item} track={en} />

      {/* OTHER DEPARTMENTS */}
      <section data-ai="Other departments" className="sec-tight pb-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-h2">{x.moreAt}</h2>
            <Link href={`${base}/#departments`} className="link6 hidden sm:inline-flex">{x.allDepartments} <Icon name="arrow-right" size={15} className="flip-rtl" /></Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => <DeptCard key={o.id} d={o} l={l} i={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
