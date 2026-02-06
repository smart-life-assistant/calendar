import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import RealtimeVisitors from "@/components/analytics/RealtimeVisitors";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { CURRENT_YEAR } from "@/lib/constants";
import { getHomeMetadata } from "@/lib/metadata";
import "./globals.css";
import KeywordContent from "@/components/custom/KeywordContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = getHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Organization Structured Data for rich search results
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lịch Vạn Niên Việt Nam",
    alternateName: ["Lịch Việt Nam", "Lịch Âm Dương Việt Nam"],
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương chính xác, ngày tốt xấu, can chi, giờ hoàng đạo, ngày lễ tết.`,
    sameAs: [
      // Add your social media links here when available
      // "https://facebook.com/your-page",
      // "https://twitter.com/your-account",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["vi", "Vietnamese"],
    },
  };

  // Website Structured Data with SearchAction
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lịch Vạn Niên Việt Nam",
    url: baseUrl,
    description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} - Tra cứu lịch âm dương, ngày tốt xấu, can chi, giờ hoàng đạo, ngày lễ tết online miễn phí.`,
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/calendar?date={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        {/* Website Structured Data with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics />
        <NextTopLoader
          color="linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6)"
          initialPosition={0.3}
          crawlSpeed={100}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="cubic-bezier(0.4, 0, 0.2, 1)"
          speed={300}
          shadow="0 0 8px rgba(59, 130, 246, 0.5), 0 0 4px rgba(99, 102, 241, 0.3)"
          zIndex={9999}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Header />
            <main className="flex-1 flex flex-col bg-linear-to-br from-background via-background/95 to-accent/5">
              {children}
              <KeywordContent />
            </main>
            <Footer />
            <Toaster />
            <RealtimeVisitors />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
