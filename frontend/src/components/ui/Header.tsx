"use client";

import { Bell, TriangleAlert, User } from "lucide-react";
import { motion } from "framer-motion";
import { MobileNav } from "./MobileNav";
import { Badge } from "./Pill";
import { useScrolled } from "./useScrollSpy";
import { cn } from "./cn";

export function Header({
  title,
  subtitle,
  alertCount,
  onEmergency,
}: {
  title: string;
  subtitle: string;
  alertCount: number;
  onEmergency: () => void;
}) {
  const scrolled = useScrolled(20);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 transition-all duration-200",
        scrolled
          ? "border-b border-slate-200 bg-canvas/80 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-canvas",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileNav alertCount={alertCount} />
          <div>
            <h1 className="text-lg font-semibold leading-tight text-slate-900">
              {title}
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 sm:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </span>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onEmergency}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <TriangleAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency</span>
          </motion.button>

          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Bell className="h-[18px] w-[18px]" />
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1">
                <Badge count={alertCount} />
              </span>
            )}
          </button>

          <button
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
