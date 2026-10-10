"use client";
import { useState } from "react";
import { useAI } from "@/components/ai/AIProvider";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { Icon } from "@/components/ui/Icon";
import { ARTICLES, JOURNAL_CATEGORIES } from "@/data/journal";

export function JournalList() {
  const { ask } = useAI();
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const list = ARTICLES.filter((a) => cat === "All" || a.cat === cat);
  return (
    <>
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="tablist">
        {JOURNAL_CATEGORIES.map((c) => <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`chip shrink-0 ${cat === c ? "border-ink bg-ink text-night" : "border-white/10 bg-surface"}`}>{c}</button>)}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <article key={a.slug} data-reveal data-scan className="card flex flex-col overflow-hidden">
            <MediaSlot id={`journal-${a.slug}`} className="aspect-[16/10]" rounded="rounded-none" />
            <div className="flex flex-1 flex-col p-6">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-violet">{a.cat} · {a.min} min</div>
              <h3 className="mt-2 text-[20px] font-semibold leading-snug tracking-tight">{a.t}</h3>
              <div className="text-[12px] text-faint">{a.source === "BioAro Drugs Science" ? "BioAro Drugs Science" : "Sample editorial · not yet published"}</div>
              {open === a.slug && <ul className="mt-4 space-y-1.5 rounded-2xl bg-canvas p-4 text-[14px]">{a.sum.map((s) => <li key={s}>· {s}</li>)}</ul>}
              <div className="flex-1" />
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => setOpen(open === a.slug ? null : a.slug)} className="chip border-white/10 bg-surface">{open === a.slug ? "Hide key points" : "Key points"}</button>
                <button onClick={() => ask(`Explain "${a.t}" simply`)} className="chip border-white/10 bg-surface"><Icon name="sparkle" size={14} className="text-violet" />Ask AI</button>
                {a.url && <a href={a.url} target="_blank" rel="noopener" className="chip border-white/10 bg-surface">Read<Icon name="external" size={12} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
