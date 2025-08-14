import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import ProjectsView from "@/view/projects";

export const metadata: Metadata = {
  title: "Projects - JIKIRO",
  description: "Manage and track your projects, view progress, and collaborate with your team on JIKIRO.",
  robots: "noindex, nofollow",
};

export default async function ProjectsPage() {
  return (
    <LayoutDashboard>
      <ProjectsView />
    </LayoutDashboard>
  );
}
