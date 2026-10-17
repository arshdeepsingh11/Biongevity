"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CARE_PATH, DEPARTMENTS, deptById } from "@/data/departments";
import { DEPT_EVIDENCE } from "@/data/stats";
import { Icon } from "@/components/ui/Icon";
import { TabBar } from "@/components/ui/Tabs";
import { Stat } from "@/components/charts/Charts";
import { EvidenceChart } from "@/components/charts/EvidenceChart";
import { MagicCard } from "@/components/fx/MagicCard";
import { AIPanel } from "@/components/ai/AIPanel";
import { AnatomyStudio } from "@/components/body/AnatomyStudio";
import { ServicesRing } from "@/components/fx3d/Showcases";
import { Tilt } from "@/components/fx3d/HoverGallery3D";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { ANATOMY } from "@/data/anatomy";
import { DEPT_EXTRA } from "@/data/deptExtra";

const ALL = [
  { id: "anatomy", label: "3D anatomy", icon: "orbit" },
  { id: "overview", label: "Overview", icon: "eye" },
  { id: "offer", label: "What we offer", icon: "sparkle" },
  { id: "conditions", label: "Conditions", icon: "clipboard" },
  { id: "services", label: "Tests & services", icon: "microscope" },
  { id: "programs", label: "Programs & prices", icon: "crown" },
  { id: "path", label: "Care path", icon: "route" },
  { id: "connected", label: "Connected care", icon: "network" },
  { id: "evidence", label: "Evidence", icon: "bars" },
  { id: "faq", label: "FAQ", icon: "message" },
  { id: "sources", label: "Sources", icon: "book" },
] as const;
type Tab = (typeof ALL)[number]["id"];

