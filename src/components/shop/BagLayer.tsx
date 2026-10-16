"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { itemById, KIND_META } from "@/lib/catalog";
import { bundleUrl } from "@/lib/commerce";
import { TERMS, POLICIES, type Term } from "@/config/store";
import { formatMoney } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { BuyButton } from "@/components/commerce/BuyButton";
import { useAI } from "@/components/ai/AIProvider";
import { askXevyo, sessionId, xevyoEnabled } from "@/lib/xevyo";

const money = (v: number | null) => (v === null ? "Quote" : formatMoney(v));

/** Global bag: floating button, bag drawer and product detail drawer. Mounted once in the layout. */
export function BagLayer() {
  const c = useCart();
  const { ask } = useAI();
  const item = c.view ? itemById(c.view) : undefined;
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { c.setOpen(false); c.setView(null); } };
    addEventListener("keydown", esc); return () => removeEventListener("keydown", esc);
  }, [c]);

  const shopify = bundleUrl(c.lines.map((l) => l.item.handle));
  const planText = c.lines.map((l) => `${l.item.title}${l.term ? ` (${l.term} months)` : ""} — ${money(l.price)}`).join("\n");
  const request = `/contact/?interest=${encodeURIComponent("My plan")}&plan=${encodeURIComponent(planText)}`;

  // AI plan review — streams Biongevity SI's answer right inside the bag. Resets when the plan changes.
  const [review, setReview] = useState<{ state: "idle" | "busy" | "done" | "error" | "off"; text: string; sources?: { title: string; url: string }[] }>({ state: "idle", text: "" });
  const stop = useRef<AbortController | null>(null);
  useEffect(() => { stop.current?.abort(); setReview({ state: "idle", text: "" }); }, [planText]);
  const runReview = async () => {
    if (!xevyoEnabled) return setReview({ state: "off", text: "" });
    stop.current = new AbortController();
    setReview({ state: "busy", text: "" });
    const message = `Review my Biongevity plan (prices in CAD):\n${planText}\nEstimated total: ${formatMoney(c.total)} CAD${c.quoted ? " + quoted items" : ""}.\nIs anything missing or overlapping, what order should I start in, and what should I ask the care team? Keep it short and simple.`;
    try {
      const r = await askXevyo({ message, history: [], context: { page: "shop", section: "My plan" }, sessionId: sessionId() },
        (t) => setReview({ state: "busy", text: t }), stop.current.signal);
      setReview({ state: "done", text: r.reply, sources: r.sources });
    } catch { setReview({ state: "error", text: "" }); }
  };

  return (
    <>
      <AnimatePresence>
        {c.lines.length > 0 && !c.open && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={() => c.setOpen(true)} aria-label={`Open my plan, ${c.lines.length} items`}
            className="fixed bottom-[calc(84px+var(--safe-bottom))] left-3 z-[90] flex items-center gap-2.5 rounded-full bg-white/95 p-1.5 pr-4 shadow-lift ring-1 ring-accent/20 backdrop-blur xl:bottom-6 xl:left-6">
            <span className="relative grid h-11 w-11 place-items-center rounded-full bg-iri text-white"><Icon name="bag" size={20} weight="duotone" /><span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[11px] font-bold text-white">{c.lines.length}</span></span>
            <span className="text-left leading-tight"><span className="block text-[13px] font-semibold">My plan</span><span className="block text-[12px] tabular-nums text-muted">{formatMoney(c.total)}{c.quoted ? " + quote" : ""} CAD</span></span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(c.open || item) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { c.setOpen(false); c.setView(null); }} className="fixed inset-0 z-[97] bg-scrim/25 backdrop-blur-[2px]" />}
      </AnimatePresence>

      {/* Product detail drawer */}
      <AnimatePresence>
        {item && (
          <motion.aside key={item.id} role="dialog" aria-label={item.title} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[98] flex w-full max-w-[460px] flex-col bg-pearl shadow-lift">
            <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
              <span className="hud-label">{KIND_META[item.kind].label} · {item.category}</span>
              <button onClick={() => c.setView(null)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-canvas"><Icon name="x" size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <span className="grid h-14 w-14 place-items-center icon-tile"><Icon name={item.icon} size={28} weight="duotone" /></span>
              <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-tight">{item.title}</h3>
              <div className="mt-2 text-[22px] font-semibold text-accent">{formatMoney(item.price)} <span className="text-[13px] font-normal text-muted">CAD · {item.billing === "term" ? "12-month plan" : "one-time"}</span></div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{item.summary}</p>
              {item.includes && <div className="mt-5"><div className="hud-label">Included</div><ul className="mt-2 space-y-1.5">{item.includes.map((x) => <li key={x} className="flex gap-2 text-[14px]"><Icon name="check" size={16} weight="bold" className="mt-0.5 shrink-0 text-teal" />{x}</li>)}</ul></div>}
              <div className="mt-5"><div className="hud-label">What happens next</div>
                <ol className="relative mt-3 space-y-3 border-l border-accent/25 pl-5">{item.next.map((x, i) => <li key={x} className="relative text-[14px]"><span className="absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">{i + 1}</span>{x}</li>)}</ol>
              </div>
              <button onClick={() => ask(`Is ${item.title} right for me? What would it tell me and how should I prepare?`)} className="mt-5 flex w-full items-center justify-between rounded-2xl bg-accent-light px-4 py-3 text-left text-[13.5px] font-semibold text-accent"><span className="flex items-center gap-2"><Icon name="sparkle" size={16} weight="duotone" />Is this right for me? Ask Biongevity SI</span><Icon name="arrow-up-right" size={15} /></button>
              {item.url && <a href={item.url} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1 text-[13px] text-muted hover:text-accent">Full product page<Icon name="arrow-up-right" size={13} /></a>}
            </div>
            <div className="border-t border-ink/[0.06] p-4">
              {c.has(item.id)
                ? <button onClick={() => { c.setView(null); c.setOpen(true); }} className="btn-light w-full"><Icon name="check" size={16} weight="bold" className="text-teal" />In your plan — view bag</button>
                : <button onClick={() => { c.add(item.id); c.setView(null); c.setOpen(true); }} className="btn-dark w-full"><Icon name="plus" size={16} weight="bold" />Add to my plan</button>}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bag drawer */}
      <AnimatePresence>
        {c.open && !item && (
          <motion.aside role="dialog" aria-label="My plan" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[98] flex w-full max-w-[460px] flex-col bg-pearl shadow-lift">
            <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
              <div><div className="text-[18px] font-semibold">My plan</div><div className="hud-label !text-muted">{c.lines.length} items · CAD</div></div>
              <button onClick={() => c.setOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-canvas"><Icon name="x" size={16} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {!c.lines.length && <div className="rounded-2xl bg-canvas p-6 text-center text-[14px] text-muted">Your plan is empty. <Link href="/shop/#studio" onClick={() => c.setOpen(false)} className="font-semibold text-accent">Build one in Plan Studio</Link>.</div>}
              {c.lines.map((l) => (
                <div key={l.id} className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06]">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center icon-tile"><Icon name={l.item.icon} size={20} weight="duotone" /></span>
                    <button onClick={() => c.setView(l.id)} className="min-w-0 flex-1 text-left"><span className="block truncate text-[14.5px] font-semibold">{l.item.title}</span><span className="hud-label !text-faint">{KIND_META[l.item.kind].label}</span></button>
                    <span className="text-right text-[14.5px] font-semibold tabular-nums">{money(l.price)}</span>
                    <button onClick={() => c.remove(l.id)} aria-label={`Remove ${l.item.title}`} className="text-faint hover:text-accent"><Icon name="trash" size={16} /></button>
                  </div>
                  {(l.item.kind === "test" || l.item.kind === "formula") && l.item.url && (
                    <div className="mt-3 flex items-center gap-2 border-t border-ink/[0.05] pt-3"><span className="flex-1 text-[11.5px] text-muted">Sold by {l.item.kind === "test" ? "BioAro Labs" : "BioAro Drugs"}</span><BuyButton href={l.item.url} store={l.item.kind === "test" ? "labs" : "drugs"} size="sm" label="Buy now" /></div>
                  )}
                  {l.item.kind === "program" && (
                    <div className="mt-3 flex items-center gap-2"><span className="text-[12px] text-muted">Term</span>
                      <div className="inline-flex rounded-full bg-canvas p-0.5">{TERMS.map((t) => <button key={t} onClick={() => c.setTerm(l.id, t as Term)} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${l.term === t ? "bg-accent text-white" : "text-muted"}`}>{t} mo</button>)}</div>
                    </div>
                  )}
                </div>
              ))}
              {c.lines.length > 0 && (
                <div className="hud relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-accent/20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="hud-label flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${review.state === "busy" ? "animate-pulseDot bg-accent" : "bg-teal"}`} />Biongevity SI plan review</span>
                    {review.state !== "busy" && <button onClick={runReview} className="flex items-center gap-1 rounded-full bg-accent-light px-3 py-1.5 text-[12px] font-semibold text-accent hover:bg-accent/15"><Icon name="sparkle" size={13} weight="duotone" />{review.state === "done" ? "Review again" : "Review my plan"}</button>}
                    {review.state === "busy" && <button onClick={() => stop.current?.abort()} className="text-[12px] text-muted hover:text-accent">Stop</button>}
                  </div>
                  {review.state === "idle" && <p className="mt-2 text-[12.5px] leading-relaxed text-muted">Get a quick AI check: gaps, overlaps and the best order to start. Your care team still confirms everything.</p>}
                  {review.state === "off" && <p className="mt-2 rounded-xl bg-gold-soft/50 px-3 py-2 text-[12.5px] text-gold-deep">Biongevity SI isn&apos;t connected in this build yet — request your plan and our care team will review it.</p>}
                  {review.state === "error" && <p className="mt-2 text-[12.5px] text-gold-deep">Biongevity SI is unavailable right now. Please try again shortly.</p>}
                  {(review.state === "busy" || review.state === "done") && (
                    <div className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink/90">
                      {review.text || <span className="inline-flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-accent" style={{ animationDelay: `${k * 0.2}s` }} />)}</span>}
                      {review.sources?.length ? <div className="mt-2 flex flex-wrap gap-2">{review.sources.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener" className="text-[11px] text-accent underline">{x.title}</a>)}</div> : null}
                      {review.state === "done" && <p className="mt-2 text-[11px] text-faint">AI guidance, not a diagnosis. A clinician confirms your plan.</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
            {c.lines.length > 0 && (
              <div className="space-y-3 border-t border-ink/[0.06] p-5">
                <div className="flex items-baseline justify-between"><span className="text-[14px] text-muted">Estimated total</span><span className="text-[24px] font-semibold tabular-nums">{formatMoney(c.total)} <span className="text-[13px] font-normal text-muted">CAD</span></span></div>
                {c.quoted && <p className="text-[12px] text-muted">Items marked “Quote” are priced by our care team before anything is charged.</p>}
                {shopify ? <a href={shopify} className="btn-dark w-full">Checkout securely<Icon name="lock" size={15} /></a>
                  : <Link href={request} onClick={() => c.setOpen(false)} className="btn-dark w-full">Request my plan<Icon name="arrow-right" size={15} /></Link>}
                <p className="text-center text-[11.5px] text-faint">{shopify ? "Checkout is hosted by Shopify." : "No payment taken here — a coordinator confirms details, scheduling and price first."}{POLICIES.refunds && ` ${POLICIES.refunds}`}</p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
