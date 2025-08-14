import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import NewPlanView from "@/view/service-plans/admin/new-plan";

export const metadata: Metadata = {
  title: "Create New Plan - Admin | JIKIRO",
  description:
    "Create a new pricing plan for service. Admin interface for creating service plans on JIKIRO.",
  robots: "noindex, nofollow",
};

interface NewPlanPageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function NewPlanPage({ params }: NewPlanPageProps) {
  const serviceId = (await params).serviceId;

  return (
    <LayoutDashboard>
      <NewPlanView serviceId={serviceId} />
    </LayoutDashboard>
  );
}
