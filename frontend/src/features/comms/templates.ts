import type { BroadcastSeverity } from "./types";

export interface MessageTemplate {
  id: string;
  label: string;
  severity: BroadcastSeverity;
  /** {zone} is replaced with target zone names */
  text: string;
}

export const TEMPLATES: MessageTemplate[] = [
  {
    id: "redirect",
    label: "Redirect crowd",
    severity: "warning",
    text: "{zone} is crowded right now. Please use alternate routes — nearby areas have space.",
  },
  {
    id: "slow-down",
    label: "Ease congestion",
    severity: "warning",
    text: "Heavy footfall near {zone}. Please move calmly and follow staff directions.",
  },
  {
    id: "all-clear",
    label: "All clear",
    severity: "info",
    text: "{zone} has returned to normal. Thanks for your cooperation.",
  },
  {
    id: "staff-rally",
    label: "Staff rally",
    severity: "warning",
    text: "All available staff near {zone}, please assist with crowd flow.",
  },
];
