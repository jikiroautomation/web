import LayoutDashboard from "@/layout/layout-dashboard";
import HelpdeskView from "@/view/helpdesk";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpdesk Management - Admin | JIKIRO",
  description:
    "Manage support tickets and customer assistance. Admin dashboard for helpdesk operations on JIKIRO platform.",
  robots: "noindex, nofollow",
};

export default function AdminHelpdeskPage() {
  return (
    <LayoutDashboard>
      <HelpdeskView />
    </LayoutDashboard>
  );
}
