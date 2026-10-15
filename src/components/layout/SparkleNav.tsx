"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, type NavItem } from "@/data/site";
import { DEPARTMENTS } from "@/data/health";
import { CLINICS } from "@/data/clinic";
import { Icon } from "@/components/ui/Icon";
import { MediaSlot } from "@/components/ui/MediaSlot";

function activeId(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/precision-health")) return "precision";
  if (path.startsWith("/clinic")) return "clinic";
  if (path.startsWith("/shop")) return "shop";
  if (path.startsWith("/contact")) return "contact";
  if (/^\/(life|app|insights|about|dashboard|platform|tools|bioelr|ai|login|scan|family|twin)/.test(path)) return "discover";
  return "home";
}

/**
 * Sparkle Navbar — floating glass bar at the bottom centre.
 * A glowing strike-through line glides (GSAP) to the active/hovered item and throws sparkles.
 * Items with a menu open a preview panel: hover a page to see its content before you go.
 */
export function SparkleNav() {
  const path = usePathname();
  const active = activeId(path);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const sparkLayer = useRef<HTMLDivElement>(null);
  const closeT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const target = hover ?? open ?? active;

  const sparkle = useCallback((x: number, y: number) => {
    const layer = sparkLayer.current;
    if (!layer || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("span");
      s.className = "absolute h-1 w-1 rounded-full";
      s.style.background = i % 3 === 0 ? "rgb(var(--c-gold))" : i % 2 ? "rgb(var(--c-teal))" : "rgb(var(--c-accent))";
      s.style.left = `${x}px`; s.style.top = `${y}px`;
      layer.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 10 + Math.random() * 18;
      gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d - 6, opacity: 0, scale: 0.2, duration: 0.6 + Math.random() * 0.3, ease: "power2.out", onComplete: () => s.remove() });
    }
  }, []);

  // Move the glowing strike-through line
  useLayoutEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>(`[data-nav="${target}"] [data-label]`);
    if (!el || !line.current || !bar.current) return;
    const br = bar.current.getBoundingClientRect(), r = el.getBoundingClientRect();
    const x = r.left - br.left + bar.current.scrollLeft - 4, w = r.width + 8, y = r.top - br.top + r.height / 2;
    gsap.to(line.current, { x, width: w, y: y - 1, opacity: 1, duration: 0.55, ease: "power3.out", onComplete: () => sparkle(x + w, y) });
  }, [target, sparkle]);

  useEffect(() => { setOpen(null); setHover(null); }, [path]);
  useEffect(() => { const f = () => setHover((h) => h); addEventListener("resize", f); return () => removeEventListener("resize", f); }, []);

  const enter = (n: NavItem) => { clearTimeout(closeT.current); setHover(n.id); if (n.menu) { setOpen(n.id); setPreview(n.menu[0].href); } else setOpen(null); };
  const leave = () => { closeT.current = setTimeout(() => { setOpen(null); setHover(null); }, 220); };
  const item = NAV.find((n) => n.id === open);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[85] flex flex-col items-center px-3 pb-[calc(12px+var(--safe-bottom))]">
      <AnimatePresence>
        {item?.menu && (
          <motion.div key={item.id} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onMouseEnter={() => clearTimeout(closeT.current)} onMouseLeave={leave} className="glass pointer-events-auto mb-3 w-full max-w-[860px] overflow-hidden rounded-[28px] shadow-lift">
            <MenuPanel item={item} preview={preview} setPreview={setPreview} />
          </motion.div>
        )}
      </AnimatePresence>

      <nav aria-label="Primary" onMouseEnter={() => clearTimeout(closeT.current)} onMouseLeave={leave} className="glass pointer-events-auto relative max-w-full rounded-full p-1.5 shadow-lift">
        <div ref={bar} className="no-scrollbar relative flex items-center overflow-x-auto">
          <span ref={line} aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 h-[2px] w-0 rounded-full opacity-0"
            style={{ background: "linear-gradient(90deg,rgb(var(--c-accent)),rgb(var(--c-teal)))", boxShadow: "0 0 8px rgb(var(--c-accent)/.9), 0 0 18px rgb(var(--c-teal)/.55)" }} />
          <div ref={sparkLayer} aria-hidden className="pointer-events-none absolute inset-0 z-30" />
          {NAV.map((n) => {
            const on = target === n.id, cur = active === n.id;
            const inner = (
              <>
                <Icon name={n.icon} size={18} weight={on ? "duotone" : "regular"} className={`shrink-0 transition-colors ${on ? "text-accent" : "text-faint"}`} />
                <span data-label className={`relative text-[10.5px] font-semibold transition-colors sm:text-[13px] ${on ? "text-accent" : "text-muted"}`}>{n.label}</span>
                {n.menu && <Icon name="chevron-down" size={12} className={`hidden transition-transform sm:block ${open === n.id ? "rotate-180 text-accent" : "text-faint"}`} />}
              </>
            );
            const cls = `relative z-10 flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1.5 transition-colors sm:flex-row sm:rounded-full sm:gap-1.5 sm:px-3.5 sm:py-2 ${cur ? "bg-accent-light" : "hover:bg-ink/[0.04]"}`;
            return n.menu ? (
              <button key={n.id} data-nav={n.id} className={cls} aria-expanded={open === n.id} aria-haspopup="true"
                onMouseEnter={() => enter(n)} onClick={() => (open === n.id ? setOpen(null) : enter(n))}>{inner}</button>
            ) : (
              <Link key={n.id} data-nav={n.id} href={n.href!} className={cls} aria-current={cur ? "page" : undefined} onMouseEnter={() => enter(n)}>{inner}</Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function MenuPanel({ item, preview, setPreview }: { item: NavItem; preview: string | null; setPreview: (h: string) => void }) {
  if (item.id === "discover" || item.id === "shop") {
    return (
      <div className={`grid gap-2 p-3 sm:grid-cols-2 ${item.id === "shop" ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {item.menu!.map((m) => (
          <Link key={m.href} href={m.href} className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-accent-light">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas text-accent group-hover:bg-white"><Icon name={m.icon} size={18} /></span>
            <span><span className="block text-[14px] font-semibold">{m.label}</span><span className="block text-[12px] leading-snug text-muted">{m.desc}</span></span>
          </Link>
        ))}
      </div>
    );
  }
  const isPrecision = item.id === "precision";
  const slug = (preview ?? item.menu![0].href).split("/").filter(Boolean).pop()!;
  const dept = isPrecision ? DEPARTMENTS.find((d) => d.id === slug) : undefined;
  const clinic = !isPrecision ? CLINICS.find((c) => c.id === slug) : undefined;
  const p = dept ?? clinic;
  return (
    <div className="grid md:grid-cols-[260px_1fr]">
      <div className="max-h-[46vh] overflow-y-auto border-b border-ink/[0.06] p-2 md:max-h-[62vh] md:border-b-0 md:border-r">
        <Link href={item.href!} className="mb-1 flex items-center justify-between rounded-xl px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint hover:text-accent">
          {isPrecision ? "All precision health" : "Global clinic"}<Icon name="arrow-right" size={13} />
        </Link>
        {item.menu!.map((m, k) => (
          <div key={m.href}>
            {m.group && m.group !== item.menu![k - 1]?.group && <div className="px-3 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{m.group}</div>}
            <Link href={m.href} onMouseEnter={() => setPreview(m.href)} onFocus={() => setPreview(m.href)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] font-medium transition-colors ${preview === m.href ? "bg-accent-light text-accent" : "text-ink hover:bg-ink/[0.04]"}`}>
              <Icon name={m.icon} size={18} weight="duotone" />{m.label}
            </Link>
          </div>
        ))}
      </div>
      {!p && isPrecision && (
        <div className="hidden p-6 md:block">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={slug === "bioaro-drugs" ? "tablets" : "test-tubes"} size={24} weight="duotone" /></span>
          <div className="mt-4 text-[22px] font-semibold tracking-tight">{slug === "bioaro-drugs" ? "BioAro Drugs" : "BioAro Labs"}</div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{slug === "bioaro-drugs" ? "AI-guided bioactive protocols — every ingredient and dose visible, matched to your goals and routine." : "47 advanced tests — genome, biomarkers and microbiome — connected by BioAro Intelligence and reviewed by clinicians."}</p>
          <Link href={preview ?? "/precision-health/"} className="btn-dark mt-5 h-10 text-[14px]">Explore<Icon name="arrow-right" size={14} /></Link>
        </div>
      )}
      {p && (
        <AnimatePresence mode="wait">
          <motion.div key={slug} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }} className="hidden p-6 md:block">
            <div className="flex items-start gap-4">
              {clinic?.media ? <MediaSlot id="clinicLoop" className="h-24 w-36 shrink-0" rounded="rounded-2xl" />
                : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-iri text-white shadow-glow"><Icon name={p.icon} size={24} weight="duotone" /></span>}
              <div><div className="text-[22px] font-semibold tracking-tight">{p.name}</div><div className="text-[14px] text-accent">{p.tag}</div></div>
            </div>
            <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted">{p.summary}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(dept ? dept.services : clinic!.points).slice(0, 4).map((s) => (
                <div key={s.t} className="rounded-xl bg-canvas px-3 py-2"><div className="text-[13px] font-semibold">{s.t}</div><div className="line-clamp-1 text-[12px] text-muted">{s.d}</div></div>
              ))}
            </div>
            <Link href={preview ?? item.menu![0].href} className="btn-dark mt-5 h-10 text-[14px]">Open {dept?.short ?? clinic?.short}<Icon name="arrow-right" size={14} /></Link>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
