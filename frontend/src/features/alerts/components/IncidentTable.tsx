"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import {
  ALERT_STATUS_LABEL,
  ALERT_STATUS_PILL,
  SEVERITY_THEME,
  formatTime,
} from "@/components/ui/status";
import type { Alert, AlertStatus } from "../types";
import { SEVERITY_RANK } from "../types";
import type { Zone } from "@/features/zones/types";
import type { Staff } from "@/features/staff/types";
import { useCrowdStore } from "@/store/useCrowdStore";

type Filter = "active" | "all" | "critical" | "resolved";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "critical", label: "Critical" },
  { id: "resolved", label: "Resolved" },
  { id: "all", label: "All" },
];

export function IncidentTable({
  alerts,
  zones,
  staff,
}: {
  alerts: Alert[];
  zones: Zone[];
  staff: Staff[];
}) {
  const setAlertStatus = useCrowdStore((s) => s.setAlertStatus);
  const dispatchStaff = useCrowdStore((s) => s.dispatchStaff);
  const log = useCrowdStore((s) => s.log);
  const [filter, setFilter] = useState<Filter>("active");

  const filtered = alerts
    .filter((a) => {
      if (filter === "active") return a.status !== "resolved";
      if (filter === "resolved") return a.status === "resolved";
      if (filter === "critical")
        return a.severity === "critical" && a.status !== "resolved";
      return true;
    })
    .sort(
      (a, b) =>
        Number(a.status === "resolved") - Number(b.status === "resolved") ||
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
        b.t - a.t,
    );

  function assign(a: Alert) {
    const zone = zones.find((z) => z.id === a.zoneId);
    const candidate =
      staff.find((s) => s.status === "available" && s.zoneId === a.zoneId) ??
      staff.find(
        (s) => s.status === "available" && zone?.neighbors.includes(s.zoneId),
      ) ??
      staff.find((s) => s.status === "available");
    if (!candidate) return;
    dispatchStaff(candidate.id, a.zoneId);
    setAlertStatus(a.id, "assigned", candidate.id);
    log({
      kind: "dispatch",
      zoneId: a.zoneId,
      message: `${candidate.name} assigned to incident in ${zone?.name ?? a.zoneId}`,
    });
  }

  function advance(a: Alert) {
    const next: AlertStatus =
      a.status === "assigned" ? "on_site" : "resolved";
    setAlertStatus(a.id, next);
    const zone = zones.find((z) => z.id === a.zoneId);
    log({
      kind: "action",
      zoneId: a.zoneId,
      message: `Incident in ${zone?.name ?? a.zoneId} → ${ALERT_STATUS_LABEL[next]}`,
    });
  }

  return (
    <Card padded={false}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Incident Queue</h3>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filter === f.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-slate-700">
            Nothing in this view
          </p>
          <p className="max-w-xs text-xs text-slate-500">
            {filter === "active" || filter === "critical"
              ? "No active incidents right now. Trigger a demo scenario to see triage in action."
              : "No records match this filter yet."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {filtered.map((a) => {
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
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: a.status === "resolved" ? "#f0fdf4" : theme.tintBg,
                      color: a.status === "resolved" ? "#16a34a" : theme.accent,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {zone?.name ?? a.zoneId}
                      </p>
                      <span className="text-xs text-slate-400">·</span>
                      <p className="truncate text-xs text-slate-500">{a.type}</p>
                    </div>
                    <p className="truncate text-xs text-slate-500">{a.message}</p>
                    {assignee && (
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {a.status === "resolved" ? "Resolved via" : "Assigned to"}{" "}
                        {assignee.name}
                      </p>
                    )}
                  </div>
                  <span className="hidden text-[11px] text-slate-400 tnum sm:block">
                    {formatTime(a.t)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${pill.bg} ${pill.text}`}
                  >
                    {ALERT_STATUS_LABEL[a.status]}
                  </span>
                  <div className="w-24 text-right">
                    {a.status === "open" ? (
                      <Button size="sm" variant="outline" onClick={() => assign(a)}>
                        <UserPlus className="h-3.5 w-3.5" /> Assign
                      </Button>
                    ) : a.status === "resolved" ? (
                      <span className="text-[11px] text-slate-300">—</span>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => advance(a)}>
                        {a.status === "assigned" ? "On-site" : "Resolve"}
                      </Button>
                    )}
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
