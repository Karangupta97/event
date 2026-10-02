"use client";

import { motion } from "framer-motion";
import { Users, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Zone } from "@/features/zones/types";
import { zoneStatus } from "@/features/zones/types";
import { ZONE_THEME } from "@/components/ui/status";

/** per-zone staffing coverage: assigned vs needed */
export function StaffingNeeds({ zones }: { zones: Zone[] }) {
  const sorted = [...zones].sort(
    (a, b) => b.staffNeeded - b.staff - (a.staffNeeded - a.staff),
  );

  return (
    <Card padded={false}>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Zone Staffing</h3>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Users className="h-3.5 w-3.5" /> assigned / needed
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {sorted.map((z) => {
          const gap = z.staffNeeded - z.staff;
          const theme = ZONE_THEME[zoneStatus(z.count, z.capacity)];
          const coverage = Math.min(100, (z.staff / z.staffNeeded) * 100);
          return (
            <li key={z.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: theme.accent }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{z.name}</p>
                  <span
                    className={`tnum text-xs font-semibold ${gap > 0 ? "text-amber-600" : "text-slate-500"}`}
                  >
                    {z.staff} / {z.staffNeeded}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: gap > 0 ? "#f59e0b" : "#22c55e" }}
                    animate={{ width: `${coverage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              {gap > 0 && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                  <AlertTriangle className="h-3 w-3" /> +{gap}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
