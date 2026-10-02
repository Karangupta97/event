"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./icons";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Show a back button that returns to the previous page */
  back?: boolean;
  /** Optional element rendered on the right (e.g. a bell button) */
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/80 px-4 py-3.5 backdrop-blur lg:border-0 lg:bg-transparent">
      <div className="flex items-center gap-3">
        {back && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <ArrowLeftIcon width={20} height={20} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
