import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Department, Service, ServiceGroup } from "@/content/types";
import { deptHref, serviceHref, servicesOf } from "@/content/uae";
import { t, type Locale } from "@/i18n";
import { Photo } from "./Photo";
import { cn } from "@/lib/utils";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Department card with photo, accent and service count. Hover: soft spotlight that follows the pointer. */
export function DeptCard({ d, l = "en", big, className, i = 0 }: { d: Department; l?: Locale; big?: boolean; className?: string; i?: number }) {
  const n = servicesOf(d).length;
  const x = t(l);
  return (
    <Link href={deptHref(d, l)} data-dept={d.id} className={cn("card6 spot6 group flex flex-col overflow-hidden", className)} data-rv style={delay((i % 4) * 70)}>
      <Photo k={d.photo} className={cn("w-full", big ? "aspect-[16/11] lg:aspect-auto lg:flex-1" : "aspect-[16/10]")} w={big ? 900 : 600} sizes={big ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[.12em] text-[rgb(var(--dept-deep))]"><span className="dept-dot" />{x.treatmentsCount(n)}</div>
        <h3 className={cn("mt-2.5 font-semibold tracking-tight text-ink", big ? "text-[26px] leading-tight" : "text-[19px] leading-snug")}>{d.name}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.tagline}</p>
        <span className="link6 mt-auto pt-5 text-[15px]">{x.explore} <Icon name="arrow-right" size={15} /></span>
      </div>
    </Link>
  );
}

/** Service card (text-first), used in department pages and related lists. */
export function ServiceCard({ d, s, l = "en", i = 0 }: { d: Department; s: Service; l?: Locale; i?: number }) {
  const x = t(l);
  return (
    <Link href={serviceHref(d, s, l)} data-dept={d.id} className="card6 spot6 group flex h-full flex-col p-6" data-rv style={delay((i % 3) * 60)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[18.5px] font-semibold leading-snug tracking-tight text-ink">{s.name}</h3>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgb(var(--dept-soft))] text-[rgb(var(--dept-deep))] transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"><Icon name="arrow-up-right" size={16} /></span>
      </div>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{s.short}</p>
      {s.facts && (s.facts.time || s.facts.downtime) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-5 text-[12.5px] text-ink/70">
          {s.facts.time && <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgb(var(--c-canvas))] px-2.5 py-1"><Icon name="clock" size={13} />{s.facts.time}</span>}
          {s.facts.downtime && <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgb(var(--c-canvas))] px-2.5 py-1"><Icon name="leaf" size={13} />{x.downtimeLabel}: {s.facts.downtime}</span>}
        </div>
      )}
    </Link>
  );
}

/** Photo-led card for popular treatments on the home page. */
export function PopularCard({ d, g, s, l = "en", i = 0 }: { d: Department; g: ServiceGroup; s: Service; l?: Locale; i?: number }) {
  return (
    <Link href={serviceHref(d, s, l)} data-dept={d.id} className="group relative block overflow-hidden rounded-[26px]" data-rv style={delay((i % 4) * 70)}>
      <Photo k={s.photo ?? g.photo ?? d.photo} className="aspect-[4/5] w-full" w={600} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 80vw" shade />
      <div className="absolute inset-x-0 bottom-0 z-[2] p-4 text-white sm:p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[.14em] text-white/80 max-sm:hidden">{g.name}</div>
        <div className="text-[18px] font-semibold leading-tight tracking-tight sm:mt-1.5 sm:text-[21px]">{s.name}</div>
        <div className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-white/85 sm:text-[14px]">{s.short}</div>
      </div>
    </Link>
  );
}
