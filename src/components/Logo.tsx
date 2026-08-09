export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Yelken Börek Cafe logosu"
    >
      <circle cx="60" cy="60" r="58" fill="var(--brand-dark)" />
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="var(--brand-gold)"
        strokeWidth="3"
      />
      {/* Yelkenli */}
      <path d="M58 26 L58 78 L30 78 Z" fill="#ffffff" />
      <path d="M64 40 L64 78 L88 78 Z" fill="var(--brand-gold)" />
      <path
        d="M22 86 Q60 98 98 86"
        fill="none"
        stroke="var(--brand-gold)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
