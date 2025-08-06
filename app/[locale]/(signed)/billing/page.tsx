import LayoutDashboard from "@/layout/layout-dashboard";
import BillingView from "@/view/billing";

export default async function BillingPage() {
  return (
    <LayoutDashboard>
      <BillingView />
    </LayoutDashboard>
  );
}
