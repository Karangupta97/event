"use client";

import { useState } from "react";
import { Users, ChevronDown, Timer } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import type { Staff, StaffRole } from "../types";
import { ROLE_LABEL } from "../types";
import { groupByZone, STATUS_PILL } from "../deploy";
import type { Zone } from "@/features/zones/types";
import { useCrowdStore } from "@/store/useCrowdStore";
import { cn } from "@/components/ui/cn";

const ROLES: (StaffRole | "all")[] = [
  "all",
  "security",
  "medic",
  "usher",
  "volunteer",
];

export function StaffRoster({
  staff,
  zones,
}: {
  staff: Staff[];
  zones: Zone[];
}) {
  const dispatchStaff = useCrowdStore((s) => s.dispatchStaff);
  const log = useCrowdStore((s) => s.log);
  const [role, setRole] = useState<StaffRole | "all">("all");

  const filtered = role === "all" ? staff : staff.filter((s) => s.role === role);
  const grouped = groupByZone(filtered);
  const zoneName = (id: string) => zones.find((z) => z.id === id)?.name ?? id;

  function deploy(s: Staff, destZoneId: string) {
    if (destZoneId === s.zoneId) return;
    dispatchStaff(s.id, destZoneId);
    log({
      kind: "dispatch",
      zoneId: destZoneId,
      message: `${s.name} deployed to ${zoneName(destZoneId)}`,
    });
  }

  return (
    <Card>
      <CardHeader
        title="Staff Roster"
        subtitle={`${staff.length} people on the ground`}
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Users className="h-[18px] w-[18px]" />
          </span>
        }
        right={
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  role === r
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {r === "all" ? "All" : ROLE_LABEL[r]}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {zones.map((zone) => {
          const members = grouped[zone.id] ?? [];
          if (members.length === 0) return null;
          return (
            <div
              key={zone.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  {zone.name}
                </span>
                <span className="tnum text-xs text-slate-400">
                  {members.length}
                </span>
              </div>
              <ul className="space-y-2">
                {members.map((s) => {
                  const pill = STATUS_PILL[s.status];
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                        {s.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {s.name}
                        </p>
                        <p className="text-[11px] capitalize text-slate-500">
                          {ROLE_LABEL[s.role]}
                        </p>
                      </div>
                      {s.status === "en_route" ? (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          <Timer className="h-3 w-3" /> ETA {s.etaTicks}
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${pill.cls}`}
                        >
                          {pill.label}
                        </span>
                      )}
                      {s.status === "available" && (
                        <div className="relative">
                          <select
                            aria-label={`Deploy ${s.name}`}
                            value=""
                            onChange={(e) => deploy(s, e.target.value)}
                            className="h-7 appearance-none rounded-lg border border-slate-200 bg-white pl-2 pr-6 text-[11px] text-slate-600 outline-none focus:border-blue-400"
                          >
                            <option value="" disabled>
                              Deploy
                            </option>
                            {zones
                              .filter((z) => z.id !== s.zoneId)
                              .map((z) => (
                                <option key={z.id} value={z.id}>
                                  {z.name}
                                </option>
                              ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
