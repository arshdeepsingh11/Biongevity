import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

/** Private: contact enquiries for the Biongevity team. Not linked anywhere, not in the sitemap or site search. */
export default function AdminPage() {
  return (
    <section className="pb-24 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
      <div className="container-x flex justify-center">
        <AdminPanel />
      </div>
    </section>
  );
}
