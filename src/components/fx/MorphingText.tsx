"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Morphing Text — words dissolve into each other with blur. */
export function MorphingText({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % words.length), interval); return () => clearInterval(t); }, [words.length, interval]);
  return (
    <span className={`relative inline-grid ${className ?? ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={words[i]} className="col-start-1 row-start-1 text-iri"
          initial={{ opacity: 0, filter: "blur(14px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(14px)", y: -10 }} transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
