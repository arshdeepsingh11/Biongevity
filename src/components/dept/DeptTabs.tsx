"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { deptById } from "@/data/health";
import { CARE } from "@/data/care";
import { DEPT_EVIDENCE } from "@/data/stats";
import { LAB_TESTS } from "@/data/labs";
import { Icon } from "@/components/ui/Icon";
import { Stat } from "@/components/charts/Charts";
import { EvidenceChart } from "@/components/charts/EvidenceChart";
import { ProductCard } from "@/components/products/ProductCard";
import { HealthTool } from "@/components/tools/HealthTools";
import { MagicCard } from "@/components/fx/MagicCard";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { useAI } from "@/components/ai/AIProvider";

const TABS = [
  { id: "overview", label: "Overview", icon: "eye" },
  { id: "care", label: "Care & tests", icon: "stethoscope" },
  { id: "evidence", label: "Evidence", icon: "bars" },
  { id: "labs", label: "Lab tests", icon: "test-tubes" },
  { id: "check", label: "Self-check", icon: "gauge" },
  { id: "faq", label: "Specialist & FAQ", icon: "message" },
] as const;
type Tab = (typeof TABS)[number]["id"];

/** Department internal tabs. Content: biongevity.com + neyuhealth.com (paraphrased), BioAro Labs, public evidence. */
export function DeptTabs({ id }: { id: string }) {
  const d = deptById(id), c = CARE[id], ev = DEPT_EVIDENCE[id];
  const tests = d.tests.map((h) => LAB_TESTS.find((t) => t.handle === h)).filter((t) => t !== undefined);
  const [tab, setTab] = useState<Tab>("overview");
  const { ask } = useAI();
  useEffect(() => { const h = location.hash.slice(1) as Tab; if (TABS.some((t) => t.id === h)) setTab(h); }, []);
  const go = (t: Tab) => { setTab(t); history.replaceState(null, "", `#${t}`); };

  return (
    <div>
      <div className="sticky top-[calc(64px+var(--safe-top))] z-20 -mx-4 bg-white/80 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div role="tablist" aria-label={`${d.short} sections`} className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card ring-1 ring-ink/[0.06] sm:inline-flex">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => go(t.id)} className="relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13.5px] font-semibold">
              {tab === t.id && <motion.span layoutId={`dt-${id}`} className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={`relative flex items-center gap-1.5 ${tab === t.id ? "text-white" : "text-muted hover:text-ink"}`}><Icon name={t.icon} size={15} />{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="mt-8">
          {tab === "overview" && (
            <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                  <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">Our approach</div>
                  {d.approach.map((a) => <p key={a} className="mt-3 text-[16px] leading-relaxed text-ink/80">{a}</p>)}
                </div>
                <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                  <div className="text-[17px] font-semibold">When to see us</div>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">{c.when.map((w) => <li key={w} className="flex gap-2.5 rounded-xl bg-canvas p-3 text-[14px]"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-teal" />{w}</li>)}</ul>
                </div>
              </div>
              <div className="space-y-5">
                <div className="rounded-[28px] bg-navy p-6 text-white shadow-lift">
                  <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-teal-soft">What we look for</div>
                  <div className="mt-4 flex flex-wrap gap-2">{c.signs.map((s) => <span key={s} className="rounded-full bg-white/10 px-3 py-1.5 text-[13px]">{s}</span>)}</div>
                  <div className="mt-6 grid grid-cols-2 gap-3">{ev.stats.map((s) => <div key={s.l}><div className="text-[26px] font-semibold">{s.v}</div><div className="text-[12px] text-white/65">{s.l}</div></div>)}</div>
                </div>
                {c.urgent && <div className="flex gap-3 rounded-2xl bg-[#FEF2F2] p-4 text-[14px] text-[#991B1B]"><Icon name="siren" size={18} className="mt-0.5 shrink-0" />{c.urgent}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => go("check")} className="rounded-2xl bg-accent-light p-4 text-left transition-colors hover:bg-accent/15"><Icon name="gauge" size={18} className="text-accent" /><div className="mt-2 text-[14px] font-semibold">Try the self-check</div></button>
                  <button onClick={() => go("care")} className="rounded-2xl bg-teal-light p-4 text-left transition-colors hover:bg-teal/15"><Icon name="stethoscope" size={18} className="text-teal" /><div className="mt-2 text-[14px] font-semibold">See care & tests</div></button>
                </div>
              </div>
            </div>
          )}

          {tab === "care" && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {c.care.map((x, k) => (
                  <MagicCard key={x.t} className="p-5">
                    <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-iri text-white"><Icon name={x.icon} size={20} /></span><span className="text-[12px] font-semibold tabular-nums text-faint">{String(k + 1).padStart(2, "0")}</span></div>
                    <div className="mt-4 text-[17px] font-semibold">{x.t}</div><div className="mt-1 text-[14px] leading-relaxed text-muted">{x.d}</div>
                  </MagicCard>
                ))}
              </div>
              {d.services.length > 0 && (
                <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]">
                  <div className="text-[17px] font-semibold">At Biongevity</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{d.services.map((s) => <div key={s.t} className="rounded-xl bg-canvas p-3"><div className="text-[14px] font-semibold">{s.t}</div><div className="mt-0.5 text-[13px] text-muted">{s.d}</div></div>)}</div>
                </div>
              )}
              <div>
                <div className="text-[17px] font-semibold">Your visit, step by step</div>
                <div className="relative mt-5 grid gap-4 md:grid-cols-4">
                  <div aria-hidden className="absolute left-0 right-0 top-5 hidden h-[2px] bg-gradient-to-r from-accent via-teal to-gold md:block" />
                  {c.path.map((p, k) => <div key={p.t} className="relative"><span className="relative z-[1] grid h-10 w-10 place-items-center rounded-full bg-navy text-[14px] font-semibold text-white ring-4 ring-white">{k + 1}</span><div className="mt-3 text-[15px] font-semibold">{p.t}</div><div className="mt-1 text-[13px] text-muted">{p.d}</div></div>)}
                </div>
              </div>
            </div>
          )}

          {tab === "evidence" && (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">
                <p className="text-[17px] leading-relaxed text-ink/80">{ev.why}</p>
                <div className="grid grid-cols-2 gap-3">{ev.stats.map((s, k) => <Stat key={s.l} {...s} accent={k === 0} />)}</div>
              </div>
              <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-ink/[0.06]"><EvidenceChart spec={ev.chart} /></div>
            </div>
          )}

          {tab === "labs" && (
            <div>
              <p className="text-[15px] text-muted">BioAro Labs tests relevant to {d.short.toLowerCase()}. Each opens its official page; a clinician can help you interpret results.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tests.map((t, k) => k === 0 ? <ElectricBorder key={t.handle} radius={24}><ProductCard p={t} reason="Most relevant starting test" /></ElectricBorder> : <ProductCard key={t.handle} p={t} />)}
              </div>
              <Link href="/shop/?tab=match" className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-accent"><Icon name="target" size={15} />Not sure? Take the match quiz →</Link>
            </div>
          )}

          {tab === "check" && <HealthTool id={c.tool} />}

          {tab === "faq" && (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
              <div className="space-y-4">
                {d.specialist ? (
                  <div className="rounded-[28px] bg-navy p-6 text-white shadow-lift"><span className="grid h-14 w-14 place-items-center rounded-full bg-white/10"><Icon name="user" size={26} /></span><div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-teal-soft">Meet your specialist</div><div className="mt-1 text-[20px] font-semibold">{d.specialist.role}</div><p className="mt-2 text-[14px] text-white/70">{d.specialist.bio}</p></div>
                ) : (
                  <div className="rounded-[28px] bg-navy p-6 text-white shadow-lift"><Icon name="users" size={26} /><div className="mt-3 text-[18px] font-semibold">A dedicated care team</div><p className="mt-2 text-[14px] text-white/70">Specialists, nurses and care coordinators working from one shared longevity record.</p></div>
                )}
                <div className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                  <div className="text-[15px] font-semibold">Questions to bring</div>
                  <div className="mt-3 space-y-2">{d.questions.map((q) => <button key={q} onClick={() => ask(q)} className="flex w-full items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2.5 text-left text-[14px] hover:text-accent">{q}<Icon name="bot" size={15} className="shrink-0 text-accent" /></button>)}</div>
                  <p className="mt-2 text-[11px] text-faint">Tap a question to ask Xevyo.</p>
                </div>
              </div>
              <div className="space-y-3">
                {c.faq.map((f) => (
                  <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink/[0.06] open:ring-accent/25">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-semibold">{f.q}<Icon name="plus" size={16} className="shrink-0 text-accent transition-transform group-open:rotate-45" /></summary>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <p className="mt-8 text-[11px] text-faint">Sources: {d.source.replace("https://", "")} · {c.source.replace("https://", "")} · evidence as cited. General information — services vary by location.</p>
    </div>
  );
}
