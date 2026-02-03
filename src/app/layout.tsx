import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lịch Vạn Niên - Xem Lịch Âm Dương Việt Nam Online 2026",
    template: "%s | Lịch Vạn Niên Việt Nam",
  },
  description:
    "Xem lịch vạn niên Việt Nam 2026 - Tra cứu lịch âm dương chính xác, xem ngày tốt xấu, ngày lễ tết, can chi, giờ hoàng đạo. Lịch vạn niên online miễn phí, cập nhật liên tục, dễ sử dụng trên điện thoại và máy tính.",
  keywords: [
    "lịch vạn niên",
    "lịch vạn niên việt nam",
    "xem lịch vạn niên",
    "lịch vạn niên 2026",
    "lịch âm dương",
    "lịch việt nam",
    "lịch âm",
    "lịch dương",
    "tra cứu lịch vạn niên",
    "xem lịch âm",
    "ngày tốt xấu",
    "ngày lễ việt nam",
    "ngày tết việt nam",
    "can chi",
    "giờ hoàng đạo",
    "xem ngày",
    "lịch việt online",
    "âm lịch việt nam",
    "dương lịch âm lịch",
    "lịch vạn sự",
  ],
  authors: [{ name: "Lịch Việt Nam" }],
  creator: "Lịch Việt Nam",
  publisher: "Lịch Việt Nam",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Lịch Vạn Niên Việt Nam 2026 - Xem Lịch Âm Dương Online",
    description:
      "Xem lịch vạn niên Việt Nam 2026 online miễn phí. Tra cứu lịch âm dương chính xác, xem ngày tốt xấu, giờ hoàng đạo, can chi, ngày lễ tết Việt Nam. Cập nhật liên tục.",
    siteName: "Lịch Vạn Niên Việt Nam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lịch Vạn Niên Việt Nam 2026 - Xem Lịch Âm Dương Online",
    description:
      "Xem lịch vạn niên Việt Nam online miễn phí. Tra cứu lịch âm dương, ngày tốt xấu, can chi, ngày lễ tết. Chính xác và dễ sử dụng.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: Thay bằng mã xác minh thật từ Google Search Console
    // Bước 1: Vào https://search.google.com/search-console
    // Bước 2: Add property: https://calendar-eight-beige.vercel.app
    // Bước 3: Chọn phương thức "HTML tag"
    // Bước 4: Copy mã từ content="xxxxx" và paste vào dưới đây
    // Bước 5: Commit, push, deploy
    // Bước 6: Click "Verify" trên Search Console
    google: "jThwvj02giCRVOyG3wTsmZhnJUfIBNmNoDF8fdCxA3w",
    // Bing Webmaster Tools (optional): https://www.bing.com/webmasters
    // bing: 'PASTE_YOUR_BING_VERIFICATION_CODE_HERE',
  },
};

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
    description:
      "Xem lịch vạn niên Việt Nam 2026 online miễn phí. Tra cứu lịch âm dương chính xác, ngày tốt xấu, can chi, giờ hoàng đạo, ngày lễ tết.",
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
    description:
      "Xem lịch vạn niên Việt Nam 2026 - Tra cứu lịch âm dương, ngày tốt xấu, can chi, giờ hoàng đạo, ngày lễ tết online miễn phí.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Header />
            <main className="flex-1 flex flex-col bg-gradient-to-br from-background via-background/95 to-accent/5">
              {children}
            </main>
            <Footer />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
