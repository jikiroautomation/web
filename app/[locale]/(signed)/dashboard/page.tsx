import LayoutDashboard from "@/layout/layout-dashboard";
import DashboardUserView from "@/view/dashboard-user";
import DashboardAdminView from "@/view/dashboard-admin";
import { currentUser, auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  let isAdmin = false;
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });

    if (token) {
      convex.setAuth(token);
    }

    isAdmin = await convex.query(api.users.isUserAdmin);
  } catch (error) {
    console.log("Error checking user role:", error);
    isAdmin = false;
  }

  return (
    <LayoutDashboard>
      {isAdmin ? <DashboardAdminView /> : <DashboardUserView />}
    </LayoutDashboard>
  );
}
