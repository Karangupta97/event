"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatTime } from "@/components/ui/status";
import type { Alert } from "../types";
import { SEVERITY_RANK } from "../types";
import type { Zone } from "@/features/zones/types";

export function PriorityBanner({
  alerts,
  zones,
}: {
  alerts: Alert[];
  zones: Zone[];
}) {
  const active = alerts
    .filter((a) => a.status !== "resolved")
    .sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || b.t - a.t);
  const top = active[0];
  const zoneName = top
    ? (zones.find((z) => z.id === top.zoneId)?.name ?? top.zoneId)
    : null;

  return (
    <AnimatePresence mode="wait">
      {top ? (
        <motion.div
          key={top.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          layout
        >
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <TriangleAlert className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-red-700">
                    {top.severity === "critical"
                      ? "Emergency Alert"
                      : "Priority Alert"}
                  </h3>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                    High Priority
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate-700">
                  {top.type} in {zoneName}
                </p>
                <p className="mt-1 text-xs text-slate-500">{top.message}</p>
                <p className="mt-2 text-xs font-medium text-red-600 tnum">
                  {formatTime(top.t)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="all-clear"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          layout
        >
          <Card className="border-green-200 bg-green-50">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-green-700">
                  All zones normal
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  No active incidents. Crowd levels are within safe limits.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
