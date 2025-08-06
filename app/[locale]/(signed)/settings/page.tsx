import LayoutDashboard from "@/layout/layout-dashboard";
import SettingsView from "@/view/settings";

export default async function SettingsPage() {
  return (
    <LayoutDashboard>
      <SettingsView />
    </LayoutDashboard>
  );
}
