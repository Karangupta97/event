"use client";

/**
 * Live cross-tab sync and communication bridge for Venuro.
 *
 * Connects /org and /staff in real-time across tabs/windows using native
 * BroadcastChannel (zero-latency pub/sub) with localStorage & StorageEvent fallback.
 *
 * Features:
 * 1. Immediate bidirectional state synchronization on every store action.
 * 2. Instant cross-console communication events (Org broadcasts, field dispatches, alert resolutions).
 * 3. Mutual handshake (REQUEST_SYNC) so opening a new console syncs immediately without reload.
 * 4. Single simulator owner election to prevent double-ticking across consoles.
 */

import { useCrowdStore } from "./useCrowdStore";

const STORAGE_KEY = "venuro-crowd-store";
const OWNER_KEY = "venuro-sim-owner";
const OWNER_TTL_MS = 6000;
const CHANNEL_NAME = "venuro-event-sync-channel";

/** unique id for this tab/session */
export const TAB_ID =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

let refCount = 0;
let isApplyingRemoteSync = false;
let channel: BroadcastChannel | null = null;
let unsubStore: (() => void) | null = null;
const eventListeners = new Set<(msg: any) => void>();

function extractDomainState(s: any) {
  return {
    zones: s.zones,
    staff: s.staff,
    alerts: s.alerts,
    broadcasts: s.broadcasts,
    auditLog: s.auditLog,
    recommendations: s.recommendations,
    mode: s.mode,
    emergencyScenario: s.emergencyScenario,
    emergencyStartedAt: s.emergencyStartedAt,
    selectedZoneId: s.selectedZoneId,
    started: s.started,
  };
}

/** Subscribe to direct comm messages between /org and /staff */
export function onCrossTabMessage(listener: (msg: any) => void): () => void {
  eventListeners.add(listener);
  return () => {
    eventListeners.delete(listener);
  };
}

/** Broadcast a direct communication event across tabs */
export function sendCrossTabMessage(type: string, payload?: any): void {
  if (channel) {
    try {
      channel.postMessage({
        type,
        senderId: TAB_ID,
        payload,
        timestamp: Date.now(),
      });
    } catch {
      /* ignore */
    }
  }
}

/** Start listening for cross-tab writes and apply them to the local store. */
export function initCrossTabSync(): () => void {
  if (typeof window === "undefined") return () => {};

  refCount += 1;
  if (refCount > 1) {
    return () => {
      refCount = Math.max(0, refCount - 1);
    };
  }

  // 1) Initialize BroadcastChannel if supported
  if (typeof BroadcastChannel !== "undefined") {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || data.senderId === TAB_ID) return;

        // Notify custom listeners
        eventListeners.forEach((l) => l(data));

        if (data.type === "STATE_SYNC" && data.payload) {
          try {
            isApplyingRemoteSync = true;
            useCrowdStore.setState(data.payload);
          } finally {
            isApplyingRemoteSync = false;
          }
        } else if (data.type === "REQUEST_SYNC") {
          const state = useCrowdStore.getState();
          if (state.started && channel) {
            channel.postMessage({
              type: "STATE_SYNC",
              senderId: TAB_ID,
              payload: extractDomainState(state),
              timestamp: Date.now(),
            });
          }
        }
      };

      // Request live sync from any existing tab
      channel.postMessage({
        type: "REQUEST_SYNC",
        senderId: TAB_ID,
        timestamp: Date.now(),
      });
    } catch {
      channel = null;
    }
  }

  // 2) Listen for local store updates and broadcast immediately to other tabs
  unsubStore = useCrowdStore.subscribe((state) => {
    if (isApplyingRemoteSync || !channel) return;
    try {
      channel.postMessage({
        type: "STATE_SYNC",
        senderId: TAB_ID,
        payload: extractDomainState(state),
        timestamp: Date.now(),
      });
    } catch {
      /* ignore */
    }
  });

  // 3) Fallback StorageEvent listener for browser compatibility
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue);
      const incoming = parsed?.state ?? parsed;
      if (incoming && typeof incoming === "object") {
        isApplyingRemoteSync = true;
        useCrowdStore.setState(incoming);
        isApplyingRemoteSync = false;
      }
    } catch {
      isApplyingRemoteSync = false;
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    refCount = Math.max(0, refCount - 1);
    if (refCount === 0) {
      window.removeEventListener("storage", onStorage);
      if (unsubStore) {
        unsubStore();
        unsubStore = null;
      }
      if (channel) {
        channel.close();
        channel = null;
      }
    }
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
