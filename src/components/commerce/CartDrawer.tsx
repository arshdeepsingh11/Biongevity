"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";
import { productByHandle } from "@/data/catalog";

export function CartDrawer() {
  const c = useCart();
  return (
    <AnimatePresence>
      {c.open && (
        <>
          <motion.div className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => c.setOpen(false)} />
          <motion.aside role="dialog" aria-label="Cart" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed bottom-0 right-0 top-0 z-[115] flex w-full max-w-[420px] flex-col bg-white pt-[var(--safe-top)] shadow-lift">
            <header className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <div><div className="text-[18px] font-semibold">Your bag</div><div className="text-[12px] text-faint">{c.mode === "shopify" ? "Secure checkout by Shopify" : "Demo mode · connect Shopify to check out"}</div></div>
              <button onClick={() => c.setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-canvas" aria-label="Close cart"><Icon name="x" size={16} /></button>
            </header>
            {c.lastAdded && <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-[13px]"><Icon name="check" size={15} className="text-emerald-600" />Added {c.lastAdded}</div>}
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {!c.lines.length && <div className="py-16 text-center text-muted"><Icon name="bag" size={32} className="mx-auto mb-3 text-faint" />Your bag is empty.</div>}
              {c.lines.map((l) => {
                const p = productByHandle(l.handle);
                return (
                  <div key={l.id} className="flex gap-3 rounded-2xl p-2 ring-1 ring-black/[0.06]">
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-canvas">{l.image ? <img src={l.image} alt="" className="h-full w-full object-cover" /> : <Icon name={p?.icon ?? "box"} size={24} />}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{l.title}</div>
                      <div className="text-[12px] text-faint">{l.vendor}</div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <button aria-label="Decrease" onClick={() => c.update(l.id, l.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-canvas"><Icon name="minus" size={13} /></button>
                        <span className="w-5 text-center text-[13px] font-semibold">{l.quantity}</span>
                        <button aria-label="Increase" onClick={() => c.update(l.id, l.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-canvas"><Icon name="plus" size={13} /></button>
                        <button aria-label="Remove" onClick={() => c.remove(l.id)} className="ml-auto text-faint hover:text-warn"><Icon name="trash" size={15} /></button>
                      </div>
                    </div>
                    <div className="text-[14px] font-semibold">{formatMoney(l.price * l.quantity, l.currency)}</div>
                  </div>
                );
              })}
            </div>
            <footer className="border-t border-black/[0.06] p-5 pb-[calc(20px+var(--safe-bottom))]">
              <div className="mb-3 flex justify-between text-[15px]"><span className="text-muted">Subtotal</span><span className="font-semibold">{formatMoney(c.subtotal, c.currency)}</span></div>
              {c.mode === "shopify" && c.checkoutUrl
                ? <a href={c.checkoutUrl} className="btn-dark w-full">Checkout</a>
                : <Link href="/cart/" onClick={() => c.setOpen(false)} className="btn-dark w-full">Review bag</Link>}
              <p className="mt-2 text-center text-[11px] text-faint">Taxes and shipping calculated at checkout.</p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
