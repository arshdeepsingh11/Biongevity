"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cartApi, isShopifyConfigured, type ShopifyCart } from "@/lib/shopify";
import { productByHandle } from "@/data/catalog";
import type { CatalogProduct } from "@/data/types";

export interface CartLine { id: string; handle: string; title: string; vendor: string; price: number; currency: string; quantity: number; image?: string }

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  currency: string;
  checkoutUrl: string | null;
  open: boolean;
  busy: boolean;
  lastAdded: string | null;
  mode: "shopify" | "demo";
  setOpen: (v: boolean) => void;
  add: (p: CatalogProduct, qty?: number) => Promise<void>;
  addMany: (ps: CatalogProduct[]) => Promise<void>;
  update: (lineId: string, qty: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
}

const Ctx = createContext<CartState | null>(null);
const KEY_ID = "bio.cartId";
const KEY_LOCAL = "bio.cart";

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

function fromShopify(c: ShopifyCart): CartLine[] {
  return c.lines.nodes.map((l) => ({
    id: l.id,
    handle: l.merchandise.product.handle,
    title: l.merchandise.product.title,
    vendor: l.merchandise.product.vendor,
    price: Number(l.merchandise.price.amount),
    currency: l.merchandise.price.currencyCode,
    quantity: l.quantity,
    image: l.merchandise.product.featuredImage?.url,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const mode = isShopifyConfigured ? "shopify" : "demo";

  const apply = useCallback((c: ShopifyCart | null) => {
    if (!c) return;
    setCartId(c.id); store.set(KEY_ID, c.id);
    setCheckoutUrl(c.checkoutUrl);
    setLines(fromShopify(c));
  }, []);

  // Hydrate
  useEffect(() => {
    if (mode === "shopify") {
      const id = store.get(KEY_ID);
      if (id) cartApi.get(id).then(apply).catch(() => undefined);
    } else {
      const raw = store.get(KEY_LOCAL);
      if (raw) try { setLines(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, [mode, apply]);

  useEffect(() => { if (mode === "demo") store.set(KEY_LOCAL, JSON.stringify(lines)); }, [lines, mode]);

  const addMany = useCallback(async (ps: CatalogProduct[]) => {
    if (!ps.length) return;
    setBusy(true);
    try {
      if (mode === "shopify") {
        const ls = ps.filter((p) => p.variantId).map((p) => ({ merchandiseId: p.variantId!, quantity: 1 }));
        if (ls.length) apply(cartId ? await cartApi.add(cartId, ls) : await cartApi.create(ls));
      } else {
        setLines((cur) => {
          const next = [...cur];
          ps.forEach((p) => {
            const i = next.findIndex((l) => l.handle === p.handle);
            if (i >= 0) next[i] = { ...next[i], quantity: next[i].quantity + 1 };
            else next.push({ id: `local-${p.handle}`, handle: p.handle, title: p.title, vendor: p.vendor, price: p.price, currency: p.currency, quantity: 1, image: p.image });
          });
          return next;
        });
      }
      setLastAdded(ps[ps.length - 1].title);
      setOpen(true);
    } finally { setBusy(false); }
  }, [mode, cartId, apply]);

  const add = useCallback((p: CatalogProduct, qty = 1) => addMany(Array.from({ length: qty }, () => p)), [addMany]);

  const update = useCallback(async (lineId: string, qty: number) => {
    if (qty < 1) return remove(lineId);
    if (mode === "shopify" && cartId) { setBusy(true); try { apply(await cartApi.update(cartId, [{ id: lineId, quantity: qty }])); } finally { setBusy(false); } }
    else setLines((cur) => cur.map((l) => (l.id === lineId ? { ...l, quantity: qty } : l)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, cartId, apply]);

  const remove = useCallback(async (lineId: string) => {
    if (mode === "shopify" && cartId) { setBusy(true); try { apply(await cartApi.remove(cartId, [lineId])); } finally { setBusy(false); } }
    else setLines((cur) => cur.filter((l) => l.id !== lineId));
  }, [mode, cartId, apply]);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    return { lines, count, subtotal, currency: lines[0]?.currency ?? "USD", checkoutUrl, open, busy, lastAdded, mode, setOpen, add, addMany, update, remove };
  }, [lines, checkoutUrl, open, busy, lastAdded, mode, add, addMany, update, remove]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

/** Resolve handles → products (used by protocol "add all"). */
export const productsFromHandles = (hs: string[]) => hs.map(productByHandle).filter(Boolean) as CatalogProduct[];
