import Link from "next/link";
import { NAV, CONTACTS } from "@/data/site";
import { DEPARTMENTS } from "@/data/health";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-white/[0.06] bg-night/80 backdrop-blur">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-[19px] font-semibold tracking-tight">Biongevity</div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">Precision health and longevity medicine. Part of BioAro, Calgary.</p>
          <div className="mt-4 space-y-1 text-[13px] text-muted">
            <a className="block hover:text-ink" href={CONTACTS.labs.tel}>Labs · {CONTACTS.labs.phone}</a>
            <a className="block hover:text-ink" href={`mailto:${CONTACTS.labs.email}`}>{CONTACTS.labs.email}</a>
            <a className="block hover:text-ink" href={`mailto:${CONTACTS.drugs.email}`}>{CONTACTS.drugs.email}</a>
          </div>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Explore</div>
          <div className="mt-3 grid gap-2">{NAV.map((n) => <Link key={n.href} href={n.href} className="text-[14px] text-muted hover:text-ink">{n.label}</Link>)}</div>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Departments</div>
          <div className="mt-3 grid gap-2">{DEPARTMENTS.map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} className="text-[14px] text-muted hover:text-ink">{d.short}</Link>)}</div>
        </div>
        <div>
          <div className="text-[13px] font-semibold">Shop</div>
          <div className="mt-3 grid gap-2">
            <a href="https://bioarolabs.com/shop" target="_blank" rel="noopener" className="text-[14px] text-muted hover:text-ink">BioAro Labs ↗</a>
            <a href="https://bioarodrugs.com/us/shop" target="_blank" rel="noopener" className="text-[14px] text-muted hover:text-ink">BioAro Drugs ↗</a>
            <Link href="/#products" className="text-[14px] text-muted hover:text-ink">AI product match</Link>
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-faint">Company and product copy from biongevity.com, bioarolabs.com and bioarodrugs.com. Dashboard data is illustrative. AI answers are labelled live or prepared.</p>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-5 pb-safe text-center text-[12px] text-faint">© {new Date().getFullYear()} Biongevity · BioAro Inc. Educational information, not medical advice.</div>
    </footer>
  );
}
