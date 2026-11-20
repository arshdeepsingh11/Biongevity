import type { ReactNode } from "react";

/** Every page eases in on arrival (CSS only, see `.page-enter`). */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
