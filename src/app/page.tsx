import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { FaqList, Head } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { INTERNATIONAL } from "@/content/contact";
import { INTL_SUPPLEMENTS, storeUrl } from "@/content/supplements";
import { REGION_KEY } from "@/lib/region";
import { JsonLd, faqPage } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Biongevity — Longevity & Precision Health | Launching in the US, March 2027" },
  description: "Biongevity measures how your body is ageing, follows it over time and turns it into a personal plan, with doctors and AI working together. Clinic open in Dubai. Launching in the United States in March 2027.",
  alternates: { canonical: "/" },
};

/**
 * First visit from the UAE/Gulf (by device time zone or locale) → the Dubai clinic site, before the page paints.
 * A saved choice (the International / Dubai links set it) always wins, and crawlers are never redirected.
 */
const REGION_SCRIPT = `(function(){try{if(localStorage.getItem(${JSON.stringify(REGION_KEY)}))return;var tz=(Intl.DateTimeFormat().resolvedOptions().timeZone||"");var l=[navigator.language].concat(navigator.languages||[]).join(",");if(/^Asia\\/(Dubai|Muscat|Qatar|Bahrain|Riyadh|Kuwait)$/.test(tz)||/-(AE|SA|QA|BH|KW|OM)(,|$)/i.test(l)){location.replace("/uae/");}}catch(e){}})();`;

const MEASURES = [
  { icon: "hourglass", t: "Biological age", d: "How fast your body is ageing, from blood markers and DNA methylation." },
  { icon: "dna", t: "Genome", d: "Your DNA, read once and used for life: inherited risks and how you respond to medicines." },
  { icon: "gut", t: "Microbiome", d: "The bacteria in your gut and what they mean for digestion, immunity and metabolism." },
  { icon: "flask", t: "Blood biomarkers", d: "Heart, metabolism, hormones, inflammation and nutrients, tracked over time." },
  { icon: "activity", t: "Wearables", d: "Sleep, recovery and activity from the devices you already wear." },
  { icon: "face", t: "Skin & body", d: "Skin health, body composition, strength and fitness: the visible signs of ageing." },
];

const LOOP = [
  { t: "Measure", d: "A baseline of your biology: tests, history and goals." },
  { t: "Plan", d: "A personal plan for nutrition, movement, sleep, treatments and supplements." },
  { t: "Follow", d: "Continuous monitoring through the app, wearables and check-ins." },
  { t: "Re-test", d: "Measure again, see what worked and adapt the plan." },
];

const TECH = [
  { icon: "sparkle", t: "Biongevity SI", d: "An AI guide that explains your results in plain words, between visits. Doctors decide; the AI explains." },
  { icon: "fingerprint", t: "Your digital twin", d: "A living picture of your health that brings tests, wearables and history together in one place." },
  { icon: "phone", t: "The Biongevity app", d: "Results, plans, reminders and family sharing in your pocket." },
  { icon: "shield", t: "Built with clinicians", d: "Designed with doctors, with privacy and safety at the centre." },
];

const FAQ = [
  { q: "What is Biongevity?", a: "Biongevity is a longevity and precision health company. We measure how your body is ageing, follow it over time and turn the results into a personal plan, with doctors and technology working together." },
  { q: "Where is Biongevity available?", a: `Our clinic in Dubai, UAE is open now. In the United States, Biongevity will launch as an online telehealth service with the Biongevity app in ${INTERNATIONAL.usLaunch}. Other countries are coming soon.` },
  { q: "Will there be a clinic in the United States?", a: "No physical clinic is planned. In the US, Biongevity will work online: telehealth consultations, testing and the Biongevity app." },
  { q: "Is this medical advice?", a: "Information on this site is general and educational. Medical decisions are made with a licensed clinician." },
];

