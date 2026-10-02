import type { ActionStep } from "./types";

/**
 * Protocols are DATA: a trigger condition + an ordered set of step templates.
 * recommend.ts picks the concrete overflow zone + staff and fills these in.
 */
export interface Protocol {
  id: string;
  /** human label */
  name: string;
  /** min occupancy pct that triggers this protocol */
  triggerPct: number;
  /** number of staff to dispatch */
  dispatchCount: number;
  /** fraction of crowd to redirect to the overflow zone */
  redirectFraction: number;
  /** build the ordered step list given resolved context */
  buildSteps: (ctx: {
    zoneName: string;
    overflowZoneName: string;
    overflowPct: number;
    staffNames: string[];
    redirectPct: number;
  }) => ActionStep[];
}

export const CONGESTION_PROTOCOL: Protocol = {
  id: "congestion-redirect",
  name: "Congestion redirect",
  triggerPct: 82,
  dispatchCount: 2,
  redirectFraction: 0.15,
  buildSteps: ({
    zoneName,
    overflowZoneName,
    overflowPct,
    staffNames,
    redirectPct,
  }) => [
    {
      kind: "broadcast",
      label: "Broadcast redirect notice to attendees",
    },
    {
      kind: "restrict",
      label: `Restrict ${zoneName} entry`,
    },
    {
      kind: "dispatch",
      label: `Dispatch ${staffNames.length} volunteers (${staffNames.join(", ")})`,
    },
    {
      kind: "redirect",
      label: `Guide ~${redirectPct}% of crowd toward ${overflowZoneName} (${overflowPct}%)`,
    },
  ],
};

export const PROTOCOLS: Protocol[] = [CONGESTION_PROTOCOL];
