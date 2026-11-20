"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { itemById, type ShopItem } from "@/lib/catalog";
import type { Term } from "@/config/store";
import { linePrice, parseLines, type Line } from "@/lib/bag";

interface Cart {
  lines: (Line & { item: ShopItem; price: number | null })[];
  add: (id: string, term?: Term) => void; remove: (id: string) => void; setTerm: (id: string, t: Term) => void; clear: () => void;
  has: (id: string) => boolean; total: number; quoted: boolean; open: boolean; setOpen: (v: boolean) => void;
  view: string | null; setView: (id: string | null) => void;
}
const Ctx = createContext<Cart | null>(null);
const KEY = "biongevity.bag.v1";

/** "My plan" bag — one cart for programs, packages, tests and formulas. Remembered in this browser. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<string | null>(null);
  // Save only after the saved bag has been read; otherwise the first (empty) render overwrites it.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { setRaw(parseLines(localStorage.getItem(KEY))); } catch { /* storage unavailable */ } setLoaded(true); }, []);
  useEffect(() => { if (!loaded) return; try { localStorage.setItem(KEY, JSON.stringify(raw)); } catch { /* storage unavailable */ } }, [raw, loaded]);

  const add = useCallback((id: string, term?: Term) => {
    const it = itemById(id); if (!it) return;
    setRaw((r) => (r.some((l) => l.id === id) ? r : [...r, { id, term: it.kind === "program" ? term ?? 12 : undefined }]));
  }, []);
  const remove = useCallback((id: string) => setRaw((r) => r.filter((l) => l.id !== id)), []);
  const setTerm = useCallback((id: string, term: Term) => setRaw((r) => r.map((l) => (l.id === id ? { ...l, term } : l))), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo(() => {
    const lines = raw.map((l) => ({ ...l, item: itemById(l.id)! })).filter((l) => l.item).map((l) => ({ ...l, price: linePrice(l.item, l.term) }));
    return {
      lines, add, remove, setTerm, clear, open, setOpen, view, setView,
      has: (id: string) => raw.some((l) => l.id === id),
      total: lines.reduce((a, l) => a + (l.price ?? 0), 0), quoted: lines.some((l) => l.price === null),
    };
  }, [raw, add, remove, setTerm, clear, open, view]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() { const c = useContext(Ctx); if (!c) throw new Error("useCart must be used inside <CartProvider>"); return c; }
