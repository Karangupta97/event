"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, Table2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import type { Zone } from "../types";
import { zonePct, zoneStatus, minutesToCritical } from "../types";
import { ZONE_THEME } from "@/components/ui/status";
import { useCrowdStore } from "@/store/useCrowdStore";

function trendOf(history: number[]): "up" | "down" | "flat" {
  if (history.length < 6) return "flat";
  const r = history.slice(-5);
  const d = r[r.length - 1] - r[0];
  if (d > 15) return "up";
  if (d < -15) return "down";
  return "flat";
}

const FLOW_LABEL: Record<string, { text: string; cls: string }> = {
  open: { text: "Open", cls: "bg-green-50 text-green-700" },
  restricted: { text: "Restricted", cls: "bg-amber-50 text-amber-700" },
  closed: { text: "Closed", cls: "bg-red-50 text-red-700" },
};

export function ZoneOverviewTable({ zones }: { zones: Zone[] }) {
  const selectZone = useCrowdStore((s) => s.selectZone);
  const selectedId = useCrowdStore((s) => s.selectedZoneId);

  return (
    <Card>
      <CardHeader
        title="Zone Overview"
        subtitle="Occupancy, trend and staffing across every zone"
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Table2 className="h-[18px] w-[18px]" />
          </span>
        }
      />
      <div className="-mx-2 overflow-x-auto thin-scroll">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-400">
              <th className="px-3 pb-2 font-medium">Zone</th>
              <th className="px-3 pb-2 font-medium">Occupancy</th>
              <th className="px-3 pb-2 font-medium">Count</th>
              <th className="px-3 pb-2 font-medium">Trend</th>
              <th className="px-3 pb-2 font-medium">Time to critical</th>
              <th className="px-3 pb-2 font-medium">Staff</th>
              <th className="px-3 pb-2 font-medium">Flow</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => {
              const status = zoneStatus(z.count, z.capacity);
              const theme = ZONE_THEME[status];
              const pct = zonePct(z.count, z.capacity);
              const trend = trendOf(z.history);
              const mins = minutesToCritical(z.history, z.capacity);
              const TrendIcon =
                trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
              const trendColor =
                trend === "up"
                  ? "text-red-600"
                  : trend === "down"
                    ? "text-green-600"
                    : "text-slate-400";
              const flow = FLOW_LABEL[z.flow];
              const understaffed = z.staff < z.staffNeeded;
              const selected = selectedId === z.id;

              return (
                <tr
                  key={z.id}
                  onClick={() => selectZone(z.id)}
                  className={`cursor-pointer border-t border-slate-100 text-sm transition-colors hover:bg-slate-50 ${
                    selected ? "bg-blue-50/40" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: theme.accent }}
                      />
                      <span className="font-medium text-slate-900">{z.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: theme.accent }}
                          animate={{ width: `${Math.min(100, pct)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span
                        className="tnum text-xs font-medium"
                        style={{ color: theme.text }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 tnum text-slate-600">
                    {z.count.toLocaleString()} / {z.capacity.toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  </td>
                  <td className="px-3 py-3 tnum text-slate-600">
                    {status === "high"
                      ? "now"
                      : mins !== null
                        ? `~${mins} min`
                        : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`tnum ${understaffed ? "font-medium text-amber-600" : "text-slate-600"}`}
                    >
                      {z.staff} / {z.staffNeeded}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${flow.cls}`}
                    >
                      {flow.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
