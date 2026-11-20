import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, Crumbs, Head } from "@/components/site/Blocks";
import { DEPARTMENTS, deptHref } from "@/content/uae";
import { UAE_CLINIC } from "@/content/contact";
import { FOUNDER, UAE_DOCTORS } from "@/content/team";
import { JsonLd, crumbsLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Our Clinic & Doctors | Biongevity Dubai, Al Barsha" },
  description: "Inside Biongevity Precision Health and Longevity Clinic in Al Barsha, Dubai: our approach, our rooms and our team.",
  alternates: { canonical: "/uae/about/" },
};

const PRINCIPLES = [
  { icon: "stethoscope", t: "Doctor-led", d: "Every plan is set by a doctor after a proper assessment, and explained in plain words." },
  { icon: "heart", t: "You come first", d: "Unhurried appointments, honest advice and no pressure to buy." },
  { icon: "hourglass", t: "Longevity thinking", d: "We look at how you will feel in ten years, not only next week." },
  { icon: "users", t: "For every family", d: "A welcoming clinic for people of every background, age and culture." },
];

export default function AboutClinic() {
  return (
    <>
      <JsonLd data={crumbsLd([["Biongevity Dubai", "/uae/"], ["Clinic & doctors", "/uae/about/"]])} />
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-14 pt-[calc(100px+var(--safe-top))] lg:pb-20 lg:pt-[132px]">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap">
          <Crumbs items={[["Dubai", "/uae/"], ["Clinic & doctors"]]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="t-eyebrow" data-rv>Our clinic</div>
              <h1 className="t-h1 mt-5" data-rv>Precision health and longevity, <span className="t-italic">in the heart of Dubai.</span></h1>
              <p className="t-lede mt-6 max-w-[54ch]" data-rv>{UAE_CLINIC.name} brings skin, wellness, family medicine, diagnostics, dental care and longevity medicine together in one calm, modern clinic in Al Barsha.</p>
              <div className="mt-8 flex flex-wrap gap-3" data-rv><BookNow size="lg" /><a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="btn6 btn6-ghost btn6-lg"><Icon name="pin" size={18} />Get directions</a></div>
            </div>
            <div className="ph6 aspect-[4/3] overflow-hidden rounded-[32px]" data-rv>
              <video className="absolute inset-0 h-full w-full object-cover" src="/media/clinic-loop.mp4" poster="/media/clinic-loop.jpg" autoPlay muted loop playsInline preload="none" aria-label="Inside Biongevity Dubai" />
            </div>
          </div>
        </div>
      </section>

      <section data-ai="Principles" className="sec-tight sec-white">
        <div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <div key={p.t} className="rounded-[26px] bg-[rgb(var(--c-canvas))] p-7" data-rv style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-gold-deep"><Icon name={p.icon} size={22} /></span>
              <h2 className="t-h3 mt-5">{p.t}</h2>
              <p className="t-body mt-2">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-ai="Inside the clinic" className="sec">
        <div className="wrap">
          <Head eyebrow="Inside the clinic" title={<>Designed to feel <span className="t-italic">calm and private.</span></>} />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {["clinicEntrance", "clinicLounge", "clinicCorridor", "clinicTreatment", "clinicDental", "clinicLaser"].map((k, i) => (
              <Photo key={k} k={k} className={`aspect-[4/3] rounded-[24px] ${i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto" : ""}`} w={i === 0 ? 900 : 520} sizes={i === 0 ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 50vw"} />
            ))}
          </div>
        </div>
      </section>

      <section data-ai="Doctors" className="sec sec-sand">
        <div className="wrap">
          <Head eyebrow="Our team" title={<>Doctors who take <span className="t-italic">the time.</span></>} lede="Our doctors, nurses and therapists work as one team across skin, wellness, family medicine, diagnostics and dental care, so your care is joined up." />
          {UAE_DOCTORS.length > 0 && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {UAE_DOCTORS.map((doc) => (
                <article key={doc.id} className="card6 overflow-hidden" data-rv>
                  {doc.photo && <div className="ph6 aspect-[4/5]"><img src={doc.photo} alt={doc.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div>}
                  <div className="p-6">
                    <h3 className="text-[20px] font-semibold">{doc.name}</h3>
                    <p className="text-[14.5px] font-medium text-gold-deep">{doc.title}</p>
                    <ul className="mt-3 grid gap-1 text-[14px] text-muted">{doc.credentials.map((c) => <li key={c}>{c}</li>)}</ul>
                    {doc.languages && <p className="mt-3 text-[13.5px] text-faint">Languages: {doc.languages.join(", ")}</p>}
                    <p className="t-body mt-3 !text-[15px]">{doc.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <article className="card6 p-7 sm:p-9" data-rv>
              <div className="t-eyebrow">Founder</div>
              <h3 className="mt-3 font-display text-[30px] leading-tight">{FOUNDER.name}</h3>
              <p className="mt-1 text-[15px] font-medium text-gold-deep">{FOUNDER.title}</p>
              <p className="t-body mt-4">{FOUNDER.bio}</p>
              <a href={FOUNDER.linkedin} target="_blank" rel="noopener" className="link6 mt-5 text-[15px]">LinkedIn <Icon name="arrow-up-right" size={14} /></a>
            </article>
            <div className="card6 flex flex-col justify-between p-7 sm:p-9" data-rv>
              <div>
                <h3 className="text-[22px] font-semibold tracking-tight">Ask about a doctor</h3>
                <p className="t-body mt-2">Want to know who will see you, their experience or the languages they speak? Message us and we will tell you.</p>
              </div>
              <WhatsAppBtn text="Hi Biongevity Dubai, could you tell me about your doctors?" label="Ask on WhatsApp" className="mt-6 self-start" />
            </div>
          </div>
        </div>
      </section>

      <section data-ai="Departments" className="sec">
        <div className="wrap">
          <Head eyebrow="What we do" title="Eight departments, one team." />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DEPARTMENTS.map((d, i) => (
              <li key={d.id} data-dept={d.id} data-rv style={{ "--d": `${(i % 4) * 50}ms` } as React.CSSProperties}>
                <Link href={deptHref(d)} className="card6 flex h-full items-center gap-3.5 p-5">
                  <span className="dept-tile"><Icon name={d.icon} size={21} /></span>
                  <span className="flex-1 text-[16px] font-semibold leading-snug">{d.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BookBand />
    </>
  );
}
