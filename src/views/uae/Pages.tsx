import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Disclaimer, Head } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { departments, deptById, deptHref } from "@/content/uae";
import { UAE_CLINIC, addressOf, waLink } from "@/content/contact";
import { uaeSupplements } from "@/content/supplements";
import { FOUNDER, FOUNDER_AR, UAE_DOCTORS } from "@/content/team";
import { t, uaeBase, type Locale } from "@/i18n";
import { JsonLd, crumbsLd } from "@/lib/seo";
import { brandDubai, uaeMeta } from "./meta";

const dl = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/* ───────────────────────── About: clinic & doctors ───────────────────────── */

const ABOUT = {
  en: {
    title: "Our Clinic & Doctors | Biongevity Dubai, Al Barsha",
    desc: "Inside Biongevity Precision Health and Longevity Clinic in Al Barsha, Dubai: our approach, our rooms and our team.",
    eyebrow: "Our clinic", h1a: "Precision health and longevity,", h1b: "in the heart of Dubai.",
    lede: `${UAE_CLINIC.name} brings skin, wellness, family medicine, diagnostics, dental care and longevity medicine together in one calm, modern clinic in Al Barsha.`,
    principles: [
      { icon: "stethoscope", t: "Doctor-led", d: "Every plan is set by a doctor after a proper assessment, and explained in plain words." },
      { icon: "heart", t: "You come first", d: "Unhurried appointments, honest advice and no pressure to buy." },
      { icon: "hourglass", t: "Longevity thinking", d: "We look at how you will feel in ten years, not only next week." },
      { icon: "users", t: "For every family", d: "A welcoming clinic for people of every background, age and culture." },
    ],
    insideEyebrow: "Inside the clinic", insideA: "Designed to feel", insideB: "calm and private.",
    teamEyebrow: "Our team", teamA: "Doctors who take", teamB: "the time.",
    teamLede: "Our doctors, nurses and therapists work as one team across skin, wellness, family medicine, diagnostics and dental care, so your care is joined up.",
    languages: "Languages", founder: "Founder",
    askDoc: "Ask about a doctor", askDocD: "Want to know who will see you, their experience or the languages they speak? Message us and we will tell you.", askWa: "Ask on WhatsApp",
    whatEyebrow: "What we do", whatTitle: "Eight departments, one team.",
  },
  ar: {
    title: "عيادتنا وأطباؤنا | بيونجيفيتي دبي، البرشاء",
    desc: "داخل عيادة بيونجيفيتي للصحة الدقيقة وطول العمر الصحي في البرشاء، دبي: أسلوبنا وغرفنا وفريقنا.",
    eyebrow: "عيادتنا", h1a: "الصحة الدقيقة وطول العمر الصحي،", h1b: "في قلب دبي.",
    lede: `تجمع ${UAE_CLINIC.nameAr} البشرة والعافية وطب الأسرة والفحوصات والعناية بالأسنان وطب طول العمر في عيادة واحدة هادئة وحديثة في البرشاء.`,
    principles: [
      { icon: "stethoscope", t: "بإشراف الأطباء", d: "يضع الطبيب كل خطة بعد تقييم دقيق، ويشرحها بكلمات بسيطة." },
      { icon: "heart", t: "أنت أولًا", d: "مواعيد دون استعجال، ونصيحة صادقة، ودون أي ضغط للشراء." },
      { icon: "hourglass", t: "تفكير طول العمر", d: "ننظر إلى شعورك بعد عشر سنوات، لا الأسبوع القادم فقط." },
      { icon: "users", t: "لكل العائلات", d: "عيادة ترحّب بالجميع من كل الخلفيات والأعمار والثقافات." },
    ],
    insideEyebrow: "داخل العيادة", insideA: "صُمّمت لتمنحك", insideB: "الهدوء والخصوصية.",
    teamEyebrow: "فريقنا", teamA: "أطباء يمنحونك", teamB: "وقتهم.",
    teamLede: "يعمل أطباؤنا وممرضونا ومعالجونا فريقًا واحدًا في البشرة والعافية وطب الأسرة والفحوصات والأسنان، لتكون رعايتك مترابطة.",
    languages: "اللغات", founder: "المؤسس",
    askDoc: "اسأل عن الأطباء", askDocD: "تريد أن تعرف من سيقابلك وخبرته واللغات التي يتحدثها؟ راسلنا وسنخبرك.", askWa: "اسأل عبر واتساب",
    whatEyebrow: "ما نقدّمه", whatTitle: "ثمانية أقسام، وفريق واحد.",
  },
} as const;

