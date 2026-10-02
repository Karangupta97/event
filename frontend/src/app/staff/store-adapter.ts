"use client";

/**
 * Adapter: bridges the shared org `useCrowdStore` (features/* domain models)
 * into the shapes the /staff UI already expects (app/staff/types.ts).
 *
 * This is what connects /staff to /org: both read and write the SAME store,
 * so live crowd counts, alerts, and dispatches flow between the two consoles.
 * The staff components keep their original look; only their data source
 * changes from static mock-data to this live, store-backed adapter.
 */

import { useMemo } from "react";
import { useCrowdStore } from "@/store/useCrowdStore";
import { zoneStatus } from "@/features/zones/types";
import type { Zone as OrgZone } from "@/features/zones/types";
import type { Staff as OrgStaff } from "@/features/staff/types";
import type { Alert as OrgAlert } from "@/features/alerts/types";
import type {
  Alert as StaffAlert,
  AlertPriority,
  AlertStatus as StaffAlertStatus,
  EmergencyAlert,
  OccupancyLevel,
  StaffSession,
  TeamInfo,
  Volunteer,
  Zone as StaffZone,
} from "./types";

/* ------------------------------------------------------------------ */
/* Zone-ID bridge: org uses short IDs, the staff map uses hyphenated   */
/* IDs that key its hotspot/icon maps. Keep both directions.           */
/* ------------------------------------------------------------------ */

const ORG_TO_STAFF_ZONE: Record<string, string> = {
  food: "food-court",
  expo: "expo-zone",
  workshop: "workshop-hall",
  gaming: "gaming-zone",
  stage: "stage-area",
  entry: "main-entry",
};

const STAFF_TO_ORG_ZONE: Record<string, string> = Object.fromEntries(
  Object.entries(ORG_TO_STAFF_ZONE).map(([org, staff]) => [staff, org]),
);

export function toStaffZoneId(orgZoneId: string): string {
  return ORG_TO_STAFF_ZONE[orgZoneId] ?? orgZoneId;
}

export function toOrgZoneId(staffZoneId: string): string {
  return STAFF_TO_ORG_ZONE[staffZoneId] ?? staffZoneId;
}

/* ------------------------------------------------------------------ */
/* Presentation lookups to recreate the staff view fields.             */
/* ------------------------------------------------------------------ */

const STAFF_ZONE_ICON: Record<string, StaffZone["icon"]> = {
  "food-court": "utensils",
  "expo-zone": "building",
  "workshop-hall": "users",
  "gaming-zone": "gamepad",
  "stage-area": "stage",
  "main-entry": "gate",
};

