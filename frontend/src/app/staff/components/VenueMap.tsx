"use client";

import Image from "next/image";
import { Expand, Radio } from "lucide-react";
import {
  formatCount,
  occupancyPercent,
  useStaffData,
} from "../store-adapter";
import { levelLabels, levelStyles } from "../utils";
import { ZoneIcon } from "./shared";

/** Clickable hotspot regions aligned to venue_map.png layout */
const zoneHotspots: Record<
  string,
  { top: string; left: string; width: string; height: string }
> = {
  "gaming-zone": { top: "10%", left: "6%", width: "28%", height: "32%" },
  "food-court": { top: "8%", left: "36%", width: "28%", height: "26%" },
  "expo-zone": { top: "10%", left: "66%", width: "28%", height: "32%" },
  "stage-area": { top: "36%", left: "30%", width: "40%", height: "34%" },
  "workshop-hall": { top: "68%", left: "6%", width: "32%", height: "26%" },
  "main-entry": { top: "68%", left: "62%", width: "32%", height: "26%" },
};

export function VenueMap({
  selectedZoneId,
  onSelectZone,
  expanded = false,
}: {
  selectedZoneId: string;
  onSelectZone: (id: string) => void;
  expanded?: boolean;
}) {
  const { zones, getZoneById } = useStaffData();
  const selected = getZoneById(selectedZoneId);

  return (
    <section
      className={`staff-map-shell group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.06)] ${
        expanded ? "min-h-[min(78vh,860px)]" : ""
      }`}
    >
      <div className="staff-map-shimmer pointer-events-none absolute inset-0 z-20" />

      <div
        className={`relative flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_top,#eef4ff_0%,#f8fafc_45%,#f1f5f9_100%)] ${
          expanded ? "min-h-[min(72vh,800px)]" : ""
        }`}
      >
        <div
          className={`staff-map-stage relative mx-auto h-full w-full ${
            expanded
              ? "min-h-[min(72vh,800px)]"
              : "aspect-[4/3] max-h-[min(72vh,820px)] lg:aspect-auto lg:min-h-[560px]"
          }`}
        >
          <Image
            src="/venue_map.png"
            alt="EventFlow venue map showing all zones and occupancy"
            fill
            priority
            className="staff-map-image object-contain object-center p-3 sm:p-4 lg:p-5"
            sizes={expanded ? "100vw" : "(max-width: 1024px) 100vw, 70vw"}
          />

          {zones.map((zone) => {
            const spot = zoneHotspots[zone.id];
            if (!spot) return null;
            const isSelected = selectedZoneId === zone.id;
            const isHigh = zone.level === "high";
            const percent = occupancyPercent(zone.current, zone.capacity);

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onSelectZone(zone.id)}
                style={spot}
                title={`${zone.name} — ${percent}%`}
                aria-label={`Select ${zone.name}`}
                className={`absolute z-10 rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isSelected
                    ? "staff-zone-selected bg-blue-500/10"
                    : isHigh
                      ? "staff-zone-alert hover:bg-red-500/5"
                      : "hover:bg-slate-900/[0.04] hover:shadow-[inset_0_0_0_2px_rgba(59,130,246,0.25)]"
                }`}
              />
            );
          })}
        </div>

        {/* Floating selected zone chip */}
        {selected && (
          <div className="staff-map-chip pointer-events-none absolute bottom-4 left-4 z-30 max-w-[min(100%,280px)] rounded-2xl border border-white/80 bg-white/90 px-3.5 py-2.5 shadow-lg shadow-slate-900/10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${levelStyles[selected.level].bgSoft} ${levelStyles[selected.level].text}`}
              >
                <ZoneIcon icon={selected.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {selected.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatCount(selected.current)} /{" "}
                  {formatCount(selected.capacity)} ·{" "}
                  <span className={levelStyles[selected.level].text}>
                    {occupancyPercent(selected.current, selected.capacity)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            <Radio className="h-3 w-3 animate-soft-pulse" />
            Live
          </span>
          {(Object.keys(levelLabels) as Array<keyof typeof levelLabels>).map(
            (level) => (
              <span key={level} className="inline-flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${levelStyles[level].dot} ${
                    level === "high" ? "animate-soft-pulse" : ""
                  }`}
                />
                {levelLabels[level]}
              </span>
            ),
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          View full map
          <Expand className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}

export function ZoneCardList({
  selectedZoneId,
  onSelectZone,
}: {
  selectedZoneId: string;
  onSelectZone: (id: string) => void;
}) {
  const { zones } = useStaffData();
  return (
    <div className="grid gap-2 sm:hidden">
      {zones.map((zone) => {
        const styles = levelStyles[zone.level];
        const percent = occupancyPercent(zone.current, zone.capacity);
        const isSelected = selectedZoneId === zone.id;

        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone(zone.id)}
            className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left shadow-sm transition ${styles.border} ${
              isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.bgSoft} ${styles.text}`}
            >
              <ZoneIcon icon={zone.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{zone.name}</p>
              <p className="text-xs text-slate-500">
                {formatCount(zone.current)} / {formatCount(zone.capacity)}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles.badge}`}
            >
              {percent}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
