"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Ban, DoorOpen, Megaphone, TrendingUp } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { Zone } from "../types";
import { zonePct, zoneStatus, minutesToCritical } from "../types";
import { ZONE_THEME } from "@/components/ui/status";
import { useCrowdStore, uid } from "@/store/useCrowdStore";

export function ZoneTrend({ zone }: { zone: Zone }) {
  const setZoneFlow = useCrowdStore((s) => s.setZoneFlow);
  const addBroadcast = useCrowdStore((s) => s.addBroadcast);
  const log = useCrowdStore((s) => s.log);

  const status = zoneStatus(zone.count, zone.capacity);
  const theme = ZONE_THEME[status];
  const pct = zonePct(zone.count, zone.capacity);
  const mins = minutesToCritical(zone.history, zone.capacity);

  const data = zone.history.map((count, i) => ({
    i,
    pct: Math.round((count / zone.capacity) * 100),
    count,
  }));

  const prediction =
    status === "high"
      ? `${zone.name} is over safe capacity at ${pct}%. Intervention advised now.`
      : mins !== null
        ? `At the current rate, ${zone.name} reaches capacity in about ${mins} min.`
        : `${zone.name} is stable at ${pct}% with no critical trend.`;

  function restrict() {
    setZoneFlow(zone.id, "restricted");
    log({ kind: "action", zoneId: zone.id, message: `${zone.name} entry restricted (manual)` });
  }
  function reopen() {
    setZoneFlow(zone.id, "open");
    log({ kind: "action", zoneId: zone.id, message: `${zone.name} reopened (manual)` });
  }
  function sendNotice() {
    addBroadcast({
      id: uid("bc"),
      channel: "attendees",
      severity: "info",
      zoneIds: [zone.id],
      message: `Heads up: ${zone.name} is getting busy. Please plan accordingly.`,
      sentAt: Date.now(),
    });
    log({ kind: "broadcast", zoneId: zone.id, message: `Notice sent to attendees in ${zone.name}` });
  }

  return (
    <Card>
      <CardHeader
        title="Zone Trend"
        subtitle={`${zone.name} · last ${data.length} readings`}
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <TrendingUp className="h-[18px] w-[18px]" />
          </span>
        }
        right={
          <Pill
            tone={status === "high" ? "red" : status === "busy" ? "amber" : "green"}
          >
            {pct}% · {theme.label}
          </Pill>
        }
      />

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="zoneFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={theme.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis
              domain={[0, 110]}
              ticks={[0, 50, 70, 90]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
              formatter={(v) => [`${v as number}%`, "Occupancy"]}
              labelFormatter={() => ""}
            />
            <ReferenceLine
              y={70}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <ReferenceLine
              y={90}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="pct"
              stroke={theme.accent}
              strokeWidth={2.5}
              fill="url(#zoneFill)"
              isAnimationActive
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        {prediction}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {zone.flow === "open" ? (
          <Button size="sm" variant="outline" onClick={restrict}>
            <Ban className="h-3.5 w-3.5" /> Restrict entry
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={reopen}>
            <DoorOpen className="h-3.5 w-3.5" /> Reopen
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={sendNotice}>
          <Megaphone className="h-3.5 w-3.5" /> Send notice
        </Button>
      </div>
    </Card>
  );
}
