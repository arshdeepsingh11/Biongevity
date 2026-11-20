import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, FaqList, Head } from "@/components/site/Blocks";
import { DeptCard, PopularCard } from "@/components/site/Cards";
import { ALL_SERVICES, DEPARTMENTS, LONGEVITY_AREAS, deptById, deptHref, popularServices, serviceHref } from "@/content/uae";
import { UAE_CLINIC, WA, waLink } from "@/content/contact";
import { UAE_SUPPLEMENTS } from "@/content/supplements";
import { JsonLd, crumbsLd, faqPage } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Biongevity Dubai — Skin, Wellness & Longevity Clinic in Al Barsha" },
  description: "Doctor-led clinic in Dubai for dermatology and aesthetics, IV therapy, GP and health checks, longevity testing, diagnostics, dental care, home healthcare and telehealth. Book on WhatsApp.",
  alternates: { canonical: "/uae/" },
  openGraph: { title: "Biongevity Dubai", description: "Skin, wellness and longevity clinic in Al Barsha, Dubai.", url: "/uae/", locale: "en_AE" },
};

const FAQ = [
  { q: "Where is the clinic?", a: `${UAE_CLINIC.address.join(", ")}. Message us on WhatsApp for directions and parking.` },
  { q: "How do I book?", a: "Tap Book now or WhatsApp us. Our team confirms your appointment, answers questions and shares prices and current offers. You can also call the clinic." },
  { q: "Why are prices not on the website?", a: "Prices depend on your treatment plan and we regularly run offers, so our team shares today's price on WhatsApp. 5% VAT applies and is added at booking and check-in." },
  { q: "Do I need to see a doctor first?", a: "For injectables, lasers and medical treatments, a doctor checks that the treatment is safe and right for you. For facials and drips, a short check is done on the day." },
  { q: "Do you offer home visits and online consultations?", a: "Yes. Doctors and nurses can visit you at home or in your hotel, and many consultations can be done by secure video." },
];

