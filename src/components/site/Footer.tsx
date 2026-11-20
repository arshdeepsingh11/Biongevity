"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS, deptHref } from "@/content/uae";
import { INTERNATIONAL, UAE_CLINIC, WA, waLink } from "@/content/contact";
import { saveRegion } from "@/lib/region";

/** Footer: Dubai clinic details on /uae pages; basic contact only on International pages. */
export function Footer() {
  const path = usePathname() ?? "/";
  const uae = path.startsWith("/uae");
  const year = 2026;
  return (
    <footer className="sec-dark relative pb-[calc(110px+var(--safe-bottom))] pt-16 lg:pb-12 lg:pt-20">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo size={26} className="text-white" />
            <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-white/70">
              {uae
                ? "Precision health and longevity in Dubai: skin, wellness, family medicine, diagnostics and more, guided by doctors."
                : "Longevity and precision health: measure how you are ageing, follow it over time and act early. Launching in the United States in March 2027."}
            </p>
            {uae ? (
              <div className="mt-7 grid gap-3 text-[15px]">
                <a href={waLink(WA.general)} target="_blank" rel="noopener" className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="whatsapp" size={18} weight="fill" />WhatsApp {UAE_CLINIC.whatsappDisplay}</a>
                <a href={UAE_CLINIC.tel} className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="call" size={18} />{UAE_CLINIC.phone}</a>
                <a href={`mailto:${UAE_CLINIC.email}`} className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="mail" size={18} />{UAE_CLINIC.email}</a>
                <a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="flex items-start gap-3 text-white/90 hover:text-white"><Icon name="pin" size={18} className="mt-0.5" /><span>{UAE_CLINIC.address.join(", ")}</span></a>
              </div>
            ) : (
              <div className="mt-7 grid gap-3 text-[15px]">
                <a href={`mailto:${INTERNATIONAL.email}`} className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="mail" size={18} />{INTERNATIONAL.email}</a>
              </div>
            )}
          </div>

          {uae ? (
            <div className="grid gap-10 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <div className="text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/50">Treatments</div>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {DEPARTMENTS.map((d) => <li key={d.id}><Link href={deptHref(d)} className="text-[15px] text-white/80 hover:text-white">{d.name}</Link></li>)}
                </ul>
              </div>
              <div>
                <div className="text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/50">Clinic</div>
                <ul className="mt-4 grid gap-2.5">
                  <li><Link href="/uae/about/" className="text-[15px] text-white/80 hover:text-white">Clinic & doctors</Link></li>
                  <li><Link href="/uae/supplements/" className="text-[15px] text-white/80 hover:text-white">Supplements</Link></li>
                  <li><Link href="/uae/contact/" className="text-[15px] text-white/80 hover:text-white">Contact & location</Link></li>
                  <li><Link href="/" onClick={() => saveRegion("intl")} className="flex items-center gap-2 text-[15px] text-white/80 hover:text-white"><Icon name="globe" size={15} />International</Link></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-3">
              <div>
                <div className="text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/50">Explore</div>
                <ul className="mt-4 grid gap-2.5">
                  <li><Link href="/#longevity" className="text-[15px] text-white/80 hover:text-white">Longevity</Link></li>
                  <li><Link href="/#technology" className="text-[15px] text-white/80 hover:text-white">Technology</Link></li>
                  <li><Link href="/#united-states" className="text-[15px] text-white/80 hover:text-white">United States</Link></li>
                  <li><Link href="/contact/" className="text-[15px] text-white/80 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/50">Where we are</div>
                <ul className="mt-4 grid gap-2.5 text-[15px] text-white/80">
                  <li><Link href="/uae/" onClick={() => saveRegion("uae")} className="hover:text-white">Dubai, UAE: clinic open now →</Link></li>
                  <li>United States: telehealth and app, launching {INTERNATIONAL.usLaunch}</li>
                  <li>Other countries: coming soon</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="hr6 mt-14" />
        <div className="mt-7 flex flex-col gap-3 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Biongevity. All rights reserved.</p>
          <p className="max-w-[70ch]">Educational information, not medical advice. {uae ? UAE_CLINIC.emergency : "In an emergency, call your local emergency number."}</p>
        </div>
      </div>
    </footer>
  );
}
