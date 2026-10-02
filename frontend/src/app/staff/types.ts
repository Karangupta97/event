export type OccupancyLevel = "normal" | "busy" | "high";

export type AlertStatus = "assigned" | "on-site" | "resolved";

export type AlertPriority = "high" | "medium" | "low";

export type NavTab = "map" | "alerts" | "dispatch" | "settings";

export interface Zone {
  id: string;
  name: string;
  current: number;
  capacity: number;
  level: OccupancyLevel;
  icon: "utensils" | "gamepad" | "building" | "users" | "stage" | "gate";
  /** CSS grid / absolute positions for desktop map */
  mapStyle: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

export interface Volunteer {
  id: string;
  name: string;
  status: "available" | "busy" | "offline";
  initials: string;
  avatarColor: string;
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  title: string;
  description: string;
  assignee: string;
  status: AlertStatus;
  priority: AlertPriority;
  time: string;
  level: OccupancyLevel;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  priority: AlertPriority;
  time: string;
  type: "emergency" | "early-warning";
}

export interface TeamInfo {
  total: number;
  nearby: number;
  otherZones: number;
}

export interface StaffSession {
  name: string;
  zoneId: string;
  online: boolean;
}
