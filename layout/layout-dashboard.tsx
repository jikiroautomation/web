"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useUserProfile } from "@/hooks/use-user-profile";
import ProfileBanner from "@/components/profile-banner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BarChart3,
  Settings,
  Zap,
  DollarSign,
  FileText,
  User,
  X,
  Info,
  Shield,
  Users,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NavbarApp from "@/components/navbar-app";

interface LayoutDashboardProps {
  children: ReactNode;
}

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  const { user } = useUser();
  const { needsProfileSetup, isProfileComplete, isLoading } = useUserProfile();
  const isAdmin = useQuery(api.users.isUserAdmin);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getMenuItems = () => {
    if (isAdmin) {
      // Admin menu items
      return [
        {
          type: "item",
          icon: BarChart3,
          label: "Overview",
          href: "/dashboard",
        },
        { type: "separator" },
        {
          type: "item",
          icon: Zap,
          label: "Services",
          href: "/admin/services",
        },
        {
          type: "item",
          icon: Users,
          label: "Users",
          href: "/admin/users",
        },
        {
          type: "item",
          icon: DollarSign,
          label: "Revenue",
          href: "/admin/revenue",
        },
        { type: "separator" },
        {
          type: "item",
          icon: Settings,
          label: "Settings",
          href: "/settings",
        },
        {
          type: "item",
          icon: HelpCircle,
          label: "Helpdesk",
          href: "/admin/helpdesk",
        },
      ];
    } else {
      // Regular user menu items
      return [
        {
          type: "item",
          icon: BarChart3,
          label: "Overview",
          href: "/dashboard",
        },
        { type: "separator" },
        {
          type: "item",
          icon: FileText,
          label: "My Projects",
          href: "/projects",
        },
        {
          type: "item",
          icon: Zap,
          label: "Services",
          href: "/services",
        },
        { type: "separator" },
        {
          type: "item",
          icon: DollarSign,
          label: "Billing",
          href: "/billing",
        },
        { type: "separator" },
        {
          type: "item",
          icon: Settings,
          label: "Settings",
          href: "/settings",
        },
        {
          type: "item",
          icon: Info,
          label: "Support",
          href: "/support",
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-muted flex flex-col">
          {/* Top Navigation */}

          <div className="relative">
            <NavbarApp
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            {!isLoading && (needsProfileSetup || !isProfileComplete) && (
              <div className="max-w-6xl mx-auto px-10">
                <ProfileBanner />
              </div>
            )}
          </div>

          {/* Main Container */}
          <div
            className={`flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 w-full ${
              needsProfileSetup || !isProfileComplete ? "" : ""
            }`}
          >
            <div className="flex gap-4 md:gap-8 relative h-full">
              {/* Mobile Sidebar Overlay */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-neutral-500 opacity-50 z-40 md:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Left Sidebar */}
              <aside
                className={`
            fixed md:static inset-y-0 left-0 z-50 md:z-auto
            w-64 flex-shrink-0 bg-muted
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            pt-16 md:pt-0 px-4 md:px-0
          `}
              >
                {/* User Profile Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName || user?.firstName || "User"}
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5 text-neutral-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-neutral-700 font-semibold dark:text-neutral-200 truncate">
                          {user?.fullName || user?.firstName || "User"}
                        </h3>
                        {isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-400 text-xs">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Close Button */}
                <div className="md:hidden mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-neutral-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item, index) => {
                    if (item.type === "separator") {
                      return (
                        <div
                          key={`separator-${index}`}
                          className="border-t border-neutral-300 dark:border-neutral-700 my-2"
                        />
                      );
                    }

                    const active = isActive(item.href ?? "");

                    return (
                      <Link
                        key={index}
                        href={item?.href ?? ""}
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                          active
                            ? "bg-neutral-300 dark:bg-neutral-700 text-primary-600 font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-700"
                        }`}
                        onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when clicking menu item
                      >
                        {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 min-w-0 p-2 md:p-0">{children}</main>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} JIKIRO.{" "}
                    All rights reserved.
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-6">
                  <Link
                    href="/privacy"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/support"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </SignedIn>
    </>
  );
}
