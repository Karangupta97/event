"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Music, UtensilsCrossed, LogOut, RotateCcw, ChevronUp } from "lucide-react";
import { applyScenario, type Scenario } from "../engine";
import { cn } from "@/components/ui/cn";

const BUTTONS: { id: Scenario; label: string; icon: typeof Music }[] = [
  { id: "concert", label: "Concert starts", icon: Music },
  { id: "lunch", label: "Lunch rush", icon: UtensilsCrossed },
  { id: "showend", label: "Show ends", icon: LogOut },
  { id: "reset", label: "Reset", icon: RotateCcw },
];

export function DemoPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="mb-2 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-card-hover"
          >
            <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold text-slate-500">
              <Play className="h-3.5 w-3.5" /> Demo scenarios
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {BUTTONS.map((b) => {
                const Icon = b.icon;
                return (
                  <button
                    key={b.id}
                    onClick={() => applyScenario(b.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition-colors",
                      b.id === "reset"
                        ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {b.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-auto flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.03]"
      >
        <Play className="h-4 w-4" />
        Demo
        <ChevronUp
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
    </div>
  );
}
