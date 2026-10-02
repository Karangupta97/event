import { create } from "zustand";
import type { Zone, ZoneFlow } from "@/features/zones/types";
import type { Staff } from "@/features/staff/types";
import type { Alert, AlertStatus } from "@/features/alerts/types";
import type { Broadcast } from "@/features/comms/types";
import type {
  AuditEntry,
  Recommendation,
} from "@/features/actions/types";
import { INITIAL_ZONES } from "@/features/zones/data";
import { INITIAL_STAFF } from "@/features/staff/data";

export type AppMode = "normal" | "emergency";
export type EmergencyScenario = "evacuate" | "medical" | "hold";

let seq = 0;
export function uid(prefix = "id"): string {
  seq += 1;
  return `${prefix}_${seq}`;
}

export interface CrowdState {
  zones: Zone[];
  staff: Staff[];
  alerts: Alert[];
  broadcasts: Broadcast[];
  auditLog: AuditEntry[];
  recommendations: Recommendation[];
  mode: AppMode;
  emergencyScenario: EmergencyScenario | null;
  emergencyStartedAt: number | null;
  selectedZoneId: string;
  started: boolean;

  // lifecycle
  seed: () => void;

  // zone ops
  patchZones: (next: Zone[]) => void;
  setZoneFlow: (zoneId: string, flow: ZoneFlow) => void;
  adjustCount: (zoneId: string, delta: number) => void;
  selectZone: (zoneId: string) => void;

  // staff ops
  patchStaff: (next: Staff[]) => void;
  dispatchStaff: (staffId: string, destZoneId: string) => void;

  // alerts
  addAlert: (a: Alert) => void;
  setAlertStatus: (id: string, status: AlertStatus, assignedTo?: string) => void;
  patchAlerts: (next: Alert[]) => void;

  // comms
  addBroadcast: (b: Broadcast) => void;

  // recommendations
  addRecommendation: (r: Recommendation) => void;
  patchRecommendation: (id: string, patch: Partial<Recommendation>) => void;
  dismissRecommendation: (id: string) => void;

  // audit
  log: (entry: Omit<AuditEntry, "id" | "t"> & { t?: number }) => void;

  // emergency
  startEmergency: (scenario: EmergencyScenario) => void;
  standDown: () => void;
}

const HISTORY_LEN = 30;

function seededHistory(count: number): number[] {
  // deterministic-ish starting slope so trend charts aren't flat.
  const arr: number[] = [];
  for (let i = 0; i < HISTORY_LEN; i++) {
    const drift = Math.round((i - HISTORY_LEN) * (count * 0.004));
    arr.push(Math.max(0, count + drift));
  }
  return arr;
}

export const useCrowdStore = create<CrowdState>((set, get) => ({
  zones: [],
  staff: [],
  alerts: [],
  broadcasts: [],
  auditLog: [],
  recommendations: [],
  mode: "normal",
  emergencyScenario: null,
  emergencyStartedAt: null,
  selectedZoneId: "food",
  started: false,

  seed: () => {
    const zones = INITIAL_ZONES.map((z) => ({
      ...z,
      history: seededHistory(z.count),
    }));
    const staff = INITIAL_STAFF.map((s) => ({ ...s }));
    set({
      zones,
      staff,
      alerts: [],
      broadcasts: [],
      recommendations: [],
      auditLog: [
        {
          id: uid("log"),
          kind: "system",
          message: "Monitoring started · all sensors online",
          t: Date.now(),
        },
      ],
      mode: "normal",
      emergencyScenario: null,
      emergencyStartedAt: null,
      selectedZoneId: "food",
      started: true,
    });
  },

  patchZones: (next) => set({ zones: next }),

  setZoneFlow: (zoneId, flow) =>
    set((s) => ({
      zones: s.zones.map((z) => (z.id === zoneId ? { ...z, flow } : z)),
    })),

  adjustCount: (zoneId, delta) =>
    set((s) => ({
      zones: s.zones.map((z) =>
        z.id === zoneId
          ? {
              ...z,
              count: Math.max(
                0,
                Math.min(Math.round(z.capacity * 1.2), z.count + delta),
              ),
            }
          : z,
      ),
    })),

  selectZone: (zoneId) => set({ selectedZoneId: zoneId }),

  patchStaff: (next) => set({ staff: next }),

  dispatchStaff: (staffId, destZoneId) =>
    set((s) => ({
      staff: s.staff.map((st) =>
        st.id === staffId
          ? {
              ...st,
              status: "en_route",
              destZoneId,
              etaTicks: 2 + Math.floor(Math.random() * 3), // 2-4 ticks
            }
          : st,
      ),
    })),

  addAlert: (a) =>
    set((s) => ({ alerts: [a, ...s.alerts].slice(0, 50) })),

  setAlertStatus: (id, status, assignedTo) =>
    set((s) => ({
      alerts: s.alerts.map((al) =>
        al.id === id
          ? { ...al, status, assignedTo: assignedTo ?? al.assignedTo }
          : al,
      ),
    })),

  patchAlerts: (next) => set({ alerts: next }),

  addBroadcast: (b) =>
    set((s) => ({ broadcasts: [b, ...s.broadcasts].slice(0, 50) })),

  addRecommendation: (r) =>
    set((s) =>
      s.recommendations.some(
        (x) => x.zoneId === r.zoneId && x.state !== "executed",
      )
        ? s
        : { recommendations: [r, ...s.recommendations] },
    ),

  patchRecommendation: (id, patch) =>
    set((s) => ({
      recommendations: s.recommendations.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    })),

  dismissRecommendation: (id) =>
    set((s) => ({
      recommendations: s.recommendations.filter((r) => r.id !== id),
    })),

  log: (entry) =>
    set((s) => ({
      auditLog: [
        { id: uid("log"), t: entry.t ?? Date.now(), ...entry },
        ...s.auditLog,
      ].slice(0, 200),
    })),

  startEmergency: (scenario) => {
    const now = Date.now();
    set({ mode: "emergency", emergencyScenario: scenario, emergencyStartedAt: now });
    get().log({
      kind: "emergency",
      message: `EMERGENCY ACTIVATED · ${scenario.toUpperCase()} protocol`,
    });
  },

  standDown: () => {
    const start = get().emergencyStartedAt;
    const secs = start ? Math.round((Date.now() - start) / 1000) : 0;
    set({ mode: "normal", emergencyScenario: null, emergencyStartedAt: null });
    get().log({
      kind: "emergency",
      message: `Emergency stood down · duration ${secs}s`,
    });
  },
}));
