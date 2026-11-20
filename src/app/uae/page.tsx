import Link from "next/link";
import type { Metadata } from "next";
import { MEDIA } from "@/config/media";
import { OFFICES, CLINICS, UAE } from "@/data/clinic";
import { DEPARTMENTS, DEPT_GROUPS } from "@/data/departments";
import { PACKAGES } from "@/data/health";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BookNow, BookBand, WhatsAppLink } from "@/components/ui/BookNow";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Price, PriceNote } from "@/components/region/Price";
import { RegionPin } from "@/components/region/RegionPin";
import { RegionFlag } from "@/components/region/RegionSwitch";
import { TeamSection, Credentials } from "@/components/trust/TeamSection";
import { SectionHead, Technology } from "@/components/home/premium/Sections";
import { JsonLd, breadcrumb, faqPage } from "@/lib/seo";

const DUBAI = OFFICES[1];
const CLINIC = CLINICS.find((c) => c.id === "uae")!;

export const metadata: Metadata = {
  title: "Biongevity Dubai — longevity & precision health clinic, Al Barsha",
  description: "Biongevity's UAE clinic on Sheikh Zayed Road, Al Barsha 1: precision internal medicine, endocrinology, genetic and microbiome diagnostics, longevity assessments and aesthetics. Prices in AED. Book online or on WhatsApp.",
  keywords: ["longevity clinic Dubai", "precision health Dubai", "biological age test Dubai", "genetic testing Dubai", "microbiome test UAE", "executive health check Dubai", "endocrinologist Dubai", "Biongevity UAE"],
  alternates: { canonical: "/uae/" },
  openGraph: { title: "Biongevity Dubai · UAE Precision Clinic", description: "Longevity and precision health in Al Barsha, Dubai. Prices in AED, book online or on WhatsApp.", locale: "en_AE" },
};

const FAQ = [
  { q: "Where is the Dubai clinic?", a: `${DUBAI.address}. Message us on WhatsApp for directions and parking, or call ${DUBAI.phone}.` },
  { q: "How do I book in the UAE?", a: "Tap Book now to choose a consultation and time online, or message the clinic on WhatsApp and the team will book you in. Virtual visits are also available." },
  { q: "Are prices in AED?", a: "Yes. Prices on this page are shown in AED. Converted list prices are marked with an asterisk and confirmed by the clinic in AED when you book." },
  { q: "Which languages do you speak?", a: "Consultations are in English; the team can arrange Arabic. Biongevity SI, our AI guide, answers in English, Arabic, French and Persian." },
  { q: "Can I see a specialist by video?", a: "Yes. Follow-ups, results reviews and first questions work well by secure video; examinations, imaging and procedures happen at the clinic." },
  { q: "Do I need a referral?", a: "No referral is needed to book at the Dubai clinic." },
];

