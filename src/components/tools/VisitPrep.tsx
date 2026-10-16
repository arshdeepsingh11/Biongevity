"use client";
import { Fragment, useMemo, useState } from "react";
import { AISurface } from "@/components/ai/AISurface";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { DEPARTMENTS, deptById, scoreDepartments } from "@/data/departments";
import { useXevyoTask } from "@/hooks/useXevyoTask";
import { AIOutput } from "./AIOutput";

const EMPTY = { reason: "", symptoms: "", since: "", meds: "", questions: "", who: "Me" };

/** Visit-prep brief: your notes become a one-page summary to print or save as PDF. Biongevity SI can tidy it (on click). */
export function VisitPrep() {
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const auto = useMemo(() => (f.reason || f.symptoms ? deptById(scoreDepartments(`${f.reason} ${f.symptoms}`)[0]).name : ""), [f.reason, f.symptoms]);
  const [dept, setDept] = useState("");
  const ai = useXevyoTask("AI tools — visit prep");
  const filled = Boolean(f.reason.trim() || f.symptoms.trim());
  const notes = `Visit for: ${f.who}\nService: ${dept || auto || "Not sure"}\nReason: ${f.reason}\nSymptoms: ${f.symptoms}\nSince: ${f.since}\nMedications & supplements: ${f.meds}\nMy questions: ${f.questions}`;
  const field = "mt-1 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-[14px] outline-none focus:border-ai focus:bg-white";

  return (
    <AISurface kicker="Tool 2 · Appointments" title="Prepare for my visit">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="no-print space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[13px] font-medium">For<select value={f.who} onChange={set("who")} className={field}>{["Me", "My parent", "My partner", "My child"].map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="text-[13px] font-medium">Service<select value={dept} onChange={(e) => setDept(e.target.value)} className={field}><option value="">{auto ? `Suggested: ${auto}` : "Not sure"}</option>{DEPARTMENTS.map((d) => <option key={d.id}>{d.name}</option>)}</select></label>
          </div>
          <label className="block text-[13px] font-medium">Main reason for the visit<input value={f.reason} onChange={set("reason")} placeholder="e.g. high blood pressure at home" className={field} /></label>
          <label className="block text-[13px] font-medium">Symptoms<textarea value={f.symptoms} onChange={set("symptoms")} rows={2} placeholder="What, how often, what makes it better or worse" className={field} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[13px] font-medium">Since when<input value={f.since} onChange={set("since")} placeholder="e.g. 3 months" className={field} /></label>
            <label className="text-[13px] font-medium">Medications<input value={f.meds} onChange={set("meds")} placeholder="Names and doses" className={field} /></label>
          </div>
          <label className="block text-[13px] font-medium">Questions for the clinician<textarea value={f.questions} onChange={set("questions")} rows={2} className={field} /></label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button disabled={!filled || ai.busy} onClick={() => ai.run(`Turn my notes into a clear one-page visit brief for a clinician: a 2-sentence summary, a symptom timeline, current medications, and my top questions (add 3 useful questions I may have missed). Keep it factual; do not diagnose.\n\n${notes}`)} className="btn-ai disabled:opacity-40"><Icon name="sparkle" size={16} />Tidy with Biongevity SI</button>
            <button disabled={!filled} onClick={() => print()} className="btn-light disabled:opacity-40"><Icon name="file" size={16} />Print / save PDF</button>
          </div>
          <p className="text-[11px] text-faint">Not stored by this site. Biongevity SI is called only when you press the button.</p>
        </div>
        <div className="print-area rounded-2xl bg-white p-5 text-[13.5px] ring-1 ring-ink/[0.08]">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3"><Logo size={18} /><span className="text-[11px] text-muted">Visit brief · {new Date().toLocaleDateString("en-CA")}</span></div>
          <dl className="mt-3 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2">
            {([["For", f.who], ["Service", dept || auto || "—"], ["Reason", f.reason || "—"], ["Symptoms", f.symptoms || "—"], ["Since", f.since || "—"], ["Medications", f.meds || "—"], ["Questions", f.questions || "—"]] as const).map(([k, v]) => <Fragment key={k}><dt className="font-semibold text-muted">{k}</dt><dd className="whitespace-pre-wrap">{v}</dd></Fragment>)}
          </dl>
          {ai.text && <div className="mt-4 border-t border-ink/10 pt-3"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ai">✦ Summary drafted by Biongevity SI</div><div className="mt-1 whitespace-pre-wrap">{ai.text}</div></div>}
          <p className="mt-4 text-[10.5px] text-muted">Prepared by the patient with Biongevity tools. Education, not a diagnosis.</p>
        </div>
      </div>
      {ai.error && <AIOutput text="" busy={false} error={ai.error} />}
    </AISurface>
  );
}
