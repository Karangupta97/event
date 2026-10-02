export type ActionStepKind =
  | "broadcast"
  | "restrict"
  | "dispatch"
  | "redirect"
  | "reopen";

export interface ActionStep {
  kind: ActionStepKind;
  label: string;
}

export type RecommendationState = "pending" | "executing" | "executed";

export interface Recommendation {
  id: string;
  zoneId: string;
  /** short reasoning line shown at top of the card */
  reason: string;
  /** overflow / destination zone for redirects */
  overflowZoneId: string;
  /** staff chosen to dispatch */
  staffIds: string[];
  steps: ActionStep[];
  state: RecommendationState;
  /** index of the step currently completed (-1 none) during execution */
  completedStep: number;
  createdAt: number;
}

export interface AuditEntry {
  id: string;
  kind: "alert" | "broadcast" | "action" | "dispatch" | "emergency" | "system";
  message: string;
  zoneId?: string;
  t: number;
}
