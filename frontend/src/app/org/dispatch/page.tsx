"use client";

import { UserCheck, Navigation, MapPin } from "lucide-react";
import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useOrgData } from "@/store/useOrgData";
import { DispatchForm } from "@/features/staff/components/DispatchForm";
import { EnRouteBoard } from "@/features/staff/components/EnRouteBoard";
import { StaffingNeeds } from "@/features/staff/components/StaffingNeeds";
import type { LucideIcon } from "lucide-react";

export default function DispatchPage() {
  return (
    <OrgGate>
      <DispatchContent />
    </OrgGate>
  );
}

function DispatchContent() {
  const { staff, zones } = useOrgData();

  const available = staff.filter((s) => s.status === "available").length;
  const enRoute = staff.filter((s) => s.status === "en_route").length;
  const understaffed = zones.filter((z) => z.staff < z.staffNeeded).length;

  return (
    <PageContainer className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={UserCheck} tint="green" label="Available" value={available} />
        <Stat icon={Navigation} tint="amber" label="En route" value={enRoute} />
        <Stat
          icon={MapPin}
          tint="blue"
          label="Understaffed zones"
          value={understaffed}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <DispatchForm staff={staff} zones={zones} />
        <div className="space-y-5">
          <EnRouteBoard staff={staff} zones={zones} />
          <StaffingNeeds zones={zones} />
        </div>
      </div>
    </PageContainer>
  );
}

const TINTS: Record<string, { bg: string; fg: string }> = {
  green: { bg: "bg-green-50", fg: "text-green-600" },
  amber: { bg: "bg-amber-50", fg: "text-amber-600" },
  blue: { bg: "bg-blue-50", fg: "text-blue-600" },
};

function Stat({
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
