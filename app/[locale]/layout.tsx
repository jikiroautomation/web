import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "JIKIRO - Professional Services Platform",
    template: "%s | JIKIRO"
  },
  description: "JIKIRO is a comprehensive platform for managing professional services, projects, and client relationships. Streamline your business operations with our powerful tools.",
  keywords: ["JIKIRO", "professional services", "project management", "business platform", "client management", "productivity"],
  authors: [{ name: "JIKIRO Team" }],
  creator: "JIKIRO",
  publisher: "JIKIRO",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jikiro.com",
    siteName: "JIKIRO",
    title: "JIKIRO - Professional Services Platform",
    description: "Streamline your business operations with JIKIRO's comprehensive professional services platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JIKIRO - Professional Services Platform",
    description: "Streamline your business operations with JIKIRO's comprehensive professional services platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/convex.svg",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} antialiased`}>
        <NextIntlClientProvider>
          <ClerkProvider dynamic>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
