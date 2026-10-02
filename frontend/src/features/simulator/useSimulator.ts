"use client";

import { useEffect } from "react";
import { useCrowdStore } from "@/store/useCrowdStore";
import { tick, TICK_MS } from "./engine";

/**
 * Seeds the store on mount (client-only, so random values never cause
 * hydration mismatch) and runs the 2-second simulation tick.
 */
export function useSimulator(): void {
  const started = useCrowdStore((s) => s.started);
  const seed = useCrowdStore((s) => s.seed);

  useEffect(() => {
    if (!started) seed();
  }, [started, seed]);

  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, [started]);
}
