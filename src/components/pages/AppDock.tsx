"use client";
import { useEffect, useState } from "react";
import { AppleDock } from "@/components/fx/AppleDock";
import { Icon } from "@/components/ui/Icon";
import { fireConfetti } from "@/components/fx/Confetti";
import { APP_FEATURES } from "@/data/health";

/** App-icon colours, one per feature (like a phone home screen). */
const TINTS: [string, string][] = [["#fb7185", "#e11d48"], ["#60a5fa", "#2563eb"], ["#5eead4", "#0d9488"], ["#bef264", "#65a30d"], ["#7dd3fc", "#0284c7"], ["#fdba74", "#ea580c"]];

export function AppShowcase() {
  const [i, setI] = useState(0);
  const f = APP_FEATURES[i];
  const [base, setBase] = useState(54);
  useEffect(() => { const fit = () => setBase(innerWidth < 420 ? 42 : 54); fit(); addEventListener("resize", fit); return () => removeEventListener("resize", fit); }, []);
  return (
    <div className="flex flex-col items-center">
      <AppleDock key={base} items={APP_FEATURES.map((a, k) => ({ icon: a.icon, label: a.t, active: k === i, onClick: () => setI(k), tint: TINTS[k % TINTS.length] }))} base={base} magnify={1.5} className="max-w-full" />
      <div key={f.t} className="card mt-10 flex max-w-[560px] items-center gap-5 p-6 animate-[float_5s_ease-in-out_infinite]">
        <span className="dock-app relative grid h-16 w-16 shrink-0 place-items-center rounded-[24%] text-white shadow-[0_12px_26px_-10px_rgb(0_0_0/.5),inset_0_1px_0_rgb(255_255_255/.45)]" style={{ background: `linear-gradient(160deg, ${TINTS[i % TINTS.length][0]}, ${TINTS[i % TINTS.length][1]})` }}><Icon name={f.icon} size={30} weight="fill" /></span>
        <div><div className="text-[22px] font-semibold">{f.t}</div><div className="text-[15px] text-muted">{f.d}</div></div>
      </div>
    </div>
  );
}

export function AppSignup() {
  const [email, setEmail] = useState(""); const [ok, setOk] = useState(false); const [bad, setBad] = useState(false);
  if (ok) return <div className="rounded-2xl bg-surface p-4 text-center text-[15px] shadow-card">Thanks — we&apos;ll share Biongevity App details at <b>{email}</b>.</div>;
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email" aria-invalid={bad}
          className={`h-12 flex-1 rounded-full border bg-surface px-5 text-[15px] outline-none focus:border-violet ${bad ? "border-warn" : "border-ink/10"}`} />
        <button onClick={(e) => { if (/\S+@\S+\.\S+/.test(email)) { setOk(true); fireConfetti({ x: e.clientX / innerWidth, y: e.clientY / innerHeight }); } else setBad(true); }} className="btn-dark h-12 px-6">Get early access</button>
      </div>
      {bad && <div className="mt-2 text-[13px] text-warn">Enter a valid email address.</div>}
      {/* TODO(shopify/crm): post to Shopify customer marketing consent or CRM endpoint. */}
    </div>
  );
}
