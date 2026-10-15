"use client";
import { useState } from "react";
import { BodyHologram } from "@/components/body/BodyHologram";
import { DEPT_ORGAN } from "@/components/home/DeptIntelligence";
import { ORGANS, organById } from "@/lib/body";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";

/** Department hero visual — the 3D body focused on the part this specialty looks after, plus tappable symptoms. */
export function DeptBody({ dept, name, signs }: { dept: string; name: string; signs: string[] }) {
  const { ask } = useAI();
  const home = DEPT_ORGAN[dept] ?? "heart";
  const [sel, setSel] = useState<string>(home);
  const related = ORGANS.filter((o) => o.id === home || o.depts.includes(dept)).map((o) => o.id);
  const o = organById(sel);
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white ring-1 ring-ink/[0.07]">
      <div className="absolute left-4 top-4 z-[4] max-w-[220px] rounded-2xl bg-white/85 px-3 py-2 ring-1 ring-ink/[0.06] backdrop-blur-md">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ai">✦ {name} focus</div>
        <div className="text-[15px] font-semibold">{o?.label}</div>
        <div className="text-[11.5px] leading-snug text-muted">{o?.plain}</div>
      </div>
      <BodyHologram height={500} selected={sel} onSelect={setSel} hotspots={related.map((id) => ({ id, tone: id === sel ? "focus" : "neutral" }))} />
      {signs.length > 0 && (
        <div className="border-t border-ink/[0.06] p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint"><XevyoOrb size={18} />Symptoms we assess · tap to ask</div>
          <div className="flex flex-wrap gap-1.5">
            {signs.slice(0, 8).map((sg) => <button key={sg} onClick={() => ask(`I have "${sg}". When should I see ${name}, and what would a first visit involve? Not a diagnosis.`, { label: `✦ ${sg}` })} className="rounded-full bg-canvas px-3 py-1.5 text-[12.5px] font-medium hover:bg-ai-soft hover:text-ai">{sg}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}
