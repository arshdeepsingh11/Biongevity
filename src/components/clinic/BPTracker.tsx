"use client";
import { useState } from "react";
import { LineChart } from "@/components/charts/Charts";

const DAYS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
const SEED: [number, number][] = [[142, 90], [138, 88], [136, 86], [134, 85], [133, 84], [131, 83], [130, 82]];

/**
 * 7-day home blood-pressure log (Hypertension Canada protocol): day 1 is discarded, days 2–7 are averaged
 * and compared with the 135/85 mmHg home threshold. Stays in the browser.
 */
export function BPTracker() {
  const [rows, setRows] = useState(SEED);
  const set = (i: number, k: 0 | 1, v: number) => setRows(rows.map((r, j) => (j === i ? (k ? [r[0], v] : [v, r[1]]) as [number, number] : r)));
  const use = rows.slice(1), avg = (k: 0 | 1) => Math.round(use.reduce((s, r) => s + r[k], 0) / use.length);
  const sys = avg(0), dia = avg(1), high = sys >= 135 || dia >= 85;
  return (
    <div className="grid gap-5 rounded-[28px] bg-white p-5 shadow-card ring-1 ring-ink/[0.06] sm:p-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="text-[15px] font-semibold">Your 7-day log</div>
        <LineChart labels={DAYS} unit=" mmHg" min={60} max={170} refLine={{ value: 135, label: "135 home threshold" }}
          series={[{ name: "Systolic", values: rows.map((r) => r[0]) }, { name: "Diastolic", values: rows.map((r) => r[1]), color: "rgb(var(--c-teal))" }]} />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-2 gap-y-1.5 text-[13px]">
          <span /><span className="text-center text-[11px] font-semibold text-faint">SYS</span><span className="text-center text-[11px] font-semibold text-faint">DIA</span>
          {rows.map((r, i) => [
            <span key={`l${i}`} className={`text-[12px] font-semibold ${i ? "" : "text-faint line-through"}`}>{DAYS[i]}</span>,
            <input key={`s${i}`} type="number" inputMode="numeric" value={r[0]} onChange={(e) => set(i, 0, Number(e.target.value) || 0)} aria-label={`Day ${i + 1} systolic`} className="h-9 w-full rounded-lg border border-ink/10 bg-canvas text-center tabular-nums outline-none focus:border-accent" />,
            <input key={`d${i}`} type="number" inputMode="numeric" value={r[1]} onChange={(e) => set(i, 1, Number(e.target.value) || 0)} aria-label={`Day ${i + 1} diastolic`} className="h-9 w-full rounded-lg border border-ink/10 bg-canvas text-center tabular-nums outline-none focus:border-accent" />,
          ])}
        </div>
        <div className={`rounded-2xl p-4 ${high ? "bg-warn/10 text-warn" : "bg-teal-light text-teal"}`}>
          <div className="text-[12px] font-semibold uppercase tracking-[0.1em]">Average, days 2–7</div>
          <div className="mt-1 text-[30px] font-semibold tabular-nums">{sys}/{dia} <span className="text-[14px] font-normal">mmHg</span></div>
          <div className="text-[13px]">{high ? "At or above 135/85 — share this with your clinician." : "Below the 135/85 home threshold."}</div>
        </div>
        <p className="text-[11px] text-faint">Example values pre-filled. Day 1 is excluded, per Hypertension Canada. Nothing leaves your browser.</p>
      </div>
    </div>
  );
}
