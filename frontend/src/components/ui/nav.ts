import {
  LayoutDashboard,
  Map,
  Bell,
  Send,
  Users,
  Radio,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** show live alert count badge */
  badge?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", href: "/org", icon: LayoutDashboard },
  { id: "live-map", label: "Live Map", href: "/org/map", icon: Map },
  { id: "alerts", label: "Alerts", href: "/org/alerts", icon: Bell, badge: true },
  { id: "dispatch", label: "Dispatch", href: "/org/dispatch", icon: Send },
  { id: "staff", label: "Staff", href: "/org/staff", icon: Users },
  { id: "broadcast", label: "Broadcast", href: "/org/broadcast", icon: Radio },
  { id: "analytics", label: "Analytics", href: "/org/analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", href: "/org/settings", icon: Settings },
];

/** resolve the active nav id from a pathname (longest-prefix match) */
export function activeNavId(pathname: string): string {
  // exact match first
  const exact = NAV_ITEMS.find((n) => n.href === pathname);
  if (exact) return exact.id;
  // otherwise longest href prefix (excluding the /org root to avoid catching all)
  const match = NAV_ITEMS.filter(
    (n) => n.href !== "/org" && pathname.startsWith(n.href),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  return match?.id ?? "overview";
}

/** header title + subtitle per route id */
export const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Command Overview",
    subtitle: "Live venue status at a glance — act before it gets crowded.",
  },
  "live-map": {
    title: "Live Map",
    subtitle: "Real-time occupancy across every zone.",
  },
  alerts: {
    title: "Alerts & Incidents",
    subtitle: "Triage, assign and resolve active incidents.",
  },
  dispatch: {
    title: "Staff Dispatch",
    subtitle: "Send responders where they're needed and track arrivals.",
  },
  staff: {
    title: "Staff Management",
    subtitle: "Roster, roles and zone coverage.",
  },
  broadcast: {
    title: "Broadcast Center",
    subtitle: "Message attendees and staff in seconds.",
  },
  analytics: {
    title: "Analytics & Reports",
    subtitle: "Occupancy trends and operations history.",
  },
  settings: {
    title: "Settings",
    subtitle: "Thresholds, zones and simulation controls.",
  },
};
