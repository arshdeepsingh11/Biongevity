import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Faq } from "@/content/types";
import { cn } from "@/lib/utils";
import { t, type Locale } from "@/i18n";
import { BookNow, CallBtn, WhatsAppBtn } from "./Cta";

/** Section heading: eyebrow, title (display font), optional lede. */
export function Head({ eyebrow, title, lede, center, className, as: As = "h2" }: { eyebrow?: ReactNode; title: ReactNode; lede?: ReactNode; center?: boolean; className?: string; as?: "h1" | "h2" }) {
  return (
    <div className={cn(center && "mx-auto text-center", "max-w-[760px]", className)} data-rv>
      {eyebrow && <div className="t-eyebrow">{eyebrow}</div>}
      <As className={cn(As === "h1" ? "t-h1" : "t-h2", eyebrow && "mt-4")}>{title}</As>
      {lede && <p className={cn("t-lede mt-5", center && "mx-auto", "max-w-[62ch]")}>{lede}</p>}
    </div>
  );
}

/** FAQ accordion (native details/summary: works without JavaScript and is accessible). */
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={cn("border-b border-ink/10", className)}>
      {items.map((f) => (
        <details key={f.q} className="faq6 group">
          <summary>{f.q}<span className="faq6-ic"><Icon name="plus" size={16} /></span></summary>
          <p className="faq6-a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Tick list. */
export function Ticks({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((x) => <li key={x} className="tick6"><Icon name="check" size={18} weight="bold" /><span>{x}</span></li>)}
    </ul>
  );
}

/** Breadcrumbs. */
export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13.5px] text-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, href], i) => (
          <li key={label} className="flex items-center gap-1.5">
            {i > 0 && <Icon name="chevron-right" size={12} className="opacity-60" />}
            {href ? <Link href={href} className="hover:text-ink">{label}</Link> : <span aria-current="page" className="text-ink/80">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The closing booking band of every UAE page: deep navy, one line, Book now, WhatsApp and the phone number. */
export function BookBand({ l = "en", title, lede, item, track, className }: { l?: Locale; title?: ReactNode; lede?: string; item?: string; track?: string; className?: string }) {
  const d = t(l);
  return (
    <section data-ai="Book" className={cn("relative py-10 sm:py-16", className)}>
      <div className="wrap">
        <div className="sec-dark relative overflow-hidden rounded-[34px] px-6 py-14 text-center sm:px-12 sm:py-20" data-rv>
          <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-gold)/.22),transparent)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-teal)/.18),transparent)]" />
          <div aria-hidden className="beam6" />
          <div className="relative">
            <h2 className="t-h2 mx-auto max-w-[20ch]">{title ?? <>{d.readyTitle} <span className="t-italic">{d.readyItalic}</span></>}</h2>
            <p className="t-lede mx-auto mt-5 max-w-[56ch]">{lede ?? d.bookBandLede}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <BookNow l={l} item={item} track={track} size="lg" variant="light" />
              <WhatsAppBtn l={l} text={item ? d.wa.book(item) : d.wa.general} size="lg" item={track ?? item} />
              <CallBtn size="lg" variant="outline-light" className="max-sm:hidden" />
            </div>
            <p className="mt-6 text-[13.5px] text-white/60">{d.vatNote} {d.emergency}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Small medical disclaimer line. */
export function Disclaimer({ l = "en", className }: { l?: Locale; className?: string }) {
  const d = t(l);
  return <p className={cn("text-[13px] leading-relaxed text-faint", className)}>{d.disclaimer} {d.emergency}</p>;
}
