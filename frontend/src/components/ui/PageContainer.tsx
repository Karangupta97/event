"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "./cn";

/**
 * Consistent page padding/width + a subtle fade-up on mount.
 * The org layout persists across navigation, so this animates on each
 * page's first paint, giving a smooth route transition.
 */
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const inner = (
    <div className={cn("mx-auto w-full max-w-[1600px]", className)}>
      {children}
    </div>
  );

  if (reduce) {
    return (
      <div className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">{inner}</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 pb-20 pt-4 sm:px-6 lg:px-8"
    >
      {inner}
    </motion.div>
  );
}

/** compact section heading used within pages */
export function SectionTitle({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
      {right}
    </div>
  );
}
