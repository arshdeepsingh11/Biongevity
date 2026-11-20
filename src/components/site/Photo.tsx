"use client";
import { useState } from "react";
import { photo as getPhoto, photoSrc } from "@/content/photos";
import { cn } from "@/lib/utils";

/**
 * A photo from src/content/photos.ts. Fades in when loaded; if it cannot load, the warm gradient behind it stays,
 * so a layout never shows a broken image. `w` is the largest width it is shown at (for srcset).
 */
export function Photo({ k, className, w = 1200, sizes = "100vw", priority, shade, alt }: { k?: string; className?: string; w?: number; sizes?: string; priority?: boolean; shade?: boolean; alt?: string }) {
  const p = getPhoto(k);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  if (!p) return <div className={cn("ph6", className)} aria-hidden />;
  const { src, srcSet } = photoSrc(p, w);
  return (
    <div className={cn("ph6", shade && "ph6-shade", className)}>
      {state !== "error" && (
        <img
          src={src} srcSet={srcSet} sizes={sizes} alt={alt ?? p.alt}
          loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"}
          data-loaded={state === "ok" ? "true" : "false"}
          ref={(el) => { if (el?.complete && el.naturalWidth > 0 && state === "loading") setState("ok"); }}
          onLoad={() => setState("ok")} onError={() => setState("error")}
          style={{ objectPosition: p.focus ?? "50% 50%" }}
        />
      )}
    </div>
  );
}
