"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { BarChart3, TrendingUp } from "lucide-react";
import type { Zone } from "@/features/zones/types";
import { zonePct, zoneStatus } from "@/features/zones/types";
import { ZONE_THEME } from "@/components/ui/status";

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  fontSize: 12,
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
} as const;

export function OccupancyByZone({ zones }: { zones: Zone[] }) {
  const data = zones.map((z) => ({
    name: z.name.replace(" Zone", "").replace(" Area", "").replace(" Hall", ""),
    pct: zonePct(z.count, z.capacity),
    status: zoneStatus(z.count, z.capacity),
  }));

  return (
    <Card>
      <CardHeader
        title="Occupancy by Zone"
        subtitle="Current fill rate across the venue"
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <BarChart3 className="h-[18px] w-[18px]" />
          </span>
        }
      />
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="#eef2f7" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 110]}
              ticks={[0, 50, 70, 90]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [`${v as number}%`, "Occupancy"]}
              cursor={{ fill: "#f1f5f9" }}
            />
            <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="4 4" />
            <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((d, i) => (
                <Cell key={i} fill={ZONE_THEME[d.status].accent} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function VenueTrend({ zones }: { zones: Zone[] }) {
  // build a venue-wide occupancy % series from aligned zone histories
  const len = Math.max(0, ...zones.map((z) => z.history.length));
  const totalCap = zones.reduce((a, z) => a + z.capacity, 0);
  const data = Array.from({ length: len }, (_, i) => {
    let sum = 0;
    for (const z of zones) {
      const h = z.history;
      sum += h[i - (len - h.length)] ?? h[0] ?? 0;
    }
    return { i, pct: totalCap ? Math.round((sum / totalCap) * 100) : 0 };
  });

  return (
    <Card>
      <CardHeader
        title="Venue Occupancy Trend"
        subtitle={`Aggregate fill rate · last ${len} readings`}
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <TrendingUp className="h-[18px] w-[18px]" />
          </span>
        }
      />
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="venueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="i" hide />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [`${v as number}%`, "Venue fill"]}
              labelFormatter={() => ""}
            />
            <Area
              type="monotone"
              dataKey="pct"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#venueFill)"
              isAnimationActive
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
