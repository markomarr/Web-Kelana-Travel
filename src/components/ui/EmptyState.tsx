import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyState({ title, description, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="mb-4"
      >
        <circle cx="60" cy="60" r="60" fill="#EEF2F7" />
        <circle cx="40" cy="80" r="6" fill="#1A3C5E" />
        <circle cx="80" cy="40" r="6" fill="#E8A020" />
        <path
          d="M40 80 C 55 65, 65 55, 80 40"
          stroke="#8896A7"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="none"
        />
      </svg>
      <h3 className="font-display text-lg font-bold text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-accent-hover"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
