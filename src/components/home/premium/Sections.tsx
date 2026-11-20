import Link from "next/link";
import type { ReactNode } from "react";
import { DEPARTMENTS, DEPT_GROUPS, CARE_PATH } from "@/data/departments";
import { CARE_PHASES, PACKAGES } from "@/data/health";
import { OFFICES, VIRTUAL, STORIES } from "@/data/clinic";
import { ABOUT_FACTS, FOUNDER, waLink } from "@/data/site";
import { LAB_TESTS } from "@/data/labs";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BookNow, BookRow, WhatsAppLink } from "@/components/ui/BookNow";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Stories } from "@/components/media/Stories";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { cn } from "@/lib/utils";
import { Price, PriceNote } from "@/components/region/Price";
import { Credentials } from "@/components/trust/TeamSection";

/** Section heading: eyebrow, headline that rises line by line, lede. */
export function SectionHead({ eyebrow, title, lede, center, children }: { eyebrow: string; title: ReactNode; lede?: string; center?: boolean; children?: ReactNode }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", center && "justify-center text-center")}>
      <div className={cn("max-w-[720px]", center && "mx-auto")}>
        <Reveal><div className={cn("eyebrow flex items-center gap-2.5", center && "justify-center")}><span aria-hidden className="h-px w-6 bg-ai-2/60" />{eyebrow}</div></Reveal>
        <SplitReveal as="h2" className="h-section mt-4 text-balance">{title}</SplitReveal>
        {lede && <Reveal delay={140}><p className="lede mt-4">{lede}</p></Reveal>}
      </div>
      {children && <Reveal delay={200} className="shrink-0">{children}</Reveal>}
    </div>
  );
}

