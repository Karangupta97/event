"use client";

import { TriangleAlert, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useOrgData } from "@/store/useOrgData";
import { IncidentTable } from "@/features/alerts/components/IncidentTable";
import { PriorityBanner } from "@/features/alerts/components/PriorityBanner";
import type { LucideIcon } from "lucide-react";

export default function AlertsPage() {
  return (
    <OrgGate>
      <AlertsContent />
    </OrgGate>
  );
}

function AlertsContent() {
  const { alerts, zones, staff } = useOrgData();

  const active = alerts.filter((a) => a.status !== "resolved");
  const critical = active.filter((a) => a.severity === "critical").length;
  const warning = active.filter((a) => a.severity === "warning").length;
  const unassigned = active.filter((a) => !a.assignedTo).length;
  const resolved = alerts.filter((a) => a.status === "resolved").length;

  return (
    <PageContainer className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={TriangleAlert}
          tint="red"
          label="Critical"
          value={critical}
        />
        <StatCard
          icon={AlertCircle}
          tint="amber"
          label="Warnings"
          value={warning}
        />
        <StatCard
          icon={Clock}
          tint="blue"
          label="Unassigned"
          value={unassigned}
        />
        <StatCard
          icon={CheckCircle2}
          tint="green"
          label="Resolved"
          value={resolved}
        />
      </div>

      <PriorityBanner alerts={alerts} zones={zones} />

      <IncidentTable alerts={alerts} zones={zones} staff={staff} />
    </PageContainer>
  );
}

const TINTS: Record<string, { bg: string; fg: string }> = {
  red: { bg: "bg-red-50", fg: "text-red-600" },
  amber: { bg: "bg-amber-50", fg: "text-amber-600" },
  blue: { bg: "bg-blue-50", fg: "text-blue-600" },
  green: { bg: "bg-green-50", fg: "text-green-600" },
};

function StatCard({
  icon: Icon,
  tint,
  label,
  value,
}: {
  icon: LucideIcon;
  tint: keyof typeof TINTS;
  label: string;
  value: number;
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
          className="block text-2xl font-semibold text-slate-900 tnum"
        />
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}
