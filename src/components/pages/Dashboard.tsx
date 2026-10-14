"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { useAI } from "@/components/ai/AIProvider";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { ProgressRing } from "@/components/fx/ProgressRing";
import { AnimatedList } from "@/components/fx/AnimatedList";
import { EvervaultCard } from "@/components/fx/EvervaultCard";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { fireConfetti } from "@/components/fx/Confetti";
import { Icon } from "@/components/ui/Icon";
import { BIO_AGE_SERIES, BIOMARKERS, INSIGHTS, PLAN, REPORTS, SLOTS, VARIANTS, VISITS } from "@/data/dashboard";

const TABS = [["overview", "Overview", "grid"], ["biomarkers", "Biomarkers", "activity"], ["genome", "Genome", "dna"], ["plan", "Plan", "check"], ["visits", "Visits", "calendar"], ["reports", "Reports", "file"]] as const;
type Tab = (typeof TABS)[number][0];
const STATUS = { ok: ["Within typical range", "text-sky"], discuss: ["Discuss with clinician", "text-warn"], neutral: ["Read against your baseline", "text-faint"] } as const;

/** Member dashboard (illustrative). Replace data with Shopify customer + BioELR APIs later. */
export function Dashboard() {
  const { ask } = useAI();
  const [tab, setTab] = useState<Tab>("overview");
  const [plan, setPlan] = useState<Record<number, boolean>>({ 0: true, 1: true, 3: true });
  const [bmf, setBmf] = useState("All");
  const [openBm, setOpenBm] = useState<string | null>(null);
  const [openRep, setOpenRep] = useState<number | null>(null);
  const [bookDept, setBookDept] = useState("Cardiology");
  const [slot, setSlot] = useState(1);
  const [extra, setExtra] = useState<typeof VISITS>([]);
  const [booked, setBooked] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ l: 0, w: 0 });
  useLayoutEffect(() => { const el = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${tab}"]`); if (el) setPill({ l: el.offsetLeft, w: el.offsetWidth }); }, [tab]);

  const done = PLAN.filter((_, i) => plan[i]).length, adherence = Math.round((done / PLAN.length) * 100);
  const visits = [...extra, ...VISITS];
  const yOf = (v: number) => 140 - ((v - 37) / 8) * 130;
  const pts = BIO_AGE_SERIES.map((v, i) => [(i / (BIO_AGE_SERIES.length - 1)) * 400, yOf(v)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

  return (
    <section data-ai="Member dashboard" className="relative z-[1] pb-24 pt-[calc(92px+var(--safe-top))] sm:pt-[110px]">
      <div className="container-x">
        <div className="flex gap-3 rounded-2xl bg-surface p-4 text-[13px] text-muted ring-1 ring-ink/[0.05]"><Icon name="info" size={17} className="shrink-0 text-violet" /><span><b className="text-ink">Demo member.</b> All values, findings, visits and reports are illustrative and not connected to BioELR, a lab, wearables or a clinic calendar.</span></div>
        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="text-[13px] text-faint">Member A-2041 · illustrative</div><h1 className="mt-1 text-[38px] font-semibold tracking-[-0.03em] sm:text-[48px]">Good morning, Alex.</h1></div>
          <div ref={tabsRef} role="tablist" className="no-scrollbar relative flex overflow-x-auto rounded-full bg-surface p-1 shadow-card ring-1 ring-ink/[0.05]">
            <span aria-hidden className="absolute bottom-1 top-1 rounded-full bg-ink transition-all duration-500 [transition-timing-function:cubic-bezier(.3,1.3,.4,1)]" style={{ left: pill.l, width: pill.w }} />
            {TABS.map(([id, label, icon]) => (
              <button key={id} data-tab={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${tab === id ? "text-white" : "text-muted"}`}>
                <Icon name={icon} size={14} />{label}
              </button>
            ))}
          </div>
        </div>

        {tab === "overview" && (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-4xl bg-surface p-6 shadow-card lg:col-span-2">
              <ShineBorder radius={28} />
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-[13px] text-faint">Estimated biological age · illustrative</div>
                  <div className="mt-2 flex items-baseline gap-2"><span className="text-[64px] font-semibold leading-none tracking-tighter text-iri"><NumberTicker value={38.4} decimals={1} from={44} /></span><span className="text-muted">vs 44 chronological</span></div>
                  <p className="mt-3 text-[13px] text-muted">Compare against your own earlier estimates; methods differ between providers.</p>
                  <button onClick={() => ask("What is biological age and how is it measured?")} className="chip mt-4 border-ink/10 bg-canvas"><Icon name="sparkle" size={14} className="text-violet" />What does this mean?</button>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] text-faint"><span>12 months</span><span>Illustrative trend</span></div>
                  <svg viewBox="0 0 400 150" className="mt-2 w-full">
                    <defs><linearGradient id="dash-l" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--c-teal-soft))" /><stop offset=".5" stopColor="rgb(var(--c-accent))" /><stop offset="1" stopColor="rgb(var(--c-accent))" /></linearGradient>
                      <linearGradient id="dash-a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="rgb(var(--c-accent))" stopOpacity=".25" /><stop offset="1" stopColor="rgb(var(--c-accent))" stopOpacity="0" /></linearGradient></defs>
                    <line x1="0" x2="400" y1={yOf(44)} y2={yOf(44)} stroke="rgb(var(--c-faint))" strokeDasharray="4 4" strokeWidth="1" />
                    <path d={`${line} L400 150 L0 150 Z`} fill="url(#dash-a)" />
                    <path d={line} fill="none" stroke="url(#dash-l)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="400" cy={pts[pts.length - 1][1]} r="5" fill="rgb(var(--c-accent))" />
                  </svg>
                  <div className="text-[11px] text-faint">Dashed line · chronological age</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 rounded-4xl bg-surface p-6 shadow-card"><ProgressRing value={adherence} label="this week" /><div><div className="font-semibold">Draft plan progress</div><div className="mt-1 text-[13px] text-muted">{done} of {PLAN.length} actions checked off. Calculated from the Plan tab.</div></div></div>
            <div className="rounded-4xl bg-surface p-6 shadow-card lg:col-span-2"><div className="mb-4 text-[13px] font-semibold text-faint">AI updates · simulated</div><AnimatedList items={INSIGHTS} /></div>
            <div className="relative flex flex-col overflow-hidden rounded-4xl bg-gradient-to-br from-accent to-accent-deep p-6 text-white shadow-glow">
              <div className="flex items-center gap-1.5 text-[13px] text-white/75"><Icon name="calendar" size={14} />Next visit · demo calendar</div>
              <div className="mt-3 text-[22px] font-semibold">{visits[0].t}</div><div className="text-[14px] text-white/60">{visits[0].mo} {visits[0].day} · {visits[0].time} · {visits[0].where}</div>
              <div className="flex-1" /><button onClick={() => setTab("visits")} className="btn mt-6 bg-surface text-ink">Manage visits</button>
            </div>
          </div>
        )}

        {tab === "biomarkers" && (
          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="no-scrollbar flex gap-2 overflow-x-auto">{["All", "Cardio", "Metabolic", "Inflammation", "Nutrients", "Recovery"].map((c) => <button key={c} aria-pressed={bmf === c} onClick={() => setBmf(c)} className={`chip shrink-0 ${bmf === c ? "border-ink bg-ink text-white" : "border-ink/10 bg-surface"}`}>{c}</button>)}</div>
              <span className="text-[12px] text-faint">Illustrative panel · Sep 30, 2026 · ranges vary by lab</span>
            </div>
            <div className="card mt-4 overflow-hidden">
              {BIOMARKERS.filter((b) => bmf === "All" || b.sys === bmf).map((b) => {
                const open = openBm === b.n, [st, col] = STATUS[b.s];
                return (
                  <div key={b.n} className="border-b border-ink/[0.05] last:border-0">
                    <button onClick={() => setOpenBm(open ? null : b.n)} aria-expanded={open} data-scan className={`grid w-full grid-cols-[1.3fr_1fr_auto] items-center gap-3 p-4 text-left sm:grid-cols-[1.4fr_1fr_1.4fr_auto] ${open ? "bg-pearl" : ""}`}>
                      <div><div className="font-semibold">{b.n}</div><div className="text-[12px] text-faint">{b.sys}</div></div>
                      <div className="text-[18px] font-semibold">{b.v} <span className="text-[12px] font-normal text-faint">{b.u}</span></div>
                      <div className="hidden sm:block"><div className="text-[12px] text-faint">{b.range}</div><div className={`text-[13px] font-semibold ${col}`}>{st}</div></div>
                      <span className="chip h-8 border-ink/10 bg-surface text-[12px]"><Icon name="sparkle" size={13} className="text-violet" />{open ? "Hide" : "Explain"}</span>
                    </button>
                    {open && (
                      <div className="grid gap-3 bg-pearl px-4 pb-5 sm:grid-cols-3">
                        <div className="rounded-2xl bg-surface p-4"><div className="text-[12px] font-semibold text-faint">What it measures</div><div className="mt-1 text-[14px]">{b.what}</div></div>
                        <div className="rounded-2xl bg-surface p-4"><div className="text-[12px] font-semibold text-faint">What it doesn&apos;t tell you</div><div className="mt-1 text-[14px]">{b.not}</div></div>
                        <div className="rounded-2xl bg-surface p-4"><div className="text-[12px] font-semibold text-faint">Ask your clinician</div><div className="mt-1 text-[14px]">{b.q}</div><button onClick={() => ask(`Explain my ${b.n} result of ${b.v} ${b.u}`)} className="mt-3 text-[13px] font-semibold text-violet">Ask a follow-up →</button></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "genome" && (
          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
            <EvervaultCard text="A-2041" label="Genome · illustrative" />
            <div className="space-y-3">
              {VARIANTS.map((v) => (
                <div key={v.g} data-scan className="card p-5">
                  <div className="flex items-center justify-between"><div className="text-[18px] font-semibold">{v.g} <span className="font-mono text-[14px] text-muted">{v.v}</span></div><span className="rounded-full bg-canvas px-2.5 py-1 text-[12px] font-semibold text-violet">{v.tag}</span></div>
                  <div className="mt-2 text-[15px]">{v.d}</div><div className="mt-1 text-[13px] text-faint">Doesn&apos;t establish: {v.not}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "plan" && (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <div className="mb-3 text-[13px] text-warn">Draft · not clinically approved. Review with your clinician.</div>
              {PLAN.map((p, i) => (
                <button key={p.t} onClick={(e) => { const on = !plan[i]; setPlan((s) => ({ ...s, [i]: on })); if (on && done + 1 === PLAN.length) fireConfetti({ x: e.clientX / innerWidth, y: e.clientY / innerHeight }); }}
                  aria-pressed={!!plan[i]} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-canvas">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${plan[i] ? "border-transparent bg-iri text-white" : "border-ink/20"}`}>{plan[i] && <Icon name="check" size={13} strokeWidth={2.4} />}</span>
                  <span className="flex-1"><span className={`block font-medium ${plan[i] ? "text-muted line-through" : ""}`}>{p.t}</span><span className="text-[13px] text-faint">{p.m}</span></span>
                </button>
              ))}
            </div>
            <div className="card flex flex-col items-center p-6 text-center"><ProgressRing value={adherence} size={150} label="adherence" /><div className="mt-3 text-[13px] text-muted">Updates as you check actions off.</div>
              <button onClick={() => ask("What questions should I ask about my draft plan?")} className="chip mt-4 border-ink/10 bg-canvas"><Icon name="sparkle" size={14} className="text-violet" />Questions to ask about this plan</button></div>
          </div>
        )}

        {tab === "visits" && (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">{visits.map((v, i) => (
              <div key={i} className="card flex items-center gap-4 p-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-canvas text-center"><div><div className="text-[11px] font-semibold uppercase text-violet">{v.mo}</div><div className="text-[20px] font-semibold leading-none">{v.day}</div></div></div><div><div className="font-semibold">{v.t}</div><div className="text-[13px] text-muted">{v.time} · {v.where}</div></div></div>
            ))}</div>
            <div className="card p-6">
              <div className="text-[19px] font-semibold">Book a visit · demo</div>
              <div className="mt-4 flex flex-wrap gap-2">{["Cardiology", "Internal Medicine", "Dietology", "Kinesiology", "Dermatology"].map((b) => <button key={b} aria-pressed={bookDept === b} onClick={() => { setBookDept(b); setBooked(false); }} className={`chip ${bookDept === b ? "border-ink bg-ink text-white" : "border-transparent bg-canvas"}`}>{b}</button>)}</div>
              <div className="mt-4 grid grid-cols-4 gap-2">{SLOTS.map((s, i) => <button key={i} aria-pressed={slot === i} onClick={() => { setSlot(i); setBooked(false); }} className={`rounded-xl p-2 text-[12px] font-medium ${slot === i ? "bg-ink text-white" : "bg-canvas"}`}>{s[0]}<br />{s[1]}</button>)}</div>
              <button onClick={(e) => { const s = SLOTS[slot]; setExtra((x) => [{ mo: "Oct", day: s[0].split(" ")[1], t: bookDept, time: s[1], where: "Demo booking" }, ...x]); setBooked(true); fireConfetti({ x: e.clientX / innerWidth, y: e.clientY / innerHeight }); }} className="btn-dark mt-5 w-full">Add to demo calendar</button>
              {booked && <div className="mt-2 text-center text-[13px] text-muted">Added locally. Not sent to the clinic.</div>}
            </div>
          </div>
        )}

        {tab === "reports" && (
          <div className="mt-8 space-y-3">
            {REPORTS.map((r, i) => (
              <div key={r.t} data-scan className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-canvas"><Icon name="file" size={20} /></span><div><div className="font-semibold">{r.t}</div><div className="text-[13px] text-faint">{r.date} · {r.src} · illustrative</div></div></div>
                  <button onClick={() => setOpenRep(openRep === i ? null : i)} aria-expanded={openRep === i} className="btn-light h-9 text-[13px]">{openRep === i ? "Hide" : "Open report"}</button>
                </div>
                {openRep === i && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-canvas p-4"><div className="text-[12px] font-semibold text-faint">Report findings · source document</div><div className="mt-1 text-[14px]">{r.findings}</div></div>
                    <div className="relative rounded-2xl bg-surface p-4 ring-1 ring-ink/5"><ShineBorder radius={16} width={1} /><div className="text-[12px] font-semibold text-violet">AI explanation · verify against the report</div><div className="mt-1 text-[14px]">{r.sum}</div></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
