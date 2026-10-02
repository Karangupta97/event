"use client";

import { SlidersHorizontal, Gauge, Play, Info } from "lucide-react";
import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, CardHeader } from "@/components/ui/Card";
import { useOrgData } from "@/store/useOrgData";
import { applyScenario, type Scenario } from "@/features/simulator/engine";
import { ZONE_THEME } from "@/components/ui/status";
import { zoneStatus } from "@/features/zones/types";

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "concert", label: "Concert starts" },
  { id: "lunch", label: "Lunch rush" },
  { id: "showend", label: "Show ends" },
  { id: "reset", label: "Reset" },
];

export default function SettingsPage() {
  return (
    <OrgGate>
      <SettingsContent />
    </OrgGate>
  );
}

function SettingsContent() {
  const { zones } = useOrgData();

  return (
    <PageContainer className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* thresholds */}
      <Card>
        <CardHeader
          title="Occupancy Thresholds"
          subtitle="When zones change status"
          icon={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Gauge className="h-[18px] w-[18px]" />
            </span>
          }
        />
        <div className="space-y-3">
          <ThresholdRow color="#22c55e" label="Normal" range="Below 70%" />
          <ThresholdRow color="#eab308" label="Busy" range="70% – 90%" />
          <ThresholdRow color="#ef4444" label="High" range="Above 90%" />
        </div>
        <p className="mt-4 flex items-start gap-1.5 text-[11px] text-slate-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Thresholds are fixed in this demo build. In production these would be
          editable per zone.
        </p>
      </Card>

      {/* demo controls */}
      <Card>
        <CardHeader
          title="Simulation Controls"
          subtitle="Drive the live demo"
          icon={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Play className="h-[18px] w-[18px]" />
            </span>
          }
        />
        <div className="grid grid-cols-2 gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => applyScenario(s.id)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                s.id === "reset"
                  ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Scenarios inject crowd surges so you can watch detection, prediction
          and the recommended-action flow respond in real time.
        </p>
      </Card>

      {/* zone capacity overview */}
      <Card className="lg:col-span-2">
        <CardHeader
          title="Zone Configuration"
          subtitle="Capacity and recommended staffing per zone"
          icon={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <SlidersHorizontal className="h-[18px] w-[18px]" />
            </span>
          }
        />
        <div className="-mx-2 overflow-x-auto thin-scroll">
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-400">
                <th className="px-3 pb-2">Zone</th>
                <th className="px-3 pb-2">Capacity</th>
                <th className="px-3 pb-2">Recommended staff</th>
                <th className="px-3 pb-2">Current status</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => {
                const theme = ZONE_THEME[zoneStatus(z.count, z.capacity)];
                return (
                  <tr
                    key={z.id}
                    className="border-t border-slate-100 text-sm"
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-900">
                      {z.name}
                    </td>
                    <td className="px-3 py-2.5 tnum text-slate-600">
                      {z.capacity.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 tnum text-slate-600">
                      {z.staffNeeded}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ background: theme.tintBg, color: theme.text }}
                      >
                        {theme.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
}

function ThresholdRow({
  color,
  label,
  range,
}: {
  color: string;
  label: string;
  range: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
      <span className="h-3 w-3 rounded-full" style={{ background: color }} />
      <span className="flex-1 text-sm font-medium text-slate-900">{label}</span>
      <span className="tnum text-sm text-slate-500">{range}</span>
    </div>
  );
}