export const aboutMeta = (l: Locale) => uaeMeta(l, "/uae/about/", ABOUT[l].title, ABOUT[l].desc);

export function AboutView({ l }: { l: Locale }) {
  const c = ABOUT[l];
  const x = t(l);
  const base = uaeBase(l);
  const f = l === "ar" ? { ...FOUNDER, ...FOUNDER_AR } : FOUNDER;
  return (
    <>
      <JsonLd data={crumbsLd([[brandDubai(l), `${base}/`], [x.clinicDoctors, `${base}/about/`]])} />
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-14 pt-[calc(100px+var(--safe-top))] lg:pb-20 lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[[x.dubai, `${base}/`], [x.clinicDoctors]]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="t-eyebrow" data-rv>{c.eyebrow}</div>
              <h1 className="t-h1 mt-5" data-rv>{c.h1a} <span className="t-italic">{c.h1b}</span></h1>
              <p className="t-lede mt-6 max-w-[54ch]" data-rv>{c.lede}</p>
              <div className="mt-8 flex flex-wrap gap-3" data-rv><BookNow l={l} size="lg" /><a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="btn6 btn6-ghost btn6-lg"><Icon name="pin" size={18} />{x.getDirections}</a></div>
            </div>
            <div className="ph6 aspect-[4/3] overflow-hidden rounded-[32px]" data-rv>
              <video className="absolute inset-0 h-full w-full object-cover" src="/media/clinic-loop.mp4" poster="/media/clinic-loop.jpg" autoPlay muted loop playsInline preload="none" aria-label={brandDubai(l)} />
            </div>
          </div>
        </div>
      </section>

      <section data-ai="Principles" className="sec-tight sec-white">
        <div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.principles.map((p, i) => (
            <div key={p.t} className="rounded-[26px] bg-[rgb(var(--c-canvas))] p-7" data-rv style={dl(i * 60)}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-gold-deep"><Icon name={p.icon} size={22} /></span>
              <h2 className="t-h3 mt-5">{p.t}</h2>
              <p className="t-body mt-2">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-ai="Inside the clinic" className="sec">
        <div className="wrap">
          <Head eyebrow={c.insideEyebrow} title={<>{c.insideA} <span className="t-italic">{c.insideB}</span></>} />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {["clinicEntrance", "clinicLounge", "clinicCorridor", "clinicTreatment", "clinicDental", "clinicLaser"].map((k, i) => (
              <Photo key={k} k={k} className={`aspect-[4/3] rounded-[24px] ${i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto" : ""}`} w={i === 0 ? 900 : 520} sizes={i === 0 ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 50vw"} />
            ))}
          </div>
        </div>
      </section>

      <section data-ai="Doctors" className="sec sec-sand">
        <div className="wrap">
          <Head eyebrow={c.teamEyebrow} title={<>{c.teamA} <span className="t-italic">{c.teamB}</span></>} lede={c.teamLede} />
          {UAE_DOCTORS.length > 0 && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {UAE_DOCTORS.map((doc) => (
                <article key={doc.id} className="card6 overflow-hidden" data-rv>
                  {doc.photo && <div className="ph6 aspect-[4/5]"><img src={doc.photo} alt={doc.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div>}
                  <div className="p-6">
                    <h3 className="text-[20px] font-semibold">{doc.name}</h3>
                    <p className="text-[14.5px] font-medium text-gold-deep">{doc.title}</p>
                    <ul className="mt-3 grid gap-1 text-[14px] text-muted">{doc.credentials.map((cr) => <li key={cr}>{cr}</li>)}</ul>
                    {doc.languages && <p className="mt-3 text-[13.5px] text-faint">{c.languages}: {doc.languages.join(", ")}</p>}
                    <p className="t-body mt-3 !text-[15px]">{doc.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <article className="card6 p-7 sm:p-9" data-rv>
              <div className="t-eyebrow">{c.founder}</div>
              <h3 className="mt-3 font-display text-[30px] leading-tight">{f.name}</h3>
              <p className="mt-1 text-[15px] font-medium text-gold-deep">{f.title}</p>
              <p className="t-body mt-4">{f.bio}</p>
              <a href={FOUNDER.linkedin} target="_blank" rel="noopener" className="link6 mt-5 text-[15px]">LinkedIn <Icon name="arrow-up-right" size={14} /></a>
            </article>
            <div className="card6 flex flex-col justify-between p-7 sm:p-9" data-rv>
              <div>
                <h3 className="text-[22px] font-semibold tracking-tight">{c.askDoc}</h3>
                <p className="t-body mt-2">{c.askDocD}</p>
              </div>
              <WhatsAppBtn l={l} text={x.wa.doctors} label={c.askWa} item="Ask about doctors" className="mt-6 self-start" />
            </div>
          </div>
        </div>
      </section>

      <section data-ai="Departments" className="sec">
        <div className="wrap">
          <Head eyebrow={c.whatEyebrow} title={c.whatTitle} />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departments(l).map((d, i) => (
              <li key={d.id} data-dept={d.id} data-rv style={dl((i % 4) * 50)}>
                <Link href={deptHref(d, l)} className="card6 flex h-full items-center gap-3.5 p-5">
                  <span className="dept-tile"><Icon name={d.icon} size={21} /></span>
                  <span className="flex-1 text-[16px] font-semibold leading-snug">{d.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BookBand l={l} />
    </>
  );
}

/* ───────────────────────── Contact & location ───────────────────────── */

export const contactMeta = (l: Locale) => l === "ar"
  ? uaeMeta(l, "/uae/contact/", "التواصل والموقع | بيونجيفيتي دبي، البرشاء", `احجز أو اسأل عبر واتساب ${UAE_CLINIC.whatsappDisplay}، أو اتصل على ${UAE_CLINIC.phone}، أو زرنا في ${UAE_CLINIC.addressAr.join("، ")}.`)
  : uaeMeta(l, "/uae/contact/", "Contact & Location | Biongevity Dubai, Al Barsha", `Book or ask a question on WhatsApp ${UAE_CLINIC.whatsappDisplay}, call ${UAE_CLINIC.phone} or visit us at ${UAE_CLINIC.address.join(", ")}.`);

export function ContactView({ l }: { l: Locale }) {
  const x = t(l);
  const base = uaeBase(l);
  const addr = addressOf(l);
  const ways = [
    { icon: "whatsapp", t: "WhatsApp", v: UAE_CLINIC.whatsappDisplay, ltr: true, href: waLink(x.wa.general), d: x.waWay, ext: true },
    { icon: "call", t: x.callWay, v: UAE_CLINIC.phone, ltr: true, href: UAE_CLINIC.tel, d: x.callWayD },
    { icon: "mail", t: x.emailWay, v: UAE_CLINIC.email, ltr: true, href: `mailto:${UAE_CLINIC.email}`, d: x.emailWayD },
    { icon: "pin", t: x.visitWay, v: addr[0], href: UAE_CLINIC.mapUrl, d: `${addr[1]}${l === "ar" ? "، " : ", "}${addr[2]}`, ext: true },
  ];
  return (
    <>
      <JsonLd data={crumbsLd([[brandDubai(l), `${base}/`], [x.contact, `${base}/contact/`]])} />
      <section data-ai="Contact" className="relative isolate overflow-hidden pb-20 pt-[calc(100px+var(--safe-top))] lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[[x.dubai, `${base}/`], [x.contact]]} />
          <Head as="h1" className="mt-8" eyebrow={x.contactLocation} title={<>{x.contactTitle} <span className="t-italic">{x.contactItalic}</span></>} lede={x.contactLede} />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <ul className="grid content-start gap-3">
              {ways.map((w, i) => (
                <li key={w.icon} data-rv style={dl(i * 60)}>
                  <a href={w.href} target={w.ext ? "_blank" : undefined} rel={w.ext ? "noopener" : undefined} data-item={`Contact: ${w.icon}`} className="card6 flex items-start gap-4 p-5">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${w.icon === "whatsapp" ? "bg-[rgb(var(--c-wa))] text-white" : "bg-[rgb(var(--c-canvas))] text-gold-deep"}`}><Icon name={w.icon} size={22} weight={w.icon === "whatsapp" ? "fill" : "regular"} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold uppercase tracking-[.12em] text-faint">{w.t}</span>
                      <span className="mt-0.5 block break-words text-[18px] font-semibold" dir={w.ltr ? "ltr" : undefined}>{w.v}</span>
                      <span className="mt-0.5 block text-[14.5px] text-muted">{w.d}</span>
                    </span>
                    <Icon name={w.ext ? "arrow-up-right" : "arrow-right"} size={16} className={`mt-1 text-faint ${w.ext ? "" : "flip-rtl"}`} />
                  </a>
                </li>
              ))}
              <li className="px-1 pt-2 text-[14px] text-muted" data-rv>{x.vatNote} {x.emergency}</li>
            </ul>
            <div data-rv>
              <h2 className="t-h3 mb-4">{x.sendAnEnquiry}</h2>
              <EnquiryForm mode="uae" l={l} interests={[x.notSureAdvise, ...departments(l).map((d) => d.name), x.suppEyebrow]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── Supplements (UAE-approved only) ───────────────────────── */

export const supplementsMeta = (l: Locale) => l === "ar"
  ? uaeMeta(l, "/uae/supplements/", "مكملات طول العمر في الإمارات | بيونجيفيتي دبي", "مكملات طول العمر المتوفرة في الإمارات لدى بيونجيفيتي دبي: LONgevity+ وCellOmega+ وCreagen. اسأل فريقنا على واتساب.")
  : uaeMeta(l, "/uae/supplements/", "Longevity Supplements in the UAE | Biongevity Dubai", "Longevity supplements available in the UAE at Biongevity Dubai: LONgevity+, CellOmega+ and Creagen. Ask our team on WhatsApp.");

/** Only UAE-approved formulas are listed (src/content/supplements.ts). No prices: visitors ask on WhatsApp. */
export function SupplementsView({ l }: { l: Locale }) {
  const x = t(l);
  const base = uaeBase(l);
  const longevity = deptById("longevity-precision-health", l)!;
  return (
    <div data-dept="longevity-precision-health">
      <JsonLd data={crumbsLd([[brandDubai(l), `${base}/`], [x.supplements, `${base}/supplements/`]])} />
      <section data-ai="Supplements" className="relative isolate overflow-hidden pb-16 pt-[calc(100px+var(--safe-top))] lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[[x.dubai, `${base}/`], [x.supplements]]} />
          <Head as="h1" className="mt-8" eyebrow={x.suppEyebrow} title={<>{x.suppTitle} <span className="t-italic">{x.suppItalic}</span></>} lede={x.suppLede} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {uaeSupplements(l).map((s, i) => (
              <article key={s.id} className="card6 spot6 flex flex-col p-7" data-item={s.name} data-rv style={dl(i * 70)}>
                <div className="font-display text-[34px] leading-none text-[rgb(var(--dept-deep))]" dir="ltr">{s.name}</div>
                <p className="mt-3 text-[16px] font-semibold">{s.line}</p>
                <p className="t-body mt-2 !text-[15.5px]">{s.detail}</p>
                <WhatsAppBtn l={l} text={x.wa.supplement(s.name)} label={x.askAboutIt} size="sm" item={s.name} className="mt-auto self-start" />
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <Disclaimer l={l} />
            <Link href={deptHref(longevity, l)} className="link6 lg:justify-self-end">{longevity.name} <Icon name="arrow-right" size={15} className="flip-rtl" /></Link>
          </div>
          <p className="mt-4 max-w-[70ch] text-[13px] text-faint">{x.suppNote}</p>
        </div>
      </section>
      <BookBand l={l} item={x.suppEyebrow} track="Longevity supplements" title={<>{x.suppBandTitle} <span className="t-italic">{x.suppBandItalic}</span></>} lede={x.suppBandLede} />
    </div>
  );
}
