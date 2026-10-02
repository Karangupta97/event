"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { useState } from "react";
import { EVENT_NAME, staffSession } from "./mock-data";
import type { NavTab } from "./types";
import {
  ActiveAlertsList,
  AlertsPanel,
  EmergencyBanner,
} from "./components/Alerts";
import { BottomNav } from "./components/BottomNav";
import { DispatchPanel } from "./components/Dispatch";
import {
  DesktopStatCards,
  DesktopTopBar,
  MobileHeaderCards,
  QuickStats,
} from "./components/HeaderStats";
import { OnlineBadge } from "./components/shared";
import { VenueMap, ZoneCardList } from "./components/VenueMap";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<NavTab>("map");
  const [selectedZoneId, setSelectedZoneId] = useState(staffSession.zoneId);
  const [showZoneCards, setShowZoneCards] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* —— Desktop —— */}
      <div className="hidden lg:block">
        <DesktopTopBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-5 xl:p-6">
          {(activeTab === "map" ||
            activeTab === "alerts" ||
            activeTab === "dispatch") && <DesktopStatCards />}

          {activeTab === "map" && (
            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.7fr)]">
              <div className="min-h-[580px]">
                <VenueMap
                  selectedZoneId={selectedZoneId}
                  onSelectZone={setSelectedZoneId}
                />
              </div>

              <div className="flex flex-col gap-3">
                <EmergencyBanner />
                <DispatchPanel defaultZoneId="food-court" />
                <QuickStats zoneId={selectedZoneId} />
                <ActiveAlertsList limit={3} />
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="mx-auto w-full max-w-2xl space-y-4">
              <EmergencyBanner />
              <ActiveAlertsList />
            </div>
          )}

          {activeTab === "dispatch" && (
            <div className="mx-auto w-full max-w-lg">
              <DispatchPanel defaultOpen defaultZoneId="food-court" />
            </div>
          )}

          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>

      {/* —— Mobile —— */}
      <div className="flex min-h-screen flex-col lg:hidden">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-slate-900">
                {activeTab === "map"
                  ? "Venue Map"
                  : activeTab === "alerts"
                    ? "Alerts"
                    : activeTab === "dispatch"
                      ? "Dispatch"
                      : "Settings"}
              </h1>
              <p className="text-[11px] text-slate-400">{EVENT_NAME}</p>
            </div>
            <OnlineBadge compact />
          </div>
        </header>

        <main className="flex-1 space-y-4 px-4 py-4 pb-24">
          {activeTab === "map" && (
            <>
              <MobileHeaderCards
                onZoneChange={() => setShowZoneCards((v) => !v)}
              />

              {showZoneCards ? (
                <ZoneCardList
                  selectedZoneId={selectedZoneId}
                  onSelectZone={(id) => {
                    setSelectedZoneId(id);
                    setShowZoneCards(false);
                  }}
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <VenueMap
                    selectedZoneId={selectedZoneId}
                    onSelectZone={setSelectedZoneId}
                  />
                </div>
              )}

              <EmergencyBanner variant="mobile" />
              <AlertsPanel collapsible defaultOpen={false} />
              <DispatchPanel
                collapsible
                defaultOpen={false}
                defaultZoneId="food-court"
              />
              <QuickStats zoneId={selectedZoneId} />
            </>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <EmergencyBanner variant="mobile" />
              <EmergencyBanner />
              <ActiveAlertsList />
            </div>
          )}

          {activeTab === "dispatch" && (
            <DispatchPanel defaultOpen defaultZoneId="food-court" />
          )}

          {activeTab === "settings" && <SettingsPanel />}
        </main>

        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <section className="mx-auto w-full max-w-lg space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
            V
          </div>
          <div>
            <p className="font-semibold text-slate-900">Volunteer Profile</p>
            <p className="text-xs text-slate-500">
              Assigned to Stage Area · Zone 3
            </p>
          </div>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {[
            ["Notifications", "Push + SMS"],
            ["Shift", "12:00 PM – 8:00 PM"],
            ["Radio Channel", "Ops · Ch 2"],
            ["Language", "English"],
          ].map(([label, value]) => (
            <li
              key={label}
              className="flex items-center justify-between py-3 text-slate-600"
            >
              <span>{label}</span>
              <span className="font-medium text-slate-900">{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-800">
          <Settings className="h-4 w-4" />
          <h2 className="text-sm font-semibold">App Preferences</h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Mock preferences for demo purposes. All data on this dashboard is
          static sample content for UI presentation.
        </p>
      </div>
    </section>
  );
}
