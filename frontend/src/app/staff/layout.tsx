import { SimulatorHost } from "@/features/simulator/SimulatorHost";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Shared event simulator + cross-tab sync, so /staff reads the same
          live event state as /org. */}
      <SimulatorHost />
      {children}
    </div>
  );
}
