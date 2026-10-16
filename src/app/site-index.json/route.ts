import { buildSiteIndex } from "@/lib/siteIndex";

/** Built once at `next build` into out/site-index.json — the on-device search index Biongevity SI answers are grounded in. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSiteIndex());
}
