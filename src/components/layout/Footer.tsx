import Link from "next/link";
import { NAV } from "@/data/site";
import { DEPARTMENTS } from "@/data/health";
import { OFFICES } from "@/data/clinic";
import { Logo } from "@/components/ui/Logo";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { env } from "@/lib/env";
import { BookNow, WhatsAppLink, CallLink } from "@/components/ui/BookNow";
import { RegionSwitch } from "@/components/region/RegionSwitch";

export function Footer() {
  const links = NAV.flatMap((n) => (n.menu && n.id !== "precision" ? n.menu : n.href ? [{ href: n.href, label: n.label }] : [])).filter((l) => !["/platform/", "/bioelr/", "/tools/"].includes(l.href));
  const col = "text-[14px] text-muted transition-colors hover:text-ink";
  return (
    <footer className="relative z-[1] overflow-hidden border-t border-ink/[0.06] bg-canvas">
      {/* The wordmark, oversized and outlined, drifting across the top of the footer. */}
      <Marquee className="border-b border-ink/[0.06] py-5" duration={48} gap="gap-14">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex shrink-0 items-center gap-14">
            <span className="text-outline whitespace-nowrap text-[clamp(3.5rem,10vw,8rem)] font-bold leading-none tracking-[-0.04em]">biongevity</span>
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ai-2" />
          </span>
        ))}
      </Marquee>

      <div className="container-x flex flex-wrap items-center justify-between gap-5 border-b border-ink/[0.06] py-8">
        <div><div className="text-[22px] font-semibold tracking-tight">Ready to book?</div><div className="mt-1 text-[14px] text-muted">Online in two minutes, or message us on WhatsApp.</div></div>
        <div className="flex flex-wrap items-center gap-2"><BookNow /><WhatsAppLink /><CallLink className="max-sm:hidden" /><RegionSwitch size="md" className="ml-1" /></div>
      </div>
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <Logo size={26} />
          <p className="mt-3 text-[14px] leading-relaxed text-muted">Precision health. Shared longevity. Part of BioAro.</p>
          <div className="mt-5 space-y-3 text-[13px] text-muted">
            {OFFICES.map((o) => <div key={o.city}><div className="font-semibold text-ink">{o.city}</div><a href={o.tel} className="hover:text-ink">{o.phone}</a>{o.email && <> · <a href={`mailto:${o.email}`} className="hover:text-ink">{o.email}</a></>}</div>)}
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div className="eyebrow">Explore</div>
          <div className="mt-4 grid gap-2">{links.map((l) => <Link key={l.href} href={l.href} className={col}>{l.label}</Link>)}</div>
        </Reveal>
        <Reveal delay={120}>
          <div className="eyebrow">Precision Health</div>
          <div className="mt-4 grid gap-2">{DEPARTMENTS.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className={col}>{d.short}</Link>)}</div>
        </Reveal>
        <Reveal delay={180}>
          <div className="eyebrow">Partners</div>
          <div className="mt-4 grid gap-2">
            <a href="https://bioarolabs.com/shop" target="_blank" rel="noopener" className={col}>BioAro Labs ↗</a>
            <a href="https://bioarodrugs.com/us/shop" target="_blank" rel="noopener" className={col}>BioAro Drugs ↗</a>
            <a href="https://neyuhealth.com" target="_blank" rel="noopener" className={col}>NEYU Health ↗</a>
          </div>
          <div className="eyebrow mt-7">Platform &amp; AI</div>
          <div className="mt-4 grid gap-2">
            <Link href="/platform/" className={col}>Healthspan platform</Link>
            <Link href="/tools/" className={col}>AI health tools</Link>
            <Link href="/bioelr/" className={col}>BioELR for clinics</Link>
            <Link href="/ai/" className={col}>How our AI works</Link>
            <Link href="/login/" className={col}>Sign in</Link>
            <a href={env.appUrl} className={col}>Member app ↗</a>
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-faint">Testing fulfilled by BioAro Labs and BioAro Drugs. Figures cite their sources; dashboard data is illustrative. Answers in chat come from Biongevity SI.</p>
        </Reveal>
      </div>
      <div className="container-x flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-ink/[0.06] py-4 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5 font-semibold text-ai"><XevyoOrb size={16} />✦ = powered by Biongevity SI</span>
        <span>Answers come from Biongevity SI, cite our pages and are never stored by this site.</span>
        <Link href="/ai/" className="font-semibold underline hover:text-ai">How our AI works</Link>
      </div>
      <div className="border-t border-ink/[0.06] px-4 py-5 text-center text-[12px] text-faint sm:px-6">© {new Date().getFullYear()} Biongevity · BioAro Inc. Educational information, not medical advice.</div>
    </footer>
  );
}
