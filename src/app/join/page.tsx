import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Head } from "@/components/home/HomeSections";
import { AuroraText } from "@/components/fx/AuroraText";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";
import { AIPanel } from "@/components/ai/AIPanel";
import { env } from "@/lib/env";
import { JsonLd, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Join Biongevity — your patient app",
  description: "Create your Biongevity account: your Digital Twin, results, personal plan, AI coach, consultations and family sharing in one patient app.",
  alternates: { canonical: "/join/" },
};

const SIGNUP = `${env.appUrl}/en/auth/signup`;
const PATIENT = `${env.appUrl}/en/patient`;
const LOGIN = `${env.appUrl}/en/auth/login`;

const GET = [
  { t: "Your Digital Twin", d: "Health and Recovery scores, live signals and every body system, compared with your own baseline.", icon: "fingerprint" },
  { t: "Results & reports", d: "Lab, genome and clinic reports in one place, explained in plain words.", icon: "file" },
  { t: "Your personal plan", d: "The tests, formulas and visits chosen for you — and why each one is there.", icon: "route" },
  { t: "AI coach", d: "Ask Biongevity SI anything about your data, any time, in four languages.", icon: "sparkle" },
  { t: "Consultations", d: "Book virtual or in-person visits with the care team in a few taps.", icon: "calendar" },
  { t: "Family sharing", d: "Give a parent, partner or child a permissioned view — you choose what they see.", icon: "users" },
];

const STEPS = [
  { t: "Create your account", d: "Email, Google or Apple — about a minute.", icon: "user" },
  { t: "Connect your data", d: "Link a watch or ring; your BioAro results arrive automatically.", icon: "wifi" },
  { t: "Book your baseline", d: "Pick a consultation; your twin starts learning your normal.", icon: "calendar" },
];

