import {
  Snowflake,
  BatteryCharging,
  Bath,
  Wifi,
  Music,
  Tv,
  Cookie,
  type LucideIcon,
} from "lucide-react";

/**
 * Parse field `facilities` (Json) dari Prisma menjadi array string.
 * Menangani null/undefined/format tidak terduga dengan aman.
 */
export function parseFacilities(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export const FACILITY_ICONS: Record<string, LucideIcon> = {
  AC: Snowflake,
  Charger: BatteryCharging,
  Toilet: Bath,
  WiFi: Wifi,
  Musik: Music,
  TV: Tv,
  Snack: Cookie,
};
