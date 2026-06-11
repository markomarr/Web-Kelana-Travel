import { icons, Sparkles, type LucideIcon } from "lucide-react";

/**
 * Resolve `icon_key` (mis. "shield", "user-check", "map-pin") dari tabel `features`
 * menjadi komponen Lucide React. Fallback ke Sparkles jika key tidak dikenal.
 */
export function getFeatureIcon(iconKey: string): LucideIcon {
  const pascalCase = iconKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return (icons as Record<string, LucideIcon>)[pascalCase] ?? Sparkles;
}
