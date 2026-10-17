"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CLINICS, OFFICES, VIRTUAL, UAE } from "@/data/clinic";
import { CARE_PHASES, DEPARTMENTS, PACKAGES } from "@/data/health";
import { STREAMS } from "@/data/stats";
import { Icon } from "@/components/ui/Icon";
import { LineChart, Radar, Stat } from "@/components/charts/Charts";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { MagicCard } from "@/components/fx/MagicCard";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { BorderBeam } from "@/components/fx/BorderBeam";
import { BPTracker } from "./BPTracker";
import { Visit3D } from "@/components/clinic3d/Visit3D";
import { CALGARY_VISIT, DUBAI_VISIT, type Visit } from "@/data/visits";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";

type T = { id: string; label: string; icon: string; body: ReactNode };

function Points({ id }: { id: string }) {
  const c = CLINICS.find((x) => x.id === id)!;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{c.points.map((p, k) => (
    <MagicCard key={p.t} className="p-5"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center icon-tile"><Icon name={p.icon ?? "check"} size={20} /></span><span className="text-[12px] font-semibold text-faint">{String(k + 1).padStart(2, "0")}</span></div><div className="mt-4 text-[17px] font-semibold">{p.t}</div><div className="mt-1 text-[14px] text-muted">{p.d}</div></MagicCard>
  ))}</div>;
}

function Flow() {
  return (
    <div className="relative grid gap-4 md:grid-cols-4">
      <svg aria-hidden className="absolute left-[12%] right-[12%] top-7 hidden h-2 w-[76%] md:block" preserveAspectRatio="none" viewBox="0 0 100 2"><line x1="0" y1="1" x2="100" y2="1" stroke="rgb(var(--c-accent))" strokeOpacity=".2" strokeWidth="2" /><line x1="0" y1="1" x2="100" y2="1" stroke="rgb(var(--c-teal))" strokeWidth="2" strokeDasharray="6 14" style={{ animation: "flow 1.6s linear infinite" }} /></svg>
      {VIRTUAL.flow.map((s, k) => (
        <div key={s.t} className="relative rounded-[24px] bg-white p-5 text-center shadow-card ring-1 ring-ink/[0.06]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy text-white"><Icon name={s.icon} size={24} /></span>
          <div className="mt-3 text-[12px] font-semibold text-accent">Step {k + 1}</div><div className="text-[16px] font-semibold">{s.t}</div><div className="mt-1 text-[13px] text-muted">{s.d}</div>
        </div>
      ))}
    </div>
  );
}

function Fit() {
  const col = (t: string, icon: string, items: string[], tone: string) => (
    <div className={`rounded-[24px] p-5 ${tone}`}><div className="flex items-center gap-2 text-[16px] font-semibold"><Icon name={icon} size={18} />{t}</div><ul className="mt-3 space-y-2 text-[14px]">{items.map((i) => <li key={i} className="flex gap-2"><Icon name="check" size={15} className="mt-0.5 shrink-0 opacity-70" />{i}</li>)}</ul></div>
  );
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {col("Great virtually", "video", VIRTUAL.good, "bg-teal-light text-ink")}
      {col("Better in person", "building", VIRTUAL.inPerson, "bg-accent-light text-ink")}
      {col("Emergency — call 911", "siren", VIRTUAL.emergency, "bg-danger/10 text-danger")}
    </div>
  );
}

function Join({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-navy p-7 text-white shadow-lift sm:p-9">
      <BorderBeam />
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div><div className="text-[26px] font-semibold tracking-tight">{label}</div><p className="mt-2 max-w-[56ch] text-[15px] text-white/70">Tell us what you want to improve. A care coordinator replies with the right first step — virtual, in person or a home test.</p></div>
        <div className="flex flex-wrap gap-3"><Link href={`/contact/?interest=${encodeURIComponent(label)}`} className="btn-light">Get started<Icon name="arrow-right" size={15} /></Link><a href={OFFICES[0].tel} className="btn h-12 rounded-full bg-white/10 px-5 text-white"><Icon name="call" size={15} />{OFFICES[0].phone}</a></div>
      </div>
    </div>
  );
}

