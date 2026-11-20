import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * English (/…) and Arabic (/ar/…) pages use two different root layouts. A link between them must be a normal page
 * load: next/link would first try an in-app navigation, then reload (two requests, a visible delay).
 * SmartLink uses a plain <a> for those links and next/link for everything else.
 */
export function SmartLink({ href, from, ...rest }: ComponentProps<"a"> & { href: string; from: string }) {
  const isAr = (p: string) => p === "/ar" || p.startsWith("/ar/");
  if (isAr(href) !== isAr(from)) return <a href={href} {...rest} />;
  return <Link href={href} {...(rest as Omit<ComponentProps<typeof Link>, "href">)} />;
}
