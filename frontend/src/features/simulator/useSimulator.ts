"use client";

import { useEffect } from "react";
import { useCrowdStore } from "@/store/useCrowdStore";
import {
  claimSimulatorOwnership,
  initCrossTabSync,
  releaseSimulatorOwnership,
} from "@/store/crossTabSync";
import { tick, TICK_MS } from "./engine";

/**
 * Seeds the store on mount (client-only, so random values never cause
 * hydration mismatch) and runs the 2-second simulation tick.
 *
 * Shared by BOTH the /org and /staff consoles so they operate on the same
 * event state. To avoid double-ticking when both consoles are open in
 * separate tabs, only one tab (the elected "owner") drives the tick; the
 * others stay in sync via cross-tab `storage` events.
 */
export function useSimulator(): void {
  const started = useCrowdStore((s) => s.started);
  const seed = useCrowdStore((s) => s.seed);

  // Listen for writes from the other console/tab.
  useEffect(() => initCrossTabSync(), []);

  // Seed once if nothing has been seeded/persisted yet.
  useEffect(() => {
    if (!started) seed();
  }, [started, seed]);

  // Only the owning tab advances the simulation.
  useEffect(() => {
    if (!started) return;

    const id = window.setInterval(() => {
      if (claimSimulatorOwnership()) tick();
    }, TICK_MS);

    // Run one immediate ownership claim so a lone tab starts ticking right away.
    claimSimulatorOwnership();

    return () => {
      window.clearInterval(id);
      releaseSimulatorOwnership();
    };
  }, [started]);
}
