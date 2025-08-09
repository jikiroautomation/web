import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management - Admin | JIKIRO",
  description: "Manage platform users and their roles. Admin dashboard for user management and role assignment on JIKIRO.",
  robots: "noindex, nofollow",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage platform users and their roles
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Users Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          User management interface will be implemented here.
        </p>
      </div>
    </div>
  );
}