"use client";

import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer, SectionTitle } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { useOrgData } from "@/store/useOrgData";
import { useCrowdStore } from "@/store/useCrowdStore";
import { cn } from "@/components/ui/cn";

import { VenueMap } from "@/features/zones/components/VenueMap";
import { ZoneTrend } from "@/features/zones/components/ZoneTrend";
import { ZoneDetailPanel } from "@/features/zones/components/ZoneDetailPanel";
import { ExitOverlay } from "@/features/emergency/components/ExitOverlay";
import { zonePct, zoneStatus } from "@/features/zones/types";
import { ZONE_THEME } from "@/components/ui/status";

export default function MapPage() {
  return (
    <OrgGate>
      <MapContent />
    </OrgGate>
  );
}

function MapContent() {
  const { zones, mode, selectedZoneId, selectedZone } = useOrgData();
  const selectZone = useCrowdStore((s) => s.selectZone);

  if (!selectedZone) return null;

  return (
    <PageContainer className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* big map */}
        <div className="space-y-3">
          <Card padded={false} className="overflow-hidden p-2">
            <VenueMap
              zones={zones}
              selectedId={selectedZoneId}
              onSelect={selectZone}
              svgOverlay={
                mode === "emergency" ? <ExitOverlay zones={zones} /> : null
              }
            />
          </Card>
          <ZoneTrend zone={selectedZone} />
        </div>

        {/* zone selector + detail */}
        <div className="space-y-4">
          <div>
            <SectionTitle title="Zones" hint="Select to inspect" />
            <div className="grid grid-cols-1 gap-2">
              {zones.map((z) => {
                const status = zoneStatus(z.count, z.capacity);
                const theme = ZONE_THEME[status];
                const pct = zonePct(z.count, z.capacity);
                const selected = selectedZoneId === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => selectZone(z.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "border-blue-300 ring-1 ring-blue-200"
                        : "border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: theme.accent }}
                    />
                    <span className="flex-1 text-sm font-medium text-slate-900">
                      {z.name}
                    </span>
                    <span
                      className="tnum text-xs font-semibold"
                      style={{ color: theme.text }}
                    >
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <ZoneDetailPanel zone={selectedZone} zones={zones} />
        </div>
      </div>
    </PageContainer>
  );
}
