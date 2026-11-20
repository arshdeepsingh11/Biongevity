import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { FaqList, Head } from "@/components/site/Blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { LoopingWords } from "@/components/site/Motion";
import { INTERNATIONAL } from "@/content/contact";
import { INTL_SUPPLEMENTS, storeUrl } from "@/content/supplements";
import { WORLD_DOTS, WORLD_H, WORLD_W } from "@/data/worldmap";
import { REGION_KEY } from "@/lib/regionPref";
import { JsonLd, faqPage } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Biongevity — Longevity & Precision Health | Launching in the US, March 2027" },
  description: "Biongevity measures how your body is ageing, follows it over time and turns it into a personal plan, with doctors and AI working together. Clinic open in Dubai. Launching in the United States in March 2027 as telehealth and an app.",
  alternates: { canonical: "/" },
};

/**
 * First visit from the UAE/Gulf (device time zone or locale) → the Dubai clinic site, before the page paints.
 * Arabic-language devices go to the Arabic Dubai pages. A saved choice always wins; crawlers are never redirected.
 */
const REGION_SCRIPT = `(function(){try{if(localStorage.getItem(${JSON.stringify(REGION_KEY)}))return;var tz=(Intl.DateTimeFormat().resolvedOptions().timeZone||"");var langs=[navigator.language].concat(navigator.languages||[]);var l=langs.join(",");if(/^Asia\\/(Dubai|Muscat|Qatar|Bahrain|Riyadh|Kuwait)$/.test(tz)||/-(AE|SA|QA|BH|KW|OM)(,|$)/i.test(l)){var ar=localStorage.getItem("biongevity.lang")==="ar"||(localStorage.getItem("biongevity.lang")!=="en"&&/^ar/i.test(navigator.language||""));location.replace(ar?"/ar/uae/":"/uae/");}}catch(e){}})();`;

const dl = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** What we measure — the six inputs of a Biongevity longevity picture. */
const MEASURES = [
  { icon: "hourglass", t: "Biological age", d: "How fast your body is ageing, from blood markers and DNA methylation, compared with your age in years." },
  { icon: "dna", t: "Genome", d: "Your DNA, read once and used for life: inherited risks and how you are likely to respond to medicines." },
  { icon: "gut", t: "Microbiome", d: "The bacteria in your gut and what they mean for digestion, immunity and metabolism." },
  { icon: "flask", t: "Blood biomarkers", d: "Heart, metabolism, hormones, inflammation and nutrients, measured and compared over time." },
  { icon: "activity", t: "Wearables", d: "Sleep, recovery, heart rate and activity from the devices you already wear." },
  { icon: "face", t: "Skin & body", d: "Skin health, body composition, strength and fitness: the visible signs of how you age." },
];

/** How we monitor and follow people: the longevity loop and the rhythm of follow-up. */
const LOOP = [
  { icon: "scan", t: "Measure", d: "A baseline of your biology: tests, history, lifestyle and goals." },
  { icon: "cpu", t: "Analyse", d: "AI brings every result together; a clinician reviews it and explains what matters." },
  { icon: "route", t: "Plan", d: "A personal plan for nutrition, movement, sleep, stress, treatments and supplements." },
  { icon: "chart", t: "Follow", d: "The app, wearables and check-ins keep the plan on track, day to day." },
  { icon: "reset", t: "Re-test", d: "Measure again, see what changed, and adapt the plan." },
];
const RHYTHM = [
  { t: "Every day", d: "The app and your wearables follow sleep, activity and habits, with gentle nudges." },
  { t: "Regular check-ins", d: "Telehealth reviews with your care team to adjust the plan." },
  { t: "Re-testing", d: "Repeat key tests to measure real change in your biology." },
];

const TECH = [
  { icon: "cpu", t: "AI analysis", d: "Connects genes, blood markers and wearable data to find patterns a single test would miss. Clinicians decide; the AI explains." },
  { icon: "fingerprint", t: "Your digital twin", d: "A living picture of your health that brings tests, wearables and history together and shows how they change." },
  { icon: "phone", t: "The Biongevity app", d: "Results, your plan, reminders, telehealth visits and family sharing in one app." },
  { icon: "shield", t: "Privacy by design", d: "Built with clinicians, with consent, security and data protection at the centre." },
];

