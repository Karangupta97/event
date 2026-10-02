import type { Staff } from "./types";

/** group staff by their current zone id */
export function groupByZone(staff: Staff[]): Record<string, Staff[]> {
  const map: Record<string, Staff[]> = {};
  for (const s of staff) {
    (map[s.zoneId] ??= []).push(s);
  }
  return map;
}

export const STATUS_PILL: Record<
  Staff["status"],
  { label: string; cls: string }
> = {
  available: { label: "Available", cls: "bg-green-50 text-green-700" },
  en_route: { label: "En route", cls: "bg-amber-50 text-amber-700" },
  assigned: { label: "On-site", cls: "bg-blue-50 text-blue-700" },
};
