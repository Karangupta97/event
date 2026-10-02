"use client";

import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useStaffData } from "../store-adapter";
import type { Alert } from "../types";
import { levelStyles, statusStyles } from "../utils";

function AlertIcon({ level }: { level: Alert["level"] }) {
  const styles = levelStyles[level];
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.bgSoft} ${styles.text}`}
    >
      <AlertTriangle className="h-4 w-4" />
    </div>
  );
}

export function EmergencyBanner({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { emergencyAlert, earlyWarning } = useStaffData();

  if (variant === "mobile") {
    if (!earlyWarning) return null;
    return (
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-2xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-left shadow-sm transition hover:bg-red-50/80"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
          <span className="text-sm font-bold">!</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-red-700">{earlyWarning.title}</p>
          <p className="text-xs text-red-600/90">{earlyWarning.message}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-red-400" />
      </button>
    );
  }

  if (!emergencyAlert) return null;

  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-red-700">{emergencyAlert.title}</p>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                High Priority
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-red-500">
                <Clock className="h-3 w-3" />
                {emergencyAlert.time}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-red-700/90">{emergencyAlert.message}</p>
        </div>
      </div>
    </div>
  );
}

export function ActiveAlertsList({ limit }: { limit?: number }) {
  const { alerts } = useStaffData();
  const items = limit ? alerts.slice(0, limit) : alerts;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Active Alerts</h2>
        <button
          type="button"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
        </button>
      </div>
      <ul className="space-y-2.5">
        {items.map((alert) => {
          const status = statusStyles[alert.status];
          return (
            <li
              key={alert.id}
              className="flex items-start gap-3 rounded-xl border border-slate-50 bg-slate-50/60 p-3 transition hover:bg-slate-50"
            >
              <AlertIcon level={alert.level} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {alert.zoneName}
                  </p>
                  <span className="text-[11px] text-slate-400">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-600">{alert.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <p className="text-[11px] text-slate-400">{alert.description}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AlertsPanel({
  collapsible = false,
  defaultOpen = true,
}: {
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const { alerts } = useStaffData();
  const [open, setOpen] = useState(defaultOpen);
  const activeCount = alerts.filter((a) => a.status !== "resolved").length;

  if (!collapsible) {
    return (
      <div className="space-y-3">
        <EmergencyBanner />
        <ActiveAlertsList />
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold text-slate-800">Alerts</h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-slate-50 px-4 pb-4 pt-3">
          <EmergencyBanner variant="mobile" />
          <ActiveAlertsList />
        </div>
      )}
    </section>
  );
}