export default function InternationalHome() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REGION_SCRIPT }} />
      <JsonLd data={faqPage(FAQ)} />

      {/* HERO — deep, futuristic */}
      <section data-ai="Hero" className="sec-dark relative isolate overflow-hidden pb-20 pt-[calc(120px+var(--safe-top))] lg:pb-28 lg:pt-[170px]">
        <video aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" src="/media/brand-loop.mp4" poster="/media/brand-film.jpg" autoPlay muted loop playsInline preload="none" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(var(--c-feature)/.55),rgb(var(--c-feature)/.92)_70%,rgb(var(--c-feature)))]" />
        <div className="wrap">
          <div className="t-eyebrow" data-rv>Biongevity · Longevity & precision health</div>
          <h1 className="t-hero mt-6 max-w-[16ch]" data-rv style={{ "--d": "60ms" } as React.CSSProperties}>The future of longevity <span className="t-italic">is personal.</span></h1>
          <p className="t-lede mt-7 max-w-[58ch]" data-rv style={{ "--d": "120ms" } as React.CSSProperties}>We measure how your body is ageing, follow it over time and turn it into a plan, with doctors and AI working together. Launching in the United States in {INTERNATIONAL.usLaunch}.</p>
          <div className="mt-9 flex flex-wrap gap-3" data-rv style={{ "--d": "180ms" } as React.CSSProperties}>
            <Link href="/contact/#updates" className="btn6 btn6-light btn6-lg">Get launch updates<Icon name="arrow-right" size={17} /></Link>
            <Link href="/uae/" className="btn6 btn6-outline-light btn6-lg">Visit our Dubai clinic</Link>
          </div>
          <ul className="mt-14 grid gap-3 sm:grid-cols-3" data-rv style={{ "--d": "240ms" } as React.CSSProperties}>
            {[
              ["Dubai, UAE", "Clinic open now", "/uae/"],
              ["United States", `Telehealth & app · ${INTERNATIONAL.usLaunch}`, "#united-states"],
              ["Other countries", "Coming soon", "/contact/#updates"],
            ].map(([t, d, href]) => (
              <li key={t}><Link href={href} className="flex items-center justify-between gap-3 rounded-[22px] border border-white/15 bg-white/[0.05] px-5 py-4 transition hover:border-white/30 hover:bg-white/[0.08]">
                <span><span className="block text-[13px] font-semibold uppercase tracking-[.14em] text-white/55">{t}</span><span className="mt-1 block text-[16.5px] font-semibold">{d}</span></span>
                <Icon name="arrow-right" size={16} className="text-white/60" />
              </Link></li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT WE MEASURE */}
      <section id="longevity" data-ai="Longevity" className="sec anchor6">
        <div className="wrap">
          <Head eyebrow="Longevity, measured" title={<>Not just how long you live. <span className="t-italic">How well.</span></>} lede="Longevity for your skin, heart, gut, mind and every part of you starts with knowing where you stand. We bring the measures that matter into one picture." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEASURES.map((m, i) => (
              <div key={m.t} className="card6 p-7" data-rv style={{ "--d": `${(i % 3) * 70}ms` } as React.CSSProperties}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--c-canvas))] text-gold-deep"><Icon name={m.icon} size={22} /></span>
                <h3 className="t-h3 mt-5">{m.t}</h3>
                <p className="t-body mt-2">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE FOLLOW YOU */}
      <section data-ai="How we follow you" className="sec sec-sand">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Head eyebrow="How we follow you" title={<>Longevity is not a test. <span className="t-italic">It is a loop.</span></>} lede="One test is a snapshot. We measure, plan, follow and re-test, so you can see what is working and change what is not." />
            <div className="mt-8 grid grid-cols-2 gap-3" data-rv>
              <Photo k="welcome" className="aspect-[4/5] rounded-[26px]" w={520} sizes="(min-width:1024px) 22vw, 45vw" />
              <Photo k="womanFloral" className="mt-10 aspect-[4/5] rounded-[26px]" w={520} sizes="(min-width:1024px) 22vw, 45vw" />
            </div>
          </div>
          <ol className="grid gap-4">
            {LOOP.map((s, i) => (
              <li key={s.t} className="card6 grid grid-cols-[64px_1fr] items-center gap-5 p-6" data-rv style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                <span className="font-display grid h-16 w-16 place-items-center rounded-full bg-[rgb(var(--c-feature))] text-[24px] text-white">{i + 1}</span>
                <div><div className="text-[21px] font-semibold tracking-tight">{s.t}</div><p className="t-body mt-1">{s.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" data-ai="Technology" className="sec sec-dark anchor6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-60 top-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-teal)/.2),transparent)]" />
        <div className="wrap relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <Head eyebrow="Technology" title={<>Biongevity is a health company <span className="t-italic">and a technology company.</span></>} />
            <p className="t-lede" data-rv>Your data should work for you. Our platform connects tests, wearables and visits into one record, and our AI guide explains it clearly, so you always know what your results mean and what to do next.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TECH.map((t, i) => (
              <div key={t.t} className="rounded-[26px] border border-white/10 bg-white/[0.04] p-7" data-rv style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[rgb(var(--c-ai-hi))]"><Icon name={t.icon} size={22} /></span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{t.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UNITED STATES */}
      <section id="united-states" data-ai="United States" className="sec anchor6">
        <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <Head eyebrow={`Launching ${INTERNATIONAL.usLaunch}`} title={<>Biongevity is coming to <span className="t-italic">the United States.</span></>} lede="In the US, Biongevity will be fully online: telehealth consultations, testing and the Biongevity app, with no need to visit a clinic." />
            <ul className="mt-9 grid gap-3" data-rv>
              {["Telehealth consultations with licensed clinicians", "Longevity testing, with home sample collection where possible", "The Biongevity app: results, plans and your AI guide", "Ongoing follow-up and re-testing"].map((t) => (
                <li key={t} className="tick6"><Icon name="check" size={18} weight="bold" /><span>{t}</span></li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] text-faint" data-rv>Services, availability and timing may change before launch.</p>
          </div>
          <div id="updates" className="anchor6" data-rv>
            <h3 className="t-h3 mb-4">Be first to know</h3>
            <EnquiryForm mode="intl" interests={["United States launch", "Other countries", "Partnerships", "Press", "Something else"]} />
          </div>
        </div>
      </section>

      {/* DUBAI CLINIC */}
      <section data-ai="Dubai clinic" className="sec-tight">
        <div className="wrap">
          <Link href="/uae/" className="card6 group grid overflow-hidden lg:grid-cols-2" data-rv>
            <Photo k="clinicEntrance" className="aspect-[16/10] lg:aspect-auto lg:min-h-[380px]" w={900} sizes="(min-width:1024px) 50vw, 100vw" />
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <div className="t-eyebrow">Open now</div>
              <h2 className="t-h2 mt-4">Our clinic in <span className="t-italic">Dubai.</span></h2>
              <p className="t-lede mt-4">Skin and aesthetics, IV therapy and wellness, family medicine, longevity testing, diagnostics, dental care, home visits and telehealth, all in one place in Dubai.</p>
              <span className="link6 mt-7 text-[16px]">Visit Biongevity Dubai <Icon name="arrow-right" size={16} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* SUPPLEMENTS (US store) */}
      <section data-ai="Supplements" className="sec-tight">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Head eyebrow="Longevity formulas" title="Daily support for healthy ageing." />
            <p className="max-w-[40ch] text-[14px] text-muted" data-rv>Available in the US through our online store. Prices in USD.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {INTL_SUPPLEMENTS.map((s, i) => (
              <a key={s.id} href={storeUrl(s.storeHandle!)} target="_blank" rel="noopener" className="card6 flex flex-col p-7" data-rv style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                <div className="font-display text-[32px] leading-none text-gold-deep">{s.name}</div>
                <p className="mt-3 text-[16px] font-semibold">{s.line}</p>
                <p className="t-body mt-2 !text-[15px]">{s.detail}</p>
                <span className="link6 mt-auto pt-5 text-[15px]">View in store <Icon name="arrow-up-right" size={15} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-ai="FAQ" className="sec">
        <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Head eyebrow="Questions" title={<>Good to <span className="t-italic">know.</span></>} />
          <div data-rv><FaqList items={FAQ} /></div>
        </div>
      </section>
    </>
  );
}
