"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { fireConfetti } from "@/components/fx/Confetti";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS, PACKAGES, deptById, scoreDepartments } from "@/data/health";
import { CLINICS } from "@/data/clinic";
import { env } from "@/lib/env";

const INTERESTS = ["Not sure yet", ...PACKAGES.map((p) => p.name), ...DEPARTMENTS.map((d) => d.name), ...CLINICS.map((c) => c.name), "BioAro Labs testing", "BioAro Drugs protocol", "Clinic visit", "BioELR demo", "BioELR proposal", "Family member / parent care"];
const EMPTY = { name: "", email: "", phone: "", interest: "Not sure yet", msg: "" };

/**
 * Enquiry form. No backend: submit hands off to `submitEnquiry()` — wire it to
 * Shopify Forms / a Shopify Flow webhook / CRM. Until then it confirms locally.
 */
async function submitEnquiry(data: typeof EMPTY & { routed: string }) {
  const url = env.contactEndpoint;
  if (!url) return true;
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return r.ok;
}

export function ContactForm() {
  const sp = useSearchParams();
  const [f, setF] = useState(EMPTY);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const i = sp.get("interest"), plan = sp.get("plan");
    if (plan) { setF((s) => ({ ...s, interest: i && INTERESTS.includes(i) ? i : s.interest, msg: plan.startsWith("BioELR") ? plan : `My plan:\n${plan}` })); return; }
    if (i) setF((s) => ({ ...s, interest: INTERESTS.includes(i) ? i : s.interest, msg: INTERESTS.includes(i) ? s.msg : `Interested in: ${i}` }));
  }, [sp]);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const emailOk = /\S+@\S+\.\S+/.test(f.email);
  const nameErr = tried && !f.name.trim() ? "Please enter your name." : "";
  const emailErr = tried && !emailOk ? "Please enter a valid email." : "";
  const routed = f.msg.trim() ? scoreDepartments(f.msg).slice(0, 2).map((i) => deptById(i).name).join(" + ") : "waiting for your message";

  const submit = async (e: React.MouseEvent) => {
    if (!f.name.trim() || !emailOk) { setTried(true); return; }
    await submitEnquiry({ ...f, routed });
    setSent(true); fireConfetti({ x: e.clientX / innerWidth, y: e.clientY / innerHeight });
  };

  const input = "mt-1.5 h-12 w-full rounded-2xl border bg-canvas px-4 text-[15px] outline-none focus:border-violet focus:bg-surface";
  return (
    <div className="relative rounded-4xl bg-surface p-6 shadow-lift sm:p-8">
      <ShineBorder radius={28} />
      {sent ? (
        <div className="py-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-iri text-white"><Icon name="check" size={24} strokeWidth={2.2} /></span>
          <div className="mt-4 text-[24px] font-semibold">Thank you, {f.name.split(" ")[0]}.</div>
          <div className="mt-2 text-muted">A coordinator will follow up. Suggested starting point: <span className="font-semibold text-ink">{routed}</span>.</div>
          <button onClick={() => { setSent(false); setTried(false); setF(EMPTY); }} className="btn-light mt-6">Send another</button>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-[14px] font-medium">Full name<input value={f.name} onChange={set("name")} aria-invalid={!!nameErr} className={`${input} ${nameErr ? "border-warn" : "border-ink/10"}`} />{nameErr && <span className="mt-1 block text-[12px] text-warn">{nameErr}</span>}</label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[14px] font-medium">Email<input type="email" value={f.email} onChange={set("email")} aria-invalid={!!emailErr} className={`${input} ${emailErr ? "border-warn" : "border-ink/10"}`} />{emailErr && <span className="mt-1 block text-[12px] text-warn">{emailErr}</span>}</label>
            <label className="block text-[14px] font-medium">Phone (optional)<input type="tel" value={f.phone} onChange={set("phone")} className={`${input} border-ink/10`} /></label>
          </div>
          <label className="block text-[14px] font-medium">Interest
            <select value={f.interest} onChange={set("interest")} className={`${input} border-ink/10`}>{INTERESTS.map((o) => <option key={o}>{o}</option>)}</select>
          </label>
          <label className="block text-[14px] font-medium">What would you like to improve?
            <textarea value={f.msg} onChange={set("msg")} rows={4} className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-canvas p-4 text-[15px] outline-none focus:border-violet focus:bg-surface" />
          </label>
          <div className="flex items-center gap-2 rounded-2xl bg-canvas px-4 py-3 text-[14px]"><Icon name="sparkle" size={15} className="text-violet" />AI suggestion: <span className="font-semibold">{routed}</span></div>
          <button onClick={submit} className="btn-dark h-12 w-full text-[16px]">Send request</button>
        </div>
      )}
    </div>
  );
}