/** absolute positions used by the old staff desktop/mobile cards */
const STAFF_ZONE_MAPSTYLE: Record<string, StaffZone["mapStyle"]> = {
  "food-court": { top: "8%", left: "38%", width: "28%", height: "22%" },
  "expo-zone": { top: "34%", left: "42%", width: "26%", height: "20%" },
  "workshop-hall": { top: "58%", left: "48%", width: "24%", height: "18%" },
  "gaming-zone": { top: "12%", left: "8%", width: "26%", height: "28%" },
  "stage-area": { top: "48%", left: "10%", width: "28%", height: "26%" },
  "main-entry": { top: "78%", left: "18%", width: "22%", height: "16%" },
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function orgLevelToStaff(count: number, capacity: number): OccupancyLevel {
  // zoneStatus already returns "normal" | "busy" | "high"
  return zoneStatus(count, capacity);
}

function severityToPriority(sev: OrgAlert["severity"]): AlertPriority {
  if (sev === "critical") return "high";
  if (sev === "warning") return "medium";
  return "low";
}

/** org alert status -> the 3-state staff status (collapse open->assigned) */
function orgStatusToStaff(status: OrgAlert["status"]): StaffAlertStatus {
  switch (status) {
    case "on_site":
      return "on-site";
    case "resolved":
      return "resolved";
    case "assigned":
    case "open":
    default:
      return "assigned";
  }
}

function fmtTime(t: number): string {
  try {
    return new Date(t).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/* Converters                                                          */
/* ------------------------------------------------------------------ */

function zoneToStaff(z: OrgZone): StaffZone {
  const staffId = toStaffZoneId(z.id);
  return {
    id: staffId,
    name: z.name,
    current: z.count,
    capacity: z.capacity,
    level: orgLevelToStaff(z.count, z.capacity),
    icon: STAFF_ZONE_ICON[staffId] ?? "users",
    mapStyle: STAFF_ZONE_MAPSTYLE[staffId] ?? {
      top: "0%",
      left: "0%",
      width: "20%",
      height: "20%",
    },
  };
}

function staffToVolunteer(s: OrgStaff, idx: number): Volunteer {
  const status: Volunteer["status"] =
    s.status === "available" ? "available" : "busy";
  return {
    id: s.id,
    name: s.name,
    status,
    initials: initialsOf(s.name),
    avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
  };
}

function alertToStaff(
  a: OrgAlert,
  zonesById: Map<string, OrgZone>,
  staffById: Map<string, OrgStaff>,
): StaffAlert {
  const zone = zonesById.get(a.zoneId);
  const assignee = a.assignedTo ? staffById.get(a.assignedTo)?.name : undefined;
  const status = orgStatusToStaff(a.status);
  const description =
    status === "resolved"
      ? assignee
        ? `Resolved by ${assignee}`
        : "Resolved"
      : assignee
        ? `Assigned to ${assignee}`
        : "Awaiting assignment";

  return {
    id: a.id,
    zoneId: toStaffZoneId(a.zoneId),
    zoneName: zone?.name ?? a.zoneId,
    title: a.message,
    description,
    assignee: assignee ?? "—",
    status,
    priority: severityToPriority(a.severity),
    time: fmtTime(a.t),
    level: zone ? orgLevelToStaff(zone.count, zone.capacity) : "normal",
  };
}

/* ------------------------------------------------------------------ */
/* Public hook: everything the staff console needs, from the live store*/
/* ------------------------------------------------------------------ */

export const EVENT_NAME = "EventFlow 2025";

/** staff session: the current volunteer is the first roster member */
const SESSION_STAFF_INDEX = 0;

export interface StaffData {
  eventName: string;
  session: StaffSession;
  zones: StaffZone[];
  volunteers: Volunteer[];
  alerts: StaffAlert[];
  teamInfo: TeamInfo;
  emergencyAlert: EmergencyAlert | null;
  earlyWarning: EmergencyAlert | null;
  getZoneById: (staffZoneId: string) => StaffZone | undefined;
}

export function useStaffData(): StaffData {
  const zones = useCrowdStore((s) => s.zones);
  const staff = useCrowdStore((s) => s.staff);
  const alerts = useCrowdStore((s) => s.alerts);
  const mode = useCrowdStore((s) => s.mode);
  const emergencyStartedAt = useCrowdStore((s) => s.emergencyStartedAt);

  return useMemo<StaffData>(() => {
    const zonesById = new Map(zones.map((z) => [z.id, z]));
    const staffById = new Map(staff.map((s) => [s.id, s]));

    const staffZones = zones.map(zoneToStaff);
    const volunteers = staff.map(staffToVolunteer);

    const me = staff[SESSION_STAFF_INDEX];
    const myZoneOrgId = me?.zoneId ?? zones[0]?.id ?? "food";
    const session: StaffSession = {
      name: me?.name ?? "Volunteer",
      zoneId: toStaffZoneId(myZoneOrgId),
      online: true,
    };

    // team info relative to the session volunteer's zone
    const nearby = staff.filter(
      (s) => s.zoneId === myZoneOrgId && s.id !== me?.id,
    ).length;
    const teamInfo: TeamInfo = {
      total: staff.length,
      nearby,
      otherZones: Math.max(0, staff.length - 1 - nearby),
    };

    const staffAlerts = alerts.map((a) =>
      alertToStaff(a, zonesById, staffById),
    );

    // Emergency banner: prefer a critical alert; early warning: the first
    // zone trending toward capacity (busy/high but not yet resolved).
    const critical = alerts.find(
      (a) => a.severity === "critical" && a.status !== "resolved",
    );
    const warning = alerts.find(
      (a) => a.severity === "warning" && a.status !== "resolved",
    );

    const emergencyAlert: EmergencyAlert | null =
      mode === "emergency"
        ? {
            id: "em-mode",
            title: "Emergency Alert",
            message: "Emergency protocol active — follow dispatch instructions.",
            priority: "high",
            time: emergencyStartedAt ? fmtTime(emergencyStartedAt) : "",
            type: "emergency",
          }
        : critical
          ? {
              id: critical.id,
              title: "Emergency Alert",
              message: `${zonesById.get(critical.zoneId)?.name ?? "Zone"}: ${critical.message}`,
              priority: "high",
              time: fmtTime(critical.t),
              type: "emergency",
            }
          : null;

    const earlyWarning: EmergencyAlert | null = warning
      ? {
          id: warning.id,
          title: "Early Warning",
          message: `${zonesById.get(warning.zoneId)?.name ?? "Zone"}: ${warning.message}`,
          priority: "high",
          time: fmtTime(warning.t),
          type: "early-warning",
        }
      : null;

    const getZoneById = (staffZoneId: string) =>
      staffZones.find((z) => z.id === staffZoneId);

    return {
      eventName: EVENT_NAME,
      session,
      zones: staffZones,
      volunteers,
      alerts: staffAlerts,
      teamInfo,
      emergencyAlert,
      earlyWarning,
      getZoneById,
    };
  }, [zones, staff, alerts, mode, emergencyStartedAt]);
}

/* ------------------------------------------------------------------ */
/* Shared presentation helpers (kept here so components can drop the   */
/* old mock-data import).                                              */
/* ------------------------------------------------------------------ */

export function occupancyPercent(current: number, capacity: number): number {
  if (!capacity) return 0;
  return Math.round((current / capacity) * 100);
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
