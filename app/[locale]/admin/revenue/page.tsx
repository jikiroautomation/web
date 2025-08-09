import LayoutDashboard from "@/layout/layout-dashboard";
import RevenueView from "@/view/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Management - Admin | JIKIRO",
  description:
    "Monitor platform revenue and financial metrics. Admin dashboard for income analytics and management on JIKIRO.",
  robots: "noindex, nofollow",
};

export default function AdminIncomePage() {
  return (
    <LayoutDashboard>
      <RevenueView />
    </LayoutDashboard>
  );
}
