"use client";
import Link from "next/link";
import { HEALTH_PACKAGES } from "@/data/labs";
import { Icon } from "@/components/ui/Icon";
import { ElectricBorder } from "@/components/fx/ElectricBorder";
import { BarList } from "@/components/charts/Charts";
import { AIPanel } from "@/components/ai/AIPanel";
import { formatMoney } from "@/lib/utils";

/** Private health packages — clinic services plus a BioAro lab component, with an AI helper. */
export function HealthPackages() {
  return (
            <div className="space-y-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                <div className="grid gap-4 md:grid-cols-2">
                  {HEALTH_PACKAGES.map((p, k) => {
                    const card = (
                      <div className="flex h-full flex-col rounded-[24px] bg-white p-6 ring-1 ring-ink/[0.06]">
                        <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-iri text-white"><Icon name={p.icon} size={24} weight="duotone" /></span><span className="text-right"><span className="block text-[11px] text-faint">Lab component</span><span className="text-[20px] font-semibold">{formatMoney(p.price)}</span></span></div>
                        <div className="mt-4 text-[19px] font-semibold">{p.t}</div><p className="mt-1 text-[13.5px] text-muted">{p.best}</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">In clinic</div><ul className="mt-1.5 space-y-1">{p.clinic.map((c) => <li key={c} className="flex gap-1.5 text-[13px]"><Icon name="stethoscope" size={14} className="mt-0.5 shrink-0 text-accent" />{c}</li>)}</ul></div>
                          <div><div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-teal">Advanced labs</div><ul className="mt-1.5 space-y-1">{p.labs.map((c) => <li key={c} className="flex gap-1.5 text-[13px]"><Icon name="test-tube" size={14} className="mt-0.5 shrink-0 text-teal" />{c}</li>)}</ul></div>
                        </div>
                        <div className="flex-1" />
                        <div className="mt-4 flex items-start gap-2 rounded-xl bg-canvas p-3 text-[12.5px] text-ink/80"><Icon name="sparkle" size={15} weight="duotone" className="mt-0.5 shrink-0 text-accent" />{p.output}</div>
                        <Link href={`/contact/?interest=${encodeURIComponent(p.t)}`} className="btn-light mt-4 w-full">Request a quote</Link>
                      </div>
                    );
                    return k === 1 ? <ElectricBorder key={p.id} color="#97703F" className="h-full">{card}</ElectricBorder> : <div key={p.id}>{card}</div>;
                  })}
                </div>
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06]"><div className="mb-3 text-[14px] font-semibold">Lab component by package</div><BarList data={HEALTH_PACKAGES.map((p) => ({ label: p.t, value: p.price }))} format={(v) => formatMoney(v)} /><p className="mt-3 text-[11px] text-faint">BioAro list prices. Clinic services are quoted by the care team.</p></div>
                  <AIPanel title="Which package fits me?" prompts={["Compare Executive Health and Longevity Baseline", "Which package suits a family history of heart disease?"]} context="BioAro health packages" />
                </div>
              </div>
            </div>
  );
}
