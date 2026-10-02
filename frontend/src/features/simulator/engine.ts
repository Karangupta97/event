import type { Zone } from "@/features/zones/types";
import type { Staff } from "@/features/staff/types";
import { useCrowdStore } from "@/store/useCrowdStore";
import { deriveNewAlerts, autoResolve } from "@/features/alerts/engine";
import { buildRecommendation } from "@/features/actions/recommend";

export const TICK_MS = 2000;
const HISTORY_LEN = 30;

/** random drift per zone, biased slightly by current pressure */
function driftZone(zone: Zone): number {
  const cap = zone.capacity;
  const pct = zone.count / cap;
  // base wander
  let delta = Math.round((Math.random() - 0.5) * cap * 0.03);
  // restricted/closed zones tend to drain
  if (zone.flow === "restricted") delta -= Math.round(cap * 0.015);
  if (zone.flow === "closed") delta -= Math.round(cap * 0.03);
  // very full open zones keep creeping up (pressure)
  if (zone.flow === "open" && pct > 0.8) delta += Math.round(cap * 0.008);
  const max = Math.round(cap * 1.2);
  return Math.max(-zone.count, Math.min(max - zone.count, delta));
}

/** advance staff ETAs; arrivals re-home the staffer into the dest zone */
function advanceStaff(staff: Staff[]): {
  staff: Staff[];
  arrivals: { name: string; zoneId: string }[];
} {
  const arrivals: { name: string; zoneId: string }[] = [];
  const next = staff.map((s) => {
    if (s.status !== "en_route") return s;
    const eta = s.etaTicks - 1;
    if (eta <= 0 && s.destZoneId) {
      arrivals.push({ name: s.name, zoneId: s.destZoneId });
      return {
        ...s,
        status: "assigned" as const,
        zoneId: s.destZoneId,
        destZoneId: undefined,
        etaTicks: 0,
      };
    }
    return { ...s, etaTicks: Math.max(0, eta) };
  });
  return { staff: next, arrivals };
}

/** one simulation step: mutate store with new counts, staff, alerts, recs */
export function tick(): void {
  const store = useCrowdStore.getState();
  if (!store.started) return;

  // 1) zone counts + history
  const zones = store.zones.map((z) => {
    const count = z.count + driftZone(z);
    const history = [...z.history, count].slice(-HISTORY_LEN);
    // recompute staff-in-zone (assigned/available located here)
    return { ...z, count, history };
  });

  // 2) staff eta countdown
  const { staff, arrivals } = advanceStaff(store.staff);

  // recompute per-zone staff tallies from staff roster
  const staffByZone = new Map<string, number>();
  for (const s of staff) {
    if (s.status === "available" || s.status === "assigned") {
      staffByZone.set(s.zoneId, (staffByZone.get(s.zoneId) ?? 0) + 1);
    }
  }
  const zonesWithStaff = zones.map((z) => ({
    ...z,
    staff: staffByZone.get(z.id) ?? 0,
  }));

  store.patchZones(zonesWithStaff);
  store.patchStaff(staff);
  for (const a of arrivals) {
    const zone = zonesWithStaff.find((z) => z.id === a.zoneId);
    store.log({
      kind: "dispatch",
      zoneId: a.zoneId,
      message: `${a.name} arrived at ${zone?.name ?? a.zoneId}`,
    });
  }

  // 3) alerts: resolve recovered, raise new
  const resolved = autoResolve(zonesWithStaff, store.alerts);
  const fresh = deriveNewAlerts(zonesWithStaff, resolved);
  if (fresh.length || resolved !== store.alerts) {
    store.patchAlerts([...fresh, ...resolved]);
    for (const f of fresh) {
      store.log({
        kind: "alert",
        zoneId: f.zoneId,
        message: `${f.severity === "critical" ? "CRITICAL" : "Warning"}: ${f.message}`,
      });
    }
  }

  // 4) recommendations for zones that need intervention
  for (const z of zonesWithStaff) {
    const already = store.recommendations.some(
      (r) => r.zoneId === z.id && r.state !== "executed",
    );
    if (already) continue;
    const rec = buildRecommendation(z, zonesWithStaff, staff);
    if (rec) {
      store.addRecommendation(rec);
      store.log({
        kind: "system",
        zoneId: z.id,
        message: `Recommended action generated for ${z.name}`,
      });
    }
  }
}

// ---- demo scenario injectors --------------------------------------------

export type Scenario = "concert" | "lunch" | "showend" | "reset";

export function applyScenario(scenario: Scenario): void {
  const store = useCrowdStore.getState();
  switch (scenario) {
    case "concert": {
      // surge into Stage Area
      store.adjustCount("stage", 420);
      store.adjustCount("entry", 120);
      store.log({ kind: "system", message: "Scenario: Concert starts — surge into Stage Area" });
      break;
    }
    case "lunch": {
      // push Food Court over the edge
      store.adjustCount("food", 320);
      store.adjustCount("gaming", 80);
      store.log({ kind: "system", message: "Scenario: Lunch rush — Food Court surging" });
      break;
    }
    case "showend": {
      // exit surge: everyone pours toward entry/exit
      store.adjustCount("stage", -380);
      store.adjustCount("entry", 260);
      store.adjustCount("expo", -150);
      store.log({ kind: "system", message: "Scenario: Show ends — exit surge toward Main Entry" });
      break;
    }
    case "reset": {
      store.seed();
      store.log({ kind: "system", message: "Scenario: Reset to seed state" });
      break;
    }
  }
}
