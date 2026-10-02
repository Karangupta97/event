"use client";

import Image from "next/image";
import { Expand } from "lucide-react";
import {
  formatCount,
  occupancyPercent,
  zones,
} from "../mock-data";
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
}: {
  selectedZoneId: string;
  onSelectZone: (id: string) => void;
}) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="relative flex-1 bg-slate-50">
        <div className="relative mx-auto aspect-[4/3] w-full max-h-[min(72vh,820px)] lg:aspect-auto lg:h-full lg:min-h-[560px]">
          <Image
            src="/venue_map.png"
            alt="EventFlow venue map showing all zones and occupancy"
            fill
            priority
            className="object-contain object-center p-2 sm:p-3"
            sizes="(max-width: 1024px) 100vw, 70vw"
          />

          {/* Invisible hotspots for zone selection */}
          {zones.map((zone) => {
            const spot = zoneHotspots[zone.id];
            if (!spot) return null;
            const selected = selectedZoneId === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onSelectZone(zone.id)}
                style={spot}
                title={`${zone.name} — ${occupancyPercent(zone.current, zone.capacity)}%`}
                aria-label={`Select ${zone.name}`}
                className={`absolute z-10 rounded-2xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  selected
                    ? "bg-blue-500/10 ring-2 ring-blue-500 ring-offset-1"
                    : "bg-transparent hover:bg-slate-900/5"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
          {(Object.keys(levelLabels) as Array<keyof typeof levelLabels>).map(
            (level) => (
              <span key={level} className="inline-flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${levelStyles[level].dot}`}
                />
                {levelLabels[level]}
              </span>
            ),
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
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
  return (
    <div className="grid gap-2 sm:hidden">
      {zones.map((zone) => {
        const styles = levelStyles[zone.level];
        const percent = occupancyPercent(zone.current, zone.capacity);
        const selected = selectedZoneId === zone.id;

        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone(zone.id)}
            className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left shadow-sm transition ${styles.border} ${
              selected ? "ring-2 ring-blue-400 ring-offset-1" : ""
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
