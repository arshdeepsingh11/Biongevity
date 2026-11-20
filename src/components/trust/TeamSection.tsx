import { CARE_ROLES, CREDENTIALS, teamFor, type Doctor } from "@/data/team";
import { DEPARTMENTS } from "@/data/departments";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const initials = (name: string) => name.replace(/^Dr\.?\s+/i, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join("");

export function DoctorCard({ d, compact }: { d: Doctor; compact?: boolean }) {
  return (
    <article className={cn("card flex h-full gap-5 p-6", compact ? "items-center" : "flex-col sm:flex-row sm:items-start")}>
      {d.photo
        ? <img src={d.photo} alt={d.name} loading="lazy" className={cn("shrink-0 rounded-[22px] object-cover", compact ? "h-16 w-16" : "h-24 w-24 sm:h-28 sm:w-28")} />
        : <span className={cn("icon-tile shrink-0 text-[20px] font-semibold tracking-tight", compact ? "h-16 w-16" : "h-24 w-24 text-[26px] sm:h-28 sm:w-28")} aria-hidden>{initials(d.name)}</span>}
      <div className="min-w-0 flex-1">
        <h3 className="text-[19px] font-semibold tracking-tight">{d.name}</h3>
        <div className="mt-0.5 text-[14px] font-medium text-accent">{d.role}</div>
        <ul className="mt-2 flex flex-wrap gap-1.5">{d.credentials.map((c) => <li key={c} className="rounded-full bg-accent-light px-2.5 py-0.5 text-[11.5px] font-semibold text-accent">{c}</li>)}</ul>
        {!compact && <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{d.bio}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-faint">
          <span className="flex items-center gap-1"><Icon name="pin" size={13} />{d.locations.join(" · ")}</span>
          {!compact && d.depts.length > 0 && <span className="flex items-center gap-1"><Icon name="stethoscope" size={13} />{d.depts.map((id) => DEPARTMENTS.find((x) => x.id === id)?.short ?? id).join(", ")}</span>}
          {d.linkedin && <a href={d.linkedin} target="_blank" rel="noopener" className="font-semibold text-accent hover:underline">LinkedIn ↗</a>}
        </div>
      </div>
    </article>
  );
}

/**
 * "Your care team": named doctors for the department (or the whole clinic), the specialist role the department
 * describes, and the roles every patient meets. Grows automatically as profiles are added to src/data/team.ts.
 */
export function TeamSection({ dept, title = "Your care team", lede, className }: { dept?: string; title?: string; lede?: string; className?: string }) {
  const doctors = teamFor(dept);
  const specialist = dept ? DEPARTMENTS.find((d) => d.id === dept)?.specialist : undefined;
  return (
    <div className={className}>
      <Reveal><div className="eyebrow flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-ai-2/60" />Doctors &amp; team</div></Reveal>
      <Reveal delay={60}><h2 className="h-section mt-4 text-balance">{title}</h2></Reveal>
      {lede && <Reveal delay={120}><p className="lede mt-4 max-w-[62ch]">{lede}</p></Reveal>}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {doctors.map((d, i) => <Reveal key={d.id} delay={i * 80} className="h-full"><DoctorCard d={d} /></Reveal>)}
        {specialist && (
          <Reveal delay={doctors.length * 80} className="h-full">
            <article className="card flex h-full flex-col p-6 sm:flex-row sm:items-start sm:gap-5">
              <span className="icon-tile h-16 w-16 shrink-0"><Icon name="stethoscope" size={28} /></span>
              <div className="mt-4 sm:mt-0"><h3 className="text-[19px] font-semibold tracking-tight">{specialist.role}</h3><p className="mt-2 text-[14.5px] leading-relaxed text-muted">{specialist.bio}</p></div>
            </article>
          </Reveal>
        )}
        <Reveal delay={(doctors.length + 1) * 80} className={cn("h-full", (doctors.length + (specialist ? 1 : 0)) % 2 === 0 && "lg:col-span-2")}>
          <div className="card h-full p-6">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Who you&apos;ll meet</div>
            <ul className={cn("mt-4 grid gap-4", (doctors.length + (specialist ? 1 : 0)) % 2 === 0 && "sm:grid-cols-3")}>
              {CARE_ROLES.map((r) => <li key={r.t} className="flex gap-3"><span className="icon-tile h-10 w-10 shrink-0"><Icon name={r.icon} size={18} /></span><span><span className="block text-[15px] font-semibold">{r.t}</span><span className="block text-[13.5px] leading-snug text-muted">{r.d}</span></span></li>)}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/** Proof strip: the facts that build trust, as four tiles. */
export function Credentials({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4", className)}>
      {CREDENTIALS.map((c, i) => (
        <Reveal key={c.t} delay={i * 70} as="li" className="h-full">
          <div className="card flex h-full gap-4 p-5">
            <span className="icon-tile h-11 w-11 shrink-0"><Icon name={c.icon} size={20} /></span>
            <span><span className="block text-[15px] font-semibold leading-snug">{c.t}</span><span className="mt-1 block text-[13px] leading-snug text-muted">{c.d}</span></span>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
