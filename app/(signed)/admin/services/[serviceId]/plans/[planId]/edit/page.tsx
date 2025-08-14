import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import EditPlanView from "@/view/service-plans/admin/edit-plan";

export const metadata: Metadata = {
  title: "Edit Plan - Admin | JIKIRO",
  description:
    "Edit pricing plan details and configuration. Admin interface for editing service plans on JIKIRO.",
  robots: "noindex, nofollow",
};

interface EditPlanPageProps {
  params: Promise<{
    serviceId: string;
    planId: string;
  }>;
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { serviceId, planId } = await params;

  return (
    <LayoutDashboard>
      <EditPlanView serviceId={serviceId} planId={planId} />
    </LayoutDashboard>
  );
}
