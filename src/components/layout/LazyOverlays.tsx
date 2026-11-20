"use client";
import dynamic from "next/dynamic";

/**
 * Site-wide overlays and effects. None of them shows anything until it is opened or triggered,
 * so they load after the page is interactive instead of adding to every page's first load.
 * Their state lives in providers (AIProvider, CartProvider), so opening one early still works.
 */
const AIAssistant = dynamic(() => import("@/components/ai/AIAssistant").then((m) => m.AIAssistant), { ssr: false });
const BagLayer = dynamic(() => import("@/components/shop/BagLayer").then((m) => m.BagLayer), { ssr: false });
const CommandBar = dynamic(() => import("@/components/ai/CommandBar").then((m) => m.CommandBar), { ssr: false });
const AskSelection = dynamic(() => import("@/components/ai/AskSelection").then((m) => m.AskSelection), { ssr: false });
const AINudge = dynamic(() => import("@/components/ai/AINudge").then((m) => m.AINudge), { ssr: false });
const ParticleField = dynamic(() => import("@/components/fx/ParticleField").then((m) => m.ParticleField), { ssr: false });
const MagneticCursor = dynamic(() => import("@/components/fx3d/MagneticCursor").then((m) => m.MagneticCursor), { ssr: false });

/** Background layer: rendered before the page content. */
export function LazyBackground() {
  return <ParticleField />;
}

/** Overlay layer: rendered after the page content. */
export function LazyOverlays() {
  return (
    <>
      <AIAssistant />
      <BagLayer />
      <CommandBar />
      <AskSelection />
      <AINudge />
      <MagneticCursor />
    </>
  );
}
