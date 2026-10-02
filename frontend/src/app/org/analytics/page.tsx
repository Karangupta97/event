"use client";

import { Users, Radio, Zap, Bell } from "lucide-react";
import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useOrgData } from "@/store/useOrgData";
import {
  OccupancyByZone,
  VenueTrend,
} from "@/features/analytics/components/AnalyticsCharts";
import { ActivityLog } from "@/features/audit/components/ActivityLog";
import type { LucideIcon } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <OrgGate>
      <AnalyticsContent />
    </OrgGate>
  );
}

function AnalyticsContent() {
  const { zones, broadcasts, alerts, auditLog } = useOrgData();

  const peak = zones.reduce(
    (max, z) => Math.max(max, Math.round((z.count / z.capacity) * 100)),
    0,
  );
  const totalAlerts = alerts.length;
  const executed = auditLog.filter((e) => e.kind === "action").length;

  return (
    <PageContainer className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Users} tint="blue" label="Peak zone fill" value={peak} suffix="%" />
        <Stat icon={Bell} tint="amber" label="Alerts logged" value={totalAlerts} />
        <Stat icon={Zap} tint="violet" label="Actions taken" value={executed} />
        <Stat
          icon={Radio}
          tint="green"
          label="Broadcasts sent"
          value={broadcasts.length}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <OccupancyByZone zones={zones} />
        <VenueTrend zones={zones} />
      </div>

      <ActivityLog log={auditLog} />
    </PageContainer>
  );
}

const TINTS: Record<string, { bg: string; fg: string }> = {
  blue: { bg: "bg-blue-50", fg: "text-blue-600" },
  amber: { bg: "bg-amber-50", fg: "text-amber-600" },
  violet: { bg: "bg-violet-50", fg: "text-violet-600" },
  green: { bg: "bg-green-50", fg: "text-green-600" },
};

function Stat({
  icon: Icon,
  tint,
  label,
  value,
  suffix,
}: {
  icon: LucideIcon;
  tint: keyof typeof TINTS;
  label: string;
  value: number;
  suffix?: string;
}) {
  const t = TINTS[tint];
  return (
    <Card interactive className="flex items-center gap-3 !p-4">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.fg}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <AnimatedNumber
          value={value}
          suffix={suffix}
          className="block text-2xl font-semibold text-slate-900 tnum"
        />
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}
