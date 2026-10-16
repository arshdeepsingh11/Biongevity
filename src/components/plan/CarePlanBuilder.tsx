"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GOAL_PATHS } from "@/data/intelligence";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { PACKAGES } from "@/data/health";
import { deptById } from "@/data/departments";
import { RETEST_LABEL, TEST_INTEL, goalMatch, type GoalId } from "@/lib/testIntel";
import { formatMoney, cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons";
import { BuyButton } from "@/components/commerce/BuyButton";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { NumberTicker } from "@/components/fx/NumberTicker";

const GOAL_TAG: Record<string, GoalId> = { heart: "heart", age: "ageing", energy: "metabolic", gut: "gut", hormones: "hormones", sleep: "sleep", brain: "brain", perform: "strength" };
type Kind = "test" | "retest" | "visit" | "formula" | "program" | "review";
interface Item { m: number; kind: Kind; t: string; d: string; cost: number; icon: IconName; url?: string; store?: "labs" | "drugs" }
const KIND: Record<Kind, { l: string; dot: string }> = {
  test: { l: "Test", dot: "bg-ai" }, retest: { l: "Re-test", dot: "bg-ai-hi" }, visit: { l: "Visit", dot: "bg-accent-deep" },
  formula: { l: "Formula", dot: "bg-gold" }, program: { l: "Program", dot: "bg-teal" }, review: { l: "Review", dot: "bg-muted" },
};
const MONTHS = Array.from({ length: 13 }, (_, i) => i);
const monthLabel = (m: number) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + m); return d.toLocaleDateString("en-CA", { month: "short", year: "2-digit" }); };

/**
 * Care plan builder + Biongevity SI care agent. Pick a goal: the plan assembles on your device from our catalogue —
 * baseline tests, re-test dates, the department visit, a formula and a program — with a 12-month timeline and a
 * total in CAD. Download it as a PDF, add reminders to your calendar, or send it to the clinic: a clinician reviews
 * and approves before anything is ordered.
 */