export default function UaeHome() {
  const popular = popularServices();
  const [first, ...rest] = DEPARTMENTS;
  return (
    <>
      <JsonLd data={[faqPage(FAQ), crumbsLd([["Biongevity Dubai", "/uae/"]])]} />

      {/* HERO */}
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-14 pt-[calc(108px+var(--safe-top))] lg:pb-24 lg:pt-[150px]" data-dept="dermatology-aesthetics">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="t-eyebrow !text-[rgb(var(--c-gold-deep))]" data-rv>Biongevity Dubai · Al Barsha</div>
            <h1 className="t-hero mt-5" data-rv style={{ "--d": "60ms" } as React.CSSProperties}>Look well. Feel well. <span className="t-italic">Live longer.</span></h1>
            <p className="t-lede mt-6 max-w-[52ch]" data-rv style={{ "--d": "120ms" } as React.CSSProperties}>A doctor-led clinic for skin, wellness and longevity in Dubai. From a HydraFacial to a full health check, every treatment is planned around you.</p>
            <div className="mt-8 flex flex-wrap gap-3" data-rv style={{ "--d": "180ms" } as React.CSSProperties}>
              <BookNow size="lg" />
              <a href="#treatments" className="btn6 btn6-ghost btn6-lg">Explore treatments<Icon name="arrow-right" size={17} /></a>
            </div>
            <ul className="mt-9 flex flex-wrap gap-2" data-rv style={{ "--d": "240ms" } as React.CSSProperties}>
              {DEPARTMENTS.slice(0, 5).map((d) => (
                <li key={d.id} data-dept={d.id}><Link href={deptHref(d)} className="pill6 hover:border-ink/20"><span className="dept-dot" />{d.short}</Link></li>
              ))}
            </ul>
          </div>

          <div className="relative" data-rv style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className="grid grid-cols-[1.25fr_1fr] gap-3 sm:gap-4">
              <Photo k="womanShortHair" priority className="h-full min-h-[300px] rounded-[30px]" w={760} sizes="(min-width:1024px) 28vw, 55vw" />
              <div className="grid content-between gap-3 sm:gap-4">
                <Photo k="hijabPortrait" priority className="aspect-square rounded-[26px]" w={520} sizes="(min-width:1024px) 20vw, 40vw" />
                <Photo k="clinicLounge" className="aspect-square rounded-[26px]" w={520} sizes="(min-width:1024px) 20vw, 40vw" />
              </div>
            </div>
            <a href={waLink(WA.help())} target="_blank" rel="noopener" className="card6 absolute -bottom-6 left-4 right-4 flex items-center gap-3.5 p-4 sm:left-auto sm:right-6 sm:w-[300px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[rgb(var(--c-wa))] text-white"><Icon name="whatsapp" size={22} weight="fill" /></span>
              <span className="min-w-0"><span className="block text-[15px] font-semibold">Not sure where to start?</span><span className="block text-[13.5px] text-muted">Message us. We will help you choose.</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* TREATMENT MARQUEE (all services, internal links) */}
      <section aria-label="All treatments" className="border-y border-ink/[0.07] bg-white/60 py-5">
        <div className="marq6-wrap">
          <div className="marq6" style={{ "--dur": "120s" } as React.CSSProperties}>
            {[0, 1].map((k) => ALL_SERVICES.map(({ dept, service }) => (
              <Link key={`${k}-${dept.id}-${service.slug}`} href={serviceHref(dept, service)} data-dept={dept.id} className="pill6 shrink-0 bg-white hover:border-ink/20" tabIndex={k ? -1 : undefined} aria-hidden={k ? true : undefined}>
                <span className="dept-dot" />{service.name}
              </Link>
            )))}
          </div>
        </div>
      </section>

      {/* POPULAR — skin first */}
      <section id="treatments" data-ai="Popular treatments" className="sec anchor6">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Head eyebrow="Most requested" title={<>Skin and wellness, <span className="t-italic">done properly.</span></>} lede="Our most requested treatments. Each one starts with a short check, so it is right for your skin and your goals." />
            <div className="flex flex-wrap items-center gap-5" data-rv>
              <Link href={deptHref(DEPARTMENTS[0])} className="link6 text-[16px]">All skin treatments <Icon name="arrow-right" size={16} /></Link>
              <BookNow item="Skin treatment" size="sm" />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {popular.map((r, i) => <PopularCard key={r.service.slug} d={r.dept} g={r.group} s={r.service} i={i} />)}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section data-ai="Departments" className="sec sec-sand">
        <div className="wrap">
          <Head eyebrow="Our departments" title={<>Everything you need, <span className="t-italic">under one roof.</span></>} lede="Eight departments, one team. Choose a department to see every treatment, what it involves and how to book." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DeptCard d={first} big className="sm:col-span-2 lg:row-span-2" />
            {rest.map((d, i) => <DeptCard key={d.id} d={d} i={i + 1} />)}
            <a href={waLink(WA.help())} target="_blank" rel="noopener" className="sec-dark flex flex-col justify-between rounded-[26px] p-7" data-rv>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[rgb(var(--c-wa))] text-white"><Icon name="whatsapp" size={23} weight="fill" /></span>
              <span>
                <span className="block font-display text-[26px] leading-tight">Not sure which department?</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-white/70">Tell us what you need on WhatsApp. We will point you to the right doctor.</span>
                <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold">Help me choose <Icon name="arrow-right" size={15} /></span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* LONGEVITY FOR EVERY PART OF YOU (dark) */}
      <section data-ai="Longevity" className="sec sec-dark overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-60 top-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-gold)/.18),transparent)]" />
        <div className="wrap relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <Head eyebrow="Longevity, for every part of you" title={<>Not just how you look. <span className="t-italic">How you age.</span></>} />
            <p className="t-lede max-w-[54ch]" data-rv>Every treatment and test is part of one idea: more healthy years. Longevity for your skin, your heart, your gut, your mind and your hair, measured where it matters and followed over time.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {LONGEVITY_AREAS.map((a, i) => {
              const d = deptById(a.dept)!;
              return (
                <Link key={a.t} href={deptHref(d)} data-dept={d.id} className="group rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25 hover:bg-white/[0.08] sm:p-6" data-rv style={{ "--d": `${(i % 4) * 60}ms` } as React.CSSProperties}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgb(var(--dept)/.18)] text-[rgb(var(--dept))]"><Icon name={a.icon} size={21} /></span>
                  <div className="mt-5 text-[18px] font-semibold tracking-tight">Longevity for your {a.t.toLowerCase()}</div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{a.d}</p>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3" data-rv>
            <BookNow item="Longevity consultation" variant="light" />
            <Link href={deptHref(deptById("longevity-precision-health")!)} className="btn6 btn6-outline-light">Longevity & Precision Health<Icon name="arrow-right" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section data-ai="How it works" className="sec">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head eyebrow="How it works" title={<>Simple from the <span className="t-italic">first message.</span></>} />
            <ol className="mt-10 grid gap-6">
              {[
                ["Message or book", "Tap Book now or WhatsApp us. Tell us what you would like help with."],
                ["We confirm", "Our team suggests the right service, shares prices and offers, and confirms a time."],
                ["Your visit", "A doctor-led assessment, then your treatment or test, in clinic, at home or online."],
                ["Follow-up", "Clear aftercare, results explained and a plan for what comes next."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[52px_1fr] gap-4" data-rv style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                  <span className="font-display grid h-[52px] w-[52px] place-items-center rounded-full border border-gold/50 text-[20px] text-gold-deep">{i + 1}</span>
                  <div><div className="t-h3">{t}</div><p className="t-body mt-1">{d}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3" data-rv><BookNow /><WhatsAppBtn variant="ghost" /></div>
          </div>
          <div className="relative" data-rv>
            <div className="ph6 aspect-[4/5] overflow-hidden rounded-[32px] sm:aspect-[5/4] lg:aspect-[4/5]">
              <video className="absolute inset-0 h-full w-full object-cover" src="/media/clinic-loop.mp4" poster="/media/clinic-loop.jpg" autoPlay muted loop playsInline preload="none" aria-label="Inside Biongevity Dubai" />
            </div>
            <div className="card6 absolute -bottom-6 -left-2 max-w-[280px] p-5 sm:-left-6">
              <div className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold-deep">Visit us</div>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug">{UAE_CLINIC.address[0]}</p>
              <p className="text-[14px] text-muted">{UAE_CLINIC.address[1]}</p>
              <a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="link6 mt-3 text-[14px]">Open in Maps <Icon name="arrow-up-right" size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* HOME & ONLINE */}
      <section data-ai="Home and online care" className="sec-tight">
        <div className="wrap grid gap-5 md:grid-cols-2">
          {(["home-healthcare", "telehealth"] as const).map((id) => {
            const d = deptById(id)!;
            return (
              <Link key={id} href={deptHref(d)} data-dept={id} className="card6 group grid overflow-hidden sm:grid-cols-[.9fr_1.1fr]" data-rv>
                <Photo k={d.photo} className="aspect-[16/10] sm:aspect-auto sm:h-full" w={600} sizes="(min-width:768px) 22vw, 100vw" />
                <div className="flex flex-col p-6 sm:p-7">
                  <span className="dept-tile"><Icon name={d.icon} size={21} /></span>
                  <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{d.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.tagline}</p>
                  <span className="link6 mt-auto pt-5">See services <Icon name="arrow-right" size={15} /></span>
                </div>
              </Link>
            );
          })}
          <div className="flex flex-wrap items-center justify-center gap-3 md:col-span-2" data-rv>
            <BookNow item="Home visit" label="Book a home visit" size="sm" />
            <BookNow item="Online consultation" label="Book an online consultation" size="sm" />
          </div>
        </div>
      </section>

      {/* CLINIC & TRUST */}
      <section data-ai="Our clinic" className="sec">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Head eyebrow="Our clinic" title={<>A calm, modern clinic <span className="t-italic">in Al Barsha.</span></>} />
            <p className="t-lede" data-rv>Private treatment rooms, a dental suite, laser and skin rooms, and a team of doctors, nurses and therapists working together, so your care feels joined up from the first message to your follow-up.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[["clinicEntrance", "lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto"], ["clinicCorridor", "aspect-square"], ["clinicTreatment", "aspect-square"], ["clinicDental", "aspect-square"], ["clinicLaser", "aspect-square"]].map(([k, c], i) => (
              <Photo key={k} k={k} className={`${c} rounded-[24px]`} w={i === 0 ? 900 : 500} sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" data-rv>
            <BookNow size="sm" />
            <Link href="/uae/about/" className="link6 text-[16px]">About the clinic and our doctors <Icon name="arrow-right" size={16} /></Link>
            <a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="link6 text-[16px]">Get directions <Icon name="arrow-up-right" size={16} /></a>
          </div>
        </div>
      </section>

      {/* SUPPLEMENTS */}
      <section data-ai="Supplements" className="sec-tight">
        <div className="wrap">
          <div className="card6 grid gap-8 overflow-hidden p-7 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center" data-dept="longevity-precision-health" data-rv>
            <div>
              <div className="t-eyebrow is-dept">Longevity supplements</div>
              <h2 className="t-h2 mt-4">Daily support, <span className="t-italic">chosen with your doctor.</span></h2>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <WhatsAppBtn text="Hi Biongevity Dubai, I'd like advice on longevity supplements." label="Ask about supplements" size="sm" item="Longevity supplements" />
                <Link href="/uae/supplements/" className="link6 text-[15px]">See all <Icon name="arrow-right" size={15} /></Link>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              {UAE_SUPPLEMENTS.map((s) => (
                <li key={s.id} className="rounded-[22px] bg-[rgb(var(--dept-soft))] p-5">
                  <div className="font-display text-[24px] text-[rgb(var(--dept-deep))]">{s.name}</div>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/75">{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-ai="FAQ" className="sec">
        <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Head eyebrow="Questions" title={<>Good to <span className="t-italic">know.</span></>} />
            <div className="mt-7 flex flex-wrap gap-3" data-rv><BookNow size="sm" /><WhatsAppBtn size="sm" variant="ghost" label="Ask a question" text="Hi Biongevity Dubai, I have a question." /></div>
          </div>
          <div data-rv><FaqList items={FAQ} /></div>
        </div>
      </section>

      <BookBand title={<>Your first step is <span className="t-italic">one message.</span></>} />
    </>
  );
}
