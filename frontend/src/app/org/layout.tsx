"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSimulator } from "@/features/simulator/useSimulator";
import { useCrowdStore } from "@/store/useCrowdStore";

import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { activeNavId, PAGE_META } from "@/components/ui/nav";

import { DemoPanel } from "@/features/simulator/components/DemoPanel";
import { EmergencyModal } from "@/features/emergency/components/EmergencyModal";
import { EmergencyBanner } from "@/features/emergency/components/EmergencyBanner";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  // single simulator instance for the whole console; persists across routes
  useSimulator();

  const pathname = usePathname();
  const activeId = activeNavId(pathname);
  const meta = PAGE_META[activeId] ?? PAGE_META.overview;

  const zones = useCrowdStore((s) => s.zones);
  const alerts = useCrowdStore((s) => s.alerts);
  const activeAlertCount = alerts.filter((a) => a.status !== "resolved").length;

  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <ScrollProgress />
      <Sidebar alertCount={activeAlertCount} />

      <div className="lg:pl-60">
        <EmergencyBanner zones={zones} />
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          alertCount={activeAlertCount}
          onEmergency={() => setEmergencyOpen(true)}
        />
        {children}
      </div>

      <DemoPanel />
      <EmergencyModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </div>
  );
}
