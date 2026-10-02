import {
  Gamepad2,
  UtensilsCrossed,
  Store,
  GraduationCap,
  Music,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";

export const ZONE_ICON: Record<string, LucideIcon> = {
  gaming: Gamepad2,
  food: UtensilsCrossed,
  expo: Store,
  workshop: GraduationCap,
  stage: Music,
  entry: DoorOpen,
};
