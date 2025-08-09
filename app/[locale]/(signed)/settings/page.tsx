import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import SettingsView from "@/view/settings";

export const metadata: Metadata = {
  title: "Settings - JIKIRO",
  description: "Configure your account settings, preferences, and profile information on JIKIRO.",
  robots: "noindex, nofollow",
};

export default async function SettingsPage() {
  return (
    <LayoutDashboard>
      <SettingsView />
    </LayoutDashboard>
  );
}