/** Planned at launch. No prices: details are published closer to launch. */
const PROGRAMMES = [
  { icon: "scan", t: "Longevity baseline", d: "A one-time deep look: biological age, key biomarkers and a clinician-reviewed report with your first plan." },
  { icon: "route", t: "Longevity programme", d: "Ongoing care: your plan, the app, regular telehealth check-ins and re-testing to follow progress.", featured: true },
  { icon: "users", t: "Family longevity", d: "Plans for couples and families, with shared insights where inherited risks matter." },
];

const FAQ = [
  { q: "What is Biongevity?", a: "Biongevity is a longevity and precision health company, and a technology company. We measure how your body is ageing, follow it over time and turn the results into a personal plan, with doctors and AI working together." },
  { q: "Where is Biongevity available?", a: `Our clinic in Dubai, UAE is open now. In the United States, Biongevity will launch as an online telehealth service with the Biongevity app in ${INTERNATIONAL.usLaunch}. Other countries are coming soon.` },
  { q: "Will there be a clinic in the United States?", a: "No physical clinic is planned. In the US, Biongevity will be fully online: telehealth consultations, testing with home sample collection where possible, and the Biongevity app." },
  { q: "How does Biongevity follow my health over time?", a: "After a baseline, your plan lives in the app. Wearables and check-ins follow how you are doing day to day, your care team reviews progress, and key tests are repeated to measure real change." },
  { q: "What will programmes cost?", a: "Programmes and prices will be published closer to the US launch. Join the updates list to hear first. Prices will be in USD." },
  { q: "Is this medical advice?", a: "Information on this site is general and educational. Medical decisions are made with a licensed clinician." },
];

