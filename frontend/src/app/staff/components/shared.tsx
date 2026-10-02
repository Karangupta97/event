"use client";

import {
  Building2,
  DoorOpen,
  Gamepad2,
  Landmark,
  MapPin,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Zone } from "../types";

const iconMap: Record<Zone["icon"], LucideIcon> = {
  utensils: UtensilsCrossed,
  gamepad: Gamepad2,
  building: Building2,
  users: Users,
  stage: Landmark,
  gate: DoorOpen,
};

export function ZoneIcon({
  icon,
  className = "h-4 w-4",
}: {
  icon: Zone["icon"] | "pin";
  className?: string;
}) {
  if (icon === "pin") {
    return <MapPin className={className} />;
  }
  const Icon = iconMap[icon];
  return <Icon className={className} />;
}

export function OccupancyRing({
  percent,
  size = 72,
  stroke = 6,
  className = "stroke-emerald-500",
}: {
  percent: number;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${percent}% occupancy`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={className}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
        {percent}%
      </span>
    </div>
  );
}

export function OnlineBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white font-medium text-slate-700 shadow-sm ${
        compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Online
    </span>
  );
}
