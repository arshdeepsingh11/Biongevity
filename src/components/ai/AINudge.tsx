"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAI } from "./AIProvider";
import { XevyoOrb } from "./XevyoOrb";
import { Icon } from "@/components/ui/Icon";

const KEY = "biongevity.nudge.v1";

/**
 * Gentle nudge — after ~25 s on a content page, offers a 30-second AI summary.
 * Shown once per session, never on home/contact/tools, dismissible. Nothing is sent until you tap it.
 */
export function AINudge() {
  const path = usePathname();
  const { summarise, open } = useAI();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    if (path === "/" || /^\/(contact|tools|login|shop)/.test(path)) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch { return; }
    const t = setTimeout(() => setShow(true), 25000);
    return () => clearTimeout(t);
  }, [path]);

  useEffect(() => { if (open) setShow(false); }, [open]);
  const done = () => { setShow(false); try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ } };

  return (
    <AnimatePresence>
      {show && (
        <motion.div role="status" initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-[calc(146px+var(--safe-bottom))] right-3 z-[94] flex max-w-[300px] items-start gap-3 rounded-2xl bg-white p-3 pr-2 shadow-lift ring-1 ring-ai/25 xl:bottom-[88px] xl:right-6">
          <XevyoOrb size={34} live />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold leading-snug">Want the 30-second version?</div>
            <div className="mt-0.5 text-[12px] text-muted">Biongevity SI can summarise this page in plain words.</div>
            <button onClick={() => { done(); summarise(); }} className="mt-2 rounded-full bg-ai px-3 py-1.5 text-[12px] font-semibold text-on-ai">✦ Summarise</button>
          </div>
          <button onClick={done} aria-label="Dismiss" className="grid h-7 w-7 place-items-center rounded-full text-faint hover:bg-ink/[0.05]"><Icon name="x" size={13} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
