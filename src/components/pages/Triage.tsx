"use client";
import { useState } from "react";
import Link from "next/link";
import { useAI } from "@/components/ai/AIProvider";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { Icon } from "@/components/ui/Icon";
import { deptById, scoreDepartments } from "@/data/health";

/** Starting point — keyword match from your words to departments; follow-up questions go to Xevyo. */
export function Triage() {
  const { ask } = useAI();
  const [q, setQ] = useState("");
  const [ids, setIds] = useState<string[] | null>(null);
  const run = () => { if (q.trim()) setIds(scoreDepartments(q)); };
  return (
    <div className="relative rounded-4xl bg-surface p-6 shadow-lift sm:p-8">
      <ShineBorder radius={28} />
      <div className="flex items-center gap-2 text-[13px] font-semibold text-accent"><Icon name="search" size={16} />Find your starting point</div>
      <div className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">Describe what you want to improve.</div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} aria-label="Your goal"
          placeholder="e.g. I sleep badly and my cholesterol is creeping up" className="h-12 flex-1 rounded-full border border-ink/10 bg-canvas px-5 text-[15px] outline-none focus:border-accent focus:bg-surface" />
        <button onClick={run} className="btn-dark h-12 px-6">Match departments</button>
      </div>
      {ids && (
        <div className="mt-5 rounded-2xl bg-canvas p-4">
          <div className="flex flex-wrap gap-2">{ids.map((id) => { const d = deptById(id); return <Link key={id} href={`/precision-health/${id}/`} className="chip border-transparent bg-navy text-white"><Icon name={d.icon} size={15} />{d.name}</Link>; })}</div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[12px] text-faint">Matched by the words you used · a coordinator confirms what fits · not a diagnosis</p>
            <button onClick={() => ask(`I wrote: "${q}". Which Biongevity departments should I consider and why?`)} className="text-[13px] font-semibold text-accent">Ask Xevyo why →</button>
          </div>
        </div>
      )}
    </div>
  );
}
