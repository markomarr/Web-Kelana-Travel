interface BadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ active, activeLabel = "Aktif", inactiveLabel = "Nonaktif" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
