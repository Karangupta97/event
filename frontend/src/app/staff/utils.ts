import type { AlertStatus, OccupancyLevel } from "./types";

export const levelStyles: Record<
  OccupancyLevel,
  {
    border: string;
    bg: string;
    bgSoft: string;
    text: string;
    badge: string;
    ring: string;
    dot: string;
  }
> = {
  normal: {
    border: "border-emerald-400",
    bg: "bg-emerald-50",
    bgSoft: "bg-emerald-100/60",
    text: "text-emerald-700",
    badge: "bg-emerald-500 text-white",
    ring: "stroke-emerald-500",
    dot: "bg-emerald-500",
  },
  busy: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    bgSoft: "bg-amber-100/60",
    text: "text-amber-700",
    badge: "bg-amber-400 text-white",
    ring: "stroke-amber-400",
    dot: "bg-amber-400",
  },
  high: {
    border: "border-red-400",
    bg: "bg-red-50",
    bgSoft: "bg-red-100/60",
    text: "text-red-700",
    badge: "bg-red-500 text-white",
    ring: "stroke-red-500",
    dot: "bg-red-500",
  },
};

export const statusStyles: Record<
  AlertStatus,
  { label: string; className: string }
> = {
  assigned: {
    label: "Assigned",
    className: "bg-red-100 text-red-700",
  },
  "on-site": {
    label: "On-site",
    className: "bg-amber-100 text-amber-700",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-100 text-emerald-700",
  },
};

export const levelLabels: Record<OccupancyLevel, string> = {
  normal: "Normal",
  busy: "Busy",
  high: "High",
};
