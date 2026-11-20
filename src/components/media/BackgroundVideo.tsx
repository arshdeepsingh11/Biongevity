"use client";
import { useRef } from "react";
import { useAutoplay } from "./useAutoplay";

/** A silent, looping background video that starts on phones too (see useAutoplay). */
export function BackgroundVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplay(ref);
  return (
    <video ref={ref} className={className} poster={poster} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden>
      <source src={src} type="video/mp4" />
    </video>
  );
}
