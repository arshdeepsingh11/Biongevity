import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DecodeText } from "@/components/fx/DecodeText";
import { AskAboutChip } from "@/components/ai/AskAboutChip";
import { PageSummary } from "@/components/ai/PageSummary";

/**
 * Page section. `ai` names the section for Xevyo and adds the "✦ Ask about this" chip (top-right).
 * Pass `chip={false}` for sections that already are an AI tool.
 */
export function Section({ ai, children, className, id, chip = true }: { ai: string; children: ReactNode; className?: string; id?: string; chip?: boolean }) {
  return (
    <section id={id} data-ai={ai} className={cn("relative z-[1] py-16 sm:py-24", className)}>
      {chip && (/(^|\s)!?pt-(\d|\[)/.test(className ?? "")
        ? <div className="container-x relative z-[3] -mt-2 mb-4 flex justify-end"><AskAboutChip topic={ai} /></div>
        : <div className="pointer-events-none absolute inset-x-0 top-4 z-[3] sm:top-6"><div className="container-x flex justify-end"><AskAboutChip topic={ai} /></div></div>)}
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: string }) {
  return <div className="eyebrow"><DecodeText text={children} /></div>;
}

/** Page hero with the "Summarise this page" AI button on every inner page. */
export function PageHero({ eyebrow, title, lede, children, ai, summary = true }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; ai?: string; summary?: boolean }) {
  return (
    <section data-ai={ai ?? eyebrow} className="relative z-[1] overflow-hidden pb-10 pt-[calc(108px+var(--safe-top))] sm:pb-14 sm:pt-[150px]">
      <div aria-hidden data-ai-fx className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-iri opacity-[0.10] blur-[110px]" />
      <div className="container-x relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 data-reveal className="h-display mt-4 max-w-[16ch]">{title}</h1>
        {lede && <p data-reveal className="lede mt-5 max-w-[62ch]">{lede}</p>}
        {children && <div data-reveal className="mt-8">{children}</div>}
        {summary && <div data-reveal className="mt-6"><PageSummary /></div>}
      </div>
    </section>
  );
}
