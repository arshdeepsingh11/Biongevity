"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import type { NavData } from "@/content/uae/nav";
import { UAE_CLINIC, waLink } from "@/content/contact";
import { isUaePath, localeFromPath, switchLocalePath, t, uaeBase, type Locale } from "@/i18n";
import { saveRegion } from "@/lib/regionPref";
import { cn } from "@/lib/utils";

const uaeLinks = (l: Locale) => {
  const x = t(l), b = uaeBase(l);
  return [
    { href: `${b}/about/`, label: x.clinicDoctors },
    { href: `${b}/supplements/`, label: x.supplements },
    { href: `${b}/contact/`, label: x.contact },
  ];
};

/** EN | العربية switch: the same page in the other language. The choice is remembered. */
function LangSwitch({ path, l, className }: { path: string; l: Locale; className?: string }) {
  const to: Locale = l === "ar" ? "en" : "ar";
  return (
    <Link href={switchLocalePath(path, to)} hrefLang={to} lang={to} onClick={() => { try { localStorage.setItem("biongevity.lang", to); } catch { /* private mode */ } }}
      className={cn("lang6", className)} aria-label={to === "ar" ? "العربية — عرض الصفحة بالعربية" : "English — view this page in English"}>
      <span className={cn(l === "en" && "is-on")}>EN</span><span className={cn(l === "ar" && "is-on")}>ع</span>
    </Link>
  );
}

const INTL_LINKS = [
  { href: "/#longevity", label: "Longevity" },
  { href: "/#technology", label: "Technology" },
  { href: "/#united-states", label: "United States" },
  { href: "/contact/", label: "Contact" },
];

/**
 * Site header. On /uae/… it is the Dubai clinic header (Treatments mega menu, WhatsApp, Book now);
 * everywhere else it is the International header (no clinic details). Hides on scroll down, returns on scroll up.
 */
