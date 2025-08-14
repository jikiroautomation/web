import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import ServicePlansUserView from "@/view/service-plans/user";

export const metadata: Metadata = {
  title: "Service Plans - JIKIRO",
  description: "Choose the perfect plan for your needs. Flexible pricing options for all service tiers.",
  robots: "index, follow",
};

interface ServicePlansUserPageProps {
  params: {
    serviceId: string;
  };
}

export default function ServicePlansUserPage({ params }: ServicePlansUserPageProps) {
  return (
    <LayoutDashboard>
      <ServicePlansUserView serviceId={params.serviceId} />
    </LayoutDashboard>
  );
}