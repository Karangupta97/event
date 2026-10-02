"use client";

import { Shield, HeartPulse, UserCog, HandHelping } from "lucide-react";
import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useOrgData } from "@/store/useOrgData";
import { StaffRoster } from "@/features/staff/components/StaffRoster";
import { StaffingNeeds } from "@/features/staff/components/StaffingNeeds";
import type { StaffRole } from "@/features/staff/types";
import type { LucideIcon } from "lucide-react";

const ROLE_CARDS: { role: StaffRole; label: string; icon: LucideIcon; tint: string }[] =
  [
    { role: "security", label: "Security", icon: Shield, tint: "blue" },
    { role: "medic", label: "Medics", icon: HeartPulse, tint: "red" },
    { role: "usher", label: "Ushers", icon: UserCog, tint: "amber" },
    { role: "volunteer", label: "Volunteers", icon: HandHelping, tint: "green" },
  ];

const TINTS: Record<string, { bg: string; fg: string }> = {
  blue: { bg: "bg-blue-50", fg: "text-blue-600" },
  red: { bg: "bg-red-50", fg: "text-red-600" },
  amber: { bg: "bg-amber-50", fg: "text-amber-600" },
  green: { bg: "bg-green-50", fg: "text-green-600" },
};

export default function StaffPage() {
  return (
    <OrgGate>
      <StaffContent />
    </OrgGate>
  );
}

function StaffContent() {
  const { staff, zones } = useOrgData();

  return (
    <PageContainer className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ROLE_CARDS.map((rc) => {
          const t = TINTS[rc.tint];
          const Icon = rc.icon;
          const count = staff.filter((s) => s.role === rc.role).length;
          const avail = staff.filter(
            (s) => s.role === rc.role && s.status === "available",
          ).length;
          return (
            <Card key={rc.role} interactive className="!p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.fg}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 tnum">
                  {avail} free
                </span>
              </div>
              <AnimatedNumber
                value={count}
                className="mt-3 block text-2xl font-semibold text-slate-900 tnum"
              />
              <p className="text-xs text-slate-500">{rc.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <StaffRoster staff={staff} zones={zones} />
        <StaffingNeeds zones={zones} />
      </div>
    </PageContainer>
  );
}
