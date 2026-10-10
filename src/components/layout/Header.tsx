"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/data/site";
import { DynamicNav } from "@/components/fx/DynamicNav";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { useCart } from "@/components/commerce/CartProvider";

export function activeHref(path: string) {
  if (path === "/") return "/";
  const seg = "/" + path.split("/").filter(Boolean)[0] + "/";
  return NAV.find((n) => n.href === seg)?.href ?? "";
}

export function Header() {
  const path = usePathname();
  const { setOpen } = useAI();
  const cart = useCart();
  const [menu, setMenu] = useState(false);
  const active = activeHref(path);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] border-b border-black/[0.06] bg-canvas/75 pt-[var(--safe-top)] backdrop-blur-2xl backdrop-saturate-[1.8]">
        <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-3 px-4 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Biongevity home">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-iri text-white"><Icon name="dna" size={15} strokeWidth={2} /></span>
            <span className="text-[17px] font-semibold tracking-tight">Biongevity</span>
          </Link>
          <DynamicNav items={NAV.slice(1)} active={active} className="mx-auto hidden xl:flex" />
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <button onClick={() => setOpen(true)} className="relative hidden h-9 items-center gap-1.5 overflow-hidden rounded-full bg-white px-3.5 text-[13px] font-semibold shadow-sm ring-1 ring-black/[0.08] sm:flex" aria-label="Open Biongevity AI">
              <Icon name="sparkle" size={15} className="text-violet" />Ask AI<kbd className="ml-1 hidden rounded bg-canvas px-1.5 text-[10px] text-faint lg:inline">⌘K</kbd>
            </button>
            <button onClick={() => cart.setOpen(true)} className="relative grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.08]" aria-label={`Cart, ${cart.count} items`}>
              <Icon name="bag" size={17} />
              {cart.count > 0 && <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-iri px-1 text-[10px] font-bold text-white">{cart.count}</span>}
            </button>
            <Link href="/dashboard/" className="hidden h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-semibold text-white hover:bg-black sm:flex"><Icon name="user" size={15} />Dashboard</Link>
            <button onClick={() => setMenu(true)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.08] xl:hidden" aria-label="Open menu"><Icon name="menu" size={17} /></button>
          </div>
        </div>
        <div className="h-[2px] w-full overflow-hidden"><div id="scroll-progress" className="h-full origin-left bg-iri-x" style={{ transform: "scaleX(0)" }} /></div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-[100] bg-canvas/95 pt-[var(--safe-top)] backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex h-[60px] items-center justify-between px-4">
              <span className="text-[17px] font-semibold">Menu</span>
              <button onClick={() => setMenu(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-black/10" aria-label="Close menu"><Icon name="x" size={16} /></button>
            </div>
            <nav className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                  <Link href={n.href} onClick={() => setMenu(false)} className={`flex items-center gap-3 rounded-2xl p-4 text-[15px] font-semibold ${active === n.href ? "bg-ink text-white" : "bg-white shadow-card"}`}>
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${active === n.href ? "bg-iri" : "bg-canvas"}`}><Icon name={n.icon} size={17} /></span>{n.label}
                  </Link>
                </motion.div>
              ))}
              <button onClick={() => { setMenu(false); setOpen(true); }} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-iri p-4 text-[15px] font-semibold text-white sm:col-span-3"><Icon name="sparkle" />Ask Biongevity AI</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