/** UAE landing page: the Dubai clinic, localised contact details, AED prices and the same Book now / WhatsApp routes. */
export default function UaePage() {
  return (
    <>
      <RegionPin region="uae" />
      <JsonLd data={[breadcrumb([["UAE", "/uae/"]]), faqPage(FAQ), { "@context": "https://schema.org", "@type": "MedicalClinic", name: "Biongevity Clinic Dubai", url: "https://biongevity.com/uae/", telephone: "+97143796393", email: DUBAI.email, address: { "@type": "PostalAddress", streetAddress: "AB Center, 3rd floor, office 302, Sheikh Zayed Rd, Al Barsha 1", addressLocality: "Dubai", addressCountry: "AE" }, geo: { "@type": "GeoCoordinates", latitude: DUBAI.loc[0], longitude: DUBAI.loc[1] }, priceRange: "AED", parentOrganization: { "@type": "Organization", name: "BioAro Inc." } }]} />

      {/* Hero */}
      <section data-ai="Biongevity Dubai" className="relative z-[1] flex min-h-[92svh] flex-col overflow-hidden bg-ink text-snow">
        <BackgroundVideo src={MEDIA.clinicLoop.video!} poster={MEDIA.clinicLoop.poster} className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="hero-scrim absolute inset-0" />
        <div className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-[calc(140px+var(--safe-top))] sm:pb-16 sm:pt-[200px]">
          <div className="max-w-[760px]">
            <Reveal><div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-snow/80"><RegionFlag region="uae" size={13} />Biongevity Clinic · Dubai, UAE</div></Reveal>
            <SplitReveal as="h1" when="ready" delay={0.1} className="h-display mt-5 !text-snow">Longevity medicine, in Dubai.</SplitReveal>
            <Reveal delay={160}><p className="mt-6 max-w-[54ch] text-[17px] leading-[1.55] text-snow/85 sm:text-[19px]">{CLINIC.summary}</p></Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <BookNow size="lg" />
                <WhatsAppLink size="lg" className="!border-0 !bg-white/90 !text-ink hover:!bg-white" text="Hi Biongevity Dubai, I'd like to book a visit." />
              </div>
            </Reveal>
          </div>
          <Reveal delay={360}>
            <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-snow/20 pt-6 text-[13.5px] text-snow/85 sm:mt-16 sm:grid-cols-3">
              <li className="flex items-start gap-2.5"><Icon name="pin" size={18} className="mt-0.5 shrink-0 text-snow/70" />{DUBAI.address}</li>
              <li className="flex items-center gap-2.5"><Icon name="call" size={18} className="shrink-0 text-snow/70" /><a href={DUBAI.tel} className="hover:underline">{DUBAI.phone}</a></li>
              <li className="flex items-center gap-2.5"><Icon name="mail" size={18} className="shrink-0 text-snow/70" /><a href={`mailto:${DUBAI.email}`} className="hover:underline">{DUBAI.email}</a></li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Assessments at the clinic */}
      <Section ai="UAE assessments" chip={false} className="!pt-16 sm:!pt-24">
        <div className="container-x">
          <SectionHead eyebrow="At the clinic" title="A complete picture in one visit." lede="The Dubai clinic combines precision internal medicine and endocrinology with genetic and microbiome diagnostics and a longevity assessment suite.">
            <Link href="/clinic/uae/" className="btn-light h-11">About the clinic<Icon name="arrow-right" size={15} /></Link>
          </SectionHead>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CLINIC.points.map((p, i) => (
              <Reveal key={p.t} delay={Math.min(i, 5) * 60} className="h-full">
                <div className="card flex h-full gap-4 p-5"><span className="icon-tile h-11 w-11 shrink-0"><Icon name={p.icon ?? "sparkle"} size={20} /></span><span><span className="block text-[16px] font-semibold">{p.t}</span><span className="block text-[13.5px] leading-snug text-muted">{p.d}</span></span></div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}><div className="mt-6 flex flex-wrap gap-2">{UAE.focus.map((f) => <span key={f} className="rounded-full bg-accent-light px-3.5 py-1.5 text-[13px] font-semibold text-accent">{f}</span>)}</div></Reveal>
        </div>
      </Section>

      {/* Services */}
      <Section ai="UAE services" id="services" chip={false}>
        <div className="container-x">
          <SectionHead eyebrow="Services" title="Find the care you need." lede="Every service has its own page: what's included, who it's for, pricing and how to book." />
          {DEPT_GROUPS.map((g) => (
            <div key={g} className="mt-10">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{g}</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DEPARTMENTS.filter((d) => d.group === g).map((d) => (
                  <Link key={d.id} href={`/precision-health/${d.id}/`} className="card group flex items-center gap-4 p-4 hover:-translate-y-0.5">
                    <span className="icon-tile h-11 w-11 shrink-0"><Icon name={d.icon} size={20} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[16px] font-semibold">{d.name}</span><span className="block text-[13px] leading-snug text-muted">{d.tag}</span></span>
                    <Icon name="arrow-right" size={16} className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Programs in AED */}
      <Section ai="UAE programs & pricing" id="pricing" chip={false}>
        <div className="container-x">
          <SectionHead center eyebrow="Programs & pricing" title="Longevity programs, priced in AED." lede="Three depths of testing, AI-guided plan and app. The clinic confirms the exact AED price when you book." />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.handle} delay={i * 90} className="h-full">
                <div className={`card relative flex h-full flex-col p-7 ${p.featured ? "ring-2 ring-accent/40" : ""}`}>
                  {p.featured && <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-[11.5px] font-semibold text-on-accent">Most popular</span>}
                  <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{p.handle}</div>
                  <h3 className="mt-2 text-[24px] font-semibold tracking-tight">{p.name}</h3>
                  <div className="mt-4"><Price cad={p.price} from className="text-[36px] font-semibold leading-none tracking-tight" /></div>
                  <div className="mt-1 text-[13px] text-muted">{p.cadence}</div>
                  <ul className="mt-6 grid flex-1 content-start gap-2.5 text-[14.5px]">
                    {[...p.diagnostics.slice(0, 3), p.ai[0], p.app[0]].map((x) => <li key={x} className="flex gap-2.5"><Icon name="check" size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" /><span className="text-muted">{x}</span></li>)}
                  </ul>
                  <div className="mt-8 flex flex-col gap-2 pt-1"><BookNow className="w-full" /><WhatsAppLink className="w-full" label="Ask on WhatsApp" text={`Hi Biongevity Dubai, I'd like to know the AED price of ${p.name}.`} /></div>
                </div>
              </Reveal>
            ))}
          </div>
          <PriceNote />
        </div>
      </Section>

      {/* Inside the clinic */}
      <Section ai="Inside the Dubai clinic" chip={false}>
        <div className="container-x">
          <SectionHead eyebrow="The clinic" title="Not your typical clinic." lede="Sheikh Zayed Road, Al Barsha 1. Private consultation rooms, onsite assessments and a lounge, with your record following you to every visit." />
          <Reveal variant="scale" delay={120}><FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside Biongevity Clinic Dubai" className="mt-10 aspect-video !rounded-[32px] lg:aspect-[21/9]" /></Reveal>
          <Credentials className="mt-6" />
        </div>
      </Section>

      {/* Team */}
      <Section ai="UAE team" chip={false} className="!pt-0">
        <div className="container-x"><TeamSection title="The people behind the clinic." lede="Biongevity's medical leadership is shared across Calgary and Dubai; your Dubai care team is introduced when you book." /></div>
      </Section>

      <Technology />

      {/* FAQ */}
      <Section ai="UAE FAQ" chip={false}>
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div><SectionHead eyebrow="Questions" title="Good to know before you visit." /><Reveal delay={200}><div className="mt-8 flex flex-wrap gap-3"><BookNow /><WhatsAppLink label="Ask on WhatsApp" text="Hi Biongevity Dubai, I have a question before booking." /></div></Reveal></div>
          <Reveal delay={120}>
            <div className="faq divide-y divide-ink/[0.07] rounded-[28px] bg-white/70 px-6 ring-1 ring-ink/[0.06] backdrop-blur-xl sm:px-8">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex items-center justify-between gap-4 text-[17px] font-semibold tracking-tight">{f.q}<span className="faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas text-accent transition-transform"><Icon name="plus" size={14} weight="bold" /></span></summary>
                  <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <BookBand title="Book your visit in Dubai." lede="Choose a time online, or message the clinic on WhatsApp and the team will book you in." text="Hi Biongevity Dubai, I'd like to book a visit." />
    </>
  );
}
