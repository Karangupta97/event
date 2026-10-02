"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { Zone } from "../types";
import { zonePct, zoneStatus } from "../types";
import { ZONE_THEME } from "@/components/ui/status";
import { useCrowdStore } from "@/store/useCrowdStore";
import { cn } from "@/components/ui/cn";

/**
 * Compact live-monitoring ticker: a single row of zone pills with a status
 * dot, name, mini progress bar and percentage. Scrolls horizontally on
 * narrow screens; fits all zones on one row at desktop widths.
 */
export function LiveStatusStrip({ zones }: { zones: Zone[] }) {
  const selectZone = useCrowdStore((s) => s.selectZone);
  const selectedId = useCrowdStore((s) => s.selectedZoneId);

  return (
    <div className="flex items-center gap-2 overflow-x-auto thin-scroll rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-card">
      {/* label */}
      <div className="flex shrink-0 items-center gap-1.5 border-r border-slate-100 pr-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          <Activity className="h-3 w-3" />
        </span>
        <div className="leading-none">
          <p className="text-[11px] font-semibold text-slate-900">Live Crowd</p>
          <p className="text-[10px] text-slate-400">every 2s</p>
        </div>
      </div>

      {/* zone pills */}
      {zones.map((z) => {
        const status = zoneStatus(z.count, z.capacity);
        const theme = ZONE_THEME[status];
        const pct = zonePct(z.count, z.capacity);
        const selected = selectedId === z.id;
        return (
          <button
            key={z.id}
            onClick={() => selectZone(z.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1 transition-colors",
              selected
                ? "border-blue-300 bg-blue-50/50"
                : "border-slate-200 bg-white hover:bg-slate-50",
            )}
          >
            <span className="relative flex h-2 w-2">
              {status === "high" && (
                <span
                  className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full"
                  style={{ background: theme.accent, opacity: 0.6 }}
                />
              )}
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: theme.accent }}
              />
            </span>
            <span className="whitespace-nowrap text-[11px] font-medium text-slate-700">
              {z.name}
            </span>
            <span className="h-1 w-8 overflow-hidden rounded-full bg-slate-100">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: theme.accent }}
                animate={{ width: `${Math.min(100, pct)}%` }}
                transition={{ duration: 0.5 }}
              />
            </span>
            <span
              className="tnum text-[11px] font-semibold tabular-nums"
              style={{ color: theme.text }}
            >
              {pct}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
