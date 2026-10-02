"use client";

import { motion } from "framer-motion";
import {
  Users,
  TriangleAlert,
  BellRing,
  UserCheck,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import type { Zone } from "../types";
import { zoneStatus } from "../types";
import type { Staff } from "@/features/staff/types";
import type { Alert } from "@/features/alerts/types";
import type { Recommendation } from "@/features/actions/types";

interface KpiRowProps {
  zones: Zone[];
  staff: Staff[];
  alerts: Alert[];
  recommendations: Recommendation[];
}

export function KpiRow({ zones, staff, alerts, recommendations }: KpiRowProps) {
  const totalInside = zones.reduce((a, z) => a + z.count, 0);
  const totalCap = zones.reduce((a, z) => a + z.capacity, 0);
  const capPct = Math.round((totalInside / totalCap) * 100);

  const highZones = zones.filter(
    (z) => zoneStatus(z.count, z.capacity) === "high",
  );
  const activeAlerts = alerts.filter((a) => a.status !== "resolved");
  const unassigned = activeAlerts.filter((a) => !a.assignedTo).length;

  const onDuty = staff.filter((s) => s.status !== "en_route").length;
  const available = staff.filter((s) => s.status === "available").length;
  const understaffed = zones.filter((z) => z.staff < z.staffNeeded).length;

  const pending = recommendations.filter((r) => r.state === "pending").length;

  return (
    <Reveal
      stagger
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5 xl:gap-5"
    >
      <Kpi
        icon={Users}
        tint="blue"
        label="Attendees Inside"
        value={totalInside}
        pill={`${capPct}% of capacity`}
        pillTone="blue"
      />
      <Kpi
        icon={TriangleAlert}
        tint="red"
        label="Zones at High"
        value={highZones.length}
        subtitle={
          highZones.length
            ? highZones.map((z) => z.name).join(", ")
            : "All zones within limits"
        }
      />
      <Kpi
        icon={BellRing}
        tint="amber"
        label="Active Alerts"
        value={activeAlerts.length}
        subtitle={`${unassigned} unassigned`}
      />
      <Kpi
        icon={UserCheck}
        tint="green"
        label="Staff On Duty"
        value={onDuty}
        subtitle={`${available} available · ${understaffed} understaffed zones`}
      />
      <Kpi
        icon={ListChecks}
        tint="violet"
        label="Pending Actions"
        value={pending}
        subtitle={pending ? "Awaiting approval" : "Nothing to approve"}
        pulse={pending > 0}
      />
    </Reveal>
  );
}

const TINTS: Record<string, { bg: string; fg: string }> = {
  blue: { bg: "bg-blue-50", fg: "text-blue-600" },
  red: { bg: "bg-red-50", fg: "text-red-600" },
  amber: { bg: "bg-amber-50", fg: "text-amber-600" },
  green: { bg: "bg-green-50", fg: "text-green-600" },
  violet: { bg: "bg-violet-50", fg: "text-violet-600" },
};

function Kpi({
  icon: Icon,
  tint,
  label,
  value,
  subtitle,
  pill,
  pillTone,
  pulse,
}: {
  icon: LucideIcon;
  tint: keyof typeof TINTS | string;
  label: string;
  value: number;
  subtitle?: string;
  pill?: string;
  pillTone?: "blue" | "green";
  pulse?: boolean;
}) {
  const t = TINTS[tint] ?? TINTS.blue;
  return (
    <RevealItem className="h-full">
      <Card
        interactive
        padded={false}
        className="flex h-full min-h-[150px] flex-col px-5 py-[18px]"
      >
        {/* top row: icon + optional capacity badge */}
        <div className="flex items-start justify-between">
          <motion.span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${t.bg} ${t.fg}`}
            animate={pulse ? { scale: [1, 1.07, 1] } : undefined}
            transition={pulse ? { duration: 1.8, repeat: Infinity } : undefined}
          >
            <Icon className="h-[18px] w-[18px]" />
          </motion.span>
          {pill && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium leading-none ${
                pillTone === "green"
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {pill}
            </span>
          )}
        </div>

        {/* content pinned together, no stretched whitespace */}
        <div className="mt-3 flex flex-col gap-0.5">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <AnimatedNumber
            value={value}
            className="text-3xl font-semibold leading-none text-slate-900 tnum"
          />
          <p className="line-clamp-1 min-h-[18px] text-sm text-slate-500">
            {subtitle ?? ""}
          </p>
        </div>
      </Card>
    </RevealItem>
  );
}
