import type { Locale } from "@/i18n";
import { departments, deptHref, serviceHref, servicesOf } from "./index";

/** Small menu data for the header and footer (built on the server, passed as props, so pages do not ship all content). */
export interface NavDept { id: string; name: string; short: string; icon: string; href: string; top: { name: string; href: string }[] }
export type NavData = Record<Locale, NavDept[]>;

export const navData = (): NavData => {
  const build = (l: Locale) => departments(l).map((d) => ({
    id: d.id, name: d.name, short: d.short, icon: d.icon, href: deptHref(d, l),
    top: servicesOf(d).slice(0, 4).map((s) => ({ name: s.name, href: serviceHref(d, s, l) })),
  }));
  return { en: build("en"), ar: build("ar") };
};
