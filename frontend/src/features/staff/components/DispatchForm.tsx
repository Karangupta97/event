"use client";

import { useState } from "react";
import { Send, Users, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Staff } from "../types";
import { ROLE_LABEL } from "../types";
import type { Zone } from "@/features/zones/types";
import { useCrowdStore, uid } from "@/store/useCrowdStore";

export function DispatchForm({
  staff,
  zones,
}: {
  staff: Staff[];
  zones: Zone[];
}) {
  const dispatchStaff = useCrowdStore((s) => s.dispatchStaff);
  const addAlert = useCrowdStore((s) => s.addAlert);
  const log = useCrowdStore((s) => s.log);
  const selectedZoneId = useCrowdStore((s) => s.selectedZoneId);

  const available = staff.filter((s) => s.status === "available");
  const [staffId, setStaffId] = useState<string>("");
  // null = follow the map's selected zone; a string = user override
  const [zoneOverride, setZoneOverride] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const chosen = staff.find((s) => s.id === staffId) ?? available[0] ?? null;
  const effectiveStaffId = staffId || available[0]?.id || "";
  const effectiveZoneId = zoneOverride ?? selectedZoneId;

  function send() {
    if (!effectiveStaffId) return;
    const zone = zones.find((z) => z.id === effectiveZoneId);
    dispatchStaff(effectiveStaffId, effectiveZoneId);
    const who = staff.find((s) => s.id === effectiveStaffId);
    addAlert({
      id: uid("alert"),
      type: "Manual dispatch",
      severity: "warning",
      zoneId: effectiveZoneId,
      message: message.trim() || `${who?.name} dispatched to ${zone?.name}.`,
      assignedTo: effectiveStaffId,
      status: "assigned",
      t: Date.now(),
    });
    log({
      kind: "dispatch",
      zoneId: effectiveZoneId,
      message: `${who?.name} dispatched to ${zone?.name}${message.trim() ? ` — "${message.trim()}"` : ""}`,
    });
    setMessage("");
    setSent(true);
    window.setTimeout(() => setSent(false), 1800);
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Users className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Dispatch Staff</h3>
          <p className="text-xs text-slate-500">Assign a staffer to respond</p>
        </div>
      </div>

      {/* staff select */}
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        Select staff
      </label>
      <div className="relative mb-3">
        <div className="pointer-events-none absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
          {chosen ? initials(chosen.name) : "–"}
        </div>
        <select
          value={effectiveStaffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="h-14 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
        >
          {available.length === 0 && <option>No staff available</option>}
          {available.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {ROLE_LABEL[s.role]} — Available
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {chosen && (
          <span className="pointer-events-none absolute bottom-2.5 left-12 flex items-center gap-1 text-[11px] text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Available
          </span>
        )}
      </div>

      {/* zone select */}
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        Target zone
      </label>
      <div className="relative mb-3">
        <select
          value={effectiveZoneId}
          onChange={(e) => setZoneOverride(e.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {/* message */}
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        Message (optional)
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        placeholder="e.g. Move to Food Court. Check for crowd congestion."
        className="mb-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
      />

      <Button fullWidth onClick={send} disabled={!effectiveStaffId}>
        <Send className="h-4 w-4" />
        {sent ? "Alert sent!" : "Send Alert"}
      </Button>
    </Card>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
