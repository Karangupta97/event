"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "./cn";

interface CardProps extends HTMLMotionProps<"div"> {
  /** enable lift-on-hover interaction */
  interactive?: boolean;
  padded?: boolean;
}

export function Card({
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-card",
        padded && "p-5 sm:p-6",
        interactive &&
          "transition-shadow duration-200 hover:border-slate-300 hover:shadow-card-hover",
        className,
      )}
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  right,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}
