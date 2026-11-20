"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MENU, MORE_LINKS, type MenuItem } from "@/data/site";
import { DEPARTMENTS, DEPT_GROUPS } from "@/data/departments";
import { CLINICS, OFFICES } from "@/data/clinic";
import { RegionSwitch, RegionPhone, RegionFlag } from "@/components/region/RegionSwitch";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { BookNow, WhatsAppLink } from "@/components/ui/BookNow";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

function isActive(item: MenuItem, path: string) {
  if (item.id === "services") return path.startsWith("/precision-health");
  if (item.id === "clinics") return path.startsWith("/clinic");
  if (item.id === "programs") return path.startsWith("/shop");
  if (item.id === "more") return MORE_LINKS.some((g) => g.links.some((l) => path.startsWith(l.href)));
  if (item.id === "how") return false;
  return path.startsWith(item.href);
}

/**
 * Top navigation — always visible. Desktop: logo, Services / Clinics / Programs / How it works / About / Contact / More,
 * then phone, Ask SI and Book now. Phones and tablets: logo, Book now and a menu button that opens a full-screen drawer.
 */
export function Header() {
  const { openCmd } = useAI();
  const path = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bar = useRef<HTMLDivElement>(null);

  // route change closes everything
  useEffect(() => { setOpen(null); setDrawer(false); }, [path]);
  // Escape closes; a click outside the bar closes the desktop panel
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setDrawer(false); } };
    const away = (e: PointerEvent) => { if (bar.current && !bar.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", key); document.addEventListener("pointerdown", away);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", away); };
  }, []);
  // the drawer locks page scroll behind it
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", drawer);
    return () => document.documentElement.classList.remove("nav-open");
  }, [drawer]);

  const enter = useCallback((id: string) => { clearTimeout(closeT.current); setOpen(id); }, []);
  const leave = useCallback(() => { closeT.current = setTimeout(() => setOpen(null), 180); }, []);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-[80] pt-[var(--safe-top)]">
        <div className="site-bar">
          <div ref={bar} className="site-wrap relative mx-auto max-w-[1280px]" onMouseLeave={leave}>
            <div className="site-inner flex h-[60px] items-center gap-1 px-3 sm:px-5">
              <Link href="/" aria-label="Biongevity home" className="mr-2 shrink-0 lg:mr-3 xl:mr-5"><Logo size={24} /></Link>

              {/* Desktop menu */}
              <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
                {MENU.map((m) => {
                  const on = isActive(m, path), cls = cn("nav-link relative flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[13.5px] font-medium transition-colors xl:px-3 xl:text-[14px]", open === m.id || on ? "text-accent" : "text-ink hover:text-accent");
                  return m.kind ? (
                    <button key={m.id} type="button" className={cls} aria-expanded={open === m.id} aria-haspopup="true" aria-current={on ? "page" : undefined}
                      onMouseEnter={() => enter(m.id)} onFocus={() => enter(m.id)} onClick={() => setOpen((o) => (o === m.id ? null : m.id))}>
                      {m.label}<Icon name="chevron-down" size={12} className={cn("transition-transform", open === m.id && "rotate-180")} />
                      {on && <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />}
                    </button>
                  ) : (
                    <Link key={m.id} href={m.href} className={cls} aria-current={on ? "page" : undefined} onMouseEnter={() => enter("")} onFocus={() => enter("")}>
                      {m.label}{on && <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <RegionPhone className="region-swap hidden h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[14px] font-medium text-ink hover:text-accent min-[1440px]:flex" icon={<Icon name="call" size={16} className="text-accent" />} />
                <RegionSwitch className="hidden lg:inline-flex" compact />
                <button onClick={() => openCmd()} aria-label="Ask Biongevity SI" title="Ask Biongevity SI" className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-ai/20 transition hover:ring-ai/45 max-[359px]:hidden"><XevyoOrb size={26} /></button>
                <BookNow size="sm" className="max-sm:hidden" />
                <button onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer} className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-ink/[0.08] hover:text-accent lg:hidden"><Icon name="menu" size={20} /></button>
              </div>
            </div>

            {/* Desktop drop-down panel */}
            <AnimatePresence>
              {open && MENU.find((m) => m.id === open)?.kind && (
                <motion.div key={open} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={SPRING}
                  onMouseEnter={() => clearTimeout(closeT.current)} className="mega absolute inset-x-0 top-full z-[1] mt-2 hidden lg:block">
                  <Panel kind={MENU.find((m) => m.id === open)!.kind!} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Phone / tablet drawer */}
      <AnimatePresence>{drawer && <Drawer path={path} onClose={() => setDrawer(false)} onAsk={() => { setDrawer(false); openCmd(); }} />}</AnimatePresence>
    </>
  );
}

const row = "group flex items-center gap-3 rounded-2xl px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-accent-light hover:text-accent";

function Panel({ kind }: { kind: NonNullable<MenuItem["kind"]> }) {
  if (kind === "services") {
    return (
      <div className="mega-panel grid grid-cols-[1fr_1fr_300px]">
        {DEPT_GROUPS.map((g) => (
          <div key={g} className="border-r border-ink/[0.06] p-4">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{g}</div>
            {DEPARTMENTS.filter((d) => d.group === g).map((d) => (
              <Link key={d.id} href={`/precision-health/${d.id}/`} className={row}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-canvas text-accent group-hover:bg-white"><Icon name={d.icon} size={16} /></span>
                <span className="min-w-0 flex-1"><span className="block">{d.name}</span><span className="block truncate text-[12px] font-normal text-muted">{d.tag}</span></span>
              </Link>
            ))}
          </div>
        ))}
        <div className="flex flex-col p-5">
          <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Testing &amp; formulas</div>
          <Link href="/precision-health/bioaro-labs/" className={row}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-canvas text-accent group-hover:bg-white"><Icon name="test-tubes" size={16} /></span><span><span className="block">BioAro Labs</span><span className="block text-[12px] font-normal text-muted">Genome, microbiome and biomarker tests</span></span></Link>
          <Link href="/precision-health/bioaro-drugs/" className={row}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-canvas text-accent group-hover:bg-white"><Icon name="tablets" size={16} /></span><span><span className="block">BioAro Drugs</span><span className="block text-[12px] font-normal text-muted">Formulas matched to your results</span></span></Link>
          <Link href="/precision-health/" className="mt-2 inline-flex items-center gap-1 px-3 text-[14px] font-semibold text-accent hover:underline">All services<Icon name="arrow-right" size={14} /></Link>
          <div className="mt-auto rounded-2xl bg-accent-light/70 p-4">
            <div className="text-[15px] font-semibold">Not sure which service?</div>
            <p className="mt-1 text-[13px] leading-snug text-muted">Book a consultation and we&apos;ll point you to the right specialist.</p>
            <div className="mt-3 flex flex-wrap gap-2"><BookNow size="sm" /><WhatsAppLink size="sm" label="WhatsApp" /></div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === "clinics") {
    return (
      <div className="mega-panel mx-auto grid max-w-[900px] grid-cols-[1fr_300px]">
        <div className="border-r border-ink/[0.06] p-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Ways to be seen</div>
          <Link href="/uae/" className={row}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-canvas group-hover:bg-white"><RegionFlag region="uae" size={13} /></span>
            <span className="min-w-0 flex-1"><span className="block">Biongevity Dubai · UAE</span><span className="block text-[12px] font-normal text-muted">Al Barsha clinic, prices in AED</span></span>
          </Link>
          {CLINICS.map((c) => (
            <Link key={c.id} href={`/clinic/${c.id}/`} className={row}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-canvas text-accent group-hover:bg-white"><Icon name={c.icon} size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block">{c.name}</span><span className="block text-[12px] font-normal text-muted">{c.tag}</span></span>
            </Link>
          ))}
          <Link href="/clinic/" className="mt-2 inline-flex items-center gap-1 px-3 text-[14px] font-semibold text-accent hover:underline">Global clinic<Icon name="arrow-right" size={14} /></Link>
        </div>
        <div className="p-5">
          <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Locations</div>
          <div className="grid gap-2">
            {OFFICES.map((o) => (
              <div key={o.city} className="rounded-2xl px-3 py-2">
                <div className="text-[14px] font-semibold">{o.city} <span className="font-normal text-muted">· {o.region.split(" · ")[1] ?? o.region}</span></div>
                <a href={o.tel} className="text-[13px] text-accent hover:underline">{o.phone}</a>
              </div>
            ))}
          </div>
          <div className="mt-3 px-1"><BookNow size="sm" /></div>
        </div>
      </div>
    );
  }
  return (
    <div className="mega-panel mx-auto grid max-w-[980px] grid-cols-3">
      {MORE_LINKS.map((g, i) => (
        <div key={g.group} className={cn("p-4", i < MORE_LINKS.length - 1 && "border-r border-ink/[0.06]")}>
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{g.group}</div>
          {g.links.map((l) => (
            <Link key={l.href} href={l.href} className={row}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-canvas text-accent group-hover:bg-white"><Icon name={l.icon} size={16} /></span>
              <span className="min-w-0 flex-1"><span className="block">{l.label}</span><span className="block text-[12px] font-normal leading-snug text-muted">{l.desc}</span></span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Full-screen menu for phones and tablets. Services and Clinics expand in place; Book now and WhatsApp stay at the bottom. */
function Drawer({ path, onClose, onAsk }: { path: string; onClose: () => void; onAsk: () => void }) {
  const [acc, setAcc] = useState<string | null>(path.startsWith("/precision-health") ? "services" : null);
  const toggle = (id: string) => setAcc((a) => (a === id ? null : id));
  const item = "flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[17px] font-semibold text-ink";
  const sub = "flex items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] text-ink hover:bg-accent-light";
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      className="drawer fixed inset-0 z-[120] flex flex-col bg-pearl/95 backdrop-blur-2xl lg:hidden">
      <div className="flex h-[60px] shrink-0 items-center justify-between px-4 pt-[var(--safe-top)] sm:px-6">
        <Link href="/" aria-label="Biongevity home" onClick={onClose}><Logo size={24} /></Link>
        <button onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-ink/[0.08]"><Icon name="x" size={18} /></button>
      </div>
      <motion.nav initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05, ...SPRING }} aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 sm:px-5" data-lenis-prevent>
        <div className="mb-2 flex items-center justify-between px-4 py-2"><span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Region</span><RegionSwitch size="md" /></div>
        {MENU.map((m) => {
          if (!m.kind) return <Link key={m.id} href={m.href} onClick={onClose} className={item}>{m.label}<Icon name="chevron-right" size={16} className="text-faint" /></Link>;
          const isOpen = acc === m.id;
          return (
            <div key={m.id}>
              <button type="button" onClick={() => toggle(m.id)} aria-expanded={isOpen} className={item}>{m.label}<Icon name="chevron-down" size={16} className={cn("text-faint transition-transform", isOpen && "rotate-180 text-accent")} /></button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                    <div className="mb-2 rounded-[22px] bg-white/70 p-2 ring-1 ring-ink/[0.05]">
                      {m.kind === "services" && (
                        <>
                          {DEPT_GROUPS.map((g) => (
                            <div key={g}>
                              <div className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{g}</div>
                              {DEPARTMENTS.filter((d) => d.group === g).map((d) => <Link key={d.id} href={`/precision-health/${d.id}/`} onClick={onClose} className={sub}><Icon name={d.icon} size={18} className="text-accent" />{d.name}</Link>)}
                            </div>
                          ))}
                          <div className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Testing &amp; formulas</div>
                          <Link href="/precision-health/bioaro-labs/" onClick={onClose} className={sub}><Icon name="test-tubes" size={18} className="text-accent" />BioAro Labs</Link>
                          <Link href="/precision-health/bioaro-drugs/" onClick={onClose} className={sub}><Icon name="tablets" size={18} className="text-accent" />BioAro Drugs</Link>
                          <Link href="/precision-health/" onClick={onClose} className={cn(sub, "font-semibold text-accent")}>All services<Icon name="arrow-right" size={14} /></Link>
                        </>
                      )}
                      {m.kind === "clinics" && (
                        <>
                          <Link href="/uae/" onClick={onClose} className={sub}><RegionFlag region="uae" size={13} />Biongevity Dubai (UAE)</Link>
                          {CLINICS.map((c) => <Link key={c.id} href={`/clinic/${c.id}/`} onClick={onClose} className={sub}><Icon name={c.icon} size={18} className="text-accent" />{c.name}</Link>)}
                          <Link href="/clinic/" onClick={onClose} className={cn(sub, "font-semibold text-accent")}>Global clinic<Icon name="arrow-right" size={14} /></Link>
                        </>
                      )}
                      {m.kind === "more" && MORE_LINKS.map((g) => (
                        <div key={g.group}>
                          <div className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{g.group}</div>
                          {g.links.map((l) => <Link key={l.href} href={l.href} onClick={onClose} className={sub}><Icon name={l.icon} size={18} className="text-accent" />{l.label}</Link>)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        <button type="button" onClick={onAsk} className={cn(item, "gap-3")}><span className="flex items-center gap-3"><XevyoOrb size={26} />Ask Biongevity SI</span><Icon name="chevron-right" size={16} className="text-faint" /></button>
      </motion.nav>
      <div className="shrink-0 border-t border-ink/[0.06] bg-white/70 px-4 pb-[calc(14px+var(--safe-bottom))] pt-3 sm:px-6">
        <div className="grid grid-cols-2 gap-2">
          <BookNow className="w-full" />
          <WhatsAppLink className="w-full" />
        </div>
        <RegionPhone className="mt-3 flex items-center justify-center gap-1.5 text-[14px] font-medium text-muted hover:text-accent" icon={<><Icon name="call" size={15} />Call&nbsp;</>} />
      </div>
    </motion.div>
  );
}