export function CarePlanBuilder() {
  const { ask } = useAI();
  const [gid, setGid] = useState(GOAL_PATHS[0].id);
  const [extra, setExtra] = useState(true);
  const [months, setMonths] = useState(3);
  const [withProgram, setWithProgram] = useState(true);
  const [sent, setSent] = useState(false);
  const g = GOAL_PATHS.find((x) => x.id === gid)!;
  const dept = deptById(g.dept);

  const plan = useMemo(() => {
    const main = LAB_TESTS.find((t) => t.title === g.test)!;
    const tag = GOAL_TAG[g.id];
    const second = TEST_INTEL.filter((x) => x.t.handle !== main.handle && x.goals.includes(tag)).sort((a, b) => goalMatch(b, [tag]) * 2 + b.utility - (goalMatch(a, [tag]) * 2 + a.utility))[0]?.t;
    const tests = [main, ...(extra && second ? [second] : [])];
    const formula = DRUG_PRODUCTS.find((p) => p.handle === g.formula);
    const program = PACKAGES.find((p) => g.program.includes(p.name.replace("Biongevity ", "")));
    const items: Item[] = [];
    for (const t of tests) {
      const intel = TEST_INTEL.find((x) => x.t.handle === t.handle);
      items.push({ m: 0, kind: "test", t: t.title, d: intel?.reveals ?? t.summary, cost: t.price, icon: t.icon, url: t.url, store: "labs" });
      const r = intel?.retest ?? 0;
      if (r > 0) for (let m = r; m <= 12; m += r) items.push({ m, kind: "retest", t: `Re-test · ${t.title}`, d: `${RETEST_LABEL(r)} — compare with your baseline.`, cost: t.price, icon: "calendar", url: t.url, store: "labs" });
    }
    items.push({ m: 1, kind: "visit", t: `${dept.name} consultation`, d: "Review results and agree the plan with your clinician. Fee confirmed at booking.", cost: 0, icon: dept.icon });
    if (formula && months > 0) items.push({ m: 1, kind: "formula", t: `${formula.title} · ${months} month${months > 1 ? "s" : ""}`, d: `${formula.tagline}. Assumes one pack a month — discuss with your clinician, especially with medication.`, cost: formula.price * months, icon: formula.icon, url: formula.url, store: "drugs" });
    if (withProgram) items.push({ m: 0, kind: "program", t: g.program, d: program ? `${program.cadence}.` : "Priced by the care team for your goal.", cost: program?.price ?? 0, icon: "crown" });
    items.push({ m: 6, kind: "review", t: "6-month review", d: "Progress check with your care team; adjust the plan.", cost: 0, icon: "chart" });
    items.push({ m: 12, kind: "review", t: "12-month review", d: "Compare with your baseline and set next year's plan.", cost: 0, icon: "award" });
    items.sort((a, b) => a.m - b.m);
    const total = items.reduce((s, x) => s + x.cost, 0);
    const by = (k: Kind[]) => items.filter((x) => k.includes(x.kind)).reduce((s, x) => s + x.cost, 0);
    return { items, total, tests, formula, breakdown: [["Tests & re-tests", by(["test", "retest"])], ["Formula", by(["formula"])], ["Program", by(["program"])]] as [string, number][] };
  }, [g, extra, months, withProgram, dept]);

  const summary = [`Goal: ${g.label}`, ...plan.items.map((x) => `Month ${x.m} (${monthLabel(x.m)}): ${x.t}${x.cost ? ` — ${formatMoney(x.cost)}` : ""}`), `Estimated total: ${formatMoney(plan.total)} CAD (visit fees confirmed at booking)`].join("\n");
  const contactHref = `/contact/?interest=${encodeURIComponent("Care plan")}&plan=${encodeURIComponent(summary)}`;

  const ics = () => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const day = (m: number) => { const d = new Date(); d.setMonth(d.getMonth() + m); return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`; };
    const ev = plan.items.filter((x) => x.m > 0).map((x, i) => ["BEGIN:VEVENT", `UID:biongevity-plan-${gid}-${i}@biongevity.com`, `DTSTAMP:${day(0)}T090000Z`, `DTSTART;VALUE=DATE:${day(x.m)}`, `SUMMARY:${x.t.replace(/[,;]/g, " ")}`, `DESCRIPTION:${x.d.replace(/[,;\n]/g, " ")}`, "END:VEVENT"].join("\r\n"));
    const blob = new Blob([["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Biongevity//Care plan//EN", ...ev, "END:VCALENDAR"].join("\r\n")], { type: "text/calendar" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `biongevity-plan-${gid}.ics`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const steps: { t: string; d: string; icon: IconName; state: "done" | "wait" | "next" }[] = [
    { t: "Plan drafted", d: "Assembled on your device from our catalogue.", icon: "clipboard", state: "done" },
    { t: "Clinician review", d: sent ? "Sent — the care team will reply to approve or adjust." : "Nothing is ordered until a clinician approves.", icon: "stethoscope", state: sent ? "done" : "next" },
    { t: "Order tests", d: "After approval, order on bioarolabs.com.", icon: "test-tubes", state: sent ? "next" : "wait" },
    { t: "Book the visit", d: `${dept.short} consultation in month 1.`, icon: "calendar", state: sent ? "next" : "wait" },
    { t: "Reminders set", d: "Re-tests and reviews in your calendar.", icon: "alarm", state: "wait" },
  ];

  return (
    <div className="space-y-6">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:grid md:grid-cols-4 md:px-0 lg:grid-cols-8">
        {GOAL_PATHS.map((x) => (
          <button key={x.id} onClick={() => { setGid(x.id); setSent(false); }} aria-pressed={gid === x.id}
            className={cn("flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-[13.5px] font-semibold ring-1 transition md:flex-col md:rounded-[22px] md:px-2 md:py-4 md:text-center md:text-[13px]", gid === x.id ? "bg-ink text-pearl ring-ink" : "bg-white ring-ink/[0.07] hover:ring-ai/40")}>
            <span className="icon-tile h-8 w-8 md:h-10 md:w-10"><Icon name={x.icon} size={17} /></span>{x.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div data-print className="min-w-0 rounded-[30px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">✦ Your 12-month plan</div><div className="mt-1 text-[24px] font-semibold tracking-tight">{g.label}</div><div className="text-[13px] text-muted">{dept.name} · built {new Date().toLocaleDateString("en-CA", { day: "numeric", month: "long", year: "numeric" })}</div></div>
            <div className="text-right"><div className="text-[11px] text-muted">Estimated total</div><div className="text-[30px] font-semibold tracking-tight text-ai"><NumberTicker value={plan.total} prefix="$" /></div><div className="text-[11px] text-faint">CAD · visit fees confirmed at booking</div></div>
          </div>

          {/* month rail */}
          <div className="no-scrollbar mt-6 overflow-x-auto">
            <div className="relative grid min-w-[620px] gap-1" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
              <div aria-hidden className="absolute left-[3.8%] right-[3.8%] top-[13px] h-[2px] rounded-full bg-ink/[0.07]" />
              {MONTHS.map((m) => {
                const its = plan.items.filter((x) => x.m === m);
                return (
                  <div key={m} className="relative flex flex-col items-center">
                    <span className={cn("relative z-[1] grid h-7 w-7 place-items-center rounded-full text-[10.5px] font-semibold ring-1", its.length ? "bg-white ring-ai/40 text-ai shadow-card" : "bg-canvas text-faint ring-transparent")}>{m}</span>
                    <span className="mt-1 text-[10px] text-faint">{monthLabel(m)}</span>
                    <span className="mt-1.5 flex flex-wrap justify-center gap-0.5">{its.map((x, i) => <span key={i} title={x.t} className={cn("h-2 w-2 rounded-full", KIND[x.kind].dot)} />)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">{(Object.keys(KIND) as Kind[]).map((k) => <span key={k} className="flex items-center gap-1"><span className={cn("h-2 w-2 rounded-full", KIND[k].dot)} />{KIND[k].l}</span>)}</div>

          {/* items */}
          <ol className="mt-6 space-y-2">
            <AnimatePresence initial={false}>
              {plan.items.map((x, i) => (
                <motion.li key={`${gid}-${x.t}-${x.m}`} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 rounded-2xl bg-canvas p-3">
                  <span className="w-12 shrink-0 pt-1 text-center"><span className="block text-[10px] font-semibold uppercase text-faint">Month</span><span className="block text-[18px] font-semibold leading-none">{x.m}</span></span>
                  <span className="icon-tile h-10 w-10"><Icon name={x.icon} size={18} /></span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold">{x.t}<span className="rounded-full bg-white px-1.5 py-px text-[10px] font-semibold text-muted ring-1 ring-ink/[0.06]">{KIND[x.kind].l}</span></span><span className="block text-[12.5px] text-muted">{x.d}</span></span>
                  <span className="shrink-0 text-right text-[13.5px] font-semibold">{x.cost ? formatMoney(x.cost) : <span className="text-[11.5px] font-medium text-faint">at booking</span>}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {plan.breakdown.map(([k, v]) => <div key={k} className="rounded-2xl bg-canvas p-3 text-center"><div className="text-[16px] font-semibold">{formatMoney(v)}</div><div className="text-[11px] text-muted">{k}</div></div>)}
          </div>
          <p className="mt-4 text-[11px] text-faint">Prices in CAD from our catalogue; the stores show final prices. Educational plan — a clinician confirms what is right for you. Not a diagnosis.</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-[26px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Adjust</div>
            <label className="mt-3 flex items-center justify-between text-[13px]"><span>Add a second matched test</span><input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--c-ai))]" /></label>
            <label className="mt-3 flex items-center justify-between text-[13px]"><span>Include the program</span><input type="checkbox" checked={withProgram} onChange={(e) => setWithProgram(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--c-ai))]" /></label>
            <div className="mt-3 text-[13px]">Formula months</div>
            <div className="mt-1 grid grid-cols-4 gap-1 rounded-full bg-canvas p-0.5 text-[12px] font-semibold">
              {[0, 3, 6, 12].map((m) => <button key={m} onClick={() => setMonths(m)} className={cn("rounded-full py-1.5", months === m ? "bg-white text-ai shadow-card" : "text-muted")}>{m || "None"}</button>)}
            </div>
          </div>

          <div className="rounded-[26px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
            <div className="flex items-center gap-2"><XevyoOrb size={28} live /><div><div className="text-[14px] font-semibold">SI care agent</div><div className="text-[11.5px] text-muted">Human in charge · nothing runs without approval</div></div></div>
            <ol className="mt-4 space-y-2.5">
              {steps.map((s) => (
                <li key={s.t} className="flex items-start gap-2.5">
                  <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px]", s.state === "done" ? "bg-teal text-white" : s.state === "next" ? "bg-ai-soft text-ai ring-1 ring-ai/30" : "bg-canvas text-faint")}>{s.state === "done" ? <Icon name="check" size={13} /> : <Icon name={s.icon} size={12} />}</span>
                  <span><span className="block text-[13px] font-semibold">{s.t}</span><span className="block text-[11.5px] leading-snug text-muted">{s.d}</span></span>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid gap-2">
              <Link href={contactHref} onClick={() => setSent(true)} className="btn-ai h-10 text-[13px]"><Icon name="stethoscope" size={15} />Send to clinic for approval</Link>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => print()} className="btn-light h-10 text-[12.5px]"><Icon name="file" size={14} />PDF</button>
                <button onClick={ics} className="btn-light h-10 text-[12.5px]"><Icon name="calendar" size={14} />Reminders</button>
              </div>
              <button onClick={() => ask(`Review this 12-month longevity plan and tell me in plain words what each step is for, what I could leave out, and what to ask my clinician:\n${summary}`, { label: `✦ Review my ${g.label.toLowerCase()} plan`, retrieve: false })} className="btn-light h-10 text-[12.5px]"><XevyoOrb size={18} />Ask SI to review</button>
            </div>
          </div>

          <div className="rounded-[26px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Order after approval</div>
            <div className="mt-3 space-y-2">
              {plan.tests.map((t) => <div key={t.handle} className="flex items-center justify-between gap-2 text-[12.5px]"><span className="min-w-0 truncate font-medium">{t.title}</span><BuyButton href={t.url} store="labs" price={t.price} size="sm" /></div>)}
              {plan.formula && months > 0 && <div className="flex items-center justify-between gap-2 text-[12.5px]"><span className="min-w-0 truncate font-medium">{plan.formula.title}</span><BuyButton href={plan.formula.url} store="drugs" price={plan.formula.price} size="sm" /></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
