"use client";

import { motion } from "framer-motion";
import { Ban, DoorOpen, Megaphone, Users, Navigation } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { Zone } from "../types";
import { zonePct, zoneStatus, minutesToCritical } from "../types";
import { ZONE_THEME } from "@/components/ui/status";
import { ZONE_ICON } from "../zoneIcon";
import { useCrowdStore, uid } from "@/store/useCrowdStore";

export function ZoneDetailPanel({
  zone,
  zones,
}: {
  zone: Zone;
  zones: Zone[];
}) {
  const setZoneFlow = useCrowdStore((s) => s.setZoneFlow);
  const addBroadcast = useCrowdStore((s) => s.addBroadcast);
  const log = useCrowdStore((s) => s.log);

  const status = zoneStatus(zone.count, zone.capacity);
  const theme = ZONE_THEME[status];
  const pct = zonePct(zone.count, zone.capacity);
  const mins = minutesToCritical(zone.history, zone.capacity);
  const Icon = ZONE_ICON[zone.id];

  const neighbors = zone.neighbors
    .map((id) => zones.find((z) => z.id === id))
    .filter((z): z is Zone => !!z);

  function notice() {
    addBroadcast({
      id: uid("bc"),
      channel: "attendees",
      severity: "info",
      zoneIds: [zone.id],
      message: `Heads up: ${zone.name} is busy. Please plan around it.`,
      sentAt: Date.now(),
    });
    log({ kind: "broadcast", zoneId: zone.id, message: `Notice sent to ${zone.name}` });
  }

  return (
    <Card padded={false}>
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: theme.tintBg, color: theme.accent }}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </span>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{zone.name}</h3>
          <p className="text-xs text-slate-500">
            Zone capacity {zone.capacity.toLocaleString()}
          </p>
        </div>
        <Pill
          tone={status === "high" ? "red" : status === "busy" ? "amber" : "green"}
        >
          {theme.label}
        </Pill>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-100">
        <Stat label="Occupancy" value={`${pct}%`} accent={theme.text} />
        <Stat
          label="Inside"
          value={zone.count.toLocaleString()}
        />
        <Stat label="Staff on zone" value={`${zone.staff} / ${zone.staffNeeded}`} />
        <Stat
          label="Time to critical"
          value={status === "high" ? "now" : mins !== null ? `~${mins}m` : "—"}
          accent={status === "high" ? "#b91c1c" : undefined}
        />
      </div>

      <div className="p-4">
        <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: theme.accent }}
            animate={{ width: `${Math.min(100, pct)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {neighbors.length > 0 && (
          <div className="mb-4">
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Adjacent zones
            </p>
            <div className="flex flex-wrap gap-1.5">
              {neighbors.map((n) => {
                const nt = ZONE_THEME[zoneStatus(n.count, n.capacity)];
                return (
                  <span
                    key={n.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  >
                    <Navigation className="h-3 w-3 text-slate-400" />
                    {n.name}
                    <span className="tnum font-medium" style={{ color: nt.text }}>
                      {zonePct(n.count, n.capacity)}%
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {zone.flow === "open" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setZoneFlow(zone.id, "restricted");
                log({ kind: "action", zoneId: zone.id, message: `${zone.name} entry restricted` });
              }}
            >
              <Ban className="h-3.5 w-3.5" /> Restrict
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setZoneFlow(zone.id, "open");
                log({ kind: "action", zoneId: zone.id, message: `${zone.name} reopened` });
              }}
            >
              <DoorOpen className="h-3.5 w-3.5" /> Reopen
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={notice}>
            <Megaphone className="h-3.5 w-3.5" /> Notice
          </Button>
          <span className="ml-auto inline-flex items-center gap-1.5 self-center text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" /> {zone.staff} assigned
          </span>
        </div>
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-white p-3">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p
        className="mt-0.5 text-lg font-semibold tnum"
        style={{ color: accent ?? "#0f172a" }}
      >
        {value}
      </p>
    </div>
  );
}
