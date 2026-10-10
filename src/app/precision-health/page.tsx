import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Triage } from "@/components/pages/Triage";
import { Icon } from "@/components/ui/Icon";
import { AuroraText } from "@/components/fx/AuroraText";
import { DEPARTMENTS } from "@/data/health";

export const metadata: Metadata = { title: "Precision Health" };

export default function PrecisionHealthPage() {
  return (
    <>
      <PageHero eyebrow="Precision Health" title={<>Care built on <AuroraText>your biology.</AuroraText></>}
        lede="Nine precision disciplines — each combining genomics, microbiome and epigenetic insight with specialist care, all feeding one BioELR record." />
      <Section ai="AI triage" className="!pt-0"><div className="container-x max-w-[900px]"><Triage /></div></Section>
      <Section ai="Departments" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((d, i) => (
            <Link key={d.id} href={`/precision-health/${d.id}/`} data-reveal data-scan className="card group flex flex-col p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-light text-accent transition-colors group-hover:bg-iri group-hover:text-white"><Icon name={d.icon} size={23} /></span>
                <span className="text-[12px] font-semibold text-faint">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-6 text-[20px] font-semibold tracking-tight">{d.name}</div>
              <div className="mt-1 text-[14px] text-accent">{d.tag}</div>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted">{d.summary}</p>
              <div className="flex-1" />
              <div className="mt-5 flex flex-wrap gap-1.5">{d.keywords.slice(0, 3).map((k) => <span key={k} className="rounded-full bg-canvas px-2.5 py-1 text-[12px] text-muted">{k}</span>)}</div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
