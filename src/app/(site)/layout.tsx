import "../globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
export { metadata, viewport } from "@/components/layout/SiteShell";

/** Root layout for English pages: International (/) and Dubai (/uae/…). */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
