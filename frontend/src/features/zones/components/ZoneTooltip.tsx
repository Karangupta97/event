"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { Zone } from "../types";
import { zonePct, zoneStatus } from "../types";
import { ZONE_THEME } from "@/components/ui/status";

function trendOf(history: number[]): "up" | "down" | "flat" {
  if (history.length < 6) return "flat";
  const recent = history.slice(-5);
  const delta = recent[recent.length - 1] - recent[0];
  if (delta > 15) return "up";
  if (delta < -15) return "down";
  return "flat";
}

export function ZoneTooltip({
  zone,
  neighborZone,
  x,
  y,
}: {
  zone: Zone;
  neighborZone: Zone | null;
  /** anchor position (CSS length, e.g. "42%") relative to the map container */
  x: string;
  y: string;
}) {
  const pct = zonePct(zone.count, zone.capacity);
  const status = zoneStatus(zone.count, zone.capacity);
  const theme = ZONE_THEME[status];
  const trend = trendOf(zone.history);
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-red-600"
      : trend === "down"
        ? "text-green-600"
        : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.14 }}
      style={{ left: x, top: y }}
      className="pointer-events-none absolute z-30 w-56 -translate-x-1/2 -translate-y-full"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card-hover">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            {zone.name}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: theme.tintBg, color: theme.text }}
          >
            {theme.label}
          </span>
        </div>
        <div className="space-y-1.5 text-xs">
          <Row label="Occupancy">
            <span className="tnum font-medium text-slate-900">
              {zone.count.toLocaleString()} / {zone.capacity.toLocaleString()}
            </span>
          </Row>
          <Row label="Capacity">
            <span className="flex items-center gap-1">
              <span className="tnum font-medium" style={{ color: theme.text }}>
                {pct}%
              </span>
              <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
            </span>
          </Row>
          <Row label="Staff assigned">
            <span className="tnum font-medium text-slate-900">{zone.staff}</span>
          </Row>
          {neighborZone && (
            <Row label="Nearest free">
              <span className="font-medium text-slate-900">
                {neighborZone.name}{" "}
                <span className="tnum text-slate-500">
                  ({zonePct(neighborZone.count, neighborZone.capacity)}%)
                </span>
              </span>
            </Row>
          )}
        </div>
      </div>
      {/* little pointer */}
      <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-slate-200 bg-white" />
    </motion.div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      {children}
    </div>
  );
}
