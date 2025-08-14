import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import ServicePlansUserView from "@/view/service-plans/user";

export const metadata: Metadata = {
  title: "Service Plans - JIKIRO",
  description:
    "Choose the perfect plan for your needs. Flexible pricing options for all service tiers.",
  robots: "index, follow",
};

interface ServicePlansUserPageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function ServicePlansUserPage({
  params,
}: ServicePlansUserPageProps) {
  const { serviceId } = await params;

  return (
    <LayoutDashboard>
      <ServicePlansUserView serviceId={serviceId} />
    </LayoutDashboard>
  );
}
