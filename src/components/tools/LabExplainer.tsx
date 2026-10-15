"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AISurface } from "@/components/ai/AISurface";
import { Icon } from "@/components/ui/Icon";
import { parseLabs, SAMPLE_LABS, type Flag } from "@/data/labRanges";
import { useXevyoTask } from "@/hooks/useXevyoTask";
import { AIOutput } from "./AIOutput";
import { RangeBar } from "@/components/charts/AICharts";
import { BuyButton } from "@/components/commerce/BuyButton";
import { LAB_TESTS } from "@/data/labs";

const TONE: Record<Flag, string> = { low: "bg-warn/10 text-warn", high: "bg-warn/10 text-warn", "in range": "bg-teal-light text-teal", "no range": "bg-canvas text-muted" };

/**
 * Lab-result explainer: paste text → values flagged ON YOUR DEVICE against general adult ranges →
 * "Explain with Xevyo" sends only the parsed values, after consent. Nothing is stored.
 */
export function LabExplainer() {
  const [text, setText] = useState("");
  const [age, setAge] = useState("");
  const [consent, setConsent] = useState(false);
  const rows = useMemo(() => parseLabs(text), [text]);
  const ai = useXevyoTask("AI tools — lab-result explainer");
  // Flagged values that BioAro Labs can re-test (on-device mapping).
  const RETEST: Record<string, string> = { crp: "hs-crp-high-sensitivity-c-reactive-protein", vitd: "vitamin-d-25-hydroxy-d2-d3", egfr: "cystatin-c", creat: "cystatin-c" };
  const retests = [...new Set(rows.filter((p) => p.flag === "low" || p.flag === "high").map((p) => RETEST[p.r.id]).filter(Boolean))].map((h) => LAB_TESTS.find((t) => t.handle === h)).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const summary = rows.map((p) => `${p.r.label}: ${p.value} ${p.unit} (${p.flag}${p.r.low !== undefined || p.r.high !== undefined ? `; general range ${p.r.low ?? "–"}–${p.r.high ?? "–"}` : ""})`).join("\n");

  return (
    <AISurface kicker="Tool 1 · Lab results" title="Explain my lab results">
      <p className="text-[14px] text-muted">Paste results from a lab report or portal. Values are read and flagged <b className="text-ink">on your device</b>. Xevyo explains them only when you ask.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={9} aria-label="Paste your lab results"
            placeholder={"e.g.\nLDL-C 3.9 mmol/L\nHbA1c 5.8 %\nhs-CRP 2.4 mg/L"} className="w-full rounded-2xl border border-ink/10 bg-canvas p-4 font-mono text-[13.5px] outline-none focus:border-ai focus:bg-white" />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px]">
            <button onClick={() => setText(SAMPLE_LABS)} className="chip h-8 border-ink/10 bg-white hover:border-ai/40 hover:text-ai">Try a sample</button>
            {text && <button onClick={() => { setText(""); ai.clear(); }} className="chip h-8 border-ink/10 bg-white hover:text-warn">Clear</button>}
            <label className="ml-auto flex items-center gap-2 text-muted">Age (optional)<input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} inputMode="numeric" className="h-8 w-16 rounded-full border border-ink/10 bg-white px-3 text-ink outline-none focus:border-ai" /></label>
          </div>
        </div>
        <div className="rounded-2xl bg-canvas p-3">
          <div className="flex items-center justify-between px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint"><span>Found on your device</span><span>{rows.length} values</span></div>
          {rows.length ? (
            <ul className="space-y-1.5">
              {rows.map((p) => (
                <li key={p.r.id} className="rounded-xl bg-white px-3 py-2 ring-1 ring-ink/[0.05]">
                  <div className="flex items-center gap-2"><span className="flex-1 text-[14px] font-semibold">{p.r.label}</span><span className="tabular-nums text-[14px]">{p.value} <span className="text-[11px] text-muted">{p.unit}</span></span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE[p.flag]}`}>{p.flag}</span></div>
                  {(p.r.low !== undefined || p.r.high !== undefined) && <RangeBar value={p.value} low={p.r.low} high={p.r.high} />}
                  <div className="mt-1.5 text-[11.5px] leading-snug text-muted">{p.r.note}</div>
                </li>
              ))}
            </ul>
          ) : <div className="grid h-40 place-items-center text-center text-[13px] text-faint">Paste results — LDL, HDL, ApoB, Lp(a), HbA1c, glucose, hs-CRP, vitamin D, ferritin, B12, TSH, eGFR, creatinine, ALT, uric acid, homocysteine…</div>}
        </div>
      </div>
      <label className="mt-4 flex items-start gap-2.5 text-[12.5px] text-muted">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[rgb(var(--c-ai))]" />
        I agree to send these values (not my name) to Xevyo AI for an explanation. The site does not store them.
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={!rows.length || !consent || ai.busy} onClick={() => ai.run(`Explain these lab results in plain words for ${age ? `a ${age}-year-old adult` : "an adult"}. For each: what it measures, what this value may mean, and what lifestyle factors influence it. Then list 3 questions to ask my clinician. Do not diagnose.\n\n${summary}`)}
          className="btn-ai disabled:opacity-40"><Icon name="sparkle" size={16} />Explain with Xevyo</button>
        <Link href="/contact/?interest=Not%20sure%20yet" className="btn-light">Review with a clinician</Link>
      </div>
      <AIOutput {...ai} />
      <p className="mt-3 text-[11px] text-faint">General adult ranges for education. Your lab&apos;s printed range and your clinician&apos;s interpretation come first.</p>
    </AISurface>
  );
}
