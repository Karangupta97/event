export type ZoneStatus = "normal" | "busy" | "high";
export type ZoneFlow = "open" | "restricted" | "closed";

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  count: number;
  /** staff currently assigned/working in this zone */
  staff: number;
  /** recommended staffing for current load */
  staffNeeded: number;
  neighbors: string[];
  /** last ~30 occupancy readings (people count) */
  history: number[];
  flow: ZoneFlow;
  /** inline SVG path describing the zone's organic shape */
  svgPath: string;
  /** label anchor inside the shape (SVG coords) */
  labelPos: { x: number; y: number };
}

export function zoneStatus(count: number, capacity: number): ZoneStatus {
  const pct = count / capacity;
  if (pct > 0.9) return "high";
  if (pct >= 0.7) return "busy";
  return "normal";
}

export function zonePct(count: number, capacity: number): number {
  return Math.round((count / capacity) * 100);
}

/** linear-trend minutes until the zone reaches 100% capacity, or null */
export function minutesToCritical(
  history: number[],
  capacity: number,
  tickSeconds = 2,
): number | null {
  const readings = history.slice(-15);
  if (readings.length < 4) return null;
  const n = readings.length;
  const xs = readings.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = readings.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (readings[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  if (den === 0) return null;
  const slopePerTick = num / den; // people per tick
  if (slopePerTick <= 0.5) return null; // not meaningfully filling
  const last = readings[n - 1];
  const remaining = capacity - last;
  if (remaining <= 0) return 0;
  const ticks = remaining / slopePerTick;
  const minutes = (ticks * tickSeconds) / 60;
  return Math.max(0, Math.round(minutes * 10) / 10);
}