export function Header({ nav }: { nav: NavData }) {
  const path = usePathname() ?? "/";
  const uae = isUaePath(path);
  const l = localeFromPath(path);
  const x = t(l);
  const base = uaeBase(l);
  const depts = nav[l];
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const last = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverAt = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => { setMega(false); setDrawer(false); }, [path]);

  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 8);
      setHidden(y > 160 && y > last.current + 4 && !mega);
      if (y < last.current - 4 || y < 160) setHidden(false);
      last.current = y;
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [mega]);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [drawer]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setMega(false); setDrawer(false); } };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, []);

  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); if (!mega) hoverAt.current = Date.now(); setMega(true); };
  // A click right after hover-open keeps the menu open (otherwise hover + click would close it again).
  const clickMega = () => setMega((v) => (v && Date.now() - hoverAt.current < 500 ? true : !v));

  useEffect(() => {
    if (!mega) return;
    const out = (e: MouseEvent) => { if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(false); };
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, [mega]);
  const closeMegaSoon = () => { closeTimer.current = setTimeout(() => setMega(false), 160); };
  const links = uae ? uaeLinks(l) : INTL_LINKS;
  // The International home opens on a deep navy hero: light header text until the bar turns solid.
  const onDark = path === "/" && !solid && !mega;
  const isCurrent = (href: string) => href === path;

  return (
    <>
      <header ref={headerRef} className={cn("hdr6", (solid || mega) && "is-solid", hidden && !drawer && "is-hidden", onDark && "is-ondark")}>
        <div className="wrap relative flex h-[72px] items-center gap-3 lg:h-[84px]">
          <Link href={uae ? `${base}/` : "/"} className="flex shrink-0 items-center gap-2.5" aria-label={uae ? (l === "ar" ? "بيونجيفيتي دبي — الرئيسية" : "Biongevity Dubai home") : "Biongevity home"}>
            <Logo size={uae ? 23 : 25} className={onDark ? "text-white" : undefined} />
            {uae && <span className="hidden border-s border-ink/15 ps-2.5 text-[12px] font-semibold uppercase tracking-[.18em] text-gold-deep sm:inline">{x.dubai}</span>}
          </Link>

          <nav aria-label="Main" className="ms-6 hidden items-center gap-0.5 lg:flex">
            {uae && (
              <div onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
                <button type="button" className="nav6-link" aria-expanded={mega} aria-controls="mega-treatments" onClick={clickMega}>
                  {x.treatments} <Icon name="chevron-down" size={14} className={cn("transition-transform", mega && "rotate-180")} />
                </button>
              </div>
            )}
            {links.map((k) => <Link key={k.href} href={k.href} className="nav6-link" aria-current={isCurrent(k.href) ? "page" : undefined}>{k.label}</Link>)}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            {uae ? (
              <>
                <Link href="/" onClick={() => saveRegion("intl")} className="nav6-link hidden !text-[14px] xl:inline-flex" title={x.biongevityInternational}><Icon name="globe" size={16} />{x.international}</Link>
                <LangSwitch path={path} l={l} />
                <a href={waLink(x.wa.general)} target="_blank" rel="noopener" aria-label={x.whatsappUs} data-item="Header WhatsApp" className="hidden h-11 w-11 place-items-center rounded-full border border-ink/15 text-[rgb(var(--c-wa-deep))] transition hover:bg-white sm:grid"><Icon name="whatsapp" size={21} weight="fill" /></a>
                <a href={waLink(x.wa.general)} target="_blank" rel="noopener" data-book data-item="Header" className="btn6 btn6-primary btn6-sm hidden sm:inline-flex"><Icon name="calendar" size={16} />{x.bookNow}</a>
              </>
            ) : (
              <Link href="/uae/" onClick={() => saveRegion("uae")} className={cn("btn6 btn6-sm hidden sm:inline-flex", onDark ? "btn6-light" : "btn6-primary")}>Dubai clinic<Icon name="arrow-right" size={15} /></Link>
            )}
            <button type="button" onClick={() => setDrawer(true)} aria-label={x.openMenu} aria-expanded={drawer} className={cn("grid h-11 w-11 place-items-center rounded-full border lg:hidden", onDark ? "border-white/30 text-white" : "border-ink/15 bg-white/70")}><Icon name="menu" size={20} /></button>
          </div>

          {uae && mega && (
            <div id="mega-treatments" className="mega6 hidden lg:block" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
              <div className="mega6-panel grid grid-cols-[1fr_280px] gap-0 overflow-hidden">
                <div className="grid grid-cols-4 gap-x-6 gap-y-7 p-8">
                  {depts.map((d) => (
                    <div key={d.id} data-dept={d.id}>
                      <Link href={d.href} className="group flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                        <span className="dept-dot" />{d.short}
                        <Icon name="arrow-right" size={13} className="flip-rtl opacity-0 transition group-hover:opacity-60" />
                      </Link>
                      <ul className="mt-2.5 grid gap-1.5 ps-[19px]">
                        {d.top.map((s) => (
                          <li key={s.href}><Link href={s.href} className="text-[13.5px] text-muted hover:text-ink">{s.name}</Link></li>
                        ))}
                        <li><Link href={d.href} className="text-[13px] font-semibold text-[rgb(var(--dept-deep))]">{x.viewAll}</Link></li>
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-between bg-[rgb(var(--c-canvas))] p-7">
                  <div>
                    <div className="t-eyebrow">{x.notSure}</div>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{x.notSureMenu}</p>
                  </div>
                  <a href={waLink(x.wa.help())} target="_blank" rel="noopener" data-item="Menu: help me choose" className="btn6 btn6-wa btn6-sm mt-6 w-full"><Icon name="whatsapp" size={17} weight="fill" />{x.helpMeChoose}</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {drawer && (
        <div className="drawer6 lg:hidden" role="dialog" aria-modal="true" aria-label={x.menu}>
          <div className="wrap flex h-[72px] items-center justify-between pt-[var(--safe-top)]">
            <Logo size={23} />
            {uae && <LangSwitch path={path} l={l} className="ms-auto me-2" />}
            <button type="button" onClick={() => setDrawer(false)} aria-label={x.closeMenu} className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white"><Icon name="x" size={20} /></button>
          </div>
          <div className="wrap pt-4">
            {uae && (
              <>
                <div className="t-eyebrow">{x.treatments}</div>
                <ul className="mt-3 grid gap-2">
                  {depts.map((d) => (
                    <li key={d.id} data-dept={d.id}>
                      <Link href={d.href} className="card6 flex items-center gap-3 px-4 py-3.5">
                        <span className="dept-tile !h-10 !w-10 !rounded-xl"><Icon name={d.icon} size={19} /></span>
                        <span className="flex-1 text-[16px] font-semibold">{d.short}</span>
                        <Icon name="chevron-right" size={16} className="text-faint flip-rtl" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <ul className="mt-6 grid border-t border-ink/10">
              {links.map((k) => <li key={k.href}><Link href={k.href} className="flex items-center justify-between border-b border-ink/10 py-4 text-[18px] font-semibold">{k.label}<Icon name="arrow-right" size={16} className="text-faint flip-rtl" /></Link></li>)}
              {uae
                ? <li><Link href="/" onClick={() => saveRegion("intl")} className="flex items-center justify-between border-b border-ink/10 py-4 text-[16px] font-medium text-muted"><span className="flex items-center gap-2"><Icon name="globe" size={17} />{x.biongevityInternational}</span><Icon name="arrow-right" size={16} className="text-faint flip-rtl" /></Link></li>
                : <li><Link href="/uae/" onClick={() => saveRegion("uae")} className="flex items-center justify-between border-b border-ink/10 py-4 text-[18px] font-semibold">Dubai clinic<Icon name="arrow-right" size={16} className="text-faint" /></Link></li>}
            </ul>
            {uae && (
              <div className="mt-6 grid gap-3">
                <a href={waLink(x.wa.general)} target="_blank" rel="noopener" data-book data-item="Menu" className="btn6 btn6-primary btn6-lg w-full"><Icon name="calendar" size={18} />{x.bookNow}</a>
                <a href={waLink(x.wa.general)} target="_blank" rel="noopener" data-item="Menu" className="btn6 btn6-wa btn6-lg w-full"><Icon name="whatsapp" size={19} weight="fill" />{x.whatsappUs}</a>
                <a href={UAE_CLINIC.tel} className="btn6 btn6-ghost btn6-lg w-full"><Icon name="call" size={18} /><span dir="ltr">{UAE_CLINIC.phone}</span></a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
