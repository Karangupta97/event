export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-50 font-sans text-slate-900 antialiased">
      {children}
    </div>
  );
}
