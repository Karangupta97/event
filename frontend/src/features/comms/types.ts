export type BroadcastChannel = "attendees" | "staff" | "all";
export type BroadcastSeverity = "info" | "warning" | "critical";

export interface Broadcast {
  id: string;
  channel: BroadcastChannel;
  severity: BroadcastSeverity;
  /** zone ids, or "all" */
  zoneIds: string[] | "all";
  message: string;
  /** epoch ms */
  sentAt: number;
}

export const CHANNEL_LABEL: Record<BroadcastChannel, string> = {
  attendees: "Attendees",
  staff: "Staff",
  all: "Everyone",
};
