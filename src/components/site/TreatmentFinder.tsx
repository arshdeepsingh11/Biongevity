"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { waItem, waLink } from "@/content/contact";
import { t, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Treatment finder: pick what you would like to improve → where to start (2–3 treatments) → Book or ask our team.
 * A plain mapping chosen by the clinic (src/content/uae/index.ts → CONCERNS), not AI. The doctor confirms the plan.
 */
export interface FinderConcern { id: string; icon: string; label: string; en: string; picks: { dept: string; icon: string; name: string; short: string; href: string }[] }

export function TreatmentFinder({ l = "en", list }: { l?: Locale; list: FinderConcern[] }) {
  const [sel, setSel] = useState(list[0].id);
  const c = list.find((x) => x.id === sel)!;
  const d = t(l);
  const enConcern = c.en;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
      <div role="radiogroup" aria-label={d.finderEyebrow} className="flex flex-wrap content-start gap-2.5">
        {list.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={sel === x.id} onClick={() => setSel(x.id)}
            className={cn("inline-flex h-12 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition",
              sel === x.id ? "border-transparent bg-[rgb(var(--c-feature))] text-white shadow-[0_10px_24px_-14px_rgb(var(--c-shadow)/.8)]" : "border-ink/10 bg-white text-ink hover:border-ink/25")}>
            <Icon name={x.icon} size={17} />{x.label}
          </button>
        ))}
      </div>
      <div className="card6 beam-host relative overflow-hidden p-6 sm:p-8" aria-live="polite">
        <div aria-hidden className="beam6" />
        <div className="relative">
          <div className="t-eyebrow">{d.finderPick} {c.label.toLowerCase()}</div>
          <ul className="mt-5 grid gap-3">
            {c.picks.map((p, i) => (
              <li key={`${sel}-${p.href}`} data-dept={p.dept} className="fade6" style={{ animationDelay: `${i * 70}ms` }}>
                <Link href={p.href} className="group flex items-center gap-4 rounded-[20px] border border-ink/[0.07] bg-[rgb(var(--c-pearl))] p-4 transition hover:border-ink/15 hover:bg-white">
                  <span className="dept-tile !h-11 !w-11"><Icon name={p.icon} size={20} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16.5px] font-semibold leading-snug">{p.name}</span>
                    <span className="block text-[14px] leading-snug text-muted">{p.short}</span>
                  </span>
                  <Icon name="arrow-right" size={16} className="flip-rtl shrink-0 text-faint transition group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waLink(d.wa.help(waItem(l, c.label, enConcern)))} target="_blank" rel="noopener" data-book data-item={`Finder: ${enConcern}`} className="btn6 btn6-primary"><Icon name="calendar" size={17} />{d.bookNow}</a>
            <a href={waLink(d.wa.help(waItem(l, c.label, enConcern)))} target="_blank" rel="noopener" data-item={`Finder: ${enConcern}`} className="btn6 btn6-ghost"><Icon name="whatsapp" size={18} weight="fill" className="text-[rgb(var(--c-wa-deep))]" />{d.finderAsk}</a>
          </div>
          <p className="mt-4 text-[12.5px] text-faint">{d.eduNote}</p>
        </div>
      </div>
    </div>
  );
}
