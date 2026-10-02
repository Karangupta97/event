export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "open" | "assigned" | "on_site" | "resolved";

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  zoneId: string;
  message: string;
  assignedTo?: string; // staff id
  status: AlertStatus;
  /** epoch ms */
  t: number;
}

export const SEVERITY_RANK: Record<AlertSeverity, number> = {
  info: 0,
  warning: 1,
  critical: 2,
};