/** Before you come — pick why you are visiting; SI builds the checklist from the real visit steps. */
const REASONS: Record<string, { id: string; t: string; icon: string; steps: string[]; note: string }[]> = {
  calgary: [
    { id: "first", t: "First visit", icon: "user", steps: ["arrive", "checkin", "forms", "vitals", "consult", "plan"], note: "Plan about 75 minutes. Do the smart intake at home to save 10 minutes." },
    { id: "labs", t: "Blood tests", icon: "test-tube", steps: ["arrive", "checkin", "lab"], note: "Some panels need fasting — your coordinator tells you when you book. Bring your requisition if you have one." },
    { id: "heart", t: "Heart check", icon: "heart", steps: ["arrive", "checkin", "vitals", "imaging", "consult", "plan"], note: "Wear comfortable shoes and clothes for a stress echo; avoid caffeine on the day if you are told to." },
    { id: "results", t: "Results review", icon: "chart", steps: ["arrive", "checkin", "consult", "plan"], note: "Often easier by video — ask if a virtual review suits you." },
  ],
  dubai: [
    { id: "full", t: "Full assessment day", icon: "radar", steps: ["arrive", "checkin", "forms", "body", "fitness", "lab", "consult", "plan"], note: "A long day — you may be asked to fast beforehand (your coordinator confirms), and bring trainers." },
    { id: "genetic", t: "Genetic testing", icon: "dna", steps: ["arrive", "checkin", "forms", "lab", "consult"], note: "Genetic consent is signed in advance or on the day; results arrive in your record." },
    { id: "aesthetic", t: "Precision aesthetics", icon: "face", steps: ["arrive", "checkin", "forms", "aesthetics", "plan"], note: "Come without make-up on the treatment area if you can." },
  ],
};

