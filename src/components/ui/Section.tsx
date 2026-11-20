import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AskAboutChip } from "@/components/ai/AskAboutChip";
import { PageSummary } from "@/components/ai/PageSummary";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { BookRow } from "@/components/ui/BookNow";

/**
 * Page section. `ai` names the section for Biongevity SI and adds the "✦ Ask about this" chip (top-right).
 * Pass `chip={false}` for sections that already are an AI tool.
 */
export function Section({ ai, children, className, id, chip = true }: { ai: string; children: ReactNode; className?: string; id?: string; chip?: boolean }) {
  return (
    <section id={id} data-ai={ai} className={cn("relative z-[1] py-20 sm:py-28", className)}>
      {chip && (/(^|\s)!?pt-(\d|\[)/.test(className ?? "")
        ? <div className="container-x relative z-[3] -mt-2 mb-4 flex justify-end"><AskAboutChip topic={ai} /></div>
        : <div className="pointer-events-none absolute inset-x-0 top-5 z-[3] sm:top-7"><div className="container-x flex justify-end"><AskAboutChip topic={ai} /></div></div>)}
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: string }) {
  return <div className="eyebrow flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-ai-2/60" />{children}</div>;
}

/** Page hero: title, lede, then Book now + WhatsApp on every service page (`book={false}` to leave them out), and the "Summarise this page" AI button. */
export function PageHero({ eyebrow, title, lede, children, ai, summary = true, book = true, whatsapp }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; ai?: string; summary?: boolean; book?: boolean; whatsapp?: string }) {
  return (
    <section data-ai={ai ?? eyebrow} className="relative z-[1] overflow-hidden pb-12 pt-[calc(108px+var(--safe-top))] sm:pb-16 sm:pt-[150px]">
      <div aria-hidden className="dotgrid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_80%_at_80%_20%,#000,transparent)]" />
      <div className="container-x relative">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <SplitReveal as="h1" when="ready" className="h-display mt-5 max-w-[16ch]">{title}</SplitReveal>
        {lede && <Reveal delay={200}><p className="lede mt-6 max-w-[62ch]">{lede}</p></Reveal>}
        {book && <Reveal delay={240}><BookRow className="mt-8" text={whatsapp} /></Reveal>}
        {children && <Reveal delay={280}><div className={book ? "mt-5" : "mt-8"}>{children}</div></Reveal>}
        {summary && <Reveal delay={340}><div className="mt-6"><PageSummary /></div></Reveal>}
      </div>
    </section>
  );
}