export default function InternationalHome() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REGION_SCRIPT }} />
      <JsonLd data={faqPage(FAQ)} />

      {/* HERO — midnight, aurora light, a live "orbit" of what we measure */}
      <section data-ai="Hero" className="sec-dark relative isolate overflow-hidden pb-20 pt-[calc(120px+var(--safe-top))] lg:pb-28 lg:pt-[160px]">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="aurora6" />
          <div className="grid6" />
        </div>
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="shine6 shine6-dark" data-rv><span className="shine6-dot" />Launching in the US · {INTERNATIONAL.usLaunch}</div>
            <h1 className="t-hero mt-6 max-w-[15ch]" data-rv style={dl(60)}>The future of longevity <span className="t-italic">is personal.</span></h1>
            <p className="t-lede mt-7 max-w-[56ch]" data-rv style={dl(120)}>Biongevity measures how your body is ageing, follows it over time and turns it into a plan you can live with. Doctors and AI, working together.</p>
            <div className="mt-9 flex flex-wrap gap-3" data-rv style={dl(180)}>
              <a href="#updates" className="btn6 btn6-light btn6-lg">Join the US waitlist<Icon name="arrow-right" size={17} /></a>
              <Link href="/uae/" className="btn6 btn6-outline-light btn6-lg">Visit our Dubai clinic</Link>
            </div>
            <p className="mt-7 text-[14px] text-white/55" data-rv style={dl(220)}>Longevity for your <LoopingWords words={["heart.", "mind.", "gut.", "skin.", "metabolism.", "future."]} className="font-semibold text-[rgb(var(--c-ai-hi))]" /></p>
          </div>
          <Orbit />
        </div>
      </section>

      {/* WHERE WE ARE */}
      <section aria-label="Where Biongevity is available" className="relative border-b border-ink/[0.06] bg-white">
        <div className="wrap grid gap-px py-2 sm:grid-cols-3">
          {[
            { k: "Dubai, UAE", v: "Clinic open now", href: "/uae/", on: true },
            { k: "United States", v: `Telehealth & app · ${INTERNATIONAL.usLaunch}`, href: "#united-states" },
            { k: "Other countries", v: "Coming soon", href: "#updates" },
          ].map((p) => (
            <Link key={p.k} href={p.href} className="group flex items-center justify-between gap-3 px-2 py-5 sm:px-5">
              <span className="flex items-center gap-3">
                <span className={`status6 ${p.on ? "is-on" : ""}`} aria-hidden />
                <span><span className="block text-[12.5px] font-semibold uppercase tracking-[.14em] text-faint">{p.k}</span><span className="mt-0.5 block text-[16px] font-semibold">{p.v}</span></span>
              </span>
              <Icon name="arrow-right" size={16} className="text-faint transition group-hover:translate-x-0.5 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      </section>

      {/* WHAT WE MEASURE */}
      <section id="longevity" data-ai="Longevity" className="sec anchor6">
        <div className="wrap">
          <Head eyebrow="Longevity, measured" title={<>Not just how long you live. <span className="t-italic">How well.</span></>} lede="Longevity for your heart, mind, gut, skin and every part of you starts with knowing where you stand. We bring the measures that matter into one picture." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEASURES.map((m, i) => (
              <div key={m.t} className="card6 spot6 p-7" data-rv style={dl((i % 3) * 70)}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--c-gold-soft))] text-gold-deep"><Icon name={m.icon} size={22} /></span>
                <h3 className="t-h3 mt-5">{m.t}</h3>
                <p className="t-body mt-2">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE MONITOR AND FOLLOW YOU */}
      <section id="how" data-ai="How we follow you" className="sec sec-sand anchor6">
        <div className="wrap">
          <Head eyebrow="How we monitor and follow you" title={<>Longevity is not a test. <span className="t-italic">It is a loop.</span></>} lede="One test is a snapshot. We measure, analyse, plan, follow and re-test, so you can see what is working and change what is not." />
          <ol className="loop6-track mt-14 grid gap-4 md:grid-cols-5">
            {LOOP.map((s, i) => (
              <li key={s.t} className="relative" data-rv style={dl(i * 80)}>
                <div className="card6 h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--c-feature))] text-[rgb(var(--c-gold))]"><Icon name={s.icon} size={21} /></span>
                    <span className="font-display text-[28px] leading-none text-ink/15">0{i + 1}</span>
                  </div>
                  <div className="mt-5 text-[20px] font-semibold tracking-tight">{s.t}</div>
                  <p className="t-body mt-1.5 !text-[15px]">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div className="grid grid-cols-2 gap-3" data-rv>
              <Photo k="welcome" className="aspect-[4/5] rounded-[26px]" w={520} sizes="(min-width:1024px) 22vw, 45vw" />
              <Photo k="womanFloral" className="mt-10 aspect-[4/5] rounded-[26px]" w={520} sizes="(min-width:1024px) 22vw, 45vw" />
            </div>
            <div>
              <h3 className="t-h3" data-rv>The rhythm of follow-up</h3>
              <ul className="mt-5 grid gap-3">
                {RHYTHM.map((r, i) => (
                  <li key={r.t} className="flex gap-4 rounded-[22px] bg-white p-5" data-rv style={dl(i * 70)}>
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[rgb(var(--c-gold))] shadow-[0_0_0_5px_rgb(var(--c-gold)/.2)]" />
                    <span><span className="block text-[17px] font-semibold">{r.t}</span><span className="mt-0.5 block text-[15px] leading-relaxed text-muted">{r.d}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" data-ai="Technology" className="sec sec-dark anchor6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-60 top-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-teal)/.22),transparent)]" />
        <div aria-hidden className="grid6" />
        <div className="wrap relative grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <Head eyebrow="Technology" title={<>A health company <span className="t-italic">and a technology company.</span></>} lede="Your data should work for you. Our platform connects tests, wearables and visits into one record, and AI helps your care team see the full picture and explain it clearly." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {TECH.map((t, i) => (
                <div key={t.t} className="spot6 rounded-[24px] border border-white/10 bg-white/[0.04] p-6" data-rv style={dl(i * 70)}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[rgb(var(--c-ai-hi))]"><Icon name={t.icon} size={21} /></span>
                  <h3 className="mt-4 text-[18px] font-semibold tracking-tight">{t.t}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/70">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
          <AppPreview />
        </div>
      </section>

      {/* PROGRAMMES (planned) */}
      <section id="programmes" data-ai="Programmes" className="sec anchor6">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Head eyebrow="Programmes · coming 2027" title={<>Choose how deep <span className="t-italic">you want to go.</span></>} lede="Planned for the US launch. Programmes and prices (in USD) will be published closer to launch." />
            <a href="#updates" className="link6 text-[16px]" data-rv>Get notified <Icon name="arrow-right" size={16} /></a>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PROGRAMMES.map((p, i) => (
              <div key={p.t} className={`relative flex flex-col overflow-hidden rounded-[28px] p-8 ${p.featured ? "sec-dark" : "card6"}`} data-rv style={dl(i * 80)}>
                {p.featured && <div aria-hidden className="beam6" />}
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${p.featured ? "bg-white/10 text-[rgb(var(--c-gold))]" : "bg-[rgb(var(--c-gold-soft))] text-gold-deep"}`}><Icon name={p.icon} size={22} /></span>
                <h3 className="mt-6 text-[23px] font-semibold tracking-tight">{p.t}</h3>
                <p className={`mt-2 text-[15.5px] leading-relaxed ${p.featured ? "text-white/70" : "text-muted"}`}>{p.d}</p>
                <span className={`mt-auto pt-7 text-[13px] font-semibold uppercase tracking-[.14em] ${p.featured ? "text-[rgb(var(--c-ai-hi))]" : "text-gold-deep"}`}>Details at launch</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13.5px] text-faint" data-rv>Programme names, contents and availability may change before launch.</p>
        </div>
      </section>

      {/* UNITED STATES */}
      <section id="united-states" data-ai="United States" className="sec sec-sand anchor6">
        <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <Head eyebrow={`Launching ${INTERNATIONAL.usLaunch}`} title={<>Biongevity is coming to <span className="t-italic">the United States.</span></>} lede="In the US, Biongevity will be fully online: telehealth consultations, testing and the Biongevity app, with no need to visit a clinic." />
            <ul className="mt-9 grid gap-3" data-rv>
              {["Telehealth consultations with licensed clinicians", "Longevity testing, with home sample collection where possible", "The Biongevity app: results, your plan and your AI guide", "Ongoing follow-up and re-testing"].map((t) => (
                <li key={t} className="tick6"><Icon name="check" size={18} weight="bold" /><span>{t}</span></li>
              ))}
            </ul>
            <PresenceMap />
            <p className="mt-4 text-[14px] text-faint" data-rv>Services, availability and timing may change before launch.</p>
          </div>
          <div id="updates" className="anchor6" data-rv>
            <h3 className="t-h3 mb-4">Be first to know</h3>
            <EnquiryForm mode="intl" interests={["United States launch", "Programmes", "Other countries", "Partnerships", "Press", "Something else"]} />
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
              <p className="t-lede mt-4">Skin and aesthetics, IV therapy and wellness, family medicine, longevity testing, diagnostics, dental care, home visits and telehealth, in one place. In English and Arabic.</p>
              <span className="link6 mt-7 text-[16px]">Visit Biongevity Dubai <Icon name="arrow-right" size={16} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* SUPPLEMENTS (US store, USD) */}
      <section data-ai="Supplements" className="sec-tight">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Head eyebrow="Longevity formulas" title="Daily support for healthy ageing." />
            <p className="max-w-[40ch] text-[14px] text-muted" data-rv>Available in the US through our online store. Prices in USD.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {INTL_SUPPLEMENTS.map((s, i) => (
              <a key={s.id} href={storeUrl(s.storeHandle!)} target="_blank" rel="noopener" className="card6 spot6 flex flex-col p-7" data-rv style={dl(i * 70)}>
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
          <div>
            <Head eyebrow="Questions" title={<>Good to <span className="t-italic">know.</span></>} />
            <a href="#updates" className="btn6 btn6-primary mt-7" data-rv>Join the US waitlist<Icon name="arrow-right" size={16} /></a>
          </div>
          <div data-rv><FaqList items={FAQ} /></div>
        </div>
      </section>
    </>
  );
}

/** Hero visual: the six measures orbit one person. Pure SVG + CSS (pauses with reduced motion). */
function Orbit() {
  const nodes = [
    ["Biological age", "hourglass"], ["Genome", "dna"], ["Microbiome", "gut"], ["Biomarkers", "flask"], ["Wearables", "activity"], ["Skin & body", "face"],
  ] as const;
  return (
    <div className="orbit6 relative mx-auto aspect-square w-full max-w-[480px]" aria-hidden data-rv style={dl(160)}>
      <div className="orbit6-ring" style={{ inset: "0%" }} />
      <div className="orbit6-ring" style={{ inset: "16%" }} />
      <div className="orbit6-ring is-dashed" style={{ inset: "31%" }} />
      <div className="orbit6-core"><span className="font-display text-[22px] leading-tight sm:text-[26px]">You</span><span className="mt-1 text-[11px] font-semibold uppercase tracking-[.16em] text-white/60">one picture</span></div>
      <div className="orbit6-spin">
        {nodes.map(([label, icon], i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={label} className="orbit6-node" style={{ left: `${50 + 42 * Math.cos(a)}%`, top: `${50 + 42 * Math.sin(a)}%` }}>
              <span className="orbit6-chip"><Icon name={icon} size={15} />{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Technology visual: an illustration of the app (not real data). */
function AppPreview() {
  // Illustrative values, falling over time (a lower biological age is better) → the line goes down.
  const pts = [62, 58, 59, 55, 52, 53, 49, 47, 46, 44];
  const y = (v: number) => 70 - (v - 40) * 2.6;
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 260 + 10} ${y(v)}`).join(" ");
  return (
    <figure className="relative mx-auto w-full max-w-[380px]" data-rv style={dl(120)}>
      <div className="rounded-[34px] border border-white/15 bg-white/[0.06] p-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/.7)] backdrop-blur">
        <div className="rounded-[26px] bg-[rgb(var(--c-pearl))] p-5 text-ink">
          <div className="flex items-center justify-between text-[12px] font-semibold text-faint"><span>Biongevity</span><span>Your plan</span></div>
          <div className="mt-4 rounded-[20px] bg-white p-4 shadow-[0_1px_0_rgb(var(--c-ink)/.05)]">
            <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-faint">Biological age trend</div>
            <svg viewBox="0 0 280 70" className="mt-3 h-[70px] w-full" role="img" aria-label="Illustration: biological age falling over time">
              <path d={path} fill="none" stroke="rgb(var(--c-gold-deep))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="270" cy={y(pts[pts.length - 1])} r="4.5" fill="rgb(var(--c-gold-deep))" />
            </svg>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[["Sleep", "moon"], ["Activity", "walk"], ["Heart", "heart"], ["Nutrition", "salad"]].map(([t, ic]) => (
              <div key={t} className="flex items-center gap-2.5 rounded-[16px] bg-white p-3 text-[13.5px] font-semibold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[rgb(var(--c-gold-soft))] text-gold-deep"><Icon name={ic} size={15} /></span>{t}</div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2.5 rounded-[16px] bg-[rgb(var(--c-feature))] p-3.5 text-[13px] leading-snug text-white"><Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-[rgb(var(--c-gold))]" />Your AI guide explains each result in plain words. Your clinician decides.</div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[12px] text-white/50">Illustration of the Biongevity app</figcaption>
    </figure>
  );
}

/** Dotted world map: Dubai (open) and the United States (launching), joined by a light arc. */
function PresenceMap() {
  const dubai: [number, number] = [88, 28.6], us: [number, number] = [28, 22.5];
  const arc = `M${us[0]} ${us[1]} Q${(us[0] + dubai[0]) / 2} ${Math.min(us[1], dubai[1]) - 16} ${dubai[0]} ${dubai[1]}`;
  return (
    <figure className="mt-10 overflow-hidden rounded-[26px] bg-[rgb(var(--c-feature))] p-5 sm:p-7" data-rv>
      <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="w-full" role="img" aria-label="Map: Dubai clinic open now; United States launching March 2027">
        <path d={WORLD_DOTS} stroke="rgb(255 255 255 / .16)" strokeWidth=".55" strokeLinecap="round" />
        <path d={arc} fill="none" stroke="rgb(var(--c-gold))" strokeWidth=".35" strokeDasharray="1.2 1.2" className="map6-arc" />
        {[[dubai, true], [us, false]].map(([p, on], i) => {
          const [x, y] = p as [number, number];
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3.2" fill="rgb(var(--c-gold) / .18)" className={on ? "map6-pulse" : undefined} />
              <circle cx={x} cy={y} r="1.2" fill={on ? "rgb(var(--c-gold))" : "rgb(255 255 255)"} />
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/75">
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-gold))]" />Dubai · clinic open</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-white" />United States · {INTERNATIONAL.usLaunch}</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border border-white/50" />More countries · coming soon</span>
      </figcaption>
    </figure>
  );
}
