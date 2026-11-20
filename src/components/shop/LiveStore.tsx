"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/utils";
import { createCheckout, fetchStoreProducts, shopifyStoreEnabled, type StoreProduct } from "@/lib/shopify";

/** Live products from the central Shopify store: only those published to the Biongevity channel. */
export function LiveStore() {
  const [items, setItems] = useState<StoreProduct[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [more, setMore] = useState(false);
  const [buying, setBuying] = useState("");
  const [buyError, setBuyError] = useState(false);

  useEffect(() => {
    if (!shopifyStoreEnabled) return;
    fetchStoreProducts().then(setItems).catch(() => setFailed(true));
  }, []);

  const buy = async (p: StoreProduct) => {
    setBuying(p.id); setBuyError(false);
    try { window.location.href = await createCheckout(p.variantId); }
    catch { setBuyError(true); setBuying(""); }
  };

  if (!shopifyStoreEnabled) return <p className="rounded-2xl bg-canvas p-6 text-center text-[14px] text-muted">The store is not connected yet.</p>;
  if (failed) return <p role="alert" className="rounded-2xl bg-canvas p-6 text-center text-[14px] text-warn">We couldn&apos;t load the store. Please refresh and try again.</p>;
  if (!items) return <p role="status" className="rounded-2xl bg-canvas p-6 text-center text-[14px] text-muted">Loading products…</p>;
  if (!items.length) return <p className="rounded-2xl bg-canvas p-6 text-center text-[14px] text-muted">No products available right now.</p>;

  const shown = more ? items : items.slice(0, 12);
  return (
    <div>
      <p className="text-[13px] text-muted">{items.length} products · prices in {items[0].currency}</p>
      {buyError && <p role="alert" className="mt-2 text-[13px] text-warn">We couldn&apos;t start checkout. Please try again.</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-ink/[0.06] transition-shadow hover:shadow-card">
            <div className="aspect-[19/12] bg-canvas">
              {p.image
                ? <img src={p.image.url} alt={p.image.alt} loading="lazy" className="h-full w-full object-cover" />
                : <span className="grid h-full place-items-center text-faint"><Icon name="test-tubes" size={34} /></span>}
            </div>
            <div className="flex flex-1 flex-col p-4">
              {p.type && <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{p.type}</div>}
              <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-[12.5px] text-muted">{p.description}</p>
              <div className="flex-1" />
              <div className="mt-3 flex items-center justify-between border-t border-ink/[0.05] pt-3">
                <span className="text-[16px] font-semibold tabular-nums">{formatMoney(p.price)}<span className="ml-1 text-[11px] font-normal text-faint">{p.currency}</span></span>
                <button onClick={() => buy(p)} disabled={!p.available || !!buying} className="flex h-9 items-center gap-1 rounded-full bg-accent px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-50">
                  {!p.available ? "Sold out" : buying === p.id ? "Opening…" : <>Buy now<Icon name="arrow-right" size={14} /></>}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {items.length > 12 && <div className="mt-6 text-center"><button onClick={() => setMore((m) => !m)} className="btn-light">{more ? "Show less" : `Show all ${items.length}`}</button></div>}
    </div>
  );
}
