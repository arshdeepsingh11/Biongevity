"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { matchIntent } from "@/lib/intent";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { BeamFlow } from "@/components/fx/BeamFlow";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { DEPARTMENTS } from "@/data/departments";
import { LAB_TESTS } from "@/data/labs";
import { DRUG_PRODUCTS } from "@/data/drugs";
import { MARKERS } from "@/data/intelligence";

const EXAMPLES = ["I'm tired all the time and gaining weight", "my blood pressure is high at home", "I want to age slower", "my dad has a family history of heart disease", "poor sleep since my late 40s"];

/** Suggested questions (Biongevity SI answers them; nothing is pre-written). Written for adults 40–65 and their families. */
const CARDS = [
  { q: "Explain an ApoB of 1.1 g/L in simple words", icon: "droplet" },
  { q: "Which test should I start with at 50?", icon: "flask" },
  { q: "How can I keep an eye on my parent's heart health?", icon: "users" },
  { q: "What is a healthspan baseline and why does it matter?", icon: "hourglass" },
];

/** Hero — the AI is the front door: an Ask Biongevity SI bar, suggested questions, and a live on-device intent engine. */
export function AIHero() {
  const { ask, setOpen } = useAI();
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

  const submit = () => {
    if (q.trim()) return ask(q);
    const ex = EXAMPLES.find((e) => ph && e.startsWith(ph)) ?? EXAMPLES[0];
    ask(ex);
  };

  return (
    <section data-ai="Hero" className="relative z-[1] overflow-hidden pb-14 pt-[calc(92px+var(--safe-top))] sm:pt-[124px]">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      <div aria-hidden className="absolute inset-0 opacity-30"><BeamFlow /></div>
      <div aria-hidden className="ai-glow left-1/2 top-24 h-[340px] w-[min(900px,90vw)] -translate-x-1/2 !opacity-[0.16]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-[920px] text-center">
          <div className="flex justify-center"><AIBadge label="Biongevity intelligence · live" /></div>
          <h1 className="h-display mt-6">More good years, <span className="text-ai-grad">guided by AI.</span></h1>
          <p className="lede mx-auto mt-5 max-w-[62ch]">Biongevity connects your labs, genome, wearables and care team in one record — and Xevyo, our AI, explains it in plain words. Built for adults 40–65 and the families who look after them.</p>
        </div>

        {/* Ask bar — the AI is the front door */}
        <div className="relative mx-auto mt-9 max-w-[860px]">
          <div className="relative flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lift ai-ring focus-within:ring-2 focus-within:ring-ai/40 sm:gap-3 sm:p-2">
            <XevyoOrb size={44} live halo className="ml-0.5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} aria-label="Ask Xevyo what you want to understand or improve"
              placeholder={ph ? `Ask Xevyo — ${ph}` : "Ask Xevyo — what would you like to improve about your health?"} className="h-11 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-faint sm:text-[18px]" />
            <button onClick={submit} className="btn-ai h-11 shrink-0 px-4 sm:h-12 sm:px-6"><span className="hidden sm:inline">Ask Xevyo</span><Icon name="arrow-right" size={17} weight="bold" /></button>
          </div>

          <AnimatePresence>
            {r && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-3 rounded-[26px] bg-white/90 p-3 shadow-card ring-1 ring-ink/[0.06] backdrop-blur sm:p-4">
                  <div className="grid gap-3 lg:grid-cols-[200px_1fr]">
                    <div className="rounded-2xl bg-ai-soft p-4">
                      <div className="hud-label !text-ai">✦ Intent detected</div>
                      <div className="mt-1 text-[17px] font-semibold leading-tight">{r.goal?.label ?? "General health review"}</div>
                      <div className="mt-3 hud-label !text-ai">Match strength</div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white"><motion.div className="h-full bg-ai" initial={{ width: 0 }} animate={{ width: `${r.confidence}%` }} transition={{ duration: 0.6 }} /></div>
                      <div className="mt-1 text-[12px] text-muted">{r.confidence}% · {r.t.length} signals read</div>
                      <div className="mt-3 flex flex-wrap gap-1">{r.t.slice(0, 6).map((w) => <span key={w} className="rounded bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-ai">{w}</span>)}</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <Col title="Care" icon="stethoscope" empty="No department match yet">{r.depts.map(({ x, s }) => <Row key={x.id} href={`/precision-health/${x.id}/`} icon={x.icon} t={x.short} sub={x.tag} s={s} />)}</Col>
                      <Col title="Biomarkers" icon="wave" empty="Keep typing…">{r.markers.map(({ x, s }) => <Row key={x.id} href="#constellation" icon={x.icon} t={x.label} sub={x.range} s={s} />)}</Col>
                      <Col title="BioAro tests" icon="test-tubes" empty="No test match yet">{r.tests.map(({ x, s }) => <Row key={x.handle} href={x.url} ext icon={x.icon} t={x.title} sub={`$${x.price}`} s={s} />)}</Col>
                      <Col title="Formulas" icon="tablets" empty="No formula match yet">{r.formulas.map(({ x, s }) => <Row key={x.handle} href={x.url} ext icon={x.icon} t={x.title} sub={x.tagline ?? ""} s={s} />)}</Col>
                    </div>
                  </div>
                  <p className="mt-3 px-1 text-[11px] text-faint">Matched on your device from our own data. Press Enter for a written answer from Xevyo. Education, not a diagnosis.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggested questions — each one asks Xevyo directly */}
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {CARDS.map((c) => (
              <button key={c.q} onClick={() => ask(c.q)} className="group flex items-center gap-3 rounded-2xl bg-white/80 p-3 text-left ring-1 ring-ink/[0.07] backdrop-blur transition hover:-translate-y-0.5 hover:ring-ai/35 sm:p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center icon-tile ring-1 ring-ai/15"><Icon name={c.icon} size={19} weight="duotone" /></span>
                <span className="min-w-0 flex-1 text-[14.5px] font-medium leading-snug">{c.q}</span>
                <Icon name="arrow-right" size={15} className="shrink-0 text-ai transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => setOpen(true)} className="btn-ai h-12 px-6"><XevyoOrb size={22} />Talk to Xevyo</button>
            <Link href="/twin/" className="btn-light h-12 px-6"><Icon name="fingerprint" size={17} className="text-accent" />Digital Twin tour</Link>
            <Link href="/scan/" className="btn-light h-12 px-6"><Icon name="radar" size={17} className="text-accent" />2-minute AI scan</Link>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-3 sm:grid-cols-4">
          {([[DEPARTMENTS.length, "departments", "/precision-health/"], [LAB_TESTS.length, "BioAro lab tests", "/precision-health/bioaro-labs/"], [MARKERS.length, "biomarkers connected", "#constellation"], [DRUG_PRODUCTS.length, "AI-matched formulas", "/precision-health/bioaro-drugs/"]] as const).map(([n, l, h]) => (
            <Link key={l} href={h} className="rounded-2xl bg-white/70 p-4 ring-1 ring-ink/[0.06] backdrop-blur transition-transform hover:-translate-y-0.5">
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
    <motion.span layout initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-ai-soft">
      <Icon name={icon} size={18} weight="duotone" className="shrink-0 text-ai" />
      <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{t}</span><span className="block truncate text-[11px] text-muted">{sub}</span></span>
      <span className="flex gap-0.5">{[1, 2, 3].map((k) => <span key={k} className={`h-3 w-1 rounded-full ${s >= k * 2 - 1 ? "bg-ai" : "bg-ink/10"}`} />)}</span>
    </motion.span>
  );
  return ext ? <a href={href} target="_blank" rel="noopener">{body}</a> : <Link href={href}>{body}</Link>;
}
