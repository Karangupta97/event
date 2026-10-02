import type { CrowdLevel } from "../lib/data";
import { crowdColors } from "../lib/data";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  /** adds a subtle hover lift for clickable cards */
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-soft ${
        interactive
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function CrowdBadge({ level }: { level: CrowdLevel }) {
  const c = crowdColors[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function Pill({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "neutral";
}) {
  const styles =
    tone === "brand"
      ? "bg-brand-soft text-brand ring-1 ring-brand/10"
      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}

export function CapacityBar({ value }: { value: number }) {
  const color =
    value >= 75
      ? "from-rose-400 to-rose-500"
      : value >= 45
        ? "from-amber-400 to-amber-500"
        : "from-emerald-400 to-emerald-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/60">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-[width] duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/** Round icon tile used across lists and headers for a consistent, polished look */
export function IconTile({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg" ? "h-11 w-11" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <span
      className={`flex ${dims} shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-inset ring-brand/10 ${className}`}
    >
      {children}
    </span>
  );
}
