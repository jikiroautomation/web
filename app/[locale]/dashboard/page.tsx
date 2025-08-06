import LayoutDashboard from "@/layout/layout-dashboard";
import DashboardView from "@/view/dashboard";

export default async function DashboardPage() {
  return (
    <LayoutDashboard>
      <DashboardView />
    </LayoutDashboard>
  );
}
