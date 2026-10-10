import { MEDIA } from "@/config/media";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

/** Video / image slot. Shows a labelled placeholder until a src is set in src/config/media.ts. */
export function MediaSlot({ id, className, rounded = "rounded-4xl" }: { id: keyof typeof MEDIA | string; className?: string; rounded?: string }) {
  const m = MEDIA[id] ?? { label: id };
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-accent-light via-white to-[#ECFEFF]", rounded, className)}>
      {m.video ? <video className="absolute inset-0 h-full w-full object-cover" src={m.video} poster={m.poster} autoPlay muted loop playsInline />
        : m.image ? <img className="absolute inset-0 h-full w-full object-cover" src={m.image} alt={m.label} loading="lazy" />
        : (
          <div className="absolute inset-0 grid place-items-center p-4 text-center">
            <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(37,99,235,.18)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="relative">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-surface text-violet shadow-card"><Icon name="play" size={18} /></span>
              <div className="mt-2 text-[13px] font-semibold text-ink/70">{m.label}</div>
              <div className="text-[11px] text-faint">Media slot · {String(id)}</div>
            </div>
          </div>
        )}
    </div>
  );
}
