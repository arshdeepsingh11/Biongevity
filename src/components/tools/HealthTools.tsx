"use client";
import { useState, type ReactNode } from "react";
import type { ToolId } from "@/data/care";
import { Icon } from "@/components/ui/Icon";
import { Gauge, BarList } from "@/components/charts/Charts";
import { ProgressRing } from "@/components/fx/ProgressRing";

/* Self-check tools. Thresholds come from public Canadian/WHO guidance and are cited under each tool.
   They inform a conversation with a clinician — they never diagnose. */

const G = "#0F9D8F", Y = "#B8873B", O = "#D97706", R = "#DC2626", B = "#3B82F6";

function Shell({ title, icon, src, children, result }: { title: string; icon: string; src: string; children: ReactNode; result: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-ink/[0.06]">
      <div className="flex items-center gap-3 border-b border-ink/[0.06] p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-light text-accent"><Icon name={icon} size={19} /></span><div className="text-[17px] font-semibold">{title}</div><span className="ml-auto rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold text-muted">Self-check</span></div>
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
        <div className="space-y-5">{children}</div>
        <div className="flex flex-col justify-center rounded-2xl bg-canvas p-5">{result}</div>
      </div>
      <div className="border-t border-ink/[0.06] px-5 py-3 text-[11px] text-faint">Source: {src}. For information only — not a diagnosis.</div>
    </div>
  );
}

function Slider({ label, value, set, min, max, step = 1, unit }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[14px]"><span className="font-medium">{label}</span><span className="text-[20px] font-semibold tabular-nums">{value}<span className="ml-0.5 text-[13px] font-normal text-muted">{unit}</span></span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="mt-2 w-full accent-[#2563EB]" aria-label={label} />
    </label>
  );
}

