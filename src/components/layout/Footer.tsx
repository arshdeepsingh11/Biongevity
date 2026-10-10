import Link from "next/link";
import { NAV } from "@/data/site";
import { DEPARTMENTS } from "@/data/health";
import { OFFICES } from "@/data/clinic";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const links = NAV.flatMap((n) => (n.menu && n.id !== "precision" ? n.menu : n.href ? [{ href: n.href, label: n.label }] : []));
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
          <p className="mt-6 text-[12px] leading-relaxed text-faint">Content from biongevity.com, neyuhealth.com, bioarolabs.com and bioarodrugs.com. Figures cite their sources; dashboard data is illustrative. Answers in chat come from Xevyo.</p>
        </div>
      </div>
      <div className="border-t border-ink/[0.06] py-5 text-center text-[12px] text-faint">© {new Date().getFullYear()} Biongevity · BioAro Inc. Educational information, not medical advice.</div>
    </footer>
  );
}
