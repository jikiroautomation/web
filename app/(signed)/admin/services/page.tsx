import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import ServicesAdminView from "@/view/services-admin";

export const metadata: Metadata = {
  title: "Services Management - Admin | JIKIRO",
  description: "Manage platform services, pricing, and service offerings. Admin interface for service management on JIKIRO.",
  robots: "noindex, nofollow",
};

export default function AdminServicesPage() {
  return (
    <LayoutDashboard>
      <ServicesAdminView />
    </LayoutDashboard>
  );
}
