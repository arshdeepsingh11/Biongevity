"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { env } from "@/lib/env";
import { submitEnquiry } from "@/lib/enquiry";
import { track } from "@/lib/track";
import { INTERNATIONAL, UAE_CLINIC, waLink } from "@/content/contact";

/**
 * Enquiry form. Works with or without a backend:
 *  • NEXT_PUBLIC_CONTACT_ENDPOINT / NEXT_PUBLIC_FORMS_URL set → the enquiry is POSTed there (forms Worker, Formspree, Zapier…).
 *  • not set → UAE: opens WhatsApp with the details filled in; International: opens an email draft.
 */
export function EnquiryForm({ mode, interests, defaultInterest }: { mode: "uae" | "intl"; interests: string[]; defaultInterest?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [f, setF] = useState({ name: "", phone: "", email: "", interest: defaultInterest ?? interests[0] ?? "", msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enquiry = { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), interest: f.interest, msg: f.msg.trim(), routed: mode === "uae" ? "Dubai clinic" : "International" };
    if (!env.contactEndpoint && mode === "uae") {
      const text = [`Hi Biongevity Dubai, I'd like to enquire about: ${enquiry.interest}.`, `Name: ${enquiry.name}`, enquiry.phone && `Phone: ${enquiry.phone}`, enquiry.msg && `Message: ${enquiry.msg}`].filter(Boolean).join("\n");
      window.open(waLink(text), "_blank", "noopener");
      track("enquiry_submit", { interest: enquiry.interest, via: "whatsapp" });
      setState("sent");
      return;
    }
    setState("sending");
    const r = await submitEnquiry(enquiry, env.contactEndpoint, mode === "uae" ? UAE_CLINIC.email : INTERNATIONAL.email);
    if (r === "error") { setState("error"); return; }
    track("enquiry_submit", { interest: enquiry.interest, via: r });
    setState("sent");
  };

  if (state === "sent") {
    return (
      <div className="card6 p-8 text-center" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[rgb(var(--c-teal-light))] text-[rgb(var(--c-teal))]"><Icon name="check" size={26} weight="bold" /></span>
        <h3 className="t-h3 mt-4">Thank you{f.name ? `, ${f.name.split(" ")[0]}` : ""}.</h3>
        <p className="t-body mt-2">{mode === "uae" ? "Our team will reply shortly to confirm the details." : "We will be in touch with updates."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card6 grid gap-4 p-6 sm:p-8" data-ai="Enquiry form">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="lbl6">Full name</span><input className="in6" required autoComplete="name" value={f.name} onChange={set("name")} /></label>
        {mode === "uae"
          ? <label className="block"><span className="lbl6">Mobile number</span><input className="in6" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+971" value={f.phone} onChange={set("phone")} /></label>
          : <label className="block"><span className="lbl6">Email</span><input className="in6" required type="email" autoComplete="email" value={f.email} onChange={set("email")} /></label>}
      </div>
      <label className="block"><span className="lbl6">{mode === "uae" ? "I'm interested in" : "Topic"}</span>
        <select className="in6" value={f.interest} onChange={set("interest")}>{interests.map((i) => <option key={i}>{i}</option>)}</select>
      </label>
      <label className="block"><span className="lbl6">Message <span className="font-normal text-faint">(optional)</span></span><textarea className="in6" rows={3} value={f.msg} onChange={set("msg")} /></label>
      <button type="submit" disabled={state === "sending"} className="btn6 btn6-primary btn6-lg mt-1 w-full disabled:opacity-60">
        {state === "sending" ? "Sending…" : mode === "uae" ? "Send enquiry" : "Keep me updated"}<Icon name="arrow-right" size={17} />
      </button>
      {state === "error" && <p className="text-[14px] text-danger" role="alert">Sorry, that did not send. Please try again, or {mode === "uae" ? <a className="underline" href={waLink(`Hi Biongevity Dubai, I'd like to enquire about: ${f.interest}.`)} target="_blank" rel="noopener">message us on WhatsApp</a> : <a className="underline" href={`mailto:${INTERNATIONAL.email}`}>email us</a>}.</p>}
      <p className="text-[12.5px] leading-relaxed text-faint">We use your details only to reply to your enquiry. Please do not include sensitive medical details here.</p>
    </form>
  );
}
