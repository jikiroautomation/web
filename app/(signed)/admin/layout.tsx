"use client";

import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const isAdmin = useQuery(api.users.isUserAdmin);
  const router = useRouter();

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  // Show loading while checking admin status
  if (isAdmin === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If not admin, don't render content (redirect will happen)
  if (isAdmin === false) {
    return null;
  }

  // Admin confirmed, render admin pages
  return <>{children}</>;
}