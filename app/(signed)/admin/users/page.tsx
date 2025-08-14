import LayoutDashboard from "@/layout/layout-dashboard";
import UsersView from "@/view/users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management - Admin | JIKIRO",
  description:
    "Manage platform users and their roles. Admin dashboard for user management and role assignment on JIKIRO.",
  robots: "noindex, nofollow",
};

export default function AdminUsersPage() {
  return (
    <LayoutDashboard>
      <UsersView />
    </LayoutDashboard>
  );
}
