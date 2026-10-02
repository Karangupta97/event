"use client";

import { useCrowdStore } from "@/store/useCrowdStore";
import { Loader2 } from "lucide-react";

/**
 * Gates page content until the simulated venue data is seeded on the client
 * (seeding happens in an effect to avoid hydration mismatches).
 */
export function OrgGate({ children }: { children: React.ReactNode }) {
  const ready = useCrowdStore((s) => s.zones.length > 0);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">Loading venue telemetry…</p>
      </div>
    );
  }

  return <>{children}</>;
}
