"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAI } from "./AIProvider";
import { XevyoOrb } from "./XevyoOrb";
import { Icon } from "@/components/ui/Icon";
import { clearInterest, readInterest } from "@/lib/interest";
import { DEPARTMENTS } from "@/data/departments";
import { GOAL_PATHS } from "@/data/intelligence";
import { env } from "@/lib/env";

type Step = { href: string; t: string; d: string; icon: string; ext?: boolean };

const DEFAULTS: Step[] = [
  { href: "/scan/", t: "Take the AI scan", d: "2 minutes: domains, tests and a re-test plan.", icon: "radar" },
  { href: "/tools/", t: "Explain my lab results", d: "Paste results; Xevyo explains them.", icon: "flask" },
  { href: "/platform/", t: "See the healthspan platform", d: "Your digital twin, explained.", icon: "fingerprint" },
];

/** Picks three next steps from what this visitor has viewed. Pure on-device rules — no AI call, no tracking. */
function pick(top: string | undefined): Step[] {
  if (!top) return DEFAULTS;
  const dept = DEPARTMENTS.find((d) => d.id === top);
  if (dept) {
    const goal = GOAL_PATHS.find((g) => g.dept === dept.id);
    return [
      { href: `/contact/?interest=${encodeURIComponent(dept.name)}`, t: `Book ${dept.short}`, d: "A coordinator confirms the right visit.", icon: "calendar" },
      goal ? { href: "/precision-health/bioaro-labs/#navigator", t: goal.program, d: `Start with ${goal.test}.`, icon: "crown" } : DEFAULTS[0],
      { href: "/tools/#router", t: "Not sure it's the right service?", d: "The specialist router suggests one.", icon: "route" },
    ];
  }
  const map: Record<string, Step[]> = {
    "bioaro-labs": [{ href: "/tools/", t: "Explain results you already have", d: "Paste lab text — flagged on your device.", icon: "flask" }, { href: "/shop/#browse", t: "Compare tests and packages", d: "One catalogue, one bag.", icon: "search" }, DEFAULTS[2]],
    "bioaro-drugs": [{ href: "/shop/#studio", t: "Match formulas to a plan", d: "Plan Studio balances tests and formulas.", icon: "sparkle" }, { href: "/contact/?interest=BioAro%20Drugs%20protocol", t: "Ask a clinician first", d: "Check fit with your medication.", icon: "stethoscope" }, DEFAULTS[1]],
    shop: [{ href: "/contact/", t: "Book a consultation", d: "Review your plan with the care team.", icon: "calendar" }, DEFAULTS[2], DEFAULTS[1]],
    platform: [{ href: "/twin/", t: "Explore your Digital Twin", d: "A guided 3D tour, then open it in the app.", icon: "fingerprint" }, { href: "/shop/#depth", t: "Start with a baseline", d: "Core, Precision or Elite program.", icon: "crown" }, { href: "/ai/", t: "How our AI works", d: "Model cards and safeguards.", icon: "shield" }],
    bioelr: [{ href: "/bioelr/#configure", t: "Configure BioELR", d: "Pick modules and request a proposal.", icon: "layers" }, { href: "/platform/", t: "See the member platform", d: "What patients see.", icon: "fingerprint" }, { href: "/ai/", t: "AI governance", d: "How the AI is controlled.", icon: "shield" }],
    clinic: [{ href: "/clinic/virtual/", t: "Start with a virtual visit", d: "Secure video from home.", icon: "video" }, DEFAULTS[0], { href: "/contact/", t: "Talk to a coordinator", d: "We route you to the right team.", icon: "message" }],
  };
  return map[top] ?? DEFAULTS;
}

/** "Your next step" — closes every page with three personalised suggestions plus an AI action. */
export function NextStep() {
  const path = usePathname();
  const { ask } = useAI();
  const [steps, setSteps] = useState<Step[]>(DEFAULTS);
  const [personal, setPersonal] = useState(false);

  useEffect(() => {
    const m = readInterest();
    const top = Object.entries(m).filter(([k]) => k !== "home" && k !== "contact").sort((a, b) => b[1] - a[1])[0]?.[0];
    setPersonal(Boolean(top));
    setSteps(pick(top).filter((s) => s.href.split(/[?#]/)[0] !== path || s.href.includes("#")).slice(0, 3));
  }, [path]);

  if (/^\/(login)/.test(path)) return null;
  return (
    <section aria-label="Your next step" className="relative z-[1] border-t border-ink/[0.06] py-10">
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-3">
          <XevyoOrb size={30} live />
          <div className="flex-1"><div className="text-[18px] font-semibold tracking-tight">Your next step</div>
            <div className="text-[12px] text-muted">{personal ? "Personalised on your device from the pages you viewed — nothing is sent." : "Popular next steps. Browse a little and these adapt to you, on your device."}</div></div>
          {personal && <button onClick={() => { clearInterest(); setPersonal(false); setSteps(DEFAULTS); }} className="text-[12px] font-semibold text-faint underline hover:text-ai">Clear</button>}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {steps.map((s) => {
            const body = (<><span className="grid h-10 w-10 shrink-0 place-items-center icon-tile"><Icon name={s.icon} size={19} weight="duotone" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14.5px] font-semibold">{s.t}</span><span className="block text-[12.5px] leading-snug text-muted">{s.d}</span></span>
              <Icon name={s.ext ? "arrow-up-right" : "arrow-right"} size={15} className="mt-1 text-faint" /></>);
            const cls = "card flex items-start gap-3 p-4 hover:-translate-y-0.5";
            return s.ext ? <a key={s.href} href={s.href} className={cls}>{body}</a> : <Link key={s.href} href={s.href} className={cls}>{body}</Link>;
          })}
          <button onClick={() => ask("Based on this page, what should my next step be? I'm interested in my healthspan.", { label: "✦ What should my next step be?" })}
            className="relative flex items-start gap-3 overflow-hidden rounded-4xl bg-white p-4 text-left ai-ring transition hover:-translate-y-0.5">
            <div aria-hidden className="ai-glow -right-8 -top-8 h-24 w-24" />
            <XevyoOrb size={40} />
            <span className="relative min-w-0 flex-1"><span className="block text-[14.5px] font-semibold">Ask Xevyo</span><span className="block text-[12.5px] leading-snug text-muted">&ldquo;What should my next step be?&rdquo;</span></span>
          </button>
        </div>
      </div>
    </section>
  );
}
