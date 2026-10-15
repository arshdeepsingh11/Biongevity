import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { AIBadge } from "@/components/ai/AIBadge";

const CARDS = [
  { href: "/platform/", icon: "fingerprint", k: "For you", t: "Your digital twin", d: "Labs, genome and wearables learned into one model of your healthspan — with Xevyo explaining every change.", cta: "See the platform" },
  { href: "/tools/", icon: "flask", k: "Free tools", t: "AI health tools", d: "Explain lab results, prepare a visit brief, find the right specialist. Nothing stored.", cta: "Try the tools" },
  { href: "/bioelr/", icon: "layers", k: "For clinics", t: "BioELR", d: "The longevity health record with AI built in — for clinics, resorts and communities.", cta: "Configure BioELR" },
];

/** Home section — the three ways Xevyo shows up beyond the chat. */
export function AIEverywhere() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
      {CARDS.map((c, i) => (
        <Link key={c.href} href={c.href} className={`group relative flex flex-col overflow-hidden rounded-[28px] p-6 transition hover:-translate-y-1 ${i === 0 ? "bg-white ai-ring lg:row-span-2" : "card"}`}>
          {i === 0 && <div aria-hidden className="ai-glow -right-16 -top-16 h-56 w-56" />}
          <div className="relative flex items-center justify-between">
            {i === 0 ? <XevyoOrb size={56} live halo /> : <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ai-soft text-ai"><Icon name={c.icon} size={22} weight="duotone" /></span>}
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{c.k}</span>
          </div>
          <div className={`relative mt-5 font-semibold tracking-tight ${i === 0 ? "text-[30px]" : "text-[21px]"}`}>{c.t}</div>
          <p className="relative mt-2 text-[14.5px] leading-relaxed text-muted">{c.d}</p>
          {i === 0 && <div className="relative mt-5 flex flex-wrap gap-2"><AIBadge label="Domain scores" /><AIBadge label="Why this?" /><AIBadge label="Family view" /></div>}
          <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-semibold text-ai">{c.cta}<Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
        </Link>
      ))}
      <a href="/twin/" className="card group flex items-center gap-4 p-5 lg:col-span-2">
        <span className="grid h-12 w-12 place-items-center icon-tile"><Icon name="user" size={22} /></span>
        <span className="flex-1"><span className="block text-[17px] font-semibold">Already a member?</span><span className="block text-[13.5px] text-muted">Take the 3D tour of your Digital Twin, then open it in the Biongevity app.</span></span>
        <span className="btn-dark h-10 px-4 text-[14px]">Open my twin<Icon name="arrow-up-right" size={14} /></span>
      </a>
    </div>
  );
}
