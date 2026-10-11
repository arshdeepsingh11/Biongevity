"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { matchIntent } from "@/lib/intent";
import { useAI } from "@/components/ai/AIProvider";
import { Icon } from "@/components/ui/Icon";
import { BeamFlow } from "@/components/fx/BeamFlow";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { MARKERS } from "@/data/intelligence";

const EXAMPLES = ["I'm tired all the time and gaining weight", "My blood pressure is high at home", "I want to age slower", "Bloating after meals and poor sleep", "Family history of heart disease"];

/** Hero — a live intent engine. Every keystroke is matched on-device against departments, tests, formulas and biomarkers. */
export function AIHero() {
  const { ask } = useAI();
  const [q, setQ] = useState("");
  const [ph, setPh] = useState("");
  const r = useMemo(() => matchIntent(q), [q]);

  // Typewriter placeholder cycling real example intents
  useEffect(() => {
    let i = 0, c = 0, del = false;
    const id = setInterval(() => {
      const s = EXAMPLES[i];
      c += del ? -1 : 1; setPh(s.slice(0, c));
      if (!del && c === s.length) { del = true; c = s.length + 12; }
      if (del && c <= 0) { del = false; i = (i + 1) % EXAMPLES.length; }
    }, 60);
    return () => clearInterval(id);
  }, []);

  const submit = () => q.trim() && ask(q);

  return (
    <section data-ai="Hero" className="relative z-[1] overflow-hidden pb-14 pt-[calc(92px+var(--safe-top))] sm:pt-[120px]">
      <div aria-hidden className="grid-bg absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      <div aria-hidden className="absolute inset-0 opacity-40"><BeamFlow /></div>
      <div className="container-x relative">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="hud-label flex items-center justify-center gap-2"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-teal" />Biongevity intelligence · live</div>
          <h1 className="h-display mt-5">Tell us what you want <span className="text-iri">to improve.</span></h1>
          <p className="lede mx-auto mt-4 max-w-[60ch]">Our AI reads your words and connects them — instantly — to the right care, tests, biomarkers and protocols across 14 departments and BioAro.</p>
        </div>

        <div className="hud relative mx-auto mt-8 max-w-[980px] overflow-hidden rounded-[28px] bg-white/85 p-3 shadow-lift ring-1 ring-accent/15 backdrop-blur-xl sm:p-4">
          <div className="scanline" />
          <div className="relative flex items-center gap-3 rounded-2xl bg-canvas px-4 py-3 ring-1 ring-ink/[0.05] focus-within:ring-accent/40">
            <Icon name="sparkle" size={22} weight="duotone" className="shrink-0 text-accent" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} aria-label="Describe what you want to improve"
              placeholder={ph} className="h-10 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-faint sm:text-[19px]" />
            <button onClick={submit} disabled={!q.trim()} className="btn-dark h-11 shrink-0 px-5 disabled:opacity-40"><span className="hidden sm:inline">Ask Xevyo</span><Icon name="arrow-up" size={17} weight="bold" /></button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 px-1">
            {EXAMPLES.slice(0, 4).map((e) => <button key={e} onClick={() => setQ(e)} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] text-muted ring-1 ring-ink/[0.07] hover:text-accent hover:ring-accent/30">{e}</button>)}
          </div>

          <AnimatePresence>
            {r && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 grid gap-3 border-t border-ink/[0.06] pt-4 lg:grid-cols-[200px_1fr]">
                  <div className="rounded-2xl bg-navy p-4">
                    <div className="hud-label">Intent detected</div>
                    <div className="mt-1 text-[17px] font-semibold leading-tight">{r.goal?.label ?? "General health review"}</div>
                    <div className="mt-3 hud-label">Match strength</div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-white"><motion.div className="h-full bg-iri-x" initial={{ width: 0 }} animate={{ width: `${r.confidence}%` }} transition={{ duration: 0.6 }} /></div>
                    <div className="mt-1 text-[12px] text-muted">{r.confidence}% · {r.t.length} signals read</div>
                    <div className="mt-3 flex flex-wrap gap-1">{r.t.slice(0, 6).map((w) => <span key={w} className="rounded bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-accent">{w}</span>)}</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Col title="Care" icon="stethoscope" empty="No department match yet">{r.depts.map(({ x, s }) => <Row key={x.id} href={`/precision-health/${x.id}/`} icon={x.icon} t={x.short} sub={x.tag} s={s} />)}</Col>
                    <Col title="Biomarkers" icon="wave" empty="Keep typing…">{r.markers.map(({ x, s }) => <Row key={x.id} href="#constellation" icon={x.icon} t={x.label} sub={x.range} s={s} />)}</Col>
                    <Col title="BioAro tests" icon="test-tubes" empty="No test match yet">{r.tests.map(({ x, s }) => <Row key={x.handle} href={x.url} ext icon={x.icon} t={x.title} sub={`$${x.price}`} s={s} />)}</Col>
                    <Col title="Formulas" icon="tablets" empty="No formula match yet">{r.formulas.map(({ x, s }) => <Row key={x.handle} href={x.url} ext icon={x.icon} t={x.title} sub={x.tagline ?? ""} s={s} />)}</Col>
                  </div>
                </div>
                <p className="mt-3 px-1 text-[11px] text-faint">Matched on your device from our own data. Press Enter to ask Xevyo for a written answer. Education, not diagnosis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-2 gap-3 sm:grid-cols-4">
          {([[DEPARTMENTS.length, "departments", "/precision-health/"], [LAB_TESTS.length, "BioAro lab tests", "/precision-health/bioaro-labs/"], [MARKERS.length, "biomarkers connected", "#constellation"], [DRUG_PRODUCTS.length, "AI-matched formulas", "/precision-health/bioaro-drugs/"]] as const).map(([n, l, h]) => (
            <Link key={l} href={h} className="hud rounded-2xl bg-white/80 p-4 ring-1 ring-ink/[0.06] backdrop-blur transition-transform hover:-translate-y-0.5">
              <div className="text-[30px] font-semibold tracking-tight tabular-nums"><NumberTicker value={n} /></div>
              <div className="hud-label !text-muted">{l}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Col({ title, icon, empty, children }: { title: string; icon: string; empty: string; children: React.ReactNode }) {
  const has = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-ink/[0.06]">
      <div className="mb-2 flex items-center gap-1.5 hud-label"><Icon name={icon} size={13} />{title}</div>
      <div className="space-y-1.5">{has ? children : <div className="py-3 text-center text-[12px] text-faint">{empty}</div>}</div>
    </div>
  );
}

function Row({ href, ext, icon, t, sub, s }: { href: string; ext?: boolean; icon: string; t: string; sub: string; s: number }) {
  const body = (
    <motion.span layout initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-accent-light">
      <Icon name={icon} size={18} weight="duotone" className="shrink-0 text-accent" />
      <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{t}</span><span className="block truncate text-[11px] text-muted">{sub}</span></span>
      <span className="flex gap-0.5">{[1, 2, 3].map((k) => <span key={k} className={`h-3 w-1 rounded-full ${s >= k * 2 - 1 ? "bg-accent" : "bg-ink/10"}`} />)}</span>
    </motion.span>
  );
  return ext ? <a href={href} target="_blank" rel="noopener">{body}</a> : <Link href={href}>{body}</Link>;
}
