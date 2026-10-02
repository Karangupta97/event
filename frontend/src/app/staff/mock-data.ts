import type {
  Alert,
  EmergencyAlert,
  StaffSession,
  TeamInfo,
  Volunteer,
  Zone,
} from "./types";

export const EVENT_NAME = "EventFlow 2025";

export const staffSession: StaffSession = {
  name: "Volunteer",
  zoneId: "stage-area",
  online: true,
};

export const teamInfo: TeamInfo = {
  total: 3,
  nearby: 1,
  otherZones: 2,
};

export const zones: Zone[] = [
  {
    id: "food-court",
    name: "Food Court",
    current: 1240,
    capacity: 1500,
    level: "high",
    icon: "utensils",
    mapStyle: { top: "8%", left: "38%", width: "28%", height: "22%" },
  },
  {
    id: "expo-zone",
    name: "Expo Zone",
    current: 620,
    capacity: 1000,
    level: "busy",
    icon: "building",
    mapStyle: { top: "34%", left: "42%", width: "26%", height: "20%" },
  },
  {
    id: "workshop-hall",
    name: "Workshop Hall",
    current: 430,
    capacity: 800,
    level: "busy",
    icon: "users",
    mapStyle: { top: "58%", left: "48%", width: "24%", height: "18%" },
  },
  {
    id: "gaming-zone",
    name: "Gaming Zone",
    current: 310,
    capacity: 800,
    level: "normal",
    icon: "gamepad",
    mapStyle: { top: "12%", left: "8%", width: "26%", height: "28%" },
  },
  {
    id: "stage-area",
    name: "Stage Area",
    current: 482,
    capacity: 1000,
    level: "normal",
    icon: "stage",
    mapStyle: { top: "48%", left: "10%", width: "28%", height: "26%" },
  },
  {
    id: "main-entry",
    name: "Main Entry",
    current: 210,
    capacity: 600,
    level: "normal",
    icon: "gate",
    mapStyle: { top: "78%", left: "18%", width: "22%", height: "16%" },
  },
];

export const volunteers: Volunteer[] = [
  {
    id: "v1",
    name: "Rohan S.",
    status: "available",
    initials: "RS",
    avatarColor: "bg-blue-500",
  },
  {
    id: "v2",
    name: "Neha P.",
    status: "busy",
    initials: "NP",
    avatarColor: "bg-violet-500",
  },
  {
    id: "v3",
    name: "Aakash R.",
    status: "available",
    initials: "AR",
    avatarColor: "bg-emerald-500",
  },
  {
    id: "v4",
    name: "Priya M.",
    status: "available",
    initials: "PM",
    avatarColor: "bg-amber-500",
  },
];

export const emergencyAlert: EmergencyAlert = {
  id: "em1",
  title: "Emergency Alert",
  message: "Crowd congestion detected in Food Court",
  priority: "high",
  time: "02:14 PM",
  type: "emergency",
};

export const earlyWarning: EmergencyAlert = {
  id: "ew1",
  title: "Early Warning",
  message: "Food Court will reach 85% capacity in 8 min.",
  priority: "high",
  time: "02:10 PM",
  type: "early-warning",
};

export const alerts: Alert[] = [
  {
    id: "a1",
    zoneId: "food-court",
    zoneName: "Food Court",
    title: "Crowd congestion",
    description: "Assigned to Rohan S.",
    assignee: "Rohan S.",
    status: "assigned",
    priority: "high",
    time: "02:14 PM",
    level: "high",
  },
  {
    id: "a2",
    zoneId: "main-entry",
    zoneName: "Main Entry",
    title: "Queue growing",
    description: "Assigned to Neha P.",
    assignee: "Neha P.",
    status: "on-site",
    priority: "medium",
    time: "01:52 PM",
    level: "busy",
  },
  {
    id: "a3",
    zoneId: "expo-zone",
    zoneName: "Expo Zone",
    title: "All clear",
    description: "Resolved by Aakash R.",
    assignee: "Aakash R.",
    status: "resolved",
    priority: "low",
    time: "12:37 PM",
    level: "normal",
  },
];

export function occupancyPercent(current: number, capacity: number): number {
  return Math.round((current / capacity) * 100);
}

export function getZoneById(id: string): Zone | undefined {
  return zones.find((z) => z.id === id);
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
