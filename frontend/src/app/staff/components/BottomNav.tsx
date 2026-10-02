"use client";

import { Bell, Map, Settings, Users } from "lucide-react";
import type { NavTab } from "../types";

const tabs: {
  id: NavTab;
  label: string;
  icon: typeof Map;
  badge?: number;
}[] = [
  { id: "map", label: "Map", icon: Map },
  { id: "alerts", label: "Alerts", icon: Bell, badge: 2 },
  { id: "dispatch", label: "Dispatch", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                className={`relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="relative">
                  <Icon
                    className={`h-5 w-5 ${isActive ? "stroke-[2.25]" : ""}`}
                  />
                  {tab.badge != null && tab.badge > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {tab.badge}
                    </span>
                  )}
                </span>
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopNav({
  active,
  onChange,
}: {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}) {
  return (
    <nav className="hidden items-center gap-0.5 rounded-2xl bg-slate-100/80 p-1 lg:flex">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`staff-nav-item relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-transform duration-200 ${
                isActive ? "scale-110" : ""
              }`}
            />
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="staff-badge-pulse rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-red-500/40">
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-blue-500 opacity-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
