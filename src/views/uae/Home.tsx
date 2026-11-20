import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/site/Photo";
import { BookNow, WhatsAppBtn } from "@/components/site/Cta";
import { BookBand, FaqList, Head } from "@/components/site/Blocks";
import { DeptCard, PopularCard } from "@/components/site/Cards";
import { CountUp, LoopingWords } from "@/components/site/Motion";
import { TreatmentFinder } from "@/components/site/TreatmentFinder";
import { AskBar } from "@/components/ai/AskBar";
import { allServices, departments, deptById, deptHref, finderData, longevityAreas, popularServices, serviceHref } from "@/content/uae";
import { UAE_CLINIC, addressOf, waLink } from "@/content/contact";
import { uaeSupplements } from "@/content/supplements";
import { t, uaeBase, type Locale } from "@/i18n";
import { JsonLd, crumbsLd, faqPage } from "@/lib/seo";
import { brandDubai, uaeMeta } from "./meta";

const COPY = {
  en: {
    title: "Biongevity Dubai — Skin, Wellness & Longevity Clinic in Al Barsha",
    desc: "Doctor-led clinic in Dubai for dermatology and aesthetics, IV therapy, GP and health checks, longevity testing, diagnostics, dental care, home healthcare and telehealth. Book on WhatsApp.",
    eyebrow: "Biongevity Dubai · Al Barsha",
    h1a: "Look well. Feel well.", h1b: "Live longer.",
    lede: "A doctor-led clinic for skin, wellness and longevity in Dubai. From a HydraFacial to a full health check, every treatment is planned around you.",
    exploreTreatments: "Explore treatments",
    notSureT: "Not sure where to start?", notSureD: "Message us. We will help you choose.",
    allTreatments: "All treatments",
    popEyebrow: "Most requested", popA: "Skin and wellness,", popB: "done properly.",
    popLede: "Our most requested treatments. Each one starts with a short check, so it is right for your skin and your goals.",
    allSkin: "All skin treatments", skinItem: "Skin treatment",
    deptEyebrow: "Our departments", deptA: "Everything you need,", deptB: "under one roof.",
    deptLede: "Eight departments, one team. Choose a department to see every treatment, what it involves and how to book.",
    whichDept: "Not sure which department?", whichDeptD: "Tell us what you need on WhatsApp. We will point you to the right doctor.",
    lonEyebrow: "Longevity, for every part of you", lonA: "Longevity for your", lonWords: ["skin.", "heart.", "gut.", "mind.", "hair.", "DNA."],
    lonLede: "Every treatment and test is part of one idea: more healthy years. Measured where it matters, explained by a doctor and followed over time.",
    lonFor: (a: string) => `Longevity for your ${a.toLowerCase()}`, lonItem: "Longevity consultation",
    steps: [["Message or book", "Tap Book now or WhatsApp us. Tell us what you would like help with."], ["We confirm", "Our team suggests the right service, shares prices and offers, and confirms a time."], ["Your visit", "A doctor-led assessment, then your treatment or test, in clinic, at home or online."], ["Follow-up", "Clear aftercare, results explained and a plan for what comes next."]],
    howA: "Simple from the", howB: "first message.",
    clinicVideo: "Inside Biongevity Dubai",
    homeVisit: "Home visit", bookHome: "Book a home visit", online: "Online consultation", bookOnline: "Book an online consultation",
    clinicEyebrow: "Our clinic", clinicA: "A calm, modern clinic", clinicB: "in Al Barsha.",
    clinicLede: "Private treatment rooms, a dental suite, laser and skin rooms, and a team of doctors, nurses and therapists working together, so your care feels joined up from the first message to your follow-up.",
    aboutLink: "About the clinic and our doctors",
    suppItem: "Longevity supplements",
    askQ: "Ask a question",
    bandA: "Your first step is", bandB: "one message.",
    faq: [
      { q: "Where is the clinic?", a: `${UAE_CLINIC.address.join(", ")}. Message us on WhatsApp for directions and parking.` },
      { q: "How do I book?", a: "Tap Book now or WhatsApp us. Our team confirms your appointment, answers questions and shares prices and current offers. You can also call the clinic." },
      { q: "Why are prices not on the website?", a: "Prices depend on your treatment plan and we regularly run offers, so our team shares today's price on WhatsApp. 5% VAT applies and is added at booking and check-in." },
      { q: "Do I need to see a doctor first?", a: "For injectables, lasers and medical treatments, a doctor checks that the treatment is safe and right for you. For facials and drips, a short check is done on the day." },
      { q: "Do you offer home visits and online consultations?", a: "Yes. Doctors and nurses can visit you at home or in your hotel, and many consultations can be done by secure video." },
      { q: "Can I use the website in Arabic?", a: "Yes. Tap العربية at the top of any page to read it in Arabic. Our team replies on WhatsApp in English or Arabic." },
    ],
  },
  ar: {
    title: "بيونجيفيتي دبي — عيادة البشرة والعافية وطول العمر الصحي في البرشاء",
    desc: "عيادة في دبي بإشراف الأطباء للأمراض الجلدية والتجميل والعلاج الوريدي وطب الأسرة والفحوصات وفحوصات طول العمر والمختبر والأسنان والرعاية المنزلية والرعاية عن بُعد. احجز عبر واتساب.",
    eyebrow: "بيونجيفيتي دبي · البرشاء",
    h1a: "إطلالة أجمل. صحة أفضل.", h1b: "وعمر أطول.",
    lede: "عيادة بإشراف الأطباء للبشرة والعافية وطول العمر الصحي في دبي. من جلسة هيدرافيشل إلى فحص صحي شامل، نخطّط كل علاج حولك أنت.",
    exploreTreatments: "اكتشف العلاجات",
    notSureT: "لا تعرف من أين تبدأ؟", notSureD: "راسلنا وسنساعدك على الاختيار.",
    allTreatments: "جميع العلاجات",
    popEyebrow: "الأكثر طلبًا", popA: "البشرة والعافية،", popB: "بعناية حقيقية.",
    popLede: "العلاجات الأكثر طلبًا لدينا. يبدأ كل علاج بفحص قصير، ليكون مناسبًا لبشرتك وأهدافك.",
    allSkin: "جميع علاجات البشرة", skinItem: "علاج للبشرة",
    deptEyebrow: "أقسامنا", deptA: "كل ما تحتاجه،", deptB: "تحت سقف واحد.",
    deptLede: "ثمانية أقسام وفريق واحد. اختر قسمًا لترى كل العلاجات وما تتضمنه وطريقة الحجز.",
    whichDept: "لا تعرف أي قسم يناسبك؟", whichDeptD: "أخبرنا بما تحتاجه على واتساب وسنوجّهك إلى الطبيب المناسب.",
    lonEyebrow: "طول العمر الصحي لكل جزء منك", lonA: "طول العمر الصحي", lonWords: ["لبشرتك.", "لقلبك.", "لجهازك الهضمي.", "لعقلك.", "لشعرك.", "لحمضك النووي."],
    lonLede: "كل علاج وكل فحص جزء من فكرة واحدة: سنوات صحية أكثر. نقيس ما يهم، ويشرحه الطبيب، ونتابعه مع الوقت.",
    lonFor: (a: string) => `طول العمر الصحي: ${a}`, lonItem: "استشارة طول العمر الصحي",
    steps: [["راسلنا أو احجز", "اضغط احجز الآن أو راسلنا على واتساب وأخبرنا بما تحتاجه."], ["نؤكد موعدك", "يقترح فريقنا الخدمة المناسبة ويشارك الأسعار والعروض ويؤكد الموعد."], ["زيارتك", "تقييم بإشراف الطبيب ثم العلاج أو الفحص، في العيادة أو المنزل أو عن بُعد."], ["المتابعة", "تعليمات واضحة بعد العلاج وشرح للنتائج وخطة للخطوة التالية."]],
    howA: "سهل من", howB: "أول رسالة.",
    clinicVideo: "داخل بيونجيفيتي دبي",
    homeVisit: "زيارة منزلية", bookHome: "احجز زيارة منزلية", online: "استشارة عن بُعد", bookOnline: "احجز استشارة عن بُعد",
    clinicEyebrow: "عيادتنا", clinicA: "عيادة هادئة وحديثة", clinicB: "في البرشاء.",
    clinicLede: "غرف علاج خاصة، وجناح للأسنان، وغرف لليزر والبشرة، وفريق من الأطباء والممرضين والمعالجين يعمل معًا، لتكون رعايتك مترابطة من أول رسالة حتى المتابعة.",
    aboutLink: "عن العيادة وأطبائنا",
    suppItem: "مكملات طول العمر الصحي",
    askQ: "اطرح سؤالًا",
    bandA: "خطوتك الأولى", bandB: "رسالة واحدة.",
    faq: [
      { q: "أين تقع العيادة؟", a: `${UAE_CLINIC.addressAr.join("، ")}. راسلنا على واتساب للاتجاهات ومواقف السيارات.` },
      { q: "كيف أحجز؟", a: "اضغط احجز الآن أو راسلنا على واتساب. يؤكد فريقنا موعدك ويجيب عن أسئلتك ويشارك الأسعار والعروض الحالية. ويمكنك أيضًا الاتصال بالعيادة." },
      { q: "لماذا لا تظهر الأسعار على الموقع؟", a: "تعتمد الأسعار على خطة العلاج، ولدينا عروض بشكل منتظم، لذلك يشارك فريقنا سعر اليوم على واتساب. تُطبَّق ضريبة القيمة المضافة بنسبة 5% وتُضاف عند الحجز وتسجيل الوصول." },
      { q: "هل أحتاج إلى مقابلة الطبيب أولًا؟", a: "في الحقن والليزر والعلاجات الطبية، يتأكد الطبيب من أن العلاج آمن ومناسب لك. أما جلسات العناية بالبشرة والمحاليل الوريدية فيُجرى لها فحص قصير في اليوم نفسه." },
      { q: "هل تقدّمون زيارات منزلية واستشارات عن بُعد؟", a: "نعم. يمكن للأطباء والممرضين زيارتك في المنزل أو الفندق، ويمكن إجراء كثير من الاستشارات عبر فيديو آمن." },
      { q: "هل يمكنني استخدام الموقع باللغة الإنجليزية؟", a: "نعم. اضغط English في أعلى أي صفحة. ويرد فريقنا على واتساب بالعربية أو الإنجليزية." },
    ],
  },
} as const;

