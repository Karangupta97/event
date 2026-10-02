"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Check,
  CircleDot,
  Megaphone,
  Ban,
  Users,
  Navigation,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Recommendation, ActionStepKind } from "../types";
import { executeRecommendation } from "../execute";
import { useCrowdStore } from "@/store/useCrowdStore";

const STEP_ICON: Record<ActionStepKind, LucideIcon> = {
  broadcast: Megaphone,
  restrict: Ban,
  dispatch: Users,
  redirect: Navigation,
  reopen: Navigation,
};

export function RecommendedAction({ rec }: { rec: Recommendation | null }) {
  const dismiss = useCrowdStore((s) => s.dismissRecommendation);

  return (
    <AnimatePresence mode="wait">
      {!rec ? (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Recommended Action
                </h3>
                <p className="text-xs text-slate-500">
                  No intervention needed right now. We&apos;ll suggest one if a
                  zone starts to fill.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : rec.state === "executed" ? (
        <motion.div
          key="executed"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          layout
        >
          <Card className="border-green-200 bg-green-50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-green-700">
                    Action Executed
                  </h3>
                  <p className="text-xs text-slate-600">
                    Plan completed · zone recovering.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismiss(rec.id)}
              >
                Done
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          layout
        >
          <Card className="border-blue-200">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Sparkles className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Recommended Action
                </h3>
                <p className="text-xs text-slate-500">Human-in-the-loop plan</p>
              </div>
            </div>

            <p className="mb-3 rounded-lg bg-blue-50/70 px-3 py-2 text-sm text-slate-700">
              {rec.reason}
            </p>

            <ol className="mb-4 space-y-2.5">
              {rec.steps.map((step, i) => {
                const StepIcon = STEP_ICON[step.kind];
                const done = rec.completedStep >= i;
                const active =
                  rec.state === "executing" && rec.completedStep === i - 1;
                return (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {done ? (
                          <motion.span
                            key="done"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.span>
                        ) : active ? (
                          <motion.span
                            key="active"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <CircleDot className="h-3 w-3" />
                          </motion.span>
                        ) : (
                          <span key="idle" className="text-[10px] font-semibold tnum">
                            {i + 1}
                          </span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <StepIcon
                        className={`h-3.5 w-3.5 ${done ? "text-green-600" : "text-slate-400"}`}
                      />
                      <span
                        className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-700"}`}
                      >
                        {step.label}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {rec.state === "pending" ? (
              <div className="flex gap-2">
                <Button
                  fullWidth
                  onClick={() => executeRecommendation(rec)}
                >
                  Approve &amp; Execute
                </Button>
                <Button variant="outline" onClick={() => dismiss(rec.id)}>
                  Dismiss
                </Button>
              </div>
            ) : (
              <p className="text-center text-xs font-medium text-blue-600">
                Executing plan…
              </p>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
