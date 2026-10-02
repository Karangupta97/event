"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  ALERT_STATUS_LABEL,
  ALERT_STATUS_PILL,
  SEVERITY_THEME,
  formatTime,
} from "@/components/ui/status";
import type { Alert } from "../types";
import { SEVERITY_RANK } from "../types";
import type { Zone } from "@/features/zones/types";

/**
 * Compact, above-the-fold critical-alert feed for the Overview command view.
 * Shows only unresolved alerts, severity-sorted, with a link to full triage.
 */
export function CriticalAlerts({
  alerts,
  zones,
  limit = 4,
}: {
  alerts: Alert[];
  zones: Zone[];
  limit?: number;
}) {
  const active = alerts
    .filter((a) => a.status !== "resolved")
    .sort(
      (a, b) =>
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || b.t - a.t,
    );
  const shown = active.slice(0, limit);

  return (
    <Card padded={false} className="flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Critical Alerts</h3>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 tnum">
            {active.length}
          </span>
        </div>
        <Link
          href="/org/alerts"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Triage <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-slate-700">All clear</p>
          <p className="text-xs text-slate-500">
            No active incidents across the venue.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {shown.map((a) => {
              const zone = zones.find((z) => z.id === a.zoneId);
              const theme = SEVERITY_THEME[a.severity];
              const pill = ALERT_STATUS_PILL[a.status];
              const Icon =
                a.severity === "critical" ? TriangleAlert : AlertCircle;
              return (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: theme.tintBg, color: theme.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {zone?.name ?? a.zoneId}
                    </p>
                    <p className="truncate text-xs text-slate-500">{a.type}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
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
    </Card>
  );
}