export const homeMeta = (l: Locale) => uaeMeta(l, "/uae/", COPY[l].title, COPY[l].desc);
const dl = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function HomeView({ l }: { l: Locale }) {
  const c = COPY[l];
  const x = t(l);
  const base = uaeBase(l);
  const depts = departments(l);
  const [first, ...rest] = depts;
  const popular = popularServices(l);
  const services = allServices(l);
  const sup = uaeSupplements(l);
  const addr = addressOf(l);
  const longevity = deptById("longevity-precision-health", l)!;

  return (
    <>
      <JsonLd data={[faqPage([...c.faq]), crumbsLd([[brandDubai(l), `${base}/`]])]} />

      {/* HERO */}
      <section data-ai="Hero" className="relative isolate overflow-hidden pb-14 pt-[calc(108px+var(--safe-top))] lg:pb-24 lg:pt-[150px]" data-dept="dermatology-aesthetics">
        <div className="hero-glow" /><div className="grain" />
        <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="shine6" data-rv><span className="shine6-dot" />{c.eyebrow}</div>
            <h1 className="t-hero mt-5" data-rv style={dl(60)}>{c.h1a} <span className="t-italic">{c.h1b}</span></h1>
            <p className="t-lede mt-6 max-w-[52ch]" data-rv style={dl(120)}>{c.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3" data-rv style={dl(180)}>
              <BookNow l={l} size="lg" />
              <a href="#finder" className="btn6 btn6-ghost btn6-lg">{c.exploreTreatments}<Icon name="arrow-right" size={17} className="flip-rtl" /></a>
            </div>
            <div className="mt-8 max-w-[560px]" data-rv style={dl(240)}><AskBar l={l} /></div>
          </div>

          <div className="relative" data-rv style={dl(120)}>
            <div className="grid grid-cols-[1.25fr_1fr] gap-3 sm:gap-4">
              <Photo k="womanShortHair" priority className="h-full min-h-[300px] rounded-[30px]" w={760} sizes="(min-width:1024px) 28vw, 55vw" />
              <div className="grid content-between gap-3 sm:gap-4">
                <Photo k="hijabPortrait" priority className="aspect-square rounded-[26px]" w={520} sizes="(min-width:1024px) 20vw, 40vw" />
                <Photo k="clinicLounge" className="aspect-square rounded-[26px]" w={520} sizes="(min-width:1024px) 20vw, 40vw" />
              </div>
            </div>
            <a href={waLink(x.wa.help())} target="_blank" rel="noopener" data-item="Hero: help me choose" className="card6 absolute -bottom-6 end-4 start-4 flex items-center gap-3.5 p-4 sm:start-auto sm:end-6 sm:w-[300px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[rgb(var(--c-wa))] text-white"><Icon name="whatsapp" size={22} weight="fill" /></span>
              <span className="min-w-0"><span className="block text-[15px] font-semibold">{c.notSureT}</span><span className="block text-[13.5px] text-muted">{c.notSureD}</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* ALL TREATMENTS MARQUEE (every service page, internal links) */}
      <section aria-label={c.allTreatments} className="border-y border-ink/[0.07] bg-white/60 py-5">
        <div className="marq6-wrap">
          <div className="marq6" style={{ "--dur": "120s" } as React.CSSProperties}>
            {[0, 1].map((k) => services.map(({ dept, service }) => (
              <Link key={`${k}-${dept.id}-${service.slug}`} href={serviceHref(dept, service, l)} data-dept={dept.id} className="pill6 shrink-0 bg-white hover:border-ink/20" tabIndex={k ? -1 : undefined} aria-hidden={k ? true : undefined}>
                <span className="dept-dot" />{service.name}
              </Link>
            )))}
          </div>
        </div>
      </section>

      {/* STATS (true numbers only) */}
      <section aria-label="Biongevity Dubai" className="sec-tight !pb-0">
        <div className="wrap">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-ink/[0.07] bg-ink/[0.07] lg:grid-cols-4" data-rv>
            {([[8, x.statDepts], [services.length, x.statServices], [3, x.statWays], [2, x.statLangs]] as [number, string][]).map(([n, label]) => (
              <div key={label} className="bg-white px-5 py-6 sm:px-7">
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-[40px] leading-none text-ink sm:text-[48px]"><CountUp to={n} /></dd>
                <dd className="mt-2 text-[14px] leading-snug text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* POPULAR — skin first */}
      <section id="treatments" data-ai="Popular treatments" className="sec anchor6">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Head eyebrow={c.popEyebrow} title={<>{c.popA} <span className="t-italic">{c.popB}</span></>} lede={c.popLede} />
            <div className="flex flex-wrap items-center gap-5" data-rv>
              <Link href={deptHref(first, l)} className="link6 text-[16px]">{c.allSkin} <Icon name="arrow-right" size={16} className="flip-rtl" /></Link>
              <BookNow l={l} item={c.skinItem} track="Skin treatment" size="sm" />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {popular.map((r, i) => <PopularCard key={r.service.slug} d={r.dept} g={r.group} s={r.service} l={l} i={i} />)}
          </div>
        </div>
      </section>

      {/* TREATMENT FINDER */}
      <section id="finder" data-ai="Treatment finder" className="sec sec-sand anchor6">
        <div className="wrap">
          <Head eyebrow={x.finderEyebrow} title={<>{x.finderTitle} <span className="t-italic">{x.finderTitleItalic}</span></>} lede={x.finderLede} />
          <div className="mt-12" data-rv><TreatmentFinder l={l} list={finderData(l)} /></div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section id="departments" data-ai="Departments" className="sec anchor6">
        <div className="wrap">
          <Head eyebrow={c.deptEyebrow} title={<>{c.deptA} <span className="t-italic">{c.deptB}</span></>} lede={c.deptLede} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DeptCard d={first} l={l} big className="sm:col-span-2 lg:row-span-2" />
            {rest.map((d, i) => <DeptCard key={d.id} d={d} l={l} i={i + 1} />)}
            <a href={waLink(x.wa.help())} target="_blank" rel="noopener" data-item="Departments: help me choose" className="sec-dark flex flex-col justify-between rounded-[26px] p-7" data-rv>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[rgb(var(--c-wa))] text-white"><Icon name="whatsapp" size={23} weight="fill" /></span>
              <span>
                <span className="block font-display text-[26px] leading-tight">{c.whichDept}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-white/70">{c.whichDeptD}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold">{x.helpMeChoose} <Icon name="arrow-right" size={15} className="flip-rtl" /></span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* LONGEVITY FOR EVERY PART OF YOU (dark) */}
      <section data-ai="Longevity" className="sec sec-dark overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -end-60 top-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-gold)/.18),transparent)]" />
        <div aria-hidden className="grid6" />
        <div className="wrap relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <Head eyebrow={c.lonEyebrow} title={<>{c.lonA} <LoopingWords words={[...c.lonWords]} className="t-italic" /></>} />
            <p className="t-lede max-w-[54ch]" data-rv>{c.lonLede}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {longevityAreas(l).map((a, i) => {
              const d = deptById(a.dept, l)!;
              return (
                <Link key={a.t} href={deptHref(d, l)} data-dept={d.id} className="spot6 group rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25 hover:bg-white/[0.08] sm:p-6" data-rv style={dl((i % 4) * 60)}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgb(var(--dept)/.18)] text-[rgb(var(--dept))]"><Icon name={a.icon} size={21} /></span>
                  <div className="mt-5 text-[18px] font-semibold tracking-tight">{c.lonFor(a.t)}</div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{a.d}</p>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3" data-rv>
            <BookNow l={l} item={c.lonItem} track="Longevity consultation" variant="light" />
            <Link href={deptHref(longevity, l)} className="btn6 btn6-outline-light">{longevity.name}<Icon name="arrow-right" size={16} className="flip-rtl" /></Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section data-ai="How it works" className="sec">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head eyebrow={x.howItWorks} title={<>{c.howA} <span className="t-italic">{c.howB}</span></>} />
            <ol className="mt-10 grid gap-6">
              {c.steps.map(([st, d], i) => (
                <li key={st} className="grid grid-cols-[52px_1fr] gap-4" data-rv style={dl(i * 70)}>
                  <span className="font-display grid h-[52px] w-[52px] place-items-center rounded-full border border-gold/50 text-[20px] text-gold-deep">{i + 1}</span>
                  <div><div className="t-h3">{st}</div><p className="t-body mt-1">{d}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3" data-rv><BookNow l={l} /><WhatsAppBtn l={l} variant="ghost" /></div>
          </div>
          <div className="relative" data-rv>
            <div className="ph6 aspect-[4/5] overflow-hidden rounded-[32px] sm:aspect-[5/4] lg:aspect-[4/5]">
              <video className="absolute inset-0 h-full w-full object-cover" src="/media/clinic-loop.mp4" poster="/media/clinic-loop.jpg" autoPlay muted loop playsInline preload="none" aria-label={c.clinicVideo} />
            </div>
            <div className="card6 absolute -bottom-6 -start-2 max-w-[280px] p-5 sm:-start-6">
              <div className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-gold-deep">{x.visitUs}</div>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug">{addr[0]}</p>
              <p className="text-[14px] text-muted">{addr[1]}</p>
              <a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="link6 mt-3 text-[14px]">{x.openInMaps} <Icon name="arrow-up-right" size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* HOME & ONLINE */}
      <section data-ai="Home and online care" className="sec-tight">
        <div className="wrap grid gap-5 md:grid-cols-2">
          {(["home-healthcare", "telehealth"] as const).map((id) => {
            const d = deptById(id, l)!;
            return (
              <Link key={id} href={deptHref(d, l)} data-dept={id} className="card6 group grid overflow-hidden sm:grid-cols-[.9fr_1.1fr]" data-rv>
                <Photo k={d.photo} className="aspect-[16/10] sm:aspect-auto sm:h-full" w={600} sizes="(min-width:768px) 22vw, 100vw" />
                <div className="flex flex-col p-6 sm:p-7">
                  <span className="dept-tile"><Icon name={d.icon} size={21} /></span>
                  <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{d.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.tagline}</p>
                  <span className="link6 mt-auto pt-5">{x.seeServices} <Icon name="arrow-right" size={15} className="flip-rtl" /></span>
                </div>
              </Link>
            );
          })}
          <div className="flex flex-wrap items-center justify-center gap-3 md:col-span-2" data-rv>
            <BookNow l={l} item={c.homeVisit} track="Home visit" label={c.bookHome} size="sm" />
            <BookNow l={l} item={c.online} track="Online consultation" label={c.bookOnline} size="sm" />
          </div>
        </div>
      </section>

      {/* CLINIC & TRUST */}
      <section data-ai="Our clinic" className="sec">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Head eyebrow={c.clinicEyebrow} title={<>{c.clinicA} <span className="t-italic">{c.clinicB}</span></>} />
            <p className="t-lede" data-rv>{c.clinicLede}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[["clinicEntrance", "lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto"], ["clinicCorridor", "aspect-square"], ["clinicTreatment", "aspect-square"], ["clinicDental", "aspect-square"], ["clinicLaser", "aspect-square"]].map(([k, cl], i) => (
              <Photo key={k} k={k} className={`${cl} rounded-[24px]`} w={i === 0 ? 900 : 500} sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" data-rv>
            <BookNow l={l} size="sm" />
            <Link href={`${base}/about/`} className="link6 text-[16px]">{c.aboutLink} <Icon name="arrow-right" size={16} className="flip-rtl" /></Link>
            <a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="link6 text-[16px]">{x.getDirections} <Icon name="arrow-up-right" size={16} /></a>
          </div>
        </div>
      </section>

      {/* SUPPLEMENTS */}
      <section data-ai="Supplements" className="sec-tight">
        <div className="wrap">
          <div className="card6 grid gap-8 overflow-hidden p-7 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center" data-dept="longevity-precision-health" data-rv>
            <div>
              <div className="t-eyebrow is-dept">{x.suppEyebrow}</div>
              <h2 className="t-h2 mt-4">{x.suppTitle} <span className="t-italic">{x.suppItalic}</span></h2>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <WhatsAppBtn l={l} text={x.wa.supplement(c.suppItem)} label={x.askAboutSupplements} size="sm" item="Longevity supplements" />
                <Link href={`${base}/supplements/`} className="link6 text-[15px]">{x.seeAll} <Icon name="arrow-right" size={15} className="flip-rtl" /></Link>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              {sup.map((s) => (
                <li key={s.id} className="rounded-[22px] bg-[rgb(var(--dept-soft))] p-5">
                  <div className="font-display text-[24px] text-[rgb(var(--dept-deep))]" dir="ltr">{s.name}</div>
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
            <Head eyebrow={x.questions} title={<>{x.goodTo} <span className="t-italic">{x.know}</span></>} />
            <div className="mt-7 flex flex-wrap gap-3" data-rv><BookNow l={l} size="sm" /><WhatsAppBtn l={l} size="sm" variant="ghost" label={c.askQ} text={x.wa.question} /></div>
          </div>
          <div data-rv><FaqList items={[...c.faq]} /></div>
        </div>
      </section>

      <BookBand l={l} title={<>{c.bandA} <span className="t-italic">{c.bandB}</span></>} />
    </>
  );
}
