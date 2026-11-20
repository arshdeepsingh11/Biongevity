"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { fireConfetti } from "@/components/fx/Confetti";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS, PACKAGES, deptById, scoreDepartments } from "@/data/health";
import { CLINICS, OFFICES } from "@/data/clinic";
import { env } from "@/lib/env";
import { submitEnquiry, type Enquiry } from "@/lib/enquiry";
import { track } from "@/lib/track";

const INTERESTS = ["Not sure yet", ...PACKAGES.map((p) => p.name), ...DEPARTMENTS.map((d) => d.name), ...CLINICS.map((c) => c.name), "BioAro Labs testing", "BioAro Drugs protocol", "Clinic visit", "BioELR demo", "BioELR proposal", "Family member / parent care"];
const EMPTY = { name: "", email: "", phone: "", interest: "Not sure yet", msg: "" };
const HQ = OFFICES[0];

type Status = "idle" | "sending" | "sent" | "mailed" | "error";

/**
 * Enquiry form. With NEXT_PUBLIC_CONTACT_ENDPOINT set, it POSTs JSON there and only confirms when the
 * endpoint accepts it. Without an endpoint it opens a pre-filled email to the care team instead,
 * so an enquiry is never silently lost.
 */
export function ContactForm() {
  const sp = useSearchParams();
  const [f, setF] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState(""); // honeypot: hidden from people, filled by bots
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  useEffect(() => {
    const i = sp.get("interest"), plan = sp.get("plan");
    if (plan) { setF((s) => ({ ...s, interest: i && INTERESTS.includes(i) ? i : s.interest, msg: plan.startsWith("BioELR") ? plan : `My plan:\n${plan}` })); return; }
    if (i) setF((s) => ({ ...s, interest: INTERESTS.includes(i) ? i : s.interest, msg: INTERESTS.includes(i) ? s.msg : `Interested in: ${i}` }));
  }, [sp]);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
  const nameErr = tried && !f.name.trim() ? "Please enter your name." : "";
  const emailErr = tried && !emailOk ? "Please enter a valid email." : "";
  const consentErr = tried && !consent ? "Please tick the box so we can reply." : "";
  const routed = f.msg.trim() ? scoreDepartments(f.msg).slice(0, 2).map((i) => deptById(i).name).join(" + ") : "waiting for your message";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!f.name.trim() || !emailOk || !consent) { setTried(true); return; }
    setStatus("sending");
    const data: Enquiry = { ...f, name: f.name.trim(), email: f.email.trim(), routed };
    const result = trap ? "sent" : await submitEnquiry(data, env.contactEndpoint, HQ.email ?? "info@biongevity.com");
    setStatus(result);
    if (result === "sent" || result === "mailed") track("enquiry_submit", { interest: f.interest, via: result });
    if (result === "sent") fireConfetti({ x: 0.5, y: 0.5 });
  };
  const restart = () => { setStatus("idle"); setTried(false); setConsent(false); setF(EMPTY); };

  const input = "mt-1.5 h-12 w-full rounded-2xl border bg-canvas px-4 text-[15px] outline-none focus:border-violet focus:bg-surface";
  const first = f.name.trim().split(" ")[0];
  return (
    <div className="relative rounded-4xl bg-surface p-6 shadow-lift sm:p-8">
      <ShineBorder radius={28} />
      {status === "sent" || status === "mailed" ? (
        <div className="py-10 text-center" role="status">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-iri text-white"><Icon name="check" size={24} strokeWidth={2.2} /></span>
          {status === "sent" ? (
            <>
              <div className="mt-4 text-[24px] font-semibold">Thank you, {first}.</div>
              <div className="mt-2 text-muted">A coordinator will follow up. Suggested starting point: <span className="font-semibold text-ink">{routed}</span>.</div>
            </>
          ) : (
            <>
              <div className="mt-4 text-[24px] font-semibold">Almost done, {first}.</div>
              <div className="mt-2 text-muted">Your email app opened with your message to <span className="font-semibold text-ink">{HQ.email}</span> — press <b>Send</b> there. Nothing opened? Email us directly or call <a href={HQ.tel} className="font-semibold text-ink underline">{HQ.phone}</a>.</div>
            </>
          )}
          <button type="button" onClick={restart} className="btn-light mt-6">Send another</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <label className="block text-[14px] font-medium">Full name<input value={f.name} onChange={set("name")} autoComplete="name" aria-invalid={!!nameErr} className={`${input} ${nameErr ? "border-warn" : "border-ink/10"}`} />{nameErr && <span className="mt-1 block text-[12px] text-warn">{nameErr}</span>}</label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[14px] font-medium">Email<input type="email" value={f.email} onChange={set("email")} autoComplete="email" aria-invalid={!!emailErr} className={`${input} ${emailErr ? "border-warn" : "border-ink/10"}`} />{emailErr && <span className="mt-1 block text-[12px] text-warn">{emailErr}</span>}</label>
            <label className="block text-[14px] font-medium">Phone (optional)<input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" className={`${input} border-ink/10`} /></label>
          </div>
          <label className="block text-[14px] font-medium">Interest
            <select value={f.interest} onChange={set("interest")} className={`${input} border-ink/10`}>{INTERESTS.map((o) => <option key={o}>{o}</option>)}</select>
          </label>
          <label className="block text-[14px] font-medium">What would you like to improve?
            <textarea value={f.msg} onChange={set("msg")} rows={4} maxLength={4000} className="mt-1.5 w-full rounded-2xl border border-ink/10 bg-canvas p-4 text-[15px] outline-none focus:border-violet focus:bg-surface" />
            <span className="mt-1 block text-[12px] font-normal text-faint">Please don&apos;t include detailed medical records here — your clinician will ask for what they need.</span>
          </label>
          {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
          <input type="text" name="company" value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <div className="flex items-center gap-2 rounded-2xl bg-canvas px-4 py-3 text-[14px]"><Icon name="sparkle" size={15} className="shrink-0 text-violet" /><span className="min-w-0">AI suggestion: <span className="font-semibold">{routed}</span></span></div>
          <label className="flex items-start gap-3 text-[13px] text-muted">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!consentErr} className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--c-ink))]" />
            <span>I agree that Biongevity may use these details to reply to my enquiry.{consentErr && <span className="mt-1 block text-[12px] text-warn">{consentErr}</span>}</span>
          </label>
          {status === "error" && (
            <div role="alert" className="rounded-2xl bg-canvas px-4 py-3 text-[14px] text-warn">
              We couldn&apos;t send your request. Please try again, email <a href={`mailto:${HQ.email}`} className="font-semibold underline">{HQ.email}</a> or call <a href={HQ.tel} className="font-semibold underline">{HQ.phone}</a>.
            </div>
          )}
          <button type="submit" disabled={status === "sending"} className="btn-dark h-12 w-full text-[16px] disabled:opacity-60">{status === "sending" ? "Sending…" : "Send request"}</button>
        </form>
      )}
    </div>
  );
}
