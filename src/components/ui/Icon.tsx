import { ICONS, type IconName } from "./icons";

type Props = { name: IconName | string; size?: number; strokeWidth?: number; className?: string };

export function Icon({ name, size = 18, strokeWidth = 1.6, className }: Props) {
  const d = (ICONS as Record<string, string>)[name] ?? ICONS.sparkle;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={d} />
    </svg>
  );
}
