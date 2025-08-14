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
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function ServicePlansPage({
  params,
}: ServicePlansPageProps) {
  const serviceId = (await params).serviceId;

  return (
    <LayoutDashboard>
      <ServicePlansView serviceId={serviceId} />
    </LayoutDashboard>
  );
}
