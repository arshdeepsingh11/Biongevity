import type { Metadata } from "next";
import AppPage from "../app/page";

/** The Digital Twin lives inside the Biongevity app — this address shows the same combined page (canonical: /app/). */
export const metadata: Metadata = {
  title: "Biongevity App & Digital Twin",
  description: "Your Digital Twin inside the Biongevity app — scores, live monitor, your body system by system, trends, what-if simulations and the AI coach, explained in plain words.",
  alternates: { canonical: "/app/" },
};

export default AppPage;
