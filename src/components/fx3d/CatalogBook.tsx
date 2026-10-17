"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn, formatMoney } from "@/lib/utils";

export interface BookCategory { id: string; title: string; icon: string; line?: string }
export interface BookItem {
  id: string; category: string; title: string; kicker?: string; image?: string; iconUrl?: string; icon: string;
  summary: string; tags?: string[]; price: number; meta?: string; url: string; store: string;
}

/** A photo that quietly falls back to a soft gradient with the item's icon if it cannot load. */
function Photo({ src, icon, alt, className }: { src?: string; icon: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (src && !bad) return <img src={src} alt={alt} onError={() => setBad(true)} draggable={false} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  return <div className={cn("grid h-full w-full place-items-center", className)} style={{ background: "radial-gradient(120% 90% at 30% 20%, rgb(var(--c-surface)), rgb(var(--c-ai-soft)))" }}><Icon name={icon} size={64} className="text-ai/50" /></div>;
}

function ItemIcon({ it, size = 44 }: { it: BookItem; size?: number }) {
  const [bad, setBad] = useState(false);
  return (
    <span className="icon-tile shrink-0 overflow-hidden bg-white" style={{ width: size, height: size }}>
      {it.iconUrl && !bad ? <img src={it.iconUrl} alt="" onError={() => setBad(true)} className="h-[78%] w-[78%] object-contain" /> : <Icon name={it.icon} size={size * 0.46} />}
    </span>
  );
}