function BeforeYouCome({ visit }: { visit: Visit }) {
  const { ask } = useAI();
  const reasons = REASONS[visit.id];
  const [r, setR] = useState(reasons[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const reason = reasons.find((x) => x.id === r)!;
  const steps = reason.steps.map((id) => visit.steps.find((s) => s.id === id)).filter(Boolean) as Visit["steps"];
  const items = [...new Set(steps.flatMap((s) => [...(s.bring ?? []), ...(s.id === "forms" ? ["Complete the intake & consent forms online (optional)"] : [])]))];
  const mins = steps.reduce((a, s) => a + s.mins, 0);
  const pct = items.length ? Math.round((items.filter((i) => done[i]).length / items.length) * 100) : 0;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-3">
        <div className="text-[15px] font-semibold">Why are you coming in?</div>
        <div className="grid grid-cols-2 gap-2">
          {reasons.map((x) => (
            <button key={x.id} onClick={() => setR(x.id)} aria-pressed={r === x.id} className={`flex items-center gap-2.5 rounded-2xl p-3 text-left ring-1 transition ${r === x.id ? "bg-ai text-on-ai ring-ai shadow-lift" : "bg-white ring-ink/[0.07] hover:ring-ai/40"}`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${r === x.id ? "bg-white/20" : "icon-tile"}`}><Icon name={x.icon} size={17} /></span><span className="text-[13.5px] font-semibold">{x.t}</span>
            </button>
          ))}
        </div>
        <div className="rounded-[22px] bg-white p-4 shadow-card ring-1 ring-ink/[0.06]">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-ai"><XevyoOrb size={16} live />SI prepared your visit</div>
          <div className="mt-2 flex items-baseline gap-2"><span className="text-[30px] font-semibold tracking-tight">~{mins}</span><span className="text-[13px] text-muted">minutes · {steps.length} stops</span></div>
          <p className="mt-1 text-[13px] text-muted">{reason.note}</p>
          <ol className="mt-3 flex flex-wrap gap-1.5">{steps.map((s, k) => <li key={s.id} className="flex items-center gap-1 rounded-full bg-ai-soft px-2.5 py-1 text-[11.5px] font-semibold text-ai"><span className="opacity-60">{k + 1}</span>{s.t.replace(/ \(.*\)/, "")}</li>)}</ol>
          <button onClick={() => ask(`I'm coming to the ${visit.place} clinic for: ${reason.t}. Make me a short personal checklist — what to bring, how to prepare, and what will happen at each stop: ${steps.map((s) => s.t).join(", ")}.`, { label: `✦ Prepare my visit: ${reason.t}` })} className="btn-ai mt-3 h-9 px-3.5 text-[12.5px]"><XevyoOrb size={16} />Ask SI to personalise it</button>
        </div>
      </div>
      <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
        <div className="flex items-center justify-between"><div className="text-[16px] font-semibold">Your checklist</div><span className="text-[12px] font-semibold tabular-nums text-ai">{pct}% ready</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]"><motion.div className="h-full rounded-full bg-ai" animate={{ width: `${pct}%` }} /></div>
        <div className="mt-3 space-y-1.5">
          {items.map((i) => (
            <label key={i} className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] ring-1 transition ${done[i] ? "bg-ai-soft ring-ai/20" : "bg-white ring-ink/[0.06]"}`}>
              <input type="checkbox" checked={!!done[i]} onChange={() => setDone((d) => ({ ...d, [i]: !d[i] }))} className="h-4 w-4 accent-[rgb(var(--c-ai))]" />{i}
            </label>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-faint">Your coordinator confirms timing and preparation when you book.</p>
      </div>
    </div>
  );
}

/** The assessment day as a timeline, from the real visit steps. */
function DayTimeline({ visit, start = 8.5 }: { visit: Visit; start?: number }) {
  let t = start * 60;
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;
  return (
    <div className="relative">
      <div aria-hidden className="absolute bottom-4 left-[52px] top-4 w-[2px] bg-gradient-to-b from-ai/10 via-ai/50 to-ai/10" />
      <div className="space-y-2.5">
        {visit.steps.map((s, k) => { const at = t; t += Math.max(5, s.mins) + 5; return (
          <motion.div key={s.id} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.05 }} className="relative flex items-start gap-4">
            <span className="w-[40px] shrink-0 pt-3 text-right font-mono text-[12px] font-semibold text-ai">{fmt(at)}</span>
            <span className="relative z-[1] mt-2 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ai text-on-ai ring-4 ring-pearl"><Icon name={s.icon} size={12} /></span>
            <div className="min-w-0 flex-1 rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-ink/[0.06]"><div className="flex flex-wrap items-baseline justify-between gap-2"><span className="text-[15px] font-semibold">{s.t}</span>{s.mins > 0 && <span className="text-[11.5px] text-muted">~{s.mins} min</span>}</div><p className="mt-0.5 text-[13px] text-muted">{s.d}</p></div>
          </motion.div>); })}
      </div>
      <p className="mt-3 text-[11.5px] text-faint">Illustrative schedule starting 08:30; your coordinator sets the real times.</p>
    </div>
  );
}

function tabsFor(id: string): T[] {
  if (id === "virtual") return [
    { id: "visit3d", label: "Visit in 3D", icon: "orbit", body: <div className="space-y-4"><p className="max-w-[70ch] text-[15px] text-muted">Most care happens by video. When you do come in, this is the route — walk it before you go: arrival, reception, the formalities, vitals, lab, consultation and your plan.</p><Visit3D visit={CALGARY_VISIT} title="Biongevity Calgary" /></div> },
    { id: "prep", label: "Before you come", icon: "checklist", body: <BeforeYouCome visit={CALGARY_VISIT} /> },
    { id: "how", label: "How it works", icon: "route", body: <div className="space-y-8"><Flow /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat v="0 km" l="travel to your appointment" accent /><Stat v="4 steps" l="from request to plan" /><Stat v="1 record" l="shared with your care team" /><Stat v="9" l="specialties reachable virtually" /></div></div> },
    { id: "fit", label: "Virtual or in person", icon: "video", body: <Fit /> },
    { id: "bp", label: "Remote BP program", icon: "gauge", body: <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-5">{VIRTUAL.bpSteps.map((s, k) => <div key={s.t} className="rounded-2xl bg-canvas p-4"><div className="text-[12px] font-semibold text-accent">0{k + 1}</div><div className="mt-1 text-[14px] font-semibold">{s.t}</div><div className="mt-1 text-[12.5px] text-muted">{s.d}</div></div>)}</div><BPTracker /></div> },
    { id: "why", label: "Why virtual", icon: "heart", body: <Points id="virtual" /> },
    { id: "join", label: "Join", icon: "users", body: <Join label="Virtual Longevity Clinic" /> },
  ];
  if (id === "uae") {
    const dxb = OFFICES.find((o) => o.city === "Dubai")!;
    return [
      { id: "visit3d", label: "Assessment day in 3D", icon: "orbit", body: <div className="space-y-4"><p className="max-w-[70ch] text-[15px] text-muted">AB Center, 3rd floor, office 302. Walk the day before you book: registration, consents, body composition, fitness testing, lab and genetic samples, the precision consultation and your plan.</p><Visit3D visit={DUBAI_VISIT} title="Biongevity Clinic Dubai" /></div> },
      { id: "day", label: "Your day", icon: "clock", body: <DayTimeline visit={DUBAI_VISIT} /> },
      { id: "prep", label: "Before you come", icon: "checklist", body: <BeforeYouCome visit={DUBAI_VISIT} /> },
      { id: "overview", label: "Overview", icon: "eye", body: <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><FilmPlayer film="clinicFilm" loop="clinicLoop" label="Inside the UAE Precision Clinic" className="aspect-video" /><div className="space-y-3"><div className="rounded-[24px] bg-navy p-6 text-white"><div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-teal-soft">Focus areas</div><div className="mt-3 flex flex-wrap gap-2">{UAE.focus.map((f) => <span key={f} className="rounded-full bg-white/10 px-3 py-1.5 text-[13px]">{f}</span>)}</div></div><div className="grid grid-cols-2 gap-3"><Stat v="9" l="longevity assessments" /><Stat v="1 day" l="to complete a full assessment" src="Biongevity" /></div></div></div> },
      { id: "assess", label: "Assessments", icon: "radar", body: <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]"><div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="text-center text-[14px] font-semibold">What a full assessment maps</div><Radar axes={UAE.radar.axes} series={[{ name: "Example profile", values: UAE.radar.you }, { name: "Age-group reference", values: UAE.radar.ref, color: "rgb(var(--c-gold))" }]} size={300} /><p className="text-center text-[11px] text-faint">Illustrative profile, not member data.</p></div><Points id="uae" /></div> },
      { id: "depts", label: "Departments", icon: "stethoscope", body: <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{DEPARTMENTS.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06] transition-transform hover:-translate-y-0.5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-light text-accent group-hover:bg-iri group-hover:text-white"><Icon name={d.icon} size={20} /></span><span className="flex-1"><span className="block text-[15px] font-semibold">{d.short}</span><span className="block text-[12px] text-muted">{d.tag}</span></span><Icon name="arrow-right" size={15} className="text-faint" /></Link>)}<p className="text-[12px] text-faint sm:col-span-2 lg:col-span-3">Availability in Dubai varies by specialty — some are offered virtually. Your coordinator confirms.</p></div> },
      { id: "visit", label: "Visit", icon: "pin", body: <div className="grid gap-5 md:grid-cols-2"><div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]"><div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{dxb.region}</div><div className="mt-1 text-[24px] font-semibold">Dubai</div><p className="mt-2 text-[15px] text-muted">{dxb.address}</p><div className="mt-4 flex flex-wrap gap-3"><a href={dxb.tel} className="btn-dark"><Icon name="call" size={15} />{dxb.phone}</a>{dxb.email && <a href={`mailto:${dxb.email}`} className="btn-light"><Icon name="mail" size={15} />Email</a>}<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dxb.address)}`} target="_blank" rel="noopener" className="btn-light"><Icon name="route" size={15} />Directions</a></div></div><Join label="UAE Precision Clinic" /></div> },
    ];
  }
  const s = STREAMS["Biological age"];
  return [
    { id: "steps", label: "The journey", icon: "route", body: (
      <div className="relative space-y-3">
        <div aria-hidden className="absolute bottom-6 left-[27px] top-6 hidden w-[2px] bg-gradient-to-b from-accent via-teal to-gold sm:block" />
        {CARE_PHASES.map((p) => <div key={p.n} className="relative flex flex-col gap-3 rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:flex-row sm:items-center"><span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center icon-tile"><Icon name={p.icon} size={22} /></span><div><div className="text-[12px] font-semibold text-accent">Step {p.n} · {p.short}</div><div className="text-[18px] font-semibold">{p.t}</div><p className="mt-1 text-[14px] text-muted">{p.d}</p></div></div>)}
      </div>) },
    { id: "age", label: "Biological age", icon: "hourglass", body: (
      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] bg-navy p-6 text-center text-white"><ProgressRing value={64} size={130} label="illustrative" dark /><div className="text-[20px] font-semibold">Biological vs chronological age</div><p className="text-[14px] text-white/70">Biological age reflects cellular health — shaped by DNA, habits and environment — and it can move.</p></div>
        <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="text-[14px] font-semibold">Biological age across a program</div><LineChart labels={[...s.trend.labels]} unit=" yrs" series={[{ name: "Biological age", values: [...s.trend.bio] }, { name: "Chronological age", values: [...s.trend.chrono], color: "rgb(var(--c-gold))", dashed: true }]} /><div className="mt-3 grid grid-cols-2 gap-3">{s.stats.map((x) => <Stat key={x.l} {...x} />)}</div><p className="mt-2 text-[11px] text-faint">Illustrative trajectory, not member data.</p></div>
      </div>) },
    { id: "get", label: "What you get", icon: "box", body: <Points id="journey" /> },
    { id: "programs", label: "Programs", icon: "crown", body: <div className="grid gap-4 md:grid-cols-3">{PACKAGES.map((p) => <Link key={p.handle} href="/shop/#depth" className={`rounded-[24px] p-6 transition-transform hover:-translate-y-0.5 ${p.featured ? "bg-navy text-white" : "bg-white ring-1 ring-ink/[0.06]"}`}><div className="text-[13px] opacity-70">{p.cadence}</div><div className="mt-1 text-[22px] font-semibold">{p.name}</div><div className="mt-2 text-[34px] font-semibold">${p.price}</div><div className="mt-2 text-[13px] opacity-75">{p.diagnostics[0]}</div></Link>)}</div> },
    { id: "join", label: "Start", icon: "arrow-right", body: <Join label="Longevity Journey" /> },
  ];
}

/** Clinic sub-page tabs: Journey, Virtual Clinic and UAE Precision Clinic each get their own relevant set. */
export function ClinicTabs({ id }: { id: string }) {
  const tabs = tabsFor(id);
  const [tab, setTab] = useState(tabs[0].id);
  useEffect(() => { const h = location.hash.slice(1); if (tabs.some((t) => t.id === h)) setTab(h); }, [tabs]);
  const go = (t: string) => { setTab(t); history.replaceState(null, "", `#${t}`); };
  const cur = tabs.find((t) => t.id === tab) ?? tabs[0];
  return (
    <div>
      <div className="sticky top-[calc(64px+var(--safe-top))] z-20 -mx-4 bg-white/80 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card ring-1 ring-ink/[0.06] sm:inline-flex">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => go(t.id)} className="relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13.5px] font-semibold">
              {tab === t.id && <motion.span layoutId={`ct-${id}`} className="absolute inset-0 rounded-full bg-ai" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={`relative flex items-center gap-1.5 ${tab === t.id ? "text-on-ai" : "text-muted hover:text-ink"}`}><Icon name={t.icon} size={15} />{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cur.id} role="tabpanel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="mt-8">{cur.body}</motion.div>
      </AnimatePresence>
    </div>
  );
}
