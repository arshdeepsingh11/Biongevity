"use client";
import { useState } from "react";
import Link from "next/link";
import { ScrollSphereGallery } from "@/components/fx/ScrollSphereGallery";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { LAB_AREAS, LAB_TESTS } from "@/data/labs";
import { formatMoney } from "@/lib/utils";

/** 3D test sphere + live detail card for the selected test area. */
export function LabsExplorer() {
  const { ask } = useAI();
  const [sel, setSel] = useState(LAB_AREAS[0].id);
  const a = LAB_AREAS.find((x) => x.id === sel) ?? LAB_AREAS[0];
  const count = LAB_TESTS.filter((t) => t.category === a.id).length;
  const cards = [...LAB_AREAS, ...LAB_AREAS, ...LAB_AREAS.slice(0, 4)].map((x, i) => ({ id: x.id, k: x.k, name: i < 6 ? x.name : `${x.k} tests`, icon: x.icon, sub: x.explores }));
  return (
    <>
      <section data-ai="Test sphere" className="relative z-[1]"><ScrollSphereGallery cards={cards} active={sel} onSelect={setSel} /></section>
      <section data-ai="Test details" className="relative z-[1] pb-16">
        <div className="container-x max-w-[960px]">
          <div data-reveal className="relative rounded-4xl bg-white p-6 shadow-lift sm:p-8">
            <ShineBorder radius={28} />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-iri text-white"><Icon name={a.icon} size={24} /></span>
                <div><div className="text-[24px] font-semibold tracking-tight">{a.name}</div><div className="text-[14px] text-muted">{a.explores}</div></div>
              </div>
              <button onClick={() => ask(`What does ${a.name} measure and not establish?`)} className="chip border-black/10 bg-canvas"><Icon name="sparkle" size={15} className="text-violet" />Ask AI about this test</button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[["Sample", a.sample], ["What it can show", a.shows], ["What it doesn't establish", a.not]].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-canvas p-4"><div className="text-[12px] font-semibold uppercase tracking-wider text-faint">{k}</div><div className="mt-1.5 text-[14px] leading-relaxed">{v}</div></div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[14px] text-muted">{count} tests · from <span className="font-semibold text-ink">{formatMoney(a.from)}</span></div>
              <Link href={`/labs/tests/?c=${a.id}`} className="btn-dark">Shop {a.k.toLowerCase()} tests<Icon name="arrow-right" size={15} /></Link>
            </div>
            <div className="mt-3 text-[11px] text-faint">Source: bioarolabs.com. Sample details to confirm with BioAro Labs.</div>
          </div>
        </div>
      </section>
    </>
  );
}
