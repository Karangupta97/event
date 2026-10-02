/**
 * Shared mock data for the Venuro event companion app.
 * Centralized here so Home, Zone Picker, Map, Facilities, etc. stay in sync.
 */

export type CrowdLevel = "low" | "medium" | "high";

export interface Zone {
  id: string;
  name: string;
  category: string;
  crowd: CrowdLevel;
  /** 0-100 percentage of capacity in use */
  capacity: number;
  waitMins: number;
  open: boolean;
  /** rough position on the schematic map, percentages */
  x: number;
  y: number;
}

export interface EventUpdate {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: "schedule" | "alert" | "info";
}

export interface Suggestion {
  id: string;
  title: string;
  reason: string;
  zoneId?: string;
  tag: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "alert" | "info" | "reminder";
  unread: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: "food" | "restroom" | "medical" | "wifi" | "water" | "atm";
  zone: string;
  distance: string;
  status: string;
  open: boolean;
}

export interface ParkingLot {
  id: string;
  name: string;
  spotsLeft: number;
  total: number;
  distance: string;
}

export interface TransitLine {
  id: string;
  name: string;
  detail: string;
  eta: string;
  status: "on-time" | "delayed" | "crowded";
}

export const eventInfo = {
  name: "Horizon Music Festival",
  venue: "Riverside Grounds",
  dateLabel: "Sat, Oct 3 · 12:00–23:00",
  weather: "24°C · Clear",
};

export const zones: Zone[] = [
  { id: "main-stage", name: "Main Stage", category: "Stage", crowd: "high", capacity: 88, waitMins: 0, open: true, x: 50, y: 24 },
  { id: "second-stage", name: "River Stage", category: "Stage", crowd: "medium", capacity: 54, waitMins: 0, open: true, x: 22, y: 40 },
  { id: "food-court", name: "Food Court", category: "Food", crowd: "high", capacity: 79, waitMins: 12, open: true, x: 74, y: 46 },
  { id: "chill-zone", name: "Chill Lawn", category: "Lounge", crowd: "low", capacity: 28, waitMins: 0, open: true, x: 36, y: 64 },
  { id: "market", name: "Artisan Market", category: "Shopping", crowd: "medium", capacity: 61, waitMins: 5, open: true, x: 66, y: 70 },
  { id: "vip-deck", name: "VIP Deck", category: "Lounge", crowd: "low", capacity: 34, waitMins: 0, open: true, x: 50, y: 84 },
];

export const eventUpdates: EventUpdate[] = [
  { id: "u1", title: "Headliner moved up 15 min", detail: "Aurora now takes the Main Stage at 20:45.", time: "4m ago", kind: "schedule" },
  { id: "u2", title: "Food Court busy", detail: "Expect ~12 min waits. Try the River Stage vendors.", time: "11m ago", kind: "alert" },
  { id: "u3", title: "Lost & Found open", detail: "Near the East entrance, next to Info Point.", time: "32m ago", kind: "info" },
];

export const suggestions: Suggestion[] = [
  { id: "s1", title: "Head to River Stage now", reason: "Lower crowd and a set you'd like starts in 10 min.", zoneId: "second-stage", tag: "Less busy" },
  { id: "s2", title: "Grab food before 19:00", reason: "Food Court waits climb sharply after the headliner.", zoneId: "food-court", tag: "Beat the rush" },
  { id: "s3", title: "Rest at Chill Lawn", reason: "Quiet right now — good spot between sets.", zoneId: "chill-zone", tag: "Quiet" },
  { id: "s4", title: "Visit Artisan Market", reason: "Based on your interest in local crafts.", zoneId: "market", tag: "For you" },
];

export const notifications: AppNotification[] = [
  { id: "n1", title: "Set time changed", body: "Aurora moved to 20:45 on the Main Stage.", time: "4m ago", kind: "alert", unread: true },
  { id: "n2", title: "Your friend checked in", body: "Sam is now near the River Stage.", time: "20m ago", kind: "info", unread: true },
  { id: "n3", title: "Reminder", body: "Shuttle to downtown departs every 20 min from Gate C.", time: "1h ago", kind: "reminder", unread: false },
  { id: "n4", title: "Weather note", body: "Clear skies through the evening. Bring a light layer.", time: "2h ago", kind: "info", unread: false },
];

export const facilities: Facility[] = [
  { id: "f1", name: "Food Court", type: "food", zone: "Central", distance: "120 m", status: "~12 min wait", open: true },
  { id: "f2", name: "Restrooms — North", type: "restroom", zone: "Main Stage", distance: "60 m", status: "Short line", open: true },
  { id: "f3", name: "Medical Tent", type: "medical", zone: "East Gate", distance: "210 m", status: "Staffed 24/7", open: true },
  { id: "f4", name: "Water Refill", type: "water", zone: "Chill Lawn", distance: "90 m", status: "Free", open: true },
  { id: "f5", name: "Free Wi-Fi Point", type: "wifi", zone: "Info Point", distance: "150 m", status: "Fast", open: true },
  { id: "f6", name: "Cash Machine", type: "atm", zone: "Artisan Market", distance: "180 m", status: "Available", open: true },
  { id: "f7", name: "Restrooms — South", type: "restroom", zone: "VIP Deck", distance: "240 m", status: "No line", open: true },
];

export const parkingLots: ParkingLot[] = [
  { id: "p1", name: "Lot A — Main", spotsLeft: 42, total: 400, distance: "5 min walk" },
  { id: "p2", name: "Lot B — East", spotsLeft: 180, total: 320, distance: "9 min walk" },
  { id: "p3", name: "Lot C — Overflow", spotsLeft: 260, total: 300, distance: "14 min walk" },
];

export const transitLines: TransitLine[] = [
  { id: "t1", name: "Shuttle · Downtown", detail: "Gate C · every 20 min", eta: "6 min", status: "on-time" },
  { id: "t2", name: "Metro Line 2", detail: "Riverside Station", eta: "11 min", status: "crowded" },
  { id: "t3", name: "Bus 48", detail: "West Entrance stop", eta: "18 min", status: "delayed" },
];

export const crowdColors: Record<CrowdLevel, { dot: string; text: string; chip: string; label: string }> = {
  low: { dot: "bg-emerald-500", text: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700", label: "Low" },
  medium: { dot: "bg-amber-500", text: "text-amber-700", chip: "bg-amber-50 text-amber-700", label: "Moderate" },
  high: { dot: "bg-rose-500", text: "text-rose-700", chip: "bg-rose-50 text-rose-700", label: "Busy" },
};
