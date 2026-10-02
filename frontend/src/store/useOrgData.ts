"use client";

import { useCrowdStore } from "./useCrowdStore";

/** convenience selector bundle shared by org pages */
export function useOrgData() {
  const zones = useCrowdStore((s) => s.zones);
  const staff = useCrowdStore((s) => s.staff);
  const alerts = useCrowdStore((s) => s.alerts);
  const broadcasts = useCrowdStore((s) => s.broadcasts);
  const recommendations = useCrowdStore((s) => s.recommendations);
  const auditLog = useCrowdStore((s) => s.auditLog);
  const mode = useCrowdStore((s) => s.mode);
  const selectedZoneId = useCrowdStore((s) => s.selectedZoneId);

  const selectedZone =
    zones.find((z) => z.id === selectedZoneId) ?? zones[0] ?? null;
  const topRec =
    recommendations.find((r) => r.state !== "executed") ??
    recommendations[0] ??
    null;

  return {
    zones,
    staff,
    alerts,
    broadcasts,
    recommendations,
    auditLog,
    mode,
    selectedZoneId,
    selectedZone,
    topRec,
  };
}
