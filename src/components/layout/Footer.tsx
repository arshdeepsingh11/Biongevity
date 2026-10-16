import Link from "next/link";
import { NAV } from "@/data/site";
import { DEPARTMENTS } from "@/data/health";
import { OFFICES } from "@/data/clinic";
import { Logo } from "@/components/ui/Logo";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { env } from "@/lib/env";

export function Footer() {
  const links = NAV.flatMap((n) => (n.menu && n.id !== "precision" ? n.menu : n.href ? [{ href: n.href, label: n.label }] : [])).filter((l) => !["/platform/", "/bioelr/", "/tools/"].includes(l.href));
  return (
    <footer className="relative z-[1] border-t border-ink/[0.06] bg-canvas/80 backdrop-blur">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={26} />
          <p className="mt-3 text-[14px] leading-relaxed text-muted">Precision health. Shared longevity. Part of BioAro.</p>
          <div className="mt-4 space-y-3 text-[13px] text-muted">
            {OFFICES.map((o) => <div key={o.city}><div className="font-semibold text-ink">{o.city}</div><a href={o.tel} className="hover:text-accent">{o.phone}</a>{o.email && <> · <a href={`mailto:${o.email}`} className="hover:text-accent">{o.email}</a></>}</div>)}
          </div>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Explore</div>
          <div className="mt-3 grid gap-2">{links.map((l) => <Link key={l.href} href={l.href} className="text-[14px] text-muted hover:text-accent">{l.label}</Link>)}</div>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Precision Health</div>
          <div className="mt-3 grid gap-2">{DEPARTMENTS.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className="text-[14px] text-muted hover:text-accent">{d.short}</Link>)}</div>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Partners</div>
          <div className="mt-3 grid gap-2">
            <a href="https://bioarolabs.com/shop" target="_blank" rel="noopener" className="text-[14px] text-muted hover:text-accent">BioAro Labs ↗</a>
            <a href="https://bioarodrugs.com/us/shop" target="_blank" rel="noopener" className="text-[14px] text-muted hover:text-accent">BioAro Drugs ↗</a>
            <a href="https://neyuhealth.com" target="_blank" rel="noopener" className="text-[14px] text-muted hover:text-accent">NEYU Health ↗</a>
          </div>
          <div className="mt-6 text-[13px] font-semibold">Platform & AI</div>
          <div className="mt-3 grid gap-2">
            <Link href="/platform/" className="text-[14px] text-muted hover:text-accent">Healthspan platform</Link>
            <Link href="/tools/" className="text-[14px] text-muted hover:text-accent">AI health tools</Link>
            <Link href="/bioelr/" className="text-[14px] text-muted hover:text-accent">BioELR for clinics</Link>
            <Link href="/ai/" className="text-[14px] text-muted hover:text-accent">How our AI works</Link>
            <Link href="/login/" className="text-[14px] text-muted hover:text-accent">Sign in</Link>
            <a href={env.appUrl} className="text-[14px] text-muted hover:text-accent">Member app ↗</a>
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-faint">Testing fulfilled by BioAro Labs and BioAro Drugs. Figures cite their sources; dashboard data is illustrative. Answers in chat come from Biongevity SI.</p>
        </div>
      </div>
      <div className="container-x flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-ink/[0.06] py-4 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5 font-semibold text-ai"><XevyoOrb size={16} />✦ = powered by Xevyo AI</span>
        <span>Answers come from Xevyo, cite our pages and are never stored by this site.</span>
        <Link href="/ai/" className="font-semibold underline hover:text-ai">How our AI works</Link>
      </div>
      <div className="border-t border-ink/[0.06] py-5 text-center text-[12px] text-faint">© {new Date().getFullYear()} Biongevity · BioAro Inc. Educational information, not medical advice.</div>
    </footer>
  );
}
