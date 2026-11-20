/**
 * The assistant's mark: a soft four-point spark inside a ring, drawn for Biongevity (replaces the old orb).
 * Decorative; the button around it carries the label.
 */
export function AiMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <path d="M12 4.6c.5 3.6 1.9 5 5.4 5.4v.1c-3.5.5-4.9 1.9-5.4 5.4h-.1c-.5-3.5-1.9-4.9-5.4-5.4V10c3.5-.4 4.9-1.8 5.4-5.4z" fill="currentColor" transform="translate(0 1.9)" />
      <circle cx="17.6" cy="6.4" r="1.35" fill="currentColor" />
    </svg>
  );
}