/** Department detail — six tabs of clinical content, cited evidence and an AI panel. */
export function DeptTabs({ id }: { id: string }) {
  const d = deptById(id), ev = DEPT_EVIDENCE[id], x = DEPT_EXTRA[id];
  const { ask } = useAI();
  const has: Record<Tab, boolean> = { anatomy: !!ANATOMY[id]?.length, overview: true, offer: !!x, conditions: true, services: true, programs: !!(x?.packages || x?.program), path: true, connected: !!x, evidence: true, faq: true, sources: !!x };
  const TABS = ALL.filter((t) => has[t.id]);
  const [tab, setTab] = useState<Tab>(TABS[0].id);
  useEffect(() => { const h = location.hash.slice(1) as Tab; if (ALL.some((t) => t.id === h) && has[h]) setTab(h); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const go = (t: Tab) => { setTab(t); history.replaceState(null, "", `#${t}`); };
  const related = DEPARTMENTS.filter((x) => x.id !== id && x.group === d.group).slice(0, 4);

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={(t) => go(t as never)} id={`dt-${id}`} />

      <div className={`mt-8 grid gap-6 ${tab === "anatomy" ? "" : "lg:grid-cols-[minmax(0,1fr)_320px]"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="min-w-0">
            {tab === "anatomy" && <AnatomyStudio dept={id} name={d.name} />}

            {tab === "offer" && x && (
              <div className="space-y-5">
                {x.numbers && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{x.numbers.map((n, k) => <Stat key={n.l} v={n.v} l={n.l} accent={k === 0} />)}</div>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {x.offer.map((o, k) => (
                    <motion.div key={o.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05 }}>
                      <Tilt max={6} className="h-full">
                        <button onClick={() => ask(`Tell me about "${o.t}" in ${d.name} at Biongevity: ${o.d} Who is it for and what happens?`, { label: `✦ ${o.t}` })} className="group flex h-full w-full flex-col rounded-[24px] bg-white p-5 text-left shadow-card ring-1 ring-ink/[0.06] transition hover:ring-ai/30">
                          <span className="icon-tile h-11 w-11"><Icon name={o.icon} size={20} /></span>
                          <span className="mt-3 text-[16px] font-semibold leading-snug">{o.t}</span>
                          <span className="mt-1 text-[13.5px] leading-relaxed text-muted">{o.d}</span>
                          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[12px] font-semibold text-ai opacity-70 transition group-hover:opacity-100"><XevyoOrb size={14} />Ask SI</span>
                        </button>
                      </Tilt>
                    </motion.div>
                  ))}
                </div>
                {x.partner && (
                  <div className="flex flex-wrap items-center gap-4 rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                    <span className="icon-tile h-12 w-12"><Icon name="building" size={22} /></span>
                    <div className="min-w-0 flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">BioAro group clinic</div><div className="text-[17px] font-semibold">{x.partner.name}</div><p className="text-[13.5px] text-muted">{x.partner.line}</p></div>
                    <a href={x.partner.url} target="_blank" rel="noopener noreferrer" className="btn-light h-10 px-4 text-[13px]">Visit<Icon name="arrow-up-right" size={13} /></a>
                  </div>
                )}
              </div>
            )}

            {tab === "programs" && x && (
              <div className="space-y-6">
                {x.program && (
                  <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                    <div className="flex flex-wrap items-end justify-between gap-2"><div><div className="eyebrow">Program</div><div className="text-[22px] font-semibold tracking-tight">{x.program.name}</div>{x.program.for && <p className="mt-1 text-[13.5px] text-muted">For: {x.program.for}</p>}</div>
                      <button onClick={() => ask(`Walk me through the ${x.program!.name} at Biongevity step by step, and whether it suits me.`, { label: `✦ ${x.program!.name}` })} className="btn-ai h-9 px-3.5 text-[12.5px]"><XevyoOrb size={16} />Is it for me?</button></div>
                    <ol className="relative mt-5 grid gap-3 md:grid-cols-5">
                      <div aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-[2px] bg-gradient-to-r from-ai/10 via-ai/50 to-ai/10 md:block" />
                      {x.program.steps.map((st, k) => (
                        <motion.li key={st.t} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * k }} className="relative">
                          <span className="relative z-[1] grid h-11 w-11 place-items-center rounded-full bg-ai text-[14px] font-bold text-on-ai ring-4 ring-pearl">{k + 1}</span>
                          <div className="mt-2 text-[14.5px] font-semibold">{st.t}</div><p className="mt-0.5 text-[12.5px] leading-snug text-muted">{st.d}</p>
                        </motion.li>
                      ))}
                    </ol>
                    {x.program.note && <p className="mt-4 rounded-2xl bg-ai-soft/60 px-4 py-2.5 text-[12.5px] text-ai">{x.program.note}</p>}
                  </div>
                )}
                {x.packages && (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {x.packages.map((p) => (
                      <Tilt key={p.name} max={5} className="h-full">
                        <div className="flex h-full flex-col rounded-[26px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                          <div className="flex items-start justify-between gap-2"><span className="icon-tile h-11 w-11"><Icon name="clipboard" size={20} /></span>{p.labPrice && <div className="text-right"><div className="text-[22px] font-semibold tracking-tight">{p.labPrice}</div><div className="text-[10.5px] text-faint">labs, CAD</div></div>}</div>
                          <div className="mt-3 text-[17px] font-semibold">{p.name}</div><p className="text-[12.5px] text-muted">{p.for}</p>
                          <div className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-faint">Clinic</div>
                          <ul className="mt-1 space-y-1">{p.clinic.map((c) => <li key={c} className="flex gap-1.5 text-[12.5px]"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-ai" />{c}</li>)}</ul>
                          <div className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-faint">BioAro Labs</div>
                          <div className="mt-1 flex flex-wrap gap-1">{p.labs.map((l) => <span key={l} className="rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-semibold text-ai">{l}</span>)}</div>
                          <Link href={`/contact/?interest=${encodeURIComponent(p.name)}`} className="btn-dark mt-auto h-10 justify-center text-[13px]" style={{ marginTop: 16 }}>Ask about {p.name}</Link>
                        </div>
                      </Tilt>
                    ))}
                  </div>
                )}
                <p className="text-[11.5px] text-faint">Lab prices are BioAro Labs list prices in CAD; clinic services are quoted by the care team. No payment is taken on this site.</p>
              </div>
            )}

            {tab === "connected" && x && (
              <div className="grid gap-3 md:grid-cols-2">
                {x.links.map((l, k) => (
                  <motion.div key={l.t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.06 }} className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                    <div className="flex items-center gap-2 text-[16px] font-semibold"><span className="grid h-8 w-8 place-items-center rounded-full bg-ai text-on-ai"><Icon name="network" size={15} /></span>{l.t}</div>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{l.d}</p>
                  </motion.div>
                ))}
                <p className="text-[12.5px] text-muted md:col-span-2">Every department writes to the same record, so these links are checked together — not in separate silos.</p>
              </div>
            )}

            {tab === "sources" && x && (
              <div className="rounded-[24px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                <div className="text-[17px] font-semibold">Where this information comes from</div>
                <ul className="mt-3 space-y-2">{x.sources.map((src) => <li key={src.url} className="flex items-start gap-2 text-[14px]"><Icon name="external" size={15} className="mt-0.5 shrink-0 text-ai" /><a href={src.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/20 underline-offset-2 hover:text-ai">{src.name}</a></li>)}</ul>
                {ANATOMY[id] && <p className="mt-4 text-[12.5px] text-muted">3D anatomy models: {ANATOMY[id].map((m) => `${m.title} by ${m.author}`).join(" · ")} (Sketchfab).</p>}
                <p className="mt-2 text-[12px] text-faint">Written in our own words and reviewed October 2026. Services and availability are confirmed by the care team.</p>
              </div>
            )}

            {tab === "overview" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat v={String(d.areas.length)} l="areas of care" accent />
                  <Stat v={String(d.services.length)} l="tests & services" />
                  <Stat v="4" l="steps from referral to plan" />
                  <Stat v="1" l="connected health record" />
                </div>
                <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                  <div className="eyebrow">Our approach</div>
                  {d.approach.map((a) => <p key={a} className="mt-3 text-[16px] leading-relaxed text-ink/80">{a}</p>)}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                    <div className="text-[17px] font-semibold">When to see us</div>
                    <ul className="mt-3 space-y-2">{d.when.map((w) => <li key={w} className="flex gap-2.5 text-[14.5px] text-ink/85"><Icon name="check" size={17} className="mt-0.5 shrink-0 text-teal" weight="bold" />{w}</li>)}</ul>
                  </div>
                  <div className="rounded-[28px] bg-navy p-6">
                    <div className="text-[17px] font-semibold">What we look for</div>
                    <div className="mt-3 flex flex-wrap gap-2">{d.signs.map((s) => <span key={s} className="rounded-full bg-white px-3 py-1.5 text-[13px] ring-1 ring-accent/15">{s}</span>)}</div>
                    <div className="mt-5 grid grid-cols-2 gap-3">{ev.stats.map((s) => <div key={s.l}><div className="text-[24px] font-semibold text-accent">{s.v}</div><div className="text-[12px] text-muted">{s.l}</div></div>)}</div>
                  </div>
                </div>
                {d.urgent && <div className="flex gap-3 rounded-2xl bg-warn/10 p-4 text-[14px] text-warn"><Icon name="siren" size={19} className="mt-0.5 shrink-0" />{d.urgent}</div>}
              </div>
            )}

            {tab === "conditions" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {d.areas.map((a, k) => (
                  <MagicCard key={a.t} className="h-full p-5">
                    <div className="flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center icon-tile"><Icon name={a.icon} size={24} weight="duotone" /></span>
                      <div><div className="text-[12px] font-semibold tabular-nums text-faint">{String(k + 1).padStart(2, "0")}</div><div className="text-[17px] font-semibold">{a.t}</div><div className="mt-1 text-[14px] text-muted">{a.d}</div></div>
                    </div>
                  </MagicCard>
                ))}
              </div>
            )}

            {tab === "services" && (
              <div className="space-y-6">
              {d.services.length >= 3 && <ServicesRing dept={id} />}
              <div className="grid gap-4 md:grid-cols-2">
                {d.services.map((s) => (
                  <div key={s.t} className="flex h-full flex-col rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-12 w-12 place-items-center icon-tile"><Icon name={s.icon} size={24} weight="duotone" /></span>
                      {s.time && <span className="flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-[12px] font-semibold text-muted"><Icon name="clock" size={13} />{s.time}</span>}
                    </div>
                    <div className="mt-4 text-[17px] font-semibold">{s.t}</div>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.d}</p>
                    {s.prep && (
                      <div className="mt-4 rounded-2xl bg-canvas p-3.5">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-accent">How to prepare</div>
                        <ul className="mt-2 space-y-1.5">{s.prep.map((p) => <li key={p} className="flex gap-2 text-[13px] text-ink/80"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-teal" weight="bold" />{p}</li>)}</ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>
            )}

            {tab === "path" && (
              <div className="space-y-5">
                <div className="relative grid gap-4 md:grid-cols-4">
                  <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-[2px] bg-iri-x md:block" />
                  {CARE_PATH.map((p, k) => (
                    <div key={p.t} className="relative rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                      <span className="relative z-[1] grid h-12 w-12 place-items-center icon-tile ring-4 ring-pearl"><Icon name={p.icon} size={22} weight="duotone" /></span>
                      <div className="mt-3 text-[12px] font-semibold text-accent">Step {k + 1}</div>
                      <div className="text-[16px] font-semibold">{p.t}</div>
                      <div className="mt-1 text-[13px] text-muted">{p.d}</div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[["video", "Virtual visits", "Follow-ups, results and medication reviews by secure video.", "/clinic/virtual/"], ["home", "At-home collection", "A trained collector visits your home or office; results flow to your record.", "/contact/?interest=at-home"], ["file", "Referral upload", "Scan or upload a referral and track it from intake to booking.", "/contact/?interest=referral"]].map(([i, t, x, h]) => (
                    <Link key={t} href={h} className="group rounded-[24px] bg-navy p-5 transition-transform hover:-translate-y-0.5">
                      <Icon name={i} size={24} weight="duotone" className="text-accent" />
                      <div className="mt-3 text-[16px] font-semibold">{t}</div><div className="mt-1 text-[13px] text-muted">{x}</div>
                      <div className="mt-3 text-[13px] font-semibold text-accent">Learn more →</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tab === "evidence" && (
              <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
                <div className="space-y-4">
                  <p className="text-[17px] leading-relaxed text-ink/80">{ev.why}</p>
                  <div className="grid grid-cols-2 gap-3">{ev.stats.map((s, k) => <Stat key={s.l} {...s} accent={k === 0} />)}</div>
                </div>
                <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]"><EvidenceChart spec={ev.chart} /></div>
              </div>
            )}

            {tab === "faq" && (
              <div className="space-y-3">
                {[...d.faq, ...(x?.faq ?? [])].map((f, k) => (
                  <details key={f.q} open={k === 0} className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink/[0.06] open:ring-accent/25">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-semibold">{f.q}<Icon name="plus" size={18} className="shrink-0 text-accent transition-transform group-open:rotate-45" /></summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
                {d.specialist && (
                  <div className="flex items-start gap-4 rounded-[24px] bg-navy p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-accent"><Icon name="user" size={22} weight="duotone" /></span>
                    <div><div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">Your specialist</div><div className="text-[17px] font-semibold">{d.specialist.role}</div><p className="mt-1 text-[14px] text-muted">{d.specialist.bio}</p></div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <aside className={`space-y-4 lg:sticky lg:top-[140px] lg:self-start ${tab === "anatomy" ? "hidden" : ""}`}>
          <AIPanel title={`Ask about ${d.short}`} prompts={d.prompts} context={d.name} />
          <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
            <div className="text-[14px] font-semibold">Related care</div>
            <div className="mt-3 space-y-1">{related.map((r) => <Link key={r.id} href={`/precision-health/${r.id}/`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-[14px] hover:bg-canvas"><Icon name={r.icon} size={18} weight="duotone" className="text-accent" />{r.short}<Icon name="arrow-right" size={14} className="ml-auto text-faint" /></Link>)}</div>
          </div>
          <Link href={`/contact/?interest=${encodeURIComponent(d.name)}`} className="btn-dark w-full">Book {d.short}<Icon name="arrow-right" size={16} /></Link>
        </aside>
      </div>
    </div>
  );
}
