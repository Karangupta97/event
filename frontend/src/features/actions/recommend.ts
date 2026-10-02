import type { Zone } from "@/features/zones/types";
import { zonePct, minutesToCritical } from "@/features/zones/types";
import type { Staff } from "@/features/staff/types";
import type { Recommendation } from "./types";
import { CONGESTION_PROTOCOL } from "./protocols";
import { uid } from "@/store/useCrowdStore";

/** pick the lowest-occupancy non-closed neighbor as the overflow target */
export function pickOverflowZone(zone: Zone, zones: Zone[]): Zone | null {
  const candidates = zone.neighbors
    .map((id) => zones.find((z) => z.id === id))
    .filter((z): z is Zone => !!z && z.flow !== "closed");
  if (candidates.length === 0) return null;
  return candidates.reduce((best, z) =>
    zonePct(z.count, z.capacity) < zonePct(best.count, best.capacity) ? z : best,
  );
}

/** best available staff, preferring volunteers already near/in the zone */
export function pickStaff(
  zone: Zone,
  staff: Staff[],
  count: number,
): Staff[] {
  const available = staff.filter((s) => s.status === "available");
  const scored = available
    .map((s) => {
      let score = 0;
      if (s.zoneId === zone.id) score += 3;
      else if (zone.neighbors.includes(s.zoneId)) score += 2;
      if (s.role === "volunteer") score += 1;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((x) => x.s);
}

/**
 * Build a Recommendation for a zone that needs intervention, or null.
 * Triggered when a zone is at/above the protocol threshold.
 */
export function buildRecommendation(
  zone: Zone,
  zones: Zone[],
  staff: Staff[],
): Recommendation | null {
  const pct = zonePct(zone.count, zone.capacity);
  if (pct < CONGESTION_PROTOCOL.triggerPct) return null;

  const overflow = pickOverflowZone(zone, zones);
  if (!overflow) return null;

  const chosen = pickStaff(zone, staff, CONGESTION_PROTOCOL.dispatchCount);
  if (chosen.length === 0) return null;

  const mins = minutesToCritical(zone.history, zone.capacity);
  const redirectPct = Math.round(CONGESTION_PROTOCOL.redirectFraction * 100);
  const overflowPct = zonePct(overflow.count, overflow.capacity);

  const reason =
    mins !== null
      ? `${zone.name} is at ${pct}% and filling. Projected critical in ~${mins} min.`
      : `${zone.name} is at ${pct}% capacity and needs intervention.`;

  const steps = CONGESTION_PROTOCOL.buildSteps({
    zoneName: zone.name,
    overflowZoneName: overflow.name,
    overflowPct,
    staffNames: chosen.map((s) => s.name),
    redirectPct,
  });

  return {
    id: uid("rec"),
    zoneId: zone.id,
    reason,
    overflowZoneId: overflow.id,
    staffIds: chosen.map((s) => s.id),
    steps,
    state: "pending",
    completedStep: -1,
    createdAt: Date.now(),
  };
}
