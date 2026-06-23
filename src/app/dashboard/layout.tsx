import { DashboardNavigation } from "@/components/dashboard-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pb-28 md:pb-0">
        {children}
      </div>

      <DashboardNavigation />
    </>
  );
}