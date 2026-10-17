"use client";
import { BOOK_URL } from "@/lib/env";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AISurface } from "@/components/ai/AISurface";
import { Icon } from "@/components/ui/Icon";
import { matchIntent } from "@/lib/intent";
import { deptById, scoreDepartments } from "@/data/departments";
import { useXevyoTask } from "@/hooks/useXevyoTask";
import { AIOutput } from "./AIOutput";

const EXAMPLES = ["Tired, gaining weight, poor sleep", "My mother keeps forgetting things", "Chest tightness when climbing stairs", "Bloating and reflux after meals"];

/** Specialist router: on-device department + test match as you type; Biongevity SI explains "why" on click. */
export function SpecialistRouter() {
  const [q, setQ] = useState("");
  const depts = useMemo(() => (q.trim().length > 3 ? scoreDepartments(q).map(deptById) : []), [q]);
  const tests = useMemo(() => matchIntent(q)?.tests ?? [], [q]);
  const ai = useXevyoTask("AI tools — specialist router");

  return (
    <AISurface kicker="Tool 3 · Find the right care" title="Which specialist should I see?">
      <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={3} aria-label="Describe the problem" placeholder="Describe what's going on, in your own words…"
        className="w-full rounded-2xl border border-ink/10 bg-canvas p-4 text-[15px] outline-none focus:border-ai focus:bg-white" />
      <div className="mt-2 flex flex-wrap gap-2">{EXAMPLES.map((e) => <button key={e} onClick={() => setQ(e)} className="chip h-8 border-ink/10 bg-white text-[12.5px] hover:border-ai/40 hover:text-ai">{e}</button>)}</div>
      {depts.length > 0 && (
        <div className="mt-4 grid gap-3 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-2">
            {depts.map((d, i) => (
              <Link key={d.id} href={`/precision-health/${d.id}/`} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/[0.07] hover:ring-ai/35">
                <span className="grid h-10 w-10 place-items-center icon-tile"><Icon name={d.icon} size={19} weight="duotone" /></span>
                <span className="min-w-0 flex-1"><span className="block text-[14.5px] font-semibold">{d.name}{i === 0 && <span className="ml-2 rounded-full bg-ai-soft px-2 py-0.5 text-[10.5px] text-ai">best match</span>}</span><span className="block truncate text-[12.5px] text-muted">{d.tag}</span></span>
                <Icon name="arrow-right" size={15} className="text-faint" />
              </Link>
            ))}
          </div>
          <div className="rounded-2xl bg-canvas p-3">
            <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Tests that may help</div>
            {tests.length ? tests.map(({ x }) => <a key={x.handle} href={x.url} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-[13px] hover:bg-white"><Icon name={x.icon} size={16} className="text-accent" /><span className="flex-1 truncate">{x.title}</span><span className="text-muted">${x.price}</span></a>)
              : <div className="px-1 text-[12.5px] text-muted">A clinician will suggest tests after your first visit.</div>}
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button disabled={!depts.length || ai.busy} onClick={() => ai.run(`I described: "${q}". Our on-device router suggested: ${depts.map((d) => d.name).join(", ")}. In plain words, explain why these services fit, what a first visit might involve, and any warning signs that need urgent care instead. Do not diagnose.`)} className="btn-ai disabled:opacity-40"><Icon name="sparkle" size={16} />Why these? Ask Biongevity SI</button>
        {depts[0] && <a href={BOOK_URL} target="_blank" rel="noopener" className="btn-light">Book {depts[0].short}</a>}
      </div>
      <AIOutput {...ai} />
      <p className="mt-3 text-[11px] text-faint">Matching runs on your device. Chest pain, stroke signs or severe breathlessness: call 911.</p>
    </AISurface>
  );
}
