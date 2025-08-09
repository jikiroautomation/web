import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpdesk Management - Admin | JIKIRO",
  description: "Manage support tickets and customer assistance. Admin dashboard for helpdesk operations on JIKIRO platform.",
  robots: "noindex, nofollow",
};

export default function AdminHelpdeskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Helpdesk Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage support tickets and customer assistance
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Support Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Helpdesk management interface will be implemented here.
        </p>
      </div>
    </div>
  );
}