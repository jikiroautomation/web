"use client";

import Navbar from "@/components/navbar";
import { ReactNode } from "react";

interface LayoutMainProps {
  children: ReactNode;
}

export default function LayoutMain({ children }: LayoutMainProps) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0a0a0a] relative">
      {/* Light Mode - Pastel Wave */}
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          background:
            "linear-gradient(120deg, #d5c5ff 0%, #a7f3d0 50%, #f0f0f0 100%)",
        }}
      />

      {/* Dark Mode - Cosmic Aurora */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
          `,
        }}
      />

      <Navbar />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">{children}</div>
    </div>
  );
}
