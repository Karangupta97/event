"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Timer, Navigation, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Staff } from "../types";
import { ROLE_LABEL } from "../types";
import type { Zone } from "@/features/zones/types";

/** live tracker of staff currently en route, with ETA countdown */
export function EnRouteBoard({
  staff,
  zones,
}: {
  staff: Staff[];
  zones: Zone[];
}) {
  const enRoute = staff.filter((s) => s.status === "en_route");
  const zoneName = (id?: string) =>
    id ? (zones.find((z) => z.id === id)?.name ?? id) : "—";

  return (
    <Card padded={false} className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">En Route</h3>
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
          <Navigation className="h-3 w-3" /> {enRoute.length} moving
        </span>
      </div>

      {enRoute.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-slate-700">No one in transit</p>
          <p className="text-xs text-slate-500">
            Dispatch a staffer and track their arrival here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {enRoute.map((s) => (
              <motion.li
                key={s.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                  {s.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {s.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ROLE_LABEL[s.role]} → {zoneName(s.destZoneId)}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 tnum">
                  <Timer className="h-3.5 w-3.5" />
                  ETA {s.etaTicks * 2}s
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}
