import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import ServicesView from "@/view/services";

export const metadata: Metadata = {
  title: "Services - JIKIRO",
  description: "Manage your services, pricing, and service offerings on JIKIRO platform.",
  robots: "noindex, nofollow",
};

export default async function ServicesPage() {
  return (
    <LayoutDashboard>
      <ServicesView />
    </LayoutDashboard>
  );
}
