import { knowledge } from "@/lib/ai/knowledge";
import { finderData } from "@/content/uae";

export const dynamic = "force-static";
/** Static JSON of every Dubai page in ar (departments, services, supplements, clinic), for the assistant and the AI team. */
export function GET() {
  return Response.json({ locale: "ar", generated: new Date().toISOString().slice(0, 10), docs: knowledge("ar"), concerns: finderData("ar").map((c) => ({ label: c.label, en: c.en, urls: c.picks.map((p) => p.href) })) });
}
