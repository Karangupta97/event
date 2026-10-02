import type { Metadata } from "next";
import StaffDashboard from "./StaffDashboard";

export const metadata: Metadata = {
  title: "Staff Console · EventFlow 2025",
  description:
    "Volunteer venue operations dashboard — live occupancy, alerts, and dispatch.",
};

export default function StaffPage() {
  return <StaffDashboard />;
}
