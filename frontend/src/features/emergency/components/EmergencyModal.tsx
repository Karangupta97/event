"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Info } from "lucide-react";
import { EMERGENCY_SCENARIOS } from "../data";
import type { EmergencyScenario } from "@/store/useCrowdStore";
import { useCrowdStore } from "@/store/useCrowdStore";
import { cn } from "@/components/ui/cn";

const HOLD_MS = 2000;

export function EmergencyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const startEmergency = useCrowdStore((s) => s.startEmergency);
  const [selected, setSelected] = useState<EmergencyScenario>("evacuate");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);

  const STEP_MS = 50; // progress tick interval
  const STEP_DELTA = STEP_MS / HOLD_MS;

  function beginHold() {
    if (reduce) {
      // reduced motion: single confirm, no hold animation
      confirm();
      return;
    }
    // advance progress by a fixed delta each interval (no wall-clock read)
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + STEP_DELTA;
        if (next >= 1) {
          confirm();
          return 1;
        }
        return next;
      });
    }, STEP_MS);
  }

  function cancelHold() {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setProgress(0);
  }

  function confirm() {
    cancelHold();
    startEmergency(selected);
    setProgress(0);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-hover">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Emergency protocol
                  </h2>
                  <p className="text-sm text-slate-500">
                    Choose a scenario, then press and hold to confirm.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 space-y-2">
                {EMERGENCY_SCENARIOS.map((sc) => {
                  const Icon = sc.icon;
                  const active = selected === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setSelected(sc.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        active
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          active
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            active ? "text-red-700" : "text-slate-900",
                          )}
                        >
                          {sc.label}
                        </p>
                        <p className="text-xs text-slate-500">{sc.description}</p>
                      </div>
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border-2",
                          active
                            ? "border-red-500 bg-red-500"
                            : "border-slate-300",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* press and hold */}
              <button
                onMouseDown={beginHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={beginHold}
                onTouchEnd={cancelHold}
                className="relative h-12 w-full select-none overflow-hidden rounded-xl bg-red-600 font-semibold text-white transition-colors hover:bg-red-700"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-red-800/40"
                  style={{ width: `${progress * 100}%` }}
                />
                <span className="relative">
                  {reduce
                    ? "Confirm emergency"
                    : progress > 0
                      ? "Keep holding…"
                      : "Press & hold to activate"}
                </span>
              </button>

              <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Coordination aid. Follow the venue safety officer and emergency
                services.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
