"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useCrowdStore } from "@/store/useCrowdStore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { EMERGENCY_SCENARIOS } from "../data";
import type { Zone } from "@/features/zones/types";

export function EmergencyBanner({ zones }: { zones: Zone[] }) {
  const mode = useCrowdStore((s) => s.mode);
  const scenario = useCrowdStore((s) => s.emergencyScenario);
  const standDown = useCrowdStore((s) => s.standDown);

  const def = EMERGENCY_SCENARIOS.find((s) => s.id === scenario);
  const peopleInside = zones.reduce((a, z) => a + z.count, 0);

  return (
    <AnimatePresence>
      {mode === "emergency" && def && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="sticky top-0 z-30"
        >
          <div className="flex flex-wrap items-center gap-3 bg-red-600 px-4 py-3 text-white sm:px-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide">
                {def.label} active
              </p>
              <p className="truncate text-xs text-red-50">{def.bannerText}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5">
              <span className="text-xs text-red-50">People still inside</span>
              <AnimatedNumber
                value={peopleInside}
                className="text-sm font-semibold tnum"
              />
            </div>
            <button
              onClick={standDown}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Stand down
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
