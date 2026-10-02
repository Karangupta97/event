import type { ZoneStatus } from "@/features/zones/types";
import type { AlertSeverity, AlertStatus } from "@/features/alerts/types";

export interface StatusTheme {
  /** solid-ish accent */
  accent: string;
  /** soft tinted bg */
  tintBg: string;
  /** darker text on tint */
  text: string;
  /** border on tint */
  border: string;
  /** svg fill for zone shapes */
  svgFill: string;
  svgStroke: string;
  label: string;
}

export const ZONE_THEME: Record<ZoneStatus, StatusTheme> = {
  normal: {
    accent: "#16a34a",
    tintBg: "#f0fdf4",
    text: "#15803d",
    border: "#bbf7d0",
    svgFill: "#dcfce7",
    svgStroke: "#86efac",
    label: "Normal",
  },
  busy: {
    accent: "#d97706",
    tintBg: "#fffbeb",
    text: "#b45309",
    border: "#fde68a",
    svgFill: "#fef3c7",
    svgStroke: "#fcd34d",
    label: "Busy",
  },
  high: {
    accent: "#dc2626",
    tintBg: "#fef2f2",
    text: "#b91c1c",
    border: "#fecaca",
    svgFill: "#fee2e2",
    svgStroke: "#fca5a5",
    label: "High",
  },
};

export const SEVERITY_THEME: Record<AlertSeverity, StatusTheme> = {
  info: ZONE_THEME.normal,
  warning: ZONE_THEME.busy,
  critical: ZONE_THEME.high,
};

export const ALERT_STATUS_LABEL: Record<AlertStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  on_site: "On-site",
  resolved: "Resolved",
};

export const ALERT_STATUS_PILL: Record<
  AlertStatus,
  { bg: string; text: string }
> = {
  open: { bg: "bg-slate-100", text: "text-slate-600" },
  assigned: { bg: "bg-red-50", text: "text-red-600" },
  on_site: { bg: "bg-amber-50", text: "text-amber-600" },
  resolved: { bg: "bg-green-50", text: "text-green-600" },
};

export function formatTime(t: number): string {
  return new Date(t).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
