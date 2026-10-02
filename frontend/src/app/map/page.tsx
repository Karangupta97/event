"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { Card, CrowdBadge, CapacityBar } from "../components/ui";
import { ClockIcon, GridIcon } from "../components/icons";
import { zones, crowdColors } from "../lib/data";

const dotColor = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-rose-500",
} as const;

function MapView() {
  const params = useSearchParams();
  const initial = params.get("zone");
  const [activeId, setActiveId] = useState<string | null>(initial);

  useEffect(() => {
    setActiveId(initial);
  }, [initial]);

  const active = zones.find((z) => z.id === activeId) ?? null;

  return (
    <div>
      <PageHeader title="Map View" subtitle="Tap a point to see live details" />

      <div className="space-y-4 p-4">
        {/* Schematic map */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#eaf1fc] to-[#e6ecf8] shadow-soft">
          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(#d6e1f2 1px, transparent 1px), linear-gradient(90deg, #d6e1f2 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          {/* a soft lawn area */}
          <div className="absolute left-6 top-10 h-24 w-28 rounded-3xl bg-emerald-100/50" />
          {/* a path / river accent */}
          <div className="absolute left-0 right-0 top-1/2 h-7 -translate-y-1/2 bg-gradient-to-r from-sky-200/70 to-blue-200/60" />

          {zones.map((z) => {
            const isActive = z.id === activeId;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setActiveId(z.id)}
                aria-label={z.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${z.x}%`, top: `${z.y}%` }}
              >
                <span className="flex flex-col items-center gap-1">
                  <span
                    className={`flex items-center justify-center rounded-full ring-[3px] ring-white transition-all duration-200 ${
                      dotColor[z.crowd]
                    } ${isActive ? "h-5 w-5 scale-110 shadow-md" : "h-3.5 w-3.5"}`}
                  />
                  <span
                    className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-white/95 text-foreground"
                    }`}
                  >
                    {z.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Low
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Busy
          </span>
        </div>

        {/* Detail panel */}
        {active ? (
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold tracking-tight">{active.name}</p>
                <p className="text-[11px] text-muted">{active.category}</p>
              </div>
              <CrowdBadge level={active.crowd} />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <CapacityBar value={active.capacity} />
              <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-muted">
                {active.capacity}%
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${crowdColors[active.crowd].text}`}>
                <ClockIcon width={14} height={14} />
                {active.waitMins > 0 ? `~${active.waitMins} min wait` : "No wait"}
              </span>
              <Link
                href="/facilities"
                className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Facilities nearby
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <GridIcon width={20} height={20} />
            </span>
            <div>
              <p className="text-sm font-semibold">Select a zone</p>
              <p className="text-xs text-muted">Tap any point on the map for live details.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted">Loading map…</div>}>
      <MapView />
    </Suspense>
  );
}
