"use client";

import { MapPin, User, Users } from "lucide-react";
import {
  formatCount,
  getZoneById,
  occupancyPercent,
  staffSession,
  teamInfo,
} from "../mock-data";
import type { NavTab } from "../types";
import { TopNav } from "./BottomNav";
import { OnlineBadge, OccupancyRing } from "./shared";

export function DesktopTopBar({
  activeTab,
  onTabChange,
}: {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}) {
  return (
    <header className="staff-topbar sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <div className="relative mx-auto flex w-full max-w-[1600px] items-center px-5 py-2.5 xl:px-6">
        {/* Brand + greeting — left */}
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="staff-logo flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-blue-500/25">
            EF
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-slate-900 xl:text-lg">
              Welcome, {staffSession.name}{" "}
              <span className="staff-wave inline-block origin-[70%_70%]">👋</span>
            </h1>
            <p className="hidden truncate text-xs text-slate-500 xl:block">
              Stay alert. Keep your zone safe.
            </p>
          </div>
        </div>

        {/* Pages — centered */}
        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <div className="pointer-events-auto">
            <TopNav active={activeTab} onChange={onTabChange} />
          </div>
        </div>

        {/* Status — right */}
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <OnlineBadge />
          <button
            type="button"
            className="group flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            aria-label="Profile"
          >
            V
          </button>
        </div>
      </div>
    </header>
  );
}

export function DesktopStatCards() {
  const zone = getZoneById(staffSession.zoneId)!;
  const percent = occupancyPercent(zone.current, zone.capacity);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <article className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <MapPin className="h-4 w-4" />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Your Zone
        </p>
        <p className="mt-0.5 text-base font-bold text-slate-900">
          {zone.name}{" "}
          <span className="text-sm font-medium text-slate-400">(Zone 3)</span>
        </p>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            {percent}%
          </span>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          People in your zone
        </p>
        <p className="mt-0.5 text-xl font-bold text-slate-900">
          {formatCount(zone.current)}
          <span className="ml-1 text-sm font-medium text-slate-400">
            / {formatCount(zone.capacity)} capacity
          </span>
        </p>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Users className="h-4 w-4" />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Your Team
        </p>
        <p className="mt-0.5 text-base font-bold text-slate-900">
          {teamInfo.total} Volunteers
        </p>
        <p className="mt-0.5 text-sm text-slate-500">
          {teamInfo.nearby} nearby • {teamInfo.otherZones} on other zones
        </p>
      </article>
    </div>
  );
}

export function MobileHeaderCards({
  onZoneChange,
}: {
  onZoneChange?: () => void;
}) {
  const zone = getZoneById(staffSession.zoneId)!;

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onZoneChange}
        className="rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition hover:border-blue-100"
      >
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <MapPin className="h-4 w-4" />
        </div>
        <p className="text-[11px] font-medium text-slate-400">Your Zone</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-900">
          {zone.name}
          <span className="text-slate-300">▾</span>
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {formatCount(zone.current)} / {formatCount(zone.capacity)} people
        </p>
      </button>

      <button
        type="button"
        className="rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition hover:border-blue-100"
      >
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Users className="h-4 w-4" />
        </div>
        <p className="text-[11px] font-medium text-slate-400">Your Team</p>
        <p className="mt-0.5 flex items-center justify-between text-sm font-bold text-slate-900">
          {teamInfo.total} Volunteers
          <span className="text-slate-300">›</span>
        </p>
      </button>
    </div>
  );
}

export function QuickStats({
  zoneId = staffSession.zoneId,
}: {
  zoneId?: string;
}) {
  const zone = getZoneById(zoneId)!;
  const percent = occupancyPercent(zone.current, zone.capacity);
  const ringClass =
    percent >= 75
      ? "stroke-red-500"
      : percent >= 50
        ? "stroke-amber-400"
        : "stroke-emerald-500";

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-800">
          Quick Stats (Your Zone)
        </h2>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="grid flex-1 grid-cols-2 gap-4">
          <div>
            <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <User className="h-3.5 w-3.5" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {formatCount(zone.current)}
            </p>
            <p className="text-xs text-slate-500">Current People</p>
          </div>
          <div>
            <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Users className="h-3.5 w-3.5" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {formatCount(zone.capacity)}
            </p>
            <p className="text-xs text-slate-500">Total Capacity</p>
          </div>
        </div>
        <OccupancyRing percent={percent} className={ringClass} size={80} />
      </div>
    </section>
  );
}
