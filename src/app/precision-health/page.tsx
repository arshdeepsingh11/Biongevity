import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Triage } from "@/components/pages/Triage";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS } from "@/data/health";

export const metadata: Metadata = { title: "Precision Health" };

export default function PrecisionHealthPage() {
  return (
    <>
      <PageHero eyebrow="Precision Health" title="Comprehensive evaluations of your overall health."
        lede="Internal medicine, geriatric medicine, cardiology, kinesiology, dietology, neurology, mental health and more, all contributing to one BioELR record." />
      <Section ai="AI triage" className="!pt-0"><div className="container-x max-w-[900px]"><Triage /></div></Section>
      <Section ai="Departments" className="!pt-0">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((d, i) => (
            <Link key={d.id} href={`/precision-health/${d.id}/`} data-reveal data-scan className="card group p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-canvas transition-colors group-hover:bg-iri group-hover:text-white"><Icon name={d.icon} size={23} /></span>
                <span className="text-[12px] font-semibold text-faint">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-6 text-[20px] font-semibold tracking-tight">{d.name}</div>
              <div className="mt-1 text-[14px] text-muted">{d.tag}</div>
              <div className="mt-5 flex items-center gap-1 text-[13px] font-semibold text-violet opacity-0 transition-opacity group-hover:opacity-100">Explore<Icon name="arrow-right" size={13} /></div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
