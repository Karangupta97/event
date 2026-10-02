import type { EmergencyScenario } from "@/store/useCrowdStore";
import { TriangleAlert, HeartPulse, Hand, type LucideIcon } from "lucide-react";

export interface EmergencyScenarioDef {
  id: EmergencyScenario;
  label: string;
  description: string;
  icon: LucideIcon;
  bannerText: string;
}

export const EMERGENCY_SCENARIOS: EmergencyScenarioDef[] = [
  {
    id: "evacuate",
    label: "Evacuate",
    description: "Clear all zones and route attendees to the nearest exits.",
    icon: TriangleAlert,
    bannerText: "EVACUATION IN PROGRESS — guide attendees to the nearest exit.",
  },
  {
    id: "medical",
    label: "Medical incident",
    description: "Open a path for medics and hold the surrounding crowd.",
    icon: HeartPulse,
    bannerText: "MEDICAL RESPONSE ACTIVE — keep access lanes clear for medics.",
  },
  {
    id: "hold",
    label: "Hold position",
    description: "Freeze crowd movement while the situation is assessed.",
    icon: Hand,
    bannerText: "HOLD POSITION — pause movement and await further instructions.",
  },
];
