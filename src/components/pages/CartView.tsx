"use client";
import Link from "next/link";
import { useCart } from "@/components/commerce/CartProvider";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";
import { productByHandle } from "@/data/catalog";

export function CartView() {
  const c = useCart();
  if (!c.lines.length) return (
    <div className="card py-20 text-center"><Icon name="bag" size={36} className="mx-auto text-faint" /><div className="mt-3 text-[20px] font-semibold">Your bag is empty.</div>
      <div className="mt-5 flex justify-center gap-2"><Link href="/labs/tests/" className="btn-dark">Shop tests</Link><Link href="/drugs/shop/" className="btn-light">Shop formulas</Link></div></div>
  );
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card divide-y divide-black/[0.05] lg:col-span-2">
        {c.lines.map((l) => (
          <div key={l.id} className="flex items-center gap-4 p-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-canvas">{l.image ? <img src={l.image} alt="" className="h-full w-full object-cover" /> : <Icon name={productByHandle(l.handle)?.icon ?? "box"} size={26} />}</span>
            <div className="min-w-0 flex-1"><div className="truncate font-semibold">{l.title}</div><div className="text-[13px] text-faint">{l.vendor}</div></div>
            <div className="flex items-center gap-2">
              <button aria-label="Decrease" onClick={() => c.update(l.id, l.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-canvas"><Icon name="minus" size={13} /></button>
              <span className="w-6 text-center font-semibold">{l.quantity}</span>
              <button aria-label="Increase" onClick={() => c.update(l.id, l.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-canvas"><Icon name="plus" size={13} /></button>
            </div>
            <div className="w-24 text-right font-semibold">{formatMoney(l.price * l.quantity, l.currency)}</div>
          </div>
        ))}
      </div>
      <div className="card h-fit p-6">
        <div className="flex justify-between text-[15px]"><span className="text-muted">Subtotal</span><span className="font-semibold">{formatMoney(c.subtotal, c.currency)}</span></div>
        <div className="mt-1 text-[12px] text-faint">Taxes and shipping calculated at checkout.</div>
        {c.mode === "shopify" && c.checkoutUrl ? <a href={c.checkoutUrl} className="btn-dark mt-5 w-full">Secure checkout</a>
          : <><button disabled className="btn-dark mt-5 w-full opacity-50">Checkout</button><p className="mt-2 text-[12px] text-faint">Demo mode: add Shopify Storefront credentials in <code>.env.local</code> to enable checkout.</p></>}
      </div>
    </div>
  );
}
