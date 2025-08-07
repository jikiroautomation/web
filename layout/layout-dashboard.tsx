"use client";

import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useUser,
  UserButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useUserProfile } from "@/hooks/use-user-profile";
import ProfileBanner from "@/components/profile-banner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LanguageSwitcher from "@/components/language-switcher";
import {
  BarChart3,
  Settings,
  Zap,
  DollarSign,
  FileText,
  Phone,
  User,
  Bell,
  Menu,
  X,
  Info,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NavbarApp from "@/components/navbar-app";

interface LayoutDashboardProps {
  children: ReactNode;
}

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  const { user } = useUser();
  const { needsProfileSetup, isProfileComplete } = useUserProfile();
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      type: "item",
      icon: BarChart3,
      label: t("navigation.overview"),
      href: "/dashboard",
    },
    { type: "separator" },
    {
      type: "item",
      icon: FileText,
      label: t("navigation.myProjects"),
      href: "/projects",
    },
    {
      type: "item",
      icon: Zap,
      label: t("navigation.services"),
      href: "/services",
    },
    { type: "separator" },
    {
      type: "item",
      icon: DollarSign,
      label: t("navigation.billing"),
      href: "/billing",
    },
    { type: "separator" },
    {
      type: "item",
      icon: Settings,
      label: t("navigation.settings"),
      href: "/settings",
    },
    {
      type: "item",
      icon: Info,
      label: t("navigation.support"),
      href: "/support",
    },
  ];

  const isActive = (href: string) => {
    // Remove locale prefix from pathname (e.g., "/en/dashboard" -> "/dashboard")
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

    return pathnameWithoutLocale.startsWith(href);
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

            {(needsProfileSetup || !isProfileComplete) && (
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
                  className="fixed inset-0 bg-gray-500 opacity-50 z-40 md:hidden"
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
                        <User className="w-5 h-5 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-gray-700 font-semibold dark:text-gray-200">
                        {user?.fullName || user?.firstName || "User"}
                      </h3>
                      <p className="text-gray-400 text-xs">
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
                    className="text-gray-300 hover:text-white"
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
                    {t("footer.allRightsReserved")}.
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-6">
                  <Link
                    href="/privacy"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("footer.privacyPolicy")}
                  </Link>
                  <Link
                    href="/terms"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("footer.termsOfService")}
                  </Link>
                  <Link
                    href="/support"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("footer.support")}
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
