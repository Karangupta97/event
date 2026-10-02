import type { Alert, AlertSeverity } from "./types";
import type { Zone } from "@/features/zones/types";
import { zonePct, zoneStatus, minutesToCritical } from "@/features/zones/types";
import { uid } from "@/store/useCrowdStore";

/**
 * Derives whether a zone currently warrants an alert, and at what severity.
 * Returns null when the zone is calm.
 */
export function evaluateZoneAlert(
  zone: Zone,
): { severity: AlertSeverity; type: string; message: string } | null {
  const status = zoneStatus(zone.count, zone.capacity);
  const pct = zonePct(zone.count, zone.capacity);
  const mins = minutesToCritical(zone.history, zone.capacity);

  if (status === "high") {
    return {
      severity: "critical",
      type: "Crowd congestion",
      message: `${zone.name} is critically crowded at ${pct}% capacity.`,
    };
  }
  if (status === "busy" && mins !== null && mins <= 6) {
    return {
      severity: "warning",
      type: "Filling fast",
      message: `${zone.name} at ${pct}% and rising — projected critical in ~${mins} min.`,
    };
  }
  if (status === "busy") {
    return {
      severity: "warning",
      type: "Elevated occupancy",
      message: `${zone.name} is busy at ${pct}% capacity.`,
    };
  }
  return null;
}

/** severity level key used for dedupe: one open alert per zone+level */
function levelKey(sev: AlertSeverity): string {
  return sev;
}

/**
 * Given current zones and existing alerts, produce any NEW alerts to add.
 * Dedupes per zone + severity level: we won't raise a second "critical"
 * for a zone that already has an open/assigned critical alert.
 */
export function deriveNewAlerts(zones: Zone[], existing: Alert[]): Alert[] {
  const openByZoneLevel = new Set(
    existing
      .filter((a) => a.status !== "resolved")
      .map((a) => `${a.zoneId}:${levelKey(a.severity)}`),
  );

  const next: Alert[] = [];
  for (const zone of zones) {
    const evalResult = evaluateZoneAlert(zone);
    if (!evalResult) continue;
    const key = `${zone.id}:${levelKey(evalResult.severity)}`;
    if (openByZoneLevel.has(key)) continue;
    openByZoneLevel.add(key);
    next.push({
      id: uid("alert"),
      type: evalResult.type,
      severity: evalResult.severity,
      zoneId: zone.id,
      message: evalResult.message,
      status: "open",
      t: Date.now(),
    });
  }
  return next;
}

/** auto-resolve alerts whose zone has recovered to normal */
export function autoResolve(zones: Zone[], alerts: Alert[]): Alert[] {
  const byId = new Map(zones.map((z) => [z.id, z]));
  return alerts.map((a) => {
    if (a.status === "resolved") return a;
    const z = byId.get(a.zoneId);
    if (!z) return a;
    const status = zoneStatus(z.count, z.capacity);
    if (status === "normal" && (a.severity === "critical" || a.severity === "warning")) {
      return { ...a, status: "resolved" as const };
    }
    return a;
  });
}