/* ───────── 1. Services ───────── */
export function ServicesGrid() {
  return (
    <Section ai="Services" id="services" chip={false} className="!pt-16 sm:!pt-24">
      <div className="container-x">
        <SectionHead eyebrow="Our services" title="Find the care you need." lede="Specialist departments and precision programs, each with its own page: what we treat, the tests we use and what to expect at your first visit.">
          <Link href="/precision-health/" className="btn-light h-11">All services<Icon name="arrow-right" size={15} /></Link>
        </SectionHead>
        {DEPT_GROUPS.map((g) => (
          <div key={g} className="mt-12 first-of-type:mt-10">
            <Reveal><h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{g}</h3></Reveal>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DEPARTMENTS.filter((d) => d.group === g).map((d, i) => (
                <Reveal key={d.id} delay={Math.min(i, 5) * 60} className="h-full">
                  <div className="card group relative flex h-full flex-col p-6 transition-transform hover:-translate-y-1">
                    <span className="icon-tile h-12 w-12"><Icon name={d.icon} size={24} /></span>
                    <h4 className="mt-5 text-[20px] font-semibold tracking-tight"><Link href={`/precision-health/${d.id}/`} className="after:absolute after:inset-0 after:rounded-[inherit]">{d.name}</Link></h4>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{d.tag}</p>
                    <div className="mt-5 flex flex-1 items-end justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent">Learn more<Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
                      <BookNow size="sm" className="relative z-[2]" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
        <Reveal delay={120}>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[["/precision-health/bioaro-labs/", "test-tubes", "BioAro Labs testing", `${LAB_TESTS.length} advanced tests — genome, microbiome, hormones and inflammation — reviewed with you by a clinician.`], ["/precision-health/bioaro-drugs/", "tablets", "BioAro Drugs formulas", "Evidence-informed formulas with every ingredient and dose shown, matched to your results."]].map(([h, i, t, x]) => (
              <Link key={h} href={h} className="card group flex items-center gap-5 p-6 hover:-translate-y-0.5">
                <span className="icon-tile h-14 w-14 shrink-0"><Icon name={i} size={28} /></span>
                <span className="min-w-0 flex-1"><span className="block text-[19px] font-semibold tracking-tight">{t}</span><span className="mt-0.5 block text-[14px] leading-relaxed text-muted">{x}</span></span>
                <Icon name="arrow-right" size={18} className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── 2. How it works ───────── */
export function HowItWorks() {
  return (
    <Section ai="How it works" id="how-it-works" chip={false} className="scroll-mt-24">
      <div className="container-x">
        <SectionHead eyebrow="How it works" title="From first visit to a plan you can follow." lede="Four steps, one connected record. Your results, plan and follow-ups stay together and are explained in plain words." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CARE_PATH.map((s, i) => (
            <Reveal key={s.t} delay={i * 90} className="h-full">
              <div className="card h-full p-6">
                <div className="flex items-center justify-between"><span className="icon-tile h-11 w-11"><Icon name={s.icon} size={21} /></span><span className="text-[13px] font-semibold tabular-nums text-faint">0{i + 1}</span></div>
                <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}><BookRow className="mt-10" text="Hi Biongevity, I'd like to book my first visit." /></Reveal>
      </div>
    </Section>
  );
}

/* ───────── 3. Feature rows ───────── */
function Feature({ flip, eyebrow, title, lede, href, media, children }: { flip?: boolean; eyebrow: string; title: ReactNode; lede: ReactNode; href: string; media: ReactNode; children?: ReactNode }) {
  return (
    <div className={cn("grid items-center gap-8 lg:grid-cols-2 lg:gap-14", flip && "lg:[&>*:first-child]:order-2")}>
      <Reveal variant="scale">{media}</Reveal>
      <div className="max-w-[560px]">
        <Reveal><div className="eyebrow flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-ai-2/60" />{eyebrow}</div></Reveal>
        <SplitReveal as="h3" className="h-section mt-4 text-balance">{title}</SplitReveal>
        <Reveal delay={120}><p className="lede mt-4">{lede}</p></Reveal>
        {children && <Reveal delay={180}><div className="mt-6">{children}</div></Reveal>}
        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookNow />
            <Link href={href} className="btn-light h-12 px-6">Learn more<Icon name="arrow-right" size={15} /></Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/** Our story stills are portrait (9:16). Show the whole picture, centred on a soft blurred copy of itself, instead of cropping heads off. */
function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={cn("relative aspect-[4/3] overflow-hidden rounded-[32px] bg-canvas shadow-lift ring-1 ring-ink/[0.06] lg:aspect-[5/4]", className)}>
      <img src={src} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl saturate-[1.2]" />
      <img src={src} alt={alt} loading="lazy" className="absolute left-1/2 top-1/2 h-[92%] w-auto max-w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[22px] object-contain shadow-lift ring-1 ring-white/70" />
    </figure>
  );
}

export function Features() {
  const minPrice = Math.min(...LAB_TESTS.map((t) => t.price));
  return (
    <Section ai="What we offer" chip={false} className="space-y-24 sm:space-y-32">
      <div className="container-x">
        <Feature eyebrow="Longevity Journey" title="One roadmap for the years ahead." href="/clinic/journey/"
          lede="Molecular age, genomics, physical and cognitive health, imaging and pharmacogenomics — brought together into one plan, tailored to you and tracked over time."
          media={<FilmPlayer film="brandFilm" loop="brandLoop" label="Precision Health. Shared Longevity." className="aspect-[4/3] !rounded-[32px] lg:aspect-[5/4]" />}>
          <ul className="flex flex-wrap gap-2">{CARE_PHASES.map((p) => <li key={p.n} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-medium ring-1 ring-ink/[0.06]"><Icon name={p.icon} size={14} className="text-accent" />{p.t}</li>)}</ul>
        </Feature>
      </div>
      <div className="container-x">
        <Feature flip eyebrow="BioAro Labs" title={<>Testing that goes <span className="text-ai-grad">deeper.</span></>} href="/precision-health/bioaro-labs/"
          lede={<>{LAB_TESTS.length} advanced tests — whole genome, gut microbiome, hormones, inflammation and biological age — from <Price cad={minPrice} />, at home or in clinic, and reviewed with you by a clinician.</>}
          media={<Photo src={STORIES[1].poster} alt="An at-home BioAro Labs gut microbiome test kit" />}>
          <ul className="grid gap-2 text-[15px] sm:grid-cols-2">{["Whole genome sequencing", "Gut microbiome", "Hormones & metabolism", "Epigenetic age"].map((x) => <li key={x} className="flex items-center gap-2"><Icon name="check" size={16} weight="bold" className="text-accent" />{x}</li>)}</ul>
        </Feature>
      </div>
      <div className="container-x">
        <Feature eyebrow="Virtual clinic" title="Seen by video, wherever you are." href="/clinic/virtual/"
          lede="Follow-ups, results reviews and first questions — a secure video visit with a longevity clinician, no commute and no waiting room."
          media={<Photo src={STORIES[0].poster} alt="A patient with her clinician at the Biongevity clinic" />}>
          <ol className="grid gap-2 text-[15px]">{VIRTUAL.flow.map((s, i) => <li key={s.t} className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-light text-[12px] font-semibold text-accent">{i + 1}</span>{s.t}</li>)}</ol>
        </Feature>
      </div>
    </Section>
  );
}

/* ───────── 4. Programs & pricing ───────── */
export function Programs() {
  return (
    <Section ai="Programs & pricing" id="programs" chip={false}>
      <div className="container-x">
        <SectionHead center eyebrow="Programs & pricing" title="Choose how deep to go." lede="Three longevity programs, each with testing, an AI-guided plan and the app. Prices in CAD; your care team confirms what fits." />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.handle} delay={i * 90} className="h-full">
              <div className={cn("card relative flex h-full flex-col p-7", p.featured && "ring-2 ring-accent/40")}>
                {p.featured && <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-[11.5px] font-semibold text-on-accent">Most popular</span>}
                <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{p.handle}</div>
                <h3 className="mt-2 text-[24px] font-semibold tracking-tight">{p.name}</h3>
                <div className="mt-4"><Price cad={p.price} from className="text-[38px] font-semibold leading-none tracking-tight" /></div>
                <div className="mt-1 text-[13px] text-muted">{p.cadence}</div>
                <ul className="mt-6 grid flex-1 content-start gap-2.5 text-[14.5px]">
                  {[...p.diagnostics.slice(0, 3), p.ai[0], p.app[0]].map((x) => <li key={x} className="flex gap-2.5"><Icon name="check" size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" /><span className="text-muted">{x}</span></li>)}
                </ul>
                <div className="mt-8 flex flex-col gap-2 pt-1">
                  <BookNow className="w-full" />
                  <Link href="/shop/#depth" className="btn-light w-full">See what&apos;s included</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <PriceNote />
      </div>
    </Section>
  );
}

/* ───────── 4b. Technology ───────── */
const TECH = [
  { href: "/ai/", icon: "sparkle", t: "Biongevity SI", d: "The AI guide that reads your results and this site, answers in four languages and points you to the right care." },
  { href: "/platform/", icon: "fingerprint", t: "Healthspan platform", d: "Your digital twin: labs, genomics and wearables learned over time into one living model." },
  { href: "/app/", icon: "phone", t: "Biongevity App", d: "Scores, trends, your AI coach and bookings in your pocket." },
  { href: "/bioelr/", icon: "layers", t: "BioELR for clinics", d: "The longevity health record other clinics and communities run on." },
] as const;

export function Technology() {
  return (
    <Section ai="Technology" id="technology" chip={false}>
      <div className="container-x">
        <SectionHead eyebrow="Also a technology company" title="The platform behind the clinic." lede="Biongevity builds the software it practises on: an AI guide, a healthspan platform, a patient app and a clinical record used by other clinics. Your care runs on it from the first visit.">
          <div className="flex flex-wrap gap-2"><BookNow size="sm" className="!h-11" /><Link href="/platform/" className="btn-light h-11">See the platform<Icon name="arrow-right" size={15} /></Link></div>
        </SectionHead>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TECH.map((t, i) => (
            <Reveal key={t.href} delay={i * 80} className="h-full">
              <Link href={t.href} className="card group flex h-full flex-col p-6 hover:-translate-y-1">
                <span className="icon-tile h-12 w-12"><Icon name={t.icon} size={24} /></span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{t.t}</h3>
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-muted">{t.d}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-accent">Learn more<Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────── 5. Stories ───────── */
export function StoriesBlock() {
  return (
    <Section ai="Patient stories" chip={false}>
      <div className="container-x">
        <SectionHead center eyebrow="Patient stories" title="Real people. Real biology." lede="From the clinic floor to an at-home test kit. Hover to preview, tap to watch." />
        <div className="mt-8"><Stories /></div>
        <Reveal delay={200}><BookRow center className="mt-4" text="Hi Biongevity, I watched your patient stories and would like to book." /></Reveal>
      </div>
    </Section>
  );
}

/* ───────── 6. Clinics ───────── */
export function Locations() {
  return (
    <Section ai="Clinics" id="clinics" chip={false}>
      <div className="container-x">
        <SectionHead eyebrow="Our clinics" title="Three locations. One record." lede="In person in Calgary and Dubai, our European office in Almelo, and virtual visits wherever you are.">
          <Link href="/clinic/" className="btn-light h-11">Global clinic<Icon name="arrow-right" size={15} /></Link>
        </SectionHead>
        <Reveal variant="scale" delay={120}><FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside Biongevity Clinic Dubai" className="mt-12 aspect-video !rounded-[32px] lg:aspect-[21/9]" /></Reveal>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {OFFICES.map((o, i) => (
            <Reveal key={o.city} delay={i * 90} className="h-full">
              <div className="card flex h-full flex-col overflow-hidden">
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">{o.region}</div>
                    <span className="icon-tile h-10 w-10 shrink-0"><Icon name={o.city === "Calgary" ? "building" : o.city === "Dubai" ? "hospital" : "globe"} size={18} /></span>
                  </div>
                  <h3 className="mt-1 text-[24px] font-semibold tracking-tight">{o.city}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{o.address}</p>
                  <div className="mt-3 grid gap-1 text-[14.5px] font-medium">
                    <a href={o.tel} className="flex items-center gap-2 hover:text-accent"><Icon name="call" size={15} className="text-accent" />{o.phone}</a>
                    {o.email && <a href={`mailto:${o.email}`} className="flex items-center gap-2 hover:text-accent"><Icon name="mail" size={15} className="text-accent" />{o.email}</a>}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <BookNow size="sm" />
                    <WhatsAppLink size="sm" label="WhatsApp" text={`Hi Biongevity ${o.city}, I'd like to book a visit.`} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────── 7. Founder & trust ───────── */
export function Trust() {
  return (
    <Section ai="About" chip={false}>
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal><div className="eyebrow flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-ai-2/60" />Built by clinicians</div></Reveal>
            <SplitReveal as="h2" className="h-section mt-4 text-balance">Medicine first. Technology in service of it.</SplitReveal>
            <Reveal delay={120}><p className="lede mt-4">Biongevity is the longevity clinic of BioAro Inc., founded by a cardiologist. Every plan is reviewed by a clinician; every number comes with its evidence.</p></Reveal>
            <Reveal delay={200}>
              <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {ABOUT_FACTS.map((f) => <div key={f.k} className="rounded-2xl bg-white/70 p-4 ring-1 ring-ink/[0.06]"><dt className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-faint">{f.k}</dt><dd className="mt-1 text-[15px] font-semibold">{f.v}</dd></div>)}
              </dl>
            </Reveal>
            <Reveal delay={260}><div className="mt-8 flex flex-wrap gap-3"><BookNow /><Link href="/about/" className="btn-light h-12 px-6">About Biongevity<Icon name="arrow-right" size={15} /></Link></div></Reveal>
          </div>
          <Reveal variant="scale">
            <figure className="card p-8 sm:p-10">
              <Icon name="quote" size={34} weight="fill" className="text-accent-soft" />
              <blockquote className="mt-4 text-[20px] font-medium leading-[1.45] tracking-tight sm:text-[23px]">{FOUNDER.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <span className="icon-tile h-12 w-12"><Icon name="user" size={22} /></span>
                <span><span className="block text-[16px] font-semibold">{FOUNDER.name}</span><span className="block text-[13.5px] text-muted">{FOUNDER.role}</span></span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
        <Credentials className="mt-10" />
      </div>
    </Section>
  );
}

/* ───────── 8. FAQ ───────── */
const FAQ = [
  { q: "How do I book?", a: "Tap Book now anywhere on the site. You'll choose a consultation category, then a virtual or in-person visit and a time. Prefer to talk first? Message us on WhatsApp or call the clinic." },
  { q: "Do I need a referral?", a: "Not to get started. In Canada some specialist visits need a referral from your family doctor; you can upload one when you book, or book directly where allowed, and our coordinators will guide you." },
  { q: "Where are you located?", a: "Calgary (head office and clinic), Dubai (Biongevity Clinic) and Almelo in the Netherlands. Virtual visits are available wherever you are." },
  { q: "Can I be seen by video?", a: "Yes. Follow-ups, results reviews, medication reviews and first questions all work well by secure video. Anything that needs an exam, imaging or a procedure is done in clinic." },
  { q: "What does it cost?", a: "Longevity programs start at $369 CAD. Individual consultations and tests are priced separately — ask us on WhatsApp for a quote before you book." },
  { q: "Is my information private?", a: "Yes. Your results, plans and visits live in one secure record that you control, and you decide what is shared with family or other clinicians." },
];

export function Faq() {
  return (
    <Section ai="FAQ" id="faq" chip={false}>
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <SectionHead eyebrow="Questions" title="Good to know before you book." />
          <Reveal delay={200}><div className="mt-8 flex flex-wrap gap-3"><BookNow /><WhatsAppLink label="Ask on WhatsApp" text="Hi Biongevity, I have a question before booking." /></div></Reveal>
        </div>
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
  );
}

/** JSON-LD for the FAQ above. */
export const HOME_FAQ = FAQ;

/* ───────── WhatsApp strip (phones see it at the end of the page as well as the fixed button) ───────── */
export function WhatsAppStrip() {
  return (
    <div className="container-x">
      <a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-[24px] bg-white/70 p-4 ring-1 ring-ink/[0.06] backdrop-blur-xl transition hover:-translate-y-0.5 hover:ring-[#25D366]/40 sm:p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white" style={{ background: "#25D366" }}><Icon name="whatsapp" size={26} weight="fill" /></span>
        <span className="min-w-0 flex-1"><span className="block text-[16px] font-semibold">Quicker on WhatsApp</span><span className="block text-[13.5px] text-muted">Message the clinic directly — questions, bookings and directions.</span></span>
        <Icon name="arrow-right" size={18} className="shrink-0 text-accent" />
      </a>
    </div>
  );
}
