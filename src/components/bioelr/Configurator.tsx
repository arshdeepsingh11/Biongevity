"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AISurface } from "@/components/ai/AISurface";
import { Icon } from "@/components/ui/Icon";
import { BIOELR_MODULES, ORG_TYPES, SPECIALTIES, type ModuleGroup } from "@/data/bioelr";
import { useXevyoTask } from "@/hooks/useXevyoTask";
import { AIOutput } from "@/components/tools/AIOutput";

/** Specialty → modules that usually go with it (on-device suggestion; the team confirms scope). */
const SUGGEST: Record<string, string[]> = {
  Longevity: ["patient", "progress", "genomic", "virtual"], Cardiology: ["cardiac", "reminders"], Dermatology: ["derma", "inventory"],
  Dental: ["dental"], "Internal medicine": ["meds", "intake"], Endocrinology: ["meds", "progress"], "Women's health": ["intake", "virtual"], "Mental health": ["virtual", "booking"],
};

/** Clinic configurator — pick organisation, specialties and modules; see a setup summary; request a proposal (prefilled contact form). */
export function Configurator() {
  const [org, setOrg] = useState(ORG_TYPES[0]);
  const [sites, setSites] = useState(1);
  const [specs, setSpecs] = useState<string[]>(["Longevity"]);
  const [mods, setMods] = useState<string[]>(["clinic", "schedule", "patient", "booking"]);
  const ai = useXevyoTask("BioELR — clinic configurator");

  const suggested = useMemo(() => [...new Set(specs.flatMap((s) => SUGGEST[s] ?? []))].filter((m) => !mods.includes(m)), [specs, mods]);
  const toggle = (xs: string[], x: string) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);
  const chosen = BIOELR_MODULES.filter((m) => mods.includes(m.id) || (sites > 1 && m.id === "multi"));
  const plan = `BioELR proposal request\nOrganisation: ${org}\nSites: ${sites}\nSpecialties: ${specs.join(", ") || "—"}\nModules: ${chosen.map((m) => m.t).join(", ")}`;

  const groups: ModuleGroup[] = ["Operations", "Specialty", "Patient"];
  return (
    <AISurface kicker="Configure BioELR" title="Build your setup in a minute">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div>
            <div className="text-[13px] font-semibold">Organisation</div>
            <div className="mt-2 flex flex-wrap gap-2">{ORG_TYPES.map((o) => <button key={o} onClick={() => setOrg(o)} aria-pressed={org === o} className={`chip h-9 ${org === o ? "border-accent bg-accent text-on-accent" : "border-ink/10 bg-white hover:border-accent/40"}`}>{o}</button>)}</div>
          </div>
          <label className="block">
            <span className="flex justify-between text-[13px] font-semibold"><span>Sites</span><span className="tabular-nums text-accent">{sites}{sites >= 20 ? "+" : ""}</span></span>
            <input type="range" min={1} max={20} value={sites} onChange={(e) => setSites(Number(e.target.value))} className="mt-2 w-full accent-accent" aria-label="Number of sites" />
          </label>
          <div>
            <div className="text-[13px] font-semibold">Specialties</div>
            <div className="mt-2 flex flex-wrap gap-2">{SPECIALTIES.map((s) => <button key={s} onClick={() => setSpecs(toggle(specs, s))} aria-pressed={specs.includes(s)} className={`chip h-9 ${specs.includes(s) ? "border-accent bg-accent-light text-accent" : "border-ink/10 bg-white hover:border-accent/40"}`}>{specs.includes(s) && <Icon name="check" size={14} />}{s}</button>)}</div>
          </div>
          {groups.map((g) => (
            <div key={g}>
              <div className="text-[13px] font-semibold">{g} modules</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {BIOELR_MODULES.filter((m) => m.group === g).map((m) => {
                  const on = mods.includes(m.id) || (sites > 1 && m.id === "multi"), sug = suggested.includes(m.id);
                  return (
                    <button key={m.id} onClick={() => setMods(toggle(mods, m.id))} aria-pressed={on} className={`flex items-start gap-2.5 rounded-xl p-2.5 text-left ring-1 transition ${on ? "bg-accent-light ring-accent/40" : "bg-white ring-ink/[0.07] hover:ring-accent/30"}`}>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${on ? "bg-accent text-on-accent" : "bg-canvas text-accent"}`}><Icon name={on ? "check" : m.icon} size={16} /></span>
                      <span className="min-w-0"><span className="block text-[13.5px] font-semibold">{m.t}{sug && <span className="ml-1.5 rounded-full bg-ai-soft px-1.5 py-0.5 text-[10px] text-ai">✦ suggested</span>}</span><span className="block text-[12px] leading-snug text-muted">{m.d}</span></span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-canvas p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Your setup</div>
            <div className="mt-2 text-[20px] font-semibold tracking-tight">{org} · {sites} site{sites > 1 ? "s" : ""}</div>
            <div className="mt-1 text-[13px] text-muted">{specs.join(" · ") || "No specialty yet"}</div>
            <ul className="mt-3 space-y-1">{chosen.map((m) => <li key={m.id} className="flex items-center gap-2 text-[13.5px]"><Icon name="check" size={14} className="text-teal" />{m.t}</li>)}</ul>
            <div className="mt-3 rounded-xl bg-white p-3 text-[12px] text-muted">Always included: Biongevity SI layer, HL7 integration, SNOMED CT / ICD coding, wearable and IoT data, analytics.</div>
            <div className="mt-4 grid gap-2">
              <Link href={`/contact/?interest=${encodeURIComponent("BioELR proposal")}&plan=${encodeURIComponent(plan)}`} className="btn-dark h-11"><Icon name="file" size={16} />Request proposal</Link>
              <button disabled={ai.busy} onClick={() => ai.run(`We are a ${org} with ${sites} site(s), specialties: ${specs.join(", ")}. Selected BioELR modules: ${chosen.map((m) => m.t).join(", ")}. In plain words: how would this setup help our team and patients, what should we roll out first, and what questions should we ask in a demo? Avoid compliance or outcome guarantees.`)}
                className="btn-ai h-11 disabled:opacity-50"><Icon name="sparkle" size={16} />Review my setup with Xevyo</button>
            </div>
          </div>
          <AIOutput {...ai} />
        </div>
      </div>
    </AISurface>
  );
}
