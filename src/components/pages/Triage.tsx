"use client";
import { useState } from "react";
import Link from "next/link";
import { useAI } from "@/components/ai/AIProvider";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { Icon } from "@/components/ui/Icon";
import { deptById, scoreDepartments } from "@/data/health";

/** AI starting point — maps a free-text goal to departments (keyword rules + optional live explanation). */
export function Triage() {
  const { explain } = useAI();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ ids: string[]; note: string; live: boolean } | null>(null);
  const run = async () => {
    if (!q.trim()) return;
    setBusy(true);
    const ids = scoreDepartments(q), names = ids.map((i) => deptById(i).name).join(", ");
    const r = await explain(`You are Biongevity AI. A visitor wrote: "${q}". Keyword matching suggests: ${names}. In under 45 words explain why these are reasonable to discuss with a coordinator. No diagnosis.`,
      `Based on the words you used, ${names} ${ids.length > 1 ? "are" : "is"} a reasonable place to start. A coordinator can confirm what fits.`);
    setRes({ ids, note: r.text, live: r.live }); setBusy(false);
  };
  return (
    <div className="relative rounded-4xl bg-surface p-6 shadow-lift sm:p-8">
      <ShineBorder radius={28} />
      <div className="flex items-center gap-2 text-[13px] font-semibold text-violet"><Icon name="sparkle" size={16} />AI starting point</div>
      <div className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">Describe what you want to improve.</div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} aria-label="Your goal"
          placeholder="e.g. I sleep badly and my cholesterol is creeping up" className="h-12 flex-1 rounded-full border border-white/10 bg-canvas px-5 text-[15px] outline-none focus:border-violet focus:bg-surface" />
        <button onClick={run} className="btn-dark h-12 px-6">{busy ? "Thinking…" : "Suggest departments"}</button>
      </div>
      {res && (
        <div className="mt-5 rounded-2xl bg-canvas p-4">
          <div className="flex flex-wrap gap-2">{res.ids.map((id) => { const d = deptById(id); return <Link key={id} href={`/precision-health/${id}/`} className="chip border-transparent bg-ink text-night"><Icon name={d.icon} size={15} />{d.name}</Link>; })}</div>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/80">{res.note}</p>
          <p className="mt-1 text-[11px] text-faint">{res.live ? "Live AI explanation" : "Prepared explanation"} · departments matched by keywords</p>
        </div>
      )}
    </div>
  );
}
