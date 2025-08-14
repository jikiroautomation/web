import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import ServicePlansView from "@/view/service-plans/admin";

export const metadata: Metadata = {
  title: "Service Plans Management - Admin | JIKIRO",
  description:
    "Manage pricing plans and service tiers for individual services. Admin interface for service plan management on JIKIRO.",
  robots: "noindex, nofollow",
};

interface ServicePlansPageProps {
  params: {
    serviceId: string;
  };
}

export default function ServicePlansPage({ params }: ServicePlansPageProps) {
  return (
    <LayoutDashboard>
      <ServicePlansView serviceId={params.serviceId} />
    </LayoutDashboard>
  );
}
