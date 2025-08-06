import LayoutDashboard from "@/layout/layout-dashboard";
import ProjectsView from "@/view/projects";

export default async function ProjectsPage() {
  return (
    <LayoutDashboard>
      <ProjectsView />
    </LayoutDashboard>
  );
}