/** Join — what the Biongevity patient app is, and one clear button to create an account. */
export default function JoinPage() {
  return (
    <>
      <JsonLd data={breadcrumb([["Join", "/join/"]])} />
      <section data-ai="Join Biongevity" className="relative z-[1] overflow-hidden pb-12 pt-[calc(108px+var(--safe-top))] sm:pt-[140px]">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -top-32 right-0 h-[460px] w-[700px] max-w-[120vw] rounded-full bg-ai/15 blur-[110px]" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <AIBadge label="Biongevity patient app" />
            <h1 className="h-display mt-5 max-w-[14ch]">Your health, <AuroraText>in one place.</AuroraText></h1>
            <p className="lede mt-5 max-w-[54ch]">The Biongevity patient app brings your Digital Twin, results, plan, AI coach and care team together — so you always know where you stand and what to do next.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SIGNUP} target="_blank" rel="noopener" className="btn-dark h-12 px-7 text-[15px]"><Icon name="user" size={17} />Join Biongevity<Icon name="arrow-up-right" size={14} /></a>
              <a href={PATIENT} target="_blank" rel="noopener" className="btn-light h-12 px-6">I already have an account</a>
            </div>
            <p className="mt-4 text-[13px] text-muted">Just looking? <a href={LOGIN} target="_blank" rel="noopener" className="font-semibold text-ai underline">Try the demo</a> — no sign-up needed. This website never asks for your password.</p>
          </div>

          {/* phone preview */}
          <div className="relative mx-auto w-[280px] sm:w-[300px]">
            <div aria-hidden className="absolute -inset-8 rounded-[60px] bg-ai/15 blur-3xl" />
            <div className="relative rounded-[46px] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)]" style={{ background: "#05070a" }}>
              <div className="overflow-hidden rounded-[38px]" style={{ background: "#0a0e13", color: "#e9eef4" }}>
                <div className="mx-auto mt-2.5 h-5 w-24 rounded-full" style={{ background: "#05070a" }} />
                <div className="px-4 pb-5 pt-3">
                  <div className="flex items-center justify-between text-[11px]" style={{ color: "#8a96a5" }}><span>Good morning</span><span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" style={{ background: "rgba(251,191,36,.14)", color: "#fbbf24" }}>Example</span></div>
                  <div className="mt-1 text-[17px] font-semibold">Your twin today</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[["Health", "82", "#38bdf8"], ["Recovery", "74", "#4ade80"]].map(([l, v, c]) => (
                      <div key={l} className="rounded-2xl p-3" style={{ background: "#121820", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)" }}>
                        <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8a96a5" }}>{l}</div>
                        <div className="mt-1 text-[26px] font-semibold leading-none" style={{ color: c }}>{v}</div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.08)" }}><div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 rounded-2xl p-3" style={{ background: "#121820", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)" }}>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8a96a5" }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: "#4ade80" }} />Live · HRV</div>
                    <svg viewBox="0 0 200 40" className="mt-1 h-10 w-full"><path d="M0 28 C20 26 30 12 50 16 S80 30 100 22 130 8 150 14 180 26 200 18" fill="none" stroke="#a78bfa" strokeWidth="2" /></svg>
                  </div>
                  <div className="mt-2 rounded-2xl p-3 text-[12px] leading-snug" style={{ background: "rgba(56,189,248,.10)", boxShadow: "inset 0 0 0 1px rgba(56,189,248,.25)" }}>
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#38bdf8" }}>✦ Biongevity SI</div>
                    Sleep was short two nights in a row. Try an earlier wind-down tonight — your recovery usually bounces back.
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[9.5px]" style={{ color: "#8a96a5" }}>
                    {[["home", "Home"], ["fingerprint", "Twin"], ["calendar", "Visits"], ["sparkle", "Coach"]].map(([i, l]) => <span key={l} className="flex flex-col items-center gap-1"><Icon name={i} size={16} />{l}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section ai="What you get" className="!pt-4">
        <div className="container-x">
          <Head n="01" label="What you get" title={<>Everything about your health, <AuroraText>in one app.</AuroraText></>} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GET.map((g) => (
              <div key={g.t} data-reveal className="rounded-[26px] bg-white/80 p-6 shadow-card ring-1 ring-ink/[0.06] backdrop-blur-xl">
                <span className="icon-tile h-12 w-12"><Icon name={g.icon} size={21} /></span>
                <div className="mt-4 text-[18px] font-semibold">{g.t}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section ai="How to join" className="bg-canvas/50">
        <div className="container-x">
          <Head n="02" label="How to join" title={<>Three steps <AuroraText>to your baseline.</AuroraText></>} />
          <ol className="relative mt-10 grid gap-3 md:grid-cols-3">
            <span aria-hidden className="absolute left-[16%] right-[16%] top-[34px] hidden h-[2px] bg-gradient-to-r from-ai/10 via-ai/50 to-ai/10 md:block" />
            {STEPS.map((s, k) => (
              <li key={s.t} className="relative rounded-[26px] bg-white/80 p-6 text-center ring-1 ring-ink/[0.06] backdrop-blur-xl">
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-ai text-on-ai shadow-lift"><Icon name={s.icon} size={22} /><span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-white font-mono text-[11px] font-bold text-ai ring-1 ring-ai/30">{k + 1}</span></span>
                <div className="mt-4 text-[18px] font-semibold">{s.t}</div>
                <p className="mt-1 text-[14px] text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={SIGNUP} target="_blank" rel="noopener" className="btn-dark h-12 px-7 text-[15px]"><Icon name="user" size={17} />Join Biongevity<Icon name="arrow-up-right" size={14} /></a>
            <Link href="/app/" className="btn-light h-12 px-6">See inside the app</Link>
          </div>
        </div>
      </Section>

      <Section ai="Questions about joining">
        <div className="container-x grid items-start gap-8 lg:grid-cols-2">
          <div>
            <Head n="03" label="Good to know" title="Private, permissioned, yours." />
            <ul className="mt-6 space-y-3 text-[15px]">
              {[["lock", "Your record is yours. Nothing is shared unless you allow it."], ["stethoscope", "Biongevity SI explains; your clinician decides. No diagnosis by AI."], ["users", "Family see only what you choose, and you can stop sharing any time."], ["globe", "English, French, Arabic and Persian."]].map(([i, t]) => (
                <li key={t} className="flex gap-3"><span className="icon-tile h-9 w-9 shrink-0"><Icon name={i} size={16} /></span><span className="pt-1.5 text-muted">{t}</span></li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] text-muted">Clinician or clinic? <Link href="/bioelr/" className="font-semibold text-ai underline">See BioELR</Link> · Sign-in options for members, clinicians and family: <Link href="/login/" className="font-semibold text-ai underline">sign in</Link></p>
          </div>
          <div>
            <AIPanel title="Questions before you join?" context="Joining the Biongevity patient app" prompts={["What do I get when I join?", "How does family sharing work?", "What does a baseline include?"]} />
            <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-faint"><XevyoOrb size={16} />Answers come from Biongevity SI.</div>
          </div>
        </div>
      </Section>
    </>
  );
}
