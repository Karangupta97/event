"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  History,
  TriangleAlert,
  Radio,
  Zap,
  Send,
  ShieldAlert,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import { formatTime } from "@/components/ui/status";
import type { AuditEntry } from "@/features/actions/types";

type Filter = "all" | AuditEntry["kind"];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "alert", label: "Alerts" },
  { id: "broadcast", label: "Broadcasts" },
  { id: "action", label: "Actions" },
  { id: "dispatch", label: "Dispatch" },
  { id: "emergency", label: "Emergency" },
];

const KIND_META: Record<
  AuditEntry["kind"],
  { icon: LucideIcon; cls: string }
> = {
  alert: { icon: TriangleAlert, cls: "bg-red-50 text-red-600" },
  broadcast: { icon: Radio, cls: "bg-blue-50 text-blue-600" },
  action: { icon: Zap, cls: "bg-violet-50 text-violet-600" },
  dispatch: { icon: Send, cls: "bg-amber-50 text-amber-600" },
  emergency: { icon: ShieldAlert, cls: "bg-red-100 text-red-700" },
  system: { icon: Info, cls: "bg-slate-100 text-slate-500" },
};

export function ActivityLog({ log }: { log: AuditEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = (filter === "all" ? log : log.filter((e) => e.kind === filter)).slice(
    0,
    40,
  );

  return (
    <Card>
      <CardHeader
        title="Activity Log"
        subtitle="Alerts, broadcasts and executed actions"
        icon={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <History className="h-[18px] w-[18px]" />
          </span>
        }
        right={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === f.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="max-h-80 overflow-y-auto thin-scroll pr-1">
        {shown.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No activity in this category yet.
          </p>
        ) : (
          <ul className="relative space-y-1 before:absolute before:bottom-2 before:left-[18px] before:top-2 before:w-px before:bg-slate-100">
            <AnimatePresence initial={false}>
              {shown.map((e) => {
                const meta = KIND_META[e.kind];
                const Icon = meta.icon;
                return (
                  <motion.li
                    key={e.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="relative flex items-start gap-3 rounded-lg px-1 py-2 hover:bg-slate-50"
                  >
                    <span
                      className={cn(
                        "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white",
                        meta.cls,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm text-slate-700">{e.message}</p>
                      <p className="text-[11px] text-slate-400 tnum">
                        {formatTime(e.t)}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </Card>
  );
}
