"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Radio, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatTime } from "@/components/ui/status";
import { cn } from "@/components/ui/cn";
import type { Broadcast, BroadcastSeverity } from "../types";
import { CHANNEL_LABEL } from "../types";
import type { Zone } from "@/features/zones/types";

const SEV_DOT: Record<BroadcastSeverity, string> = {
  info: "bg-blue-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

export function BroadcastHistory({
  broadcasts,
  zones,
}: {
  broadcasts: Broadcast[];
  zones: Zone[];
}) {
  const zoneLabel = (b: Broadcast) =>
    b.zoneIds === "all"
      ? "All zones"
      : b.zoneIds
          .map((id) => zones.find((z) => z.id === id)?.name ?? id)
          .join(", ");

  return (
    <Card padded={false} className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Sent Broadcasts</h3>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 tnum">
            {broadcasts.length}
          </span>
        </div>
        <Radio className="h-4 w-4 text-slate-400" />
      </div>

      {broadcasts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-12 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Megaphone className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-slate-700">
            No broadcasts yet
          </p>
          <p className="max-w-xs text-xs text-slate-500">
            Messages you send appear here, newest first.
          </p>
        </div>
      ) : (
        <ul className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto thin-scroll">
          <AnimatePresence initial={false}>
            {broadcasts.map((b) => (
              <motion.li
                key={b.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", SEV_DOT[b.severity])} />
                  <span className="text-xs font-medium capitalize text-slate-500">
                    {b.severity} · {CHANNEL_LABEL[b.channel]}
                  </span>
                  <span className="ml-auto text-[11px] text-slate-400 tnum">
                    {formatTime(b.sentAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-800">{b.message}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{zoneLabel(b)}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}
