import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Management - Admin | JIKIRO",
  description: "Monitor platform revenue and financial metrics. Admin dashboard for income analytics and management on JIKIRO.",
  robots: "noindex, nofollow",
};

export default function AdminIncomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Revenue Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor platform revenue and financial metrics
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Revenue analytics and management interface will be implemented here.
        </p>
      </div>
    </div>
  );
}