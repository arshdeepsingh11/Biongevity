"use client";
import { Visit3D } from "./Visit3D";
import { CALGARY_VISIT, DUBAI_VISIT } from "@/data/visits";
import { Head } from "@/components/home/HomeSections";

/** The in-person visit, walked through in 3D — Calgary for the Virtual Clinic page, Dubai for the UAE clinic. */
export function VisitSection({ id }: { id: "virtual" | "uae" | string }) {
  const uae = id === "uae";
  return (
    <>
      <Head n="3D" label={uae ? "Your assessment day, in 3D" : "Your in-person visit, in 3D"}
        title={uae ? "Walk through a day at the Dubai clinic." : "See the clinic visit before you go."}
        lede={uae
          ? "From the lift lobby at AB Center to your plan: registration, consents, body composition, fitness testing, lab and genetic samples and the precision consultation — with what to bring at each stop."
          : "Virtual care covers most visits — when you do come in, this is the route: arrival, reception, the formalities, vitals, lab, consultation and your plan. Follow yourself or look over the whole floor."} />
      <div className="mt-8"><Visit3D visit={uae ? DUBAI_VISIT : CALGARY_VISIT} title={uae ? "Biongevity Clinic Dubai" : "Biongevity Calgary"} /></div>
    </>
  );
}
