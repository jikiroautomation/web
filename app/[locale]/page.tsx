import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Hero from "@/components/landing/hero";
import LayoutMain from "@/layout/layout-main";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <LayoutMain>
      <Hero />
    </LayoutMain>
  );
}