function Seg<T extends string>({ value, set, options }: { value: T; set: (v: T) => void; options: [T, string][] }) {
  return <div className="inline-flex rounded-full bg-canvas p-1">{options.map(([v, l]) => <button key={v} onClick={() => set(v)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${value === v ? "bg-navy text-white" : "text-muted"}`}>{l}</button>)}</div>;
}

function Checks({ items, on, set }: { items: string[]; on: string[]; set: (v: string[]) => void }) {
  return (
    <div className="grid gap-2">
      {items.map((t) => { const c = on.includes(t); return (
        <button key={t} onClick={() => set(c ? on.filter((x) => x !== t) : [...on, t])} aria-pressed={c} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ${c ? "bg-accent-light text-ink" : "bg-canvas text-muted hover:text-ink"}`}>
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${c ? "border-accent bg-accent text-white" : "border-ink/20 bg-white"}`}>{c && <Icon name="check" size={12} />}</span>{t}
        </button>
      ); })}
    </div>
  );
}

function BP() {
  const [s, setS] = useState(128), [d, setD] = useState(82);
  const level = s >= 180 || d >= 110 ? 3 : s >= 135 || d >= 85 ? 2 : s >= 121 || d >= 80 ? 1 : 0;
  const msg = ["Within the healthy home range.", "Below the home threshold — keep tracking.", "Above the home threshold (135/85). Repeat for 7 days and share with a clinician.", "Very high. If you have symptoms such as chest pain or headache, call 911."][level];
  return (
    <Shell title="Home blood-pressure check" icon="gauge" src="Hypertension Canada home BP threshold (135/85 mmHg)"
      result={<><Gauge value={s} min={90} max={200} unit=" mmHg" label="Systolic" zones={[{ to: 120, color: G, label: "Optimal" }, { to: 134, color: B, label: "Normal" }, { to: 179, color: O, label: "High (home)" }, { to: 200, color: R, label: "Very high" }]} /><p className="mt-3 text-center text-[13px] text-muted">{s}/{d} mmHg · {msg}</p></>}>
      <Slider label="Systolic (top number)" value={s} set={setS} min={90} max={200} unit="mmHg" />
      <Slider label="Diastolic (bottom number)" value={d} set={setD} min={50} max={120} unit="mmHg" />
      <div className="rounded-xl bg-accent-light p-3 text-[13px] text-ink/80"><b>How to measure:</b> sit 5 minutes, arm supported at heart level. Take 2 readings morning and evening for 7 days and average them.</div>
    </Shell>
  );
}

function BMI() {
  const [h, setH] = useState(172), [w, setW] = useState(76), [waist, setWaist] = useState(90), [sex, setSex] = useState<"f" | "m">("f");
  const bmi = Math.round((w / (h / 100) ** 2) * 10) / 10;
  const cut = sex === "m" ? 102 : 88;
  return (
    <Shell title="BMI & waist" icon="scale" src="WHO BMI categories; Health Canada waist circumference cut-offs (102 cm men, 88 cm women)"
      result={<><Gauge value={bmi} min={15} max={40} label="BMI" zones={[{ to: 18.4, color: B, label: "Underweight" }, { to: 24.9, color: G, label: "Healthy range" }, { to: 29.9, color: Y, label: "Overweight" }, { to: 40, color: R, label: "Obesity" }]} />
        <div className={`mt-3 rounded-xl p-3 text-center text-[13px] ${waist > cut ? "bg-[#FEF3C7] text-[#92400E]" : "bg-teal-light text-teal"}`}>Waist {waist} cm — {waist > cut ? `above the ${cut} cm cut-off: higher cardiometabolic risk` : `below the ${cut} cm cut-off`}</div></>}>
      <Seg value={sex} set={setSex} options={[["f", "Female"], ["m", "Male"]]} />
      <Slider label="Height" value={h} set={setH} min={140} max={210} unit="cm" />
      <Slider label="Weight" value={w} set={setW} min={40} max={160} unit="kg" />
      <Slider label="Waist" value={waist} set={setWaist} min={60} max={150} unit="cm" />
    </Shell>
  );
}

function A1c() {
  const [a, setA] = useState(5.6);
  const mmol = Math.round((a - 2.15) * 10.929);
  return (
    <Shell title="HbA1c explainer" icon="droplet" src="Diabetes Canada clinical practice guidelines"
      result={<><Gauge value={a} min={4} max={10} unit="%" label="HbA1c" zones={[{ to: 5.9, color: G, label: "Normal range" }, { to: 6.4, color: Y, label: "Prediabetes range" }, { to: 10, color: R, label: "Diabetes range" }]} /><p className="mt-2 text-center text-[13px] text-muted">≈ {mmol} mmol/mol · a diagnosis needs confirmation by repeat testing.</p></>}>
      <Slider label="Your HbA1c" value={a} set={(n) => setA(Math.round(n * 10) / 10)} min={4} max={10} step={0.1} unit="%" />
      <p className="text-[14px] leading-relaxed text-muted">HbA1c reflects your average blood sugar over roughly three months. Movement, sleep, fibre and weight changes can all lower it.</p>
    </Shell>
  );
}

const FOODS: [string, number][] = [["Lentils, 1 cup cooked", 15], ["Raspberries, 1 cup", 8], ["Broccoli, 1 cup", 5], ["Apple with skin", 4.4], ["Oatmeal, 1 cup cooked", 4], ["Chia seeds, 1 tbsp", 4], ["Almonds, 30 g", 3.5], ["Whole-wheat bread, 1 slice", 2]];
function Fibre() {
  const [q, setQ] = useState<number[]>(FOODS.map((_, i) => (i === 3 || i === 4 ? 1 : 0)));
  const [sex, setSex] = useState<"f" | "m">("f");
  const total = Math.round(q.reduce((s, n, i) => s + n * FOODS[i][1], 0) * 10) / 10, target = sex === "m" ? 38 : 25;
  return (
    <Shell title="Daily fibre builder" icon="wheat" src="Health Canada Dietary Reference Intakes; Canadian Nutrient File (approx. values)"
      result={<><div className="flex justify-center"><ProgressRing value={Math.min(100, Math.round((total / target) * 100))} size={130} label="of target" /></div><p className="mt-3 text-center text-[14px]"><b>{total} g</b> of {target} g a day</p>
        <div className="mt-3"><BarList data={[{ label: "Your day", value: total }, { label: "Target", value: target, color: "#B8873B" }]} unit=" g" max={Math.max(target, total)} /></div></>}>
      <Seg value={sex} set={setSex} options={[["f", "Female · 25 g"], ["m", "Male · 38 g"]]} />
      <div className="grid gap-1.5">
        {FOODS.map(([f, g], i) => (
          <div key={f} className="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2 text-[13px]">
            <span className="flex-1">{f} <span className="text-faint">· {g} g</span></span>
            <button aria-label={`Less ${f}`} onClick={() => setQ(q.map((n, k) => (k === i ? Math.max(0, n - 1) : n)))} className="grid h-7 w-7 place-items-center rounded-full bg-white ring-1 ring-ink/10"><Icon name="minus" size={13} /></button>
            <span className="w-4 text-center font-semibold tabular-nums">{q[i]}</span>
            <button aria-label={`More ${f}`} onClick={() => setQ(q.map((n, k) => (k === i ? n + 1 : n)))} className="grid h-7 w-7 place-items-center rounded-full bg-white ring-1 ring-ink/10"><Icon name="plus" size={13} /></button>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Sleep() {
  const [bed, setBed] = useState(23.5), [wake, setWake] = useState(6.5);
  const hrs = Math.round(((wake - bed + 24) % 24) * 10) / 10;
  const fmt = (t: number) => `${String(Math.floor(t) % 24).padStart(2, "0")}:${t % 1 ? "30" : "00"}`;
  return (
    <Shell title="Sleep window" icon="moon" src="American Academy of Sleep Medicine & Sleep Research Society (7+ hours for adults)"
      result={<><Gauge value={hrs} min={3} max={12} unit=" h" label="Sleep" zones={[{ to: 5.9, color: R, label: "Too short" }, { to: 6.9, color: Y, label: "Slightly short" }, { to: 9, color: G, label: "Recommended range" }, { to: 12, color: B, label: "Long" }]} /><p className="mt-2 text-center text-[13px] text-muted">{fmt(bed)} → {fmt(wake)} · Keep the same wake time every day, including weekends.</p></>}>
      <Slider label="Bedtime" value={bed} set={setBed} min={20} max={27} step={0.5} unit={` (${fmt(bed)})`} />
      <Slider label="Wake time" value={wake} set={setWake} min={4} max={11} step={0.5} unit={` (${fmt(wake)})`} />
      <p className="text-[14px] text-muted">Short sleep raises stress hormones and affects mood, focus and blood sugar. Consistency matters as much as length.</p>
    </Shell>
  );
}

function UV() {
  const [u, setU] = useState(6);
  const cat = u >= 11 ? ["Extreme", R, "Avoid sun 11:00–15:00; full cover, SPF 30+."] : u >= 8 ? ["Very high", O, "Seek shade, hat, sunglasses and SPF 30+ every 2 hours."] : u >= 6 ? ["High", Y, "Protection needed: shade at midday, SPF 30+, hat."] : u >= 3 ? ["Moderate", B, "Protection needed when outdoors for long periods."] : ["Low", G, "Minimal protection needed for most people."];
  return (
    <Shell title="UV index guide" icon="sun" src="WHO Global Solar UV Index"
      result={<><Gauge value={u} min={0} max={12} label="UV index" zones={[{ to: 2, color: G, label: "Low" }, { to: 5, color: B, label: "Moderate" }, { to: 7, color: Y, label: "High" }, { to: 10, color: O, label: "Very high" }, { to: 12, color: R, label: "Extreme" }]} /><p className="mt-2 text-center text-[13px] text-muted">{cat[2]}</p></>}>
      <Slider label="Today's UV index" value={u} set={setU} min={0} max={12} unit="" />
      <p className="text-[14px] text-muted">UV is the biggest driver of visible skin ageing. Daily broad-spectrum sunscreen is the most effective anti-ageing habit.</p>
    </Shell>
  );
}

const ORAL = ["Brush twice a day for 2 minutes", "Clean between teeth daily", "Fluoride toothpaste", "Sugary drinks rarely", "No smoking or vaping", "Dental check-up in the last 12 months"];
function Oral() {
  const [on, set] = useState<string[]>(ORAL.slice(0, 3));
  const pct = Math.round((on.length / ORAL.length) * 100);
  return (
    <Shell title="Oral health habits" icon="tooth" src="WHO oral health; Canadian Dental Association"
      result={<><div className="flex justify-center"><ProgressRing value={pct} size={130} label="habit score" /></div><p className="mt-3 text-center text-[13px] text-muted">{pct === 100 ? "Excellent routine." : `Add: ${ORAL.filter((x) => !on.includes(x))[0]}.`}</p></>}>
      <Checks items={ORAL} on={on} set={set} />
    </Shell>
  );
}

const BONE = ["Age 50 or older", "A fracture after age 50", "A parent broke a hip", "Low body weight (BMI under 20)", "Current smoker", "3+ alcoholic drinks a day", "Long-term steroid tablets", "Menopause before 45", "Rheumatoid arthritis"];
function Bone() {
  const [on, set] = useState<string[]>([]);
  const n = on.length;
  return (
    <Shell title="Bone-health risk factors" icon="bone" src="Osteoporosis Canada; International Osteoporosis Foundation risk factors"
      result={<><div className="text-center text-[44px] font-semibold tabular-nums">{n}<span className="text-[18px] text-muted"> / {BONE.length}</span></div>
        <div className="mt-2 grid grid-cols-9 gap-1">{BONE.map((b, i) => <span key={b} className="h-3 rounded-full" style={{ background: i < n ? (n >= 3 ? R : Y) : "rgba(11,21,48,.08)" }} />)}</div>
        <p className="mt-3 text-center text-[13px] text-muted">{n === 0 ? "No listed risk factors selected." : n < 3 ? "Worth discussing a bone-density (DXA) scan with your clinician." : "Several risk factors — ask about a bone-density scan and fracture-risk assessment."}</p></>}>
      <Checks items={BONE} on={on} set={set} />
    </Shell>
  );
}

function CRC() {
  const [age, setAge] = useState(48), [fam, setFam] = useState<"no" | "yes">("no");
  const start = fam === "yes" ? 40 : 50;
  const msg = age < start ? `Screening usually starts at ${start}. That's in ${start - age} year${start - age === 1 ? "" : "s"}.` : age > 74 ? "Over 74: screening is a personal decision with your doctor." : fam === "yes" ? "With a close relative affected, colonoscopy is usually recommended — ask for a referral." : "You're in the screening age range: a stool test (FIT) every 2 years, or colonoscopy as advised.";
  return (
    <Shell title="Bowel-cancer screening" icon="microscope" src="Canadian Task Force on Preventive Health Care; provincial colorectal screening programs"
      result={<><div className="relative mt-4 h-3 rounded-full bg-ink/[0.07]">
          <span className="absolute inset-y-0 rounded-full bg-gradient-to-r from-accent to-teal" style={{ left: `${((start - 30) / 55) * 100}%`, width: `${((74 - start) / 55) * 100}%` }} />
          <span className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-navy transition-all" style={{ left: `${((Math.min(85, Math.max(30, age)) - 30) / 55) * 100}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-faint"><span>30</span><span>{start}</span><span>74</span><span>85</span></div>
        <p className="mt-4 text-center text-[14px]">{msg}</p></>}>
      <Slider label="Your age" value={age} set={setAge} min={30} max={85} unit="yrs" />
      <div><div className="mb-2 text-[14px] font-medium">Parent, sibling or child with bowel cancer?</div><Seg value={fam} set={setFam} options={[["no", "No / not sure"], ["yes", "Yes"]]} /></div>
    </Shell>
  );
}

export function HealthTool({ id }: { id: ToolId }) {
  const T = { bp: BP, bmi: BMI, hba1c: A1c, fibre: Fibre, sleep: Sleep, uv: UV, oral: Oral, bone: Bone, crc: CRC }[id];
  return <T />;
}
