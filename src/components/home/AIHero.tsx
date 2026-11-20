"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { matchIntent } from "@/lib/intent";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { Icon } from "@/components/ui/Icon";
import { PromptCard, HeroStats } from "@/components/home/HeroExtras";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroScene } from "@/components/three/HeroScene";
import { gsap, reducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

const EXAMPLES = ["I'm tired all the time and gaining weight", "my blood pressure is high at home", "I want to age slower", "my dad has a family history of heart disease", "poor sleep since my late 40s"];

/** Suggested questions (Biongevity SI answers them; nothing is pre-written). Written for people who want more good years, and their families. */
const CARDS = [
  { q: "Explain an ApoB of 1.1 g/L in simple words", icon: "droplet", d: "What ApoB counts, where 1.1 g/L sits against common targets, and which questions to bring to your doctor.", covers: ["Lipids", "Heart risk", "Next test"] },
  { q: "Which test should I start with at 50?", icon: "flask", d: "A short, ranked starting set for your age — what each test answers, roughly what it costs in CAD, and what can wait.", covers: ["BioAro tests", "Prices", "Order of tests"] },
  { q: "How can I keep an eye on my parent's heart health?", icon: "users", d: "Home blood pressure, warning signs, which visits matter and how family care lets you follow along with consent.", covers: ["Family care", "Cardiology", "Home BP"] },
  { q: "What is a healthspan baseline and why does it matter?", icon: "hourglass", d: "The handful of measures that set your starting line, and how re-testing shows whether changes are working.", covers: ["Biological age", "Baseline", "Re-testing"] },
];

/**
 * Hero — the AI is the front door. Left: the promise, rising line by line, then the Ask Biongevity SI
 * bar, the live on-device intent engine and four suggested questions. Right: the digital twin's core,
 * a glass sphere held by three turning rings. Under both, the four numbers that size the platform.
 */
export function AIHero() {
  const { ask, setOpen } = useAI();
  const [q, setQ] = useState("");
  const [ph, setPh] = useState("");
  const r = useMemo(() => matchIntent(q), [q]);
  const ref = useRef<HTMLElement>(null);

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

  // Everything but the headline fades up once the curtain lifts.
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const items = el.querySelectorAll<HTMLElement>("[data-hero-fade]");
    gsap.set(items, { opacity: 0, y: 24 });
    const off = onReady(() => { gsap.to(items, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "power3.out", delay: 0.45, clearProps: "transform" }); });
    return () => { off(); gsap.set(items, { clearProps: "all" }); };
  }, []);

  const submit = () => {
    if (q.trim()) return ask(q);
    const ex = EXAMPLES.find((e) => ph && e.startsWith(ph)) ?? EXAMPLES[0];
    ask(ex);
  };

  return (
    <section ref={ref} data-ai="Hero" className="relative z-[1] overflow-hidden pb-16 pt-[calc(88px+var(--safe-top))] sm:pt-[112px]">
      <div aria-hidden className="dotgrid absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_70%_at_75%_35%,#000,transparent)]" />
      <div className="container-x relative">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
          {/* The promise and the front door */}
          <div className="relative max-w-[680px]">
            <div data-hero-fade><AIBadge label="Biongevity intelligence · live" /></div>
            <SplitReveal as="h1" when="ready" delay={0.1} className="h-display mt-6">
              More good years, <span className="text-ai-grad">guided by SI.</span>
            </SplitReveal>
            <p data-hero-fade className="lede mt-6 max-w-[56ch]">Biongevity connects your labs, genome, wearables and care team in one record — and Biongevity SI explains it in plain words. Know your baseline, change what can be changed, and add more good years.</p>

            {/* Ask bar — the AI is the front door */}
            <div data-hero-fade className="relative mt-8">
              <div className="relative flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lift ai-ring focus-within:ring-2 focus-within:ring-ai/40 sm:gap-3 sm:p-2">
                <XevyoOrb size={44} live halo className="ml-0.5" />
                <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} aria-label="Ask Biongevity SI what you want to understand or improve"
                  placeholder={ph ? `Ask Biongevity SI — ${ph}` : "Ask Biongevity SI — what would you like to improve about your health?"} className="h-11 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-faint sm:text-[17px]" />
                <button onClick={submit} className="btn-ai h-11 shrink-0 px-4 sm:h-12 sm:px-5"><span className="hidden sm:inline">Ask</span><Icon name="arrow-right" size={17} weight="bold" /></button>
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
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Col title="Care" icon="stethoscope" empty="No department match yet">{r.depts.map(({ x, s }) => <Row key={x.id} href={`/precision-health/${x.id}/`} icon={x.icon} t={x.short} sub={x.tag} s={s} />)}</Col>
                          <Col title="Biomarkers" icon="wave" empty="Keep typing…">{r.markers.map(({ x, s }) => <Row key={x.id} href="#constellation" icon={x.icon} t={x.label} sub={x.range} s={s} />)}</Col>
                          <Col title="BioAro tests" icon="test-tubes" empty="No test match yet">{r.tests.map(({ x, s }) => <Row key={x.handle} href={x.url} ext icon={x.icon} t={x.title} sub={`$${x.price}`} s={s} />)}</Col>
                          <Col title="Formulas" icon="tablets" empty="No formula match yet">{r.formulas.map(({ x, s }) => <Row key={x.handle} href={x.url} ext icon={x.icon} t={x.title} sub={x.tagline ?? ""} s={s} />)}</Col>
                        </div>
                      </div>
                      <p className="mt-3 px-1 text-[11px] text-faint">Matched on your device from our own data. Press Enter for a written answer from Biongevity SI. Education, not a diagnosis.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Suggested questions — each one asks Biongevity SI directly */}
            <div data-hero-fade className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {CARDS.map((c) => <PromptCard key={c.q} {...c} />)}
            </div>
            <div data-hero-fade className="mt-6 flex flex-wrap gap-3">
              <Magnetic><button onClick={() => setOpen(true)} className="btn-ai h-12 px-6"><XevyoOrb size={22} />Talk to Biongevity SI</button></Magnetic>
              <Link href="/app/#twin" className="btn-light h-12 px-5"><Icon name="fingerprint" size={17} className="text-accent" />Digital Twin tour</Link>
              <Link href="/scan/" className="btn-light h-12 px-5"><Icon name="radar" size={17} className="text-accent" />2-minute AI scan</Link>
              <Link href="/about/" className="btn-light h-12 px-5"><Icon name="info" size={17} className="text-accent" />About us</Link>
            </div>
          </div>

          {/* The twin's core */}
          <div className="relative mx-auto h-[18rem] w-full max-w-[22rem] sm:h-[22rem] sm:max-w-[26rem] lg:mx-0 lg:h-[min(72vh,40rem)] lg:max-w-none">
            <HeroScene className="absolute inset-0" />
          </div>
        </div>

        <div data-hero-fade><HeroStats /></div>
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
