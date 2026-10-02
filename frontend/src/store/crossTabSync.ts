"use client";

/**
 * Live cross-tab sync for the crowd store.
 *
 * The `persist` middleware already restores state from localStorage on load,
 * so a refresh keeps the same event state. But when the /staff and /org
 * consoles are open in two tabs at the same time, we also want writes in one
 * tab to show up in the other without a refresh.
 *
 * We do that by listening for the browser `storage` event (fired in *other*
 * tabs whenever localStorage changes) and re-hydrating the store from the
 * freshly written value.
 *
 * We also elect a single "simulator owner" tab via a short-lived heartbeat in
 * localStorage, so the 2s tick only runs in one tab. Other tabs stay in sync
 * purely through the storage events, which prevents two tabs from both
 * driving (and doubling) the simulation.
 */

import { useCrowdStore } from "./useCrowdStore";

const STORAGE_KEY = "eventflow-crowd-store";
const OWNER_KEY = "eventflow-sim-owner";
const OWNER_TTL_MS = 6000;

/** unique id for this tab/session */
const TAB_ID =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

let subscribed = false;

/** Start listening for cross-tab writes and apply them to the local store. */
export function initCrossTabSync(): () => void {
  if (typeof window === "undefined" || subscribed) return () => {};
  subscribed = true;

  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue);
      // zustand/persist stores shape as { state, version }
      const incoming = parsed?.state ?? parsed;
      if (incoming && typeof incoming === "object") {
        // Merge domain fields; keep our action functions intact.
        useCrowdStore.setState(incoming);
      }
    } catch {
      /* ignore malformed payloads */
    }
  };

  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    subscribed = false;
  };
}

/**
 * Try to become (or renew) the simulator-owner tab.
 * Returns true if this tab currently owns the simulation loop.
 */
export function claimSimulatorOwnership(): boolean {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  try {
    const raw = localStorage.getItem(OWNER_KEY);
    const current = raw ? (JSON.parse(raw) as { id: string; t: number }) : null;

    const expired = !current || now - current.t > OWNER_TTL_MS;
    const mine = current?.id === TAB_ID;

    if (expired || mine) {
      localStorage.setItem(OWNER_KEY, JSON.stringify({ id: TAB_ID, t: now }));
      return true;
    }
    return false;
  } catch {
    // If storage is unavailable, just run locally.
    return true;
  }
}

/** Release ownership when the owning tab unmounts/closes. */
export function releaseSimulatorOwnership(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(OWNER_KEY);
    const current = raw ? (JSON.parse(raw) as { id: string }) : null;
    if (current?.id === TAB_ID) localStorage.removeItem(OWNER_KEY);
  } catch {
    /* ignore */
  }
}
