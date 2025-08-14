import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import EditPlanView from "@/view/service-plans/edit-plan";

export const metadata: Metadata = {
  title: "Edit Plan - Admin | JIKIRO",
  description: "Edit pricing plan details and configuration. Admin interface for editing service plans on JIKIRO.",
  robots: "noindex, nofollow",
};

interface EditPlanPageProps {
  params: {
    serviceId: string;
    planId: string;
  };
}

export default function EditPlanPage({ params }: EditPlanPageProps) {
  return (
    <LayoutDashboard>
      <EditPlanView 
        serviceId={params.serviceId} 
        planId={params.planId}
      />
    </LayoutDashboard>
  );
}