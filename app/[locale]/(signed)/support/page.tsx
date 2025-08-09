import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import SupportView from "@/view/support";

export const metadata: Metadata = {
  title: "Support - JIKIRO",
  description: "Get help and support for your JIKIRO account. Access documentation, contact support, and find answers to common questions.",
  robots: "noindex, nofollow",
};

export default async function SupportPage() {
  return (
    <LayoutDashboard>
      <SupportView />
    </LayoutDashboard>
  );
}
