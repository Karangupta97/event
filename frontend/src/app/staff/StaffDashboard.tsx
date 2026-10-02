"use client";

import { ArrowLeft, Clock, Settings, Users } from "lucide-react";
import { useState } from "react";
import { useStaffData } from "./store-adapter";
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
  const { session, eventName } = useStaffData();
  const [activeTab, setActiveTab] = useState<NavTab>("map");
  const [selectedZoneId, setSelectedZoneId] = useState(session.zoneId);
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
            <div className="staff-map-page flex min-h-0 flex-1 flex-col gap-3">
              <EmergencyBanner />
              <div className="min-h-[min(78vh,860px)] w-full">
                <VenueMap
                  expanded
                  selectedZoneId={selectedZoneId}
                  onSelectZone={setSelectedZoneId}
                />
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
            <div className="grid w-full gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
              <div className="staff-rise-in">
                <DispatchPanel defaultOpen defaultZoneId="food-court" />
              </div>

              <div className="staff-rise-in staff-delay-1 flex flex-col gap-4">
                <QuickStats zoneId={selectedZoneId} />
                <div className="staff-card-hover flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800">
                    How requests work
                  </h2>
                  <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-500">
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      Pick an available volunteer nearby your zone.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      Choose the target area that needs backup.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      Add a short note so they know what to expect.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="staff-rise-in staff-delay-2 lg:col-span-2 xl:col-span-1">
                <DispatchSidePanel />
              </div>
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
              <p className="text-[11px] text-slate-400">{eventName}</p>
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
                    expanded
                    selectedZoneId={selectedZoneId}
                    onSelectZone={setSelectedZoneId}
                  />
                </div>
              )}

              <EmergencyBanner variant="mobile" />
              <AlertsPanel collapsible defaultOpen={false} />
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
            <div className="space-y-4">
              <DispatchPanel defaultOpen defaultZoneId="food-court" />
              <QuickStats zoneId={selectedZoneId} />
            </div>
          )}

          {activeTab === "settings" && <SettingsPanel />}
        </main>

        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}

const statusMeta: Record<
  string,
  { label: string; dot: string; text: string }
> = {
  available: { label: "Available", dot: "bg-emerald-500", text: "text-emerald-600" },
  busy: { label: "Busy", dot: "bg-amber-400", text: "text-amber-600" },
  offline: { label: "Offline", dot: "bg-slate-300", text: "text-slate-400" },
};

function DispatchSidePanel() {
  const { volunteers, alerts } = useStaffData();
  return (
    <div className="flex h-full flex-col gap-4">
      <section className="staff-card-hover rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800">
            Team Availability
          </h2>
        </div>
        <ul className="space-y-1">
          {volunteers.map((v, i) => {
            const meta = statusMeta[v.status] ?? statusMeta.offline;
            return (
              <li
                key={v.id}
                className="staff-rise-in flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${v.avatarColor}`}
                >
                  {v.initials}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                  {v.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="staff-card-hover flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800">
            Recent Requests
          </h2>
        </div>
        <ol className="relative space-y-4 border-l border-slate-100 pl-4">
          {alerts.map((a, i) => (
            <li
              key={a.id}
              className="staff-rise-in relative"
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            >
              <span
                className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                  a.level === "high"
                    ? "bg-red-500"
                    : a.level === "busy"
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                }`}
              />
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-slate-800">
                  {a.title}
                </p>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {a.time}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {a.zoneName} · {a.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
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
