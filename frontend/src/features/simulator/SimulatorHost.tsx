"use client";

import { useSimulator } from "./useSimulator";

/**
 * Mounts the shared event simulator + cross-tab sync for a console.
 * Rendered by both the /org and /staff layouts so either console keeps the
 * same event state alive and in sync. Renders nothing.
 */
export function SimulatorHost() {
  useSimulator();
  return null;
}
