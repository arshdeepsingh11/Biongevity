import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Triage } from "@/components/pages/Triage";
import { Icon } from "@/components/ui/Icon";
import { AuroraText } from "@/components/fx/AuroraText";
import { DEPARTMENTS, DEPT_GROUPS } from "@/data/departments";
import { DisciplineExplorer } from "@/components/home/DisciplineExplorer";
import { JsonLd, breadcrumb } from "@/lib/seo";
import { DeptBeam } from "@/components/fx3d/Showcases";

export const metadata: Metadata = {
  title: "Precision Health — cardiology, endocrinology, internal medicine, genomics",
  description: "Fourteen departments — from cardiology with onsite exercise stress echo to endocrinology, respiratory, geriatrics, nutrition and skin — plus BioAro Labs testing and BioAro Drugs protocols.",
  alternates: { canonical: "/precision-health/" },
};

export default function PrecisionHealthPage() {
  const card = (d: (typeof DEPARTMENTS)[number]) => (
    <Link key={d.id} href={`/precision-health/${d.id}/`} data-reveal className="card group flex flex-col p-6 hover:-translate-y-1">
      <span className="grid h-12 w-12 place-items-center icon-tile transition-colors group-hover:bg-iri group-hover:text-white"><Icon name={d.icon} size={26} weight="duotone" /></span>
      <div className="mt-5 text-[20px] font-semibold tracking-tight">{d.name}</div>
      <div className="mt-1 text-[14px] text-accent">{d.tag}</div>
      <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted">{d.summary}</p>
      <div className="flex-1" />
      <div className="mt-5 flex items-center justify-between text-[12px] text-faint"><span>{d.areas.length} areas · {d.services.length} services</span><Icon name="arrow-right" size={15} className="text-accent" /></div>
    </Link>
  );
  return (
    <>
      <JsonLd data={breadcrumb([["Precision Health", "/precision-health/"]])} />
      <PageHero eyebrow="Precision Health" title={<>Care built on <AuroraText>your biology.</AuroraText></>}
        lede={`${DEPARTMENTS.length} departments, onsite diagnostics and BioAro testing — every result connected in one record and explained by AI.`} />
      <Section ai="Find a department" className="!pt-0"><div className="container-x max-w-[900px]"><Triage /></div></Section>
      <Section ai="Evidence" className="!pt-0"><div className="container-x"><h2 className="text-[28px] font-semibold tracking-tight">Why each department matters</h2><p className="mt-1 text-[15px] text-muted">Hover a department for the evidence behind it.</p><div className="mt-6"><DisciplineExplorer /></div></div></Section>
      {DEPT_GROUPS.map((g) => (
        <Section key={g} ai={g} className="!pt-0">
          <div className="container-x"><h2 className="text-[28px] font-semibold tracking-tight">{g}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{DEPARTMENTS.filter((d) => d.group === g).map(card)}</div></div>
        </Section>
      ))}
      <Section ai="BioAro" className="!pt-0">
        <div className="container-x"><h2 className="text-[28px] font-semibold tracking-tight">BioAro testing & protocols</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[["/precision-health/bioaro-labs/", "test-tubes", "BioAro Labs", "47 advanced tests — genome, microbiome, hormones, inflammation and brain — connected by AI."], ["/precision-health/bioaro-drugs/", "tablets", "BioAro Drugs", "AI-guided bioactive protocols with every ingredient and dose shown."]].map(([h, i, t, x]) => (
              <Link key={h} href={h} className="group flex items-center gap-5 rounded-[28px] bg-navy p-6 transition-transform hover:-translate-y-0.5">
                <span className="grid h-16 w-16 shrink-0 place-items-center icon-tile"><Icon name={i} size={32} weight="duotone" /></span>
                <span className="flex-1"><span className="block text-[22px] font-semibold">{t}</span><span className="block text-[14px] text-muted">{x}</span></span>
                <Icon name="arrow-right" size={20} className="text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
