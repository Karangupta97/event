"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Calendar } from "lucide-react";
import { NAV_ITEMS, activeNavId } from "./nav";
import { Badge } from "./Pill";
import { cn } from "./cn";

export function Sidebar({ alertCount }: { alertCount: number }) {
  const pathname = usePathname();
  const active = activeNavId(pathname);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* logo */}
      <Link
        href="/org"
        className="flex items-center gap-2.5 px-5 py-5 transition-opacity hover:opacity-90"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
          <Shield className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-[15px] font-semibold leading-tight text-slate-900">
            EventFlow
          </p>
          <p className="text-xs text-slate-500">Organizer Console</p>
        </div>
      </Link>

      {/* nav */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-blue-50"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <motion.span
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="relative z-10 flex items-center"
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px]",
                    isActive ? "text-blue-600" : "text-slate-400",
                  )}
                  strokeWidth={2}
                />
              </motion.span>
              <span className="relative z-10 flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="relative z-10">
                  <Badge count={alertCount} />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* event card */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Calendar className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">TechFest 2025</p>
            <p className="text-xs text-slate-500 tnum">22 – 24 Aug 2025</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
