"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  ALERT_STATUS_LABEL,
  ALERT_STATUS_PILL,
  SEVERITY_THEME,
  formatTime,
} from "@/components/ui/status";
import type { Alert } from "../types";
import { SEVERITY_RANK } from "../types";
import type { Zone } from "@/features/zones/types";
import type { Staff } from "@/features/staff/types";

export function ActiveAlerts({
  alerts,
  zones,
  staff,
  limit = 5,
}: {
  alerts: Alert[];
  zones: Zone[];
  staff: Staff[];
  limit?: number;
}) {
  const sorted = [...alerts].sort(
    (a, b) =>
      Number(a.status === "resolved") - Number(b.status === "resolved") ||
      SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
      b.t - a.t,
  );
  const shown = sorted.slice(0, limit);
  const activeCount = alerts.filter((a) => a.status !== "resolved").length;

  return (
    <Card>
      <CardHeader
        title="Active Alerts"
        right={
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
            View all
          </button>
        }
      />
      {shown.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No alerts yet — all zones are calm.
        </p>
      ) : (
        <ul className="-mx-2">
          <AnimatePresence initial={false}>
            {shown.map((a) => {
              const zone = zones.find((z) => z.id === a.zoneId);
              const assignee = a.assignedTo
                ? staff.find((s) => s.id === a.assignedTo)
                : null;
              const theme = SEVERITY_THEME[a.severity];
              const pill = ALERT_STATUS_PILL[a.status];
              const Icon =
                a.status === "resolved"
                  ? CheckCircle2
                  : a.severity === "critical"
                    ? TriangleAlert
                    : AlertCircle;
              return (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        a.status === "resolved" ? "#f0fdf4" : theme.tintBg,
                      color: a.status === "resolved" ? "#16a34a" : theme.accent,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {zone?.name ?? a.zoneId}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {a.type}
                      {assignee
                        ? ` · ${a.status === "resolved" ? "Resolved by" : "Assigned to"} ${assignee.name}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${pill.bg} ${pill.text}`}
                    >
                      {ALERT_STATUS_LABEL[a.status]}
                    </span>
                    <span className="text-[11px] text-slate-400 tnum">
                      {formatTime(a.t)}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
      {activeCount > limit && (
        <p className="mt-2 text-center text-xs text-slate-400">
          +{activeCount - limit} more active
        </p>
      )}
    </Card>
  );
}
