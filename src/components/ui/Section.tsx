import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DecodeText } from "@/components/fx/DecodeText";

export function Section({ ai, children, className, id }: { ai: string; children: ReactNode; className?: string; id?: string }) {
  return <section id={id} data-ai={ai} className={cn("relative z-[1] py-16 sm:py-24", className)}>{children}</section>;
}

export function Eyebrow({ children }: { children: string }) {
  return <div className="eyebrow"><DecodeText text={children} /></div>;
}

export function PageHero({ eyebrow, title, lede, children, ai }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; ai?: string }) {
  return (
    <section data-ai={ai ?? eyebrow} className="relative z-[1] overflow-hidden pb-10 pt-[calc(108px+var(--safe-top))] sm:pb-14 sm:pt-[150px]">
      <div aria-hidden data-ai-fx className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-iri opacity-[0.10] blur-[110px]" />
      <div className="container-x relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 data-reveal className="h-display mt-4 max-w-[16ch]">{title}</h1>
        {lede && <p data-reveal className="lede mt-5 max-w-[62ch]">{lede}</p>}
        {children && <div data-reveal className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
