"use client";

import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";

import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer, SectionTitle } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { useOrgData } from "@/store/useOrgData";
import { useCrowdStore } from "@/store/useCrowdStore";

import { LiveStatusStrip } from "@/features/zones/components/LiveStatusStrip";
import { KpiRow } from "@/features/zones/components/KpiRow";
import { VenueMap } from "@/features/zones/components/VenueMap";
import { ZoneOverviewTable } from "@/features/zones/components/ZoneOverviewTable";
import { CriticalAlerts } from "@/features/alerts/components/CriticalAlerts";
import { PriorityBanner } from "@/features/alerts/components/PriorityBanner";
import { RecommendedAction } from "@/features/actions/components/RecommendedAction";
import { ExitOverlay } from "@/features/emergency/components/ExitOverlay";

export default function OverviewPage() {
  return (
    <OrgGate>
      <OverviewContent />
    </OrgGate>
  );
}

function OverviewContent() {
  const { zones, staff, alerts, recommendations, mode, selectedZoneId, topRec } =
    useOrgData();
  const selectZone = useCrowdStore((s) => s.selectZone);

  return (
    <PageContainer className="space-y-5">
      {/* at-a-glance live crowd strip */}
      <LiveStatusStrip zones={zones} />

      {/* KPIs */}
      <KpiRow
        zones={zones}
        staff={staff}
        alerts={alerts}
        recommendations={recommendations}
      />

      {/* command grid: map (left) + decision rail (right) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <SectionTitle
            title="Venue Map"
            hint="Click a zone to inspect it on the Live Map"
            right={
              <Link
                href="/org/map"
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Maximize2 className="h-3.5 w-3.5" /> Full map
              </Link>
            }
          />
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
        </div>

        <div className="space-y-4">
          <PriorityBanner alerts={alerts} zones={zones} />
          <RecommendedAction rec={topRec} />
          <CriticalAlerts alerts={alerts} zones={zones} />
        </div>
      </div>

      {/* condensed detail below the fold */}
      <div className="space-y-3">
        <SectionTitle
          title="Zone Status"
          hint="Occupancy, trend and staffing across every zone"
          right={
            <Link
              href="/org/analytics"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Full analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <ZoneOverviewTable zones={zones} />
      </div>
    </PageContainer>
  );
}
