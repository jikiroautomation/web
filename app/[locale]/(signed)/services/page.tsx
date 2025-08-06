import LayoutDashboard from "@/layout/layout-dashboard";
import ServicesView from "@/view/services";

export default async function ServicesPage() {
  return (
    <LayoutDashboard>
      <ServicesView />
    </LayoutDashboard>
  );
}
