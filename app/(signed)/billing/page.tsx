import { Metadata } from "next";
import LayoutDashboard from "@/layout/layout-dashboard";
import BillingView from "@/view/billing";

export const metadata: Metadata = {
  title: "Billing - JIKIRO",
  description: "Manage your billing information, invoices, and payment history on JIKIRO.",
  robots: "noindex, nofollow",
};

export default async function BillingPage() {
  return (
    <LayoutDashboard>
      <BillingView />
    </LayoutDashboard>
  );
}
