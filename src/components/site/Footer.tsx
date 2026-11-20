"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import type { NavData } from "@/content/uae/nav";
import { INTERNATIONAL, UAE_CLINIC, addressOf, waLink } from "@/content/contact";
import { isUaePath, localeFromPath, switchLocalePath, t, uaeBase } from "@/i18n";
import { saveRegion } from "@/lib/regionPref";

const head = "text-[12.5px] font-semibold uppercase tracking-[.16em] text-white/50";
const lnk = "text-[15px] text-white/80 hover:text-white";

/** Footer: Dubai clinic details on Dubai pages (English or Arabic); basic contact only on International pages. */
export function Footer({ nav }: { nav: NavData }) {
  const path = usePathname() ?? "/";
  const uae = isUaePath(path);
  const l = localeFromPath(path);
  const x = t(l);
  const b = uaeBase(l);
  const year = 2026;
  return (
    <footer className="sec-dark relative pb-[calc(110px+var(--safe-bottom))] pt-16 lg:pb-12 lg:pt-20">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo size={26} className="text-white" />
            <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-white/70">
              {uae ? x.footerAbout : "Longevity and precision health: measure how you are ageing, follow it over time and act early. Launching in the United States in March 2027."}
            </p>
            {uae ? (
              <div className="mt-7 grid gap-3 text-[15px]">
                <a href={waLink(x.wa.general)} target="_blank" rel="noopener" data-item="Footer" className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="whatsapp" size={18} weight="fill" />WhatsApp <span dir="ltr">{UAE_CLINIC.whatsappDisplay}</span></a>
                <a href={UAE_CLINIC.tel} className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="call" size={18} /><span dir="ltr">{UAE_CLINIC.phone}</span></a>
                <a href={`mailto:${UAE_CLINIC.email}`} className="flex items-center gap-3 text-white/90 hover:text-white"><Icon name="mail" size={18} />{UAE_CLINIC.email}</a>
                <a href={UAE_CLINIC.mapUrl} target="_blank" rel="noopener" className="flex items-start gap-3 text-white/90 hover:text-white"><Icon name="pin" size={18} className="mt-0.5" /><span>{addressOf(l).join(l === "ar" ? "، " : ", ")}</span></a>
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
                <div className={head}>{x.footerTreatments}</div>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {nav[l].map((d) => <li key={d.id}><Link href={d.href} className={lnk}>{d.name}</Link></li>)}
                </ul>
              </div>
              <div>
                <div className={head}>{x.footerClinic}</div>
                <ul className="mt-4 grid gap-2.5">
                  <li><Link href={`${b}/about/`} className={lnk}>{x.clinicDoctors}</Link></li>
                  <li><Link href={`${b}/supplements/`} className={lnk}>{x.supplements}</Link></li>
                  <li><Link href={`${b}/contact/`} className={lnk}>{x.contactLocation}</Link></li>
                  <li><Link href={switchLocalePath(path, l === "ar" ? "en" : "ar")} lang={l === "ar" ? "en" : "ar"} className={lnk}>{x.otherLang}</Link></li>
                  <li><Link href="/" onClick={() => saveRegion("intl")} className={`flex items-center gap-2 ${lnk}`}><Icon name="globe" size={15} />{x.international}</Link></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-3">
              <div>
                <div className={head}>Explore</div>
                <ul className="mt-4 grid gap-2.5">
                  <li><Link href="/#longevity" className={lnk}>Longevity</Link></li>
                  <li><Link href="/#technology" className={lnk}>Technology</Link></li>
                  <li><Link href="/#programmes" className={lnk}>Programmes</Link></li>
                  <li><Link href="/#united-states" className={lnk}>United States</Link></li>
                  <li><Link href="/contact/" className={lnk}>Contact</Link></li>
                </ul>
              </div>
              <div className="sm:col-span-2">
                <div className={head}>Where we are</div>
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
          <p>© {year} Biongevity. {uae ? x.rights : "All rights reserved."}</p>
          <p className="max-w-[70ch]">{uae ? `${x.eduNote} ${x.emergency}` : "Educational information, not medical advice. In an emergency, call your local emergency number."}</p>
        </div>
      </div>
    </footer>
  );
}
