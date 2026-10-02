export type StaffRole = "security" | "medic" | "usher" | "volunteer";
export type StaffStatus = "available" | "en_route" | "assigned";

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  zoneId: string;
  status: StaffStatus;
  /** ticks remaining until arrival when en_route */
  etaTicks: number;
  /** zone the staffer is heading to while en_route */
  destZoneId?: string;
}

export const ROLE_LABEL: Record<StaffRole, string> = {
  security: "Security",
  medic: "Medic",
  usher: "Usher",
  volunteer: "Volunteer",
};
