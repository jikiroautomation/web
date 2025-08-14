import { Metadata } from "next";
import Hero from "@/components/landing/hero";
import LayoutMain from "@/layout/layout-main";

export const metadata: Metadata = {
  title: "JIKIRO - Professional Services Platform",
  description: "JIKIRO is a comprehensive platform for managing professional services, projects, and client relationships. Streamline your business operations with our powerful tools.",
  keywords: ["JIKIRO", "professional services", "project management", "business platform", "client management"],
  openGraph: {
    title: "JIKIRO - Professional Services Platform",
    description: "Streamline your business operations with JIKIRO's comprehensive professional services platform.",
    type: "website",
  },
};

export default async function Home() {
  return (
    <LayoutMain>
      <Hero />
    </LayoutMain>
  );
}
